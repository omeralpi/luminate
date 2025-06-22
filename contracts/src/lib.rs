#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, vec, Address, Env, String, Symbol, Vec
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PostMetadata {
    pub ipfs_hash: String,
    pub author: Address,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct CollectionInfo {
    pub name: String,
    pub symbol: String,
    pub creator: Address,
    pub max_supply: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct Post {
    pub post_id: u32,
    pub owner: Address,
    pub metadata: PostMetadata,
    pub created_at: u64,
    pub collected_by: Vec<Address>,
    pub collect_count: u32,
}

#[contracttype]
pub enum DataKey {
    CollectionInfo,
    Post(u32),
    UserPosts(Address),
    CollectedPosts(Address),
    PostCounter,
    Admin,
}

#[contracttype]
pub enum Events {
    PostMinted(u32, Address, String),
    PostCollected(u32, Address),
    PostTransferred(u32, Address, Address),
}

#[contract]
pub struct PostContract;

#[contractimpl]
impl PostContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        max_supply: u32,
    ) {
        admin.require_auth();
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        let collection_info = CollectionInfo {
            name,
            symbol,
            creator: admin.clone(),
            max_supply,
        };
        env.storage().instance().set(&DataKey::CollectionInfo, &collection_info);
        
        env.storage().instance().set(&DataKey::PostCounter, &0u32);
        
        env.storage().instance().extend_ttl(500_000, 1_000_000);
    }

    pub fn mint_post(
        env: Env,
        author: Address,
        ipfs_hash: String,
        post_db_id: u32,
    ) -> u32 {
        author.require_auth();
        
        let mut post_counter: u32 = env.storage()
            .instance()
            .get(&DataKey::PostCounter)
            .unwrap_or(0);
        
        let collection_info: CollectionInfo = env.storage()
            .instance()
            .get(&DataKey::CollectionInfo)
            .unwrap();
        
        if post_counter >= collection_info.max_supply {
            panic!("Max posts reached");
        }
        
        let metadata = PostMetadata {
            ipfs_hash: ipfs_hash.clone(),
            author: author.clone(),
            created_at: env.ledger().timestamp(),
        };
        
        let post = Post {
            post_id: post_db_id,
            owner: author.clone(),
            metadata: metadata.clone(),
            created_at: env.ledger().timestamp(),
            collected_by: vec![&env, author.clone()],
            collect_count: 1,
        };
        
        env.storage().persistent().set(&DataKey::Post(post_db_id), &post);
        
        let mut user_posts: Vec<u32> = env.storage()
            .persistent()
            .get(&DataKey::UserPosts(author.clone()))
            .unwrap_or(vec![&env]);
        user_posts.push_back(post_db_id);
        env.storage().persistent().set(&DataKey::UserPosts(author.clone()), &user_posts);
        
        let mut collected_posts: Vec<u32> = env.storage()
            .persistent()
            .get(&DataKey::CollectedPosts(author.clone()))
            .unwrap_or(vec![&env]);
        collected_posts.push_back(post_db_id);
        env.storage().persistent().set(&DataKey::CollectedPosts(author.clone()), &collected_posts);
        
        post_counter += 1;
        env.storage().instance().set(&DataKey::PostCounter, &post_counter);
        
        env.events().publish(
            (Symbol::new(&env, "post_minted"),),
            (post_db_id, author, ipfs_hash)
        );
        
        env.storage().persistent().extend_ttl(&DataKey::Post(post_db_id), 500_000, 1_000_000);
        
        post_db_id
    }

    pub fn collect_post(env: Env, collector: Address, post_id: u32) {
        collector.require_auth();
        
        let mut post: Post = env.storage()
            .persistent()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("Post does not exist"));

        if post.collected_by.contains(&collector) {
            panic!("Already collected by this address");
        }
        
        post.collected_by.push_back(collector.clone());
        post.collect_count += 1;
        env.storage().persistent().set(&DataKey::Post(post_id), &post);
        
        let mut collected_posts: Vec<u32> = env.storage()
            .persistent()
            .get(&DataKey::CollectedPosts(collector.clone()))
            .unwrap_or(vec![&env]);
        collected_posts.push_back(post_id);
        env.storage().persistent().set(&DataKey::CollectedPosts(collector.clone()), &collected_posts);
        
        env.events().publish(
            (Symbol::new(&env, "post_collected"),),
            (post_id, collector)
        );
    }

    pub fn uncollect_post(env: Env, collector: Address, post_id: u32) {
        collector.require_auth();
        
        let mut post: Post = env.storage()
            .persistent()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("Post does not exist"));
        
        if !post.collected_by.contains(&collector) {
            panic!("Not collected by this address");
        }
        
        if post.metadata.author == collector {
            panic!("Cannot uncollect your own post");
        }
        
        let mut new_collected_by = vec![&env];
        for addr in post.collected_by.iter() {
            if addr != collector {
                new_collected_by.push_back(addr);
            }
        }
        post.collected_by = new_collected_by;
        post.collect_count -= 1;
        env.storage().persistent().set(&DataKey::Post(post_id), &post);

        let mut collected_posts: Vec<u32> = env.storage()
            .persistent()
            .get(&DataKey::CollectedPosts(collector.clone()))
            .unwrap_or(vec![&env]);
        let mut new_collected_posts = vec![&env];
        for id in collected_posts.iter() {
            if id != post_id {
                new_collected_posts.push_back(id);
            }
        }
        collected_posts = new_collected_posts;
        env.storage().persistent().set(&DataKey::CollectedPosts(collector.clone()), &collected_posts);
    }

    pub fn get_post(env: Env, post_id: u32) -> Post {
        env.storage()
            .persistent()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("Post does not exist"))
    }

    pub fn get_posts_by_author(env: Env, author: Address) -> Vec<u32> {
        env.storage()
            .persistent()
            .get(&DataKey::UserPosts(author))
            .unwrap_or(vec![&env])
    }

    pub fn get_collected_posts(env: Env, collector: Address) -> Vec<u32> {
        env.storage()
            .persistent()
            .get(&DataKey::CollectedPosts(collector))
            .unwrap_or(vec![&env])
    }

    pub fn collection_info(env: Env) -> CollectionInfo {
        env.storage()
            .instance()
            .get(&DataKey::CollectionInfo)
            .unwrap()
    }

    pub fn total_posts(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::PostCounter)
            .unwrap_or(0)
    }

    pub fn has_collected(env: Env, collector: Address, post_id: u32) -> bool {
        let post: Post = env.storage()
            .persistent()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("Post does not exist"));
        post.collected_by.contains(&collector)
    }

    pub fn get_collect_count(env: Env, post_id: u32) -> u32 {
        let post: Post = env.storage()
            .persistent()
            .get(&DataKey::Post(post_id))
            .unwrap_or_else(|| panic!("Post does not exist"));
        post.collect_count
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let info = client.collection_info();
        assert_eq!(info.name, String::from_str(&env, "Social Posts"));
        assert_eq!(info.symbol, String::from_str(&env, "POST"));
        assert_eq!(info.creator, admin);
        assert_eq!(info.max_supply, 10000);
    }

    #[test]
    fn test_user_creates_post() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let ipfs_hash = String::from_str(&env, "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
        let db_post_id = 42u32;
        
        let post_id = client.mint_post(&user1, &ipfs_hash, &db_post_id);
        assert_eq!(post_id, db_post_id);
        
        let post = client.get_post(&post_id);
        assert_eq!(post.post_id, db_post_id);
        assert_eq!(post.owner, user1);
        assert_eq!(post.metadata.ipfs_hash, ipfs_hash);
        assert_eq!(post.metadata.author, user1);
        assert_eq!(post.collect_count, 1);
        
        let user_posts = client.get_posts_by_author(&user1);
        assert_eq!(user_posts.len(), 1);
        assert_eq!(user_posts.get(0).unwrap(), post_id);
        
        assert!(client.has_collected(&user1, &post_id));
    }

    #[test]
    fn test_nft_conversion_optional() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post_id_1 = client.mint_post(
            &user1,
            &String::from_str(&env, "QmHash1"),
            &1u32,
        );
        
        let post_id_2 = client.mint_post(
            &user1,
            &String::from_str(&env, "QmHash2"),
            &2u32,
        );
        
        assert_eq!(client.get_post(&post_id_1).owner, user1);
        assert_eq!(client.get_post(&post_id_2).owner, user1);
        
        assert_eq!(client.get_posts_by_author(&user1).len(), 2);
    }

    #[test]
    fn test_unlimited_collecting() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let author = Address::generate(&env);
        let collector1 = Address::generate(&env);
        let collector2 = Address::generate(&env);
        let collector3 = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post_id = client.mint_post(
            &author,
            &String::from_str(&env, "QmPopularPost"),
            &100u32,
        );
        
        client.collect_post(&collector1, &post_id);
        client.collect_post(&collector2, &post_id);
        client.collect_post(&collector3, &post_id);
        
        assert!(client.has_collected(&author, &post_id));
        assert!(client.has_collected(&collector1, &post_id));
        assert!(client.has_collected(&collector2, &post_id));
        assert!(client.has_collected(&collector3, &post_id));
        
        assert_eq!(client.get_collect_count(&post_id), 4);
        
        assert_eq!(client.get_collected_posts(&collector1).len(), 1);
        assert_eq!(client.get_collected_posts(&collector2).len(), 1);
        assert_eq!(client.get_collected_posts(&collector3).len(), 1);
    }

    #[test]
    fn test_uncollect_functionality() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let author = Address::generate(&env);
        let collector = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post_id = client.mint_post(
            &author,
            &String::from_str(&env, "QmTestPost"),
            &1u32,
        );
        
        client.collect_post(&collector, &post_id);
        assert!(client.has_collected(&collector, &post_id));
        assert_eq!(client.get_collect_count(&post_id), 2);
        
        client.uncollect_post(&collector, &post_id);
        assert!(!client.has_collected(&collector, &post_id));
        assert_eq!(client.get_collect_count(&post_id), 1);
    }

    #[test]
    #[should_panic(expected = "Cannot uncollect your own post")]
    fn test_author_cannot_uncollect_own_post() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let author = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post_id = client.mint_post(
            &author,
            &String::from_str(&env, "QmTestPost"),
            &1u32,
        );
        
        client.uncollect_post(&author, &post_id);
    }

    #[test]
    #[should_panic(expected = "Already collected by this address")]
    fn test_cannot_collect_twice() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let author = Address::generate(&env);
        let collector = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post_id = client.mint_post(
            &author,
            &String::from_str(&env, "QmTestPost"),
            &1u32,
        );

        client.collect_post(&collector, &post_id);
        client.collect_post(&collector, &post_id);
    }

    #[test]
    fn test_multiple_posts_and_collections() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let author1 = Address::generate(&env);
        let author2 = Address::generate(&env);
        let collector = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        let post1 = client.mint_post(&author1, &String::from_str(&env, "QmPost1"), &1u32);
        let post2 = client.mint_post(&author1, &String::from_str(&env, "QmPost2"), &2u32);
        let post3 = client.mint_post(&author2, &String::from_str(&env, "QmPost3"), &3u32);
        
        client.collect_post(&collector, &post1);
        client.collect_post(&collector, &post3);
        
        let collected = client.get_collected_posts(&collector);
        assert_eq!(collected.len(), 2);
        
        assert_eq!(client.get_posts_by_author(&author1).len(), 2);
        
        assert_eq!(client.get_posts_by_author(&author2).len(), 1);
    }

    #[test]
    #[should_panic(expected = "Max posts reached")]
    fn test_max_supply_limit() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Limited Posts"),
            &String::from_str(&env, "LTD"),
            &2u32,
        );
        
        client.mint_post(&user, &String::from_str(&env, "QmPost1"), &1u32);
        client.mint_post(&user, &String::from_str(&env, "QmPost2"), &2u32);
        
        client.mint_post(&user, &String::from_str(&env, "QmPost3"), &3u32);
    }

    #[test]
    fn test_get_total_posts() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register(PostContract, ());
        let client = PostContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        
        client.initialize(
            &admin,
            &String::from_str(&env, "Social Posts"),
            &String::from_str(&env, "POST"),
            &10000u32,
        );
        
        assert_eq!(client.total_posts(), 0);
        
        client.mint_post(&user1, &String::from_str(&env, "QmPost1"), &1u32);
        assert_eq!(client.total_posts(), 1);
        
        client.mint_post(&user2, &String::from_str(&env, "QmPost2"), &2u32);
        assert_eq!(client.total_posts(), 2);
        
        client.mint_post(&user1, &String::from_str(&env, "QmPost3"), &3u32);
        assert_eq!(client.total_posts(), 3);
    }
}