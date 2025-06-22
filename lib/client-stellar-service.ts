import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import {
    Address,
    Contract,
    nativeToScVal,
    Networks,
    SorobanRpc,
    TransactionBuilder
} from '@stellar/stellar-sdk';

const RPC_URL = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID!;

export class ClientStellarService {
    private server: SorobanRpc.Server;
    private contract: Contract;

    constructor() {
        this.server = new SorobanRpc.Server(RPC_URL);
        this.contract = new Contract(CONTRACT_ID);
    }

    async checkWalletConnection() {
        const connected = await isConnected();
        if (!connected) {
            throw new Error("Please connect your Stellar wallet");
        }
        const { address } = await requestAccess();
        return address;
    }

    async mintPostAsNFT(
        ipfsHash: string,
        dbPostId: number
    ) {
        try {
            const userAddress = await this.checkWalletConnection();

            const account = await this.server.getAccount(userAddress);

            const mintOperation = this.contract.call(
                "mint_post",
                ...[
                    new Address(userAddress).toScVal(),
                    nativeToScVal(ipfsHash, { type: "string" }),
                    nativeToScVal(dbPostId, { type: "u32" }),
                ]
            );

            const transaction = new TransactionBuilder(account, {
                fee: "100000",
                networkPassphrase: NETWORK_PASSPHRASE,
            })
                .addOperation(mintOperation)
                .setTimeout(30)
                .build();

            const preparedTx = await this.server.prepareTransaction(transaction);

            const signedXDR = await signTransaction(
                preparedTx.toXDR(),
                {
                    networkPassphrase: NETWORK_PASSPHRASE,
                    address: userAddress,
                }
            );

            const tx = TransactionBuilder.fromXDR(signedXDR.signedTxXdr, NETWORK_PASSPHRASE);
            const sendResponse = await this.server.sendTransaction(tx);

            const result = await this.waitForTransaction(sendResponse.hash);

            return {
                success: true,
                hash: sendResponse.hash,
                userAddress,
            };
        } catch (error) {
            console.error("Mint error:", error);
            throw error;
        }
    }

    async collectPost(postId: number) {
        try {
            const collectorAddress = await this.checkWalletConnection();
            const account = await this.server.getAccount(collectorAddress);

            const collectOperation = this.contract.call(
                "collect_post",
                ...[
                    new Address(collectorAddress).toScVal(),
                    nativeToScVal(postId, { type: "u32" }),
                ]
            );

            const transaction = new TransactionBuilder(account, {
                fee: "100000",
                networkPassphrase: NETWORK_PASSPHRASE,
            })
                .addOperation(collectOperation)
                .setTimeout(30)
                .build();

            const preparedTx = await this.server.prepareTransaction(transaction);

            const signedXDR = await signTransaction(
                preparedTx.toXDR(),
                {
                    networkPassphrase: NETWORK_PASSPHRASE,
                    address: collectorAddress,
                }
            );

            const tx = TransactionBuilder.fromXDR(signedXDR.signedTxXdr, NETWORK_PASSPHRASE);
            const sendResponse = await this.server.sendTransaction(tx);
            await this.waitForTransaction(sendResponse.hash);

            return {
                success: true,
                hash: sendResponse.hash,
            };
        } catch (error) {
            console.error("Collect error:", error);
            throw error;
        }
    }

    private async waitForTransaction(hash: string): Promise<any> {
        let getResponse = await this.server.getTransaction(hash);
        let attempts = 0;

        while (getResponse.status === "NOT_FOUND" && attempts < 30) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            getResponse = await this.server.getTransaction(hash);
            attempts++;
        }

        if (getResponse.status === "SUCCESS") {
            return getResponse;
        } else {
            throw new Error(`Transaction failed: ${getResponse.status}`);
        }
    }
}