import { User } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar({ user, className }: { user: User, className?: string }) {
    return (
        <Avatar className={cn(
            "w-9 h-9 rounded-full",
            className
        )}>
            <AvatarImage src={user.avatar ?? 'https://lh3.googleusercontent.com/fife/ALs6j_FhjUqgwvo94K2aVHB1fEZghUrf5WVonmb4gIriTIz_kKM6p_wlO3-IYRJK51Zrwn1Nc64lVjMlKO1JBjBre5iozikZ32-sHi3IB2YwMy7sZ7lDyY1Oq-8H3U9G5YvWNsmKczD1f55239DubS7MHeydipOJg7ozsL-qnjxZ7u8aWOFWEuGHaEAbMSQD9tJQ6r4cenp5hYdn_1629oxsuUWmDzXnw_BW1ZH6JiUqcORVUKANw8cJm1IGEHFUpoOa7dtVKV7nXLNZfCcG4AgOCzjjTKTfwS43-0lDo9ZG0hCEosolzSgknNiiZ3Vt4T_j3iQ9Q6JYVPZxtu0n3LZiMxUTxIpHkGVZOw9cNdTXyIQQpJ4JojtkAeCOrX-k-kzk4nYEXfV_JsDsTESmIUzJ9uOIlfF1YJ7osDgCSFZNUevYRvqQJ2DwKioSN2PH6ghCf8nLulCL8TjlAT_WEKdBPZdFpa8MFH6Rp1ul2HtIQnhgYf1jm-IrlB007gzqhoAs1KqQvtdRo4t0NndMrPLFoTgFD6vYbprY95kv-fePJ4rf5EZz_62LOgHVHXgMNgxrjKwCZlWYIRSfAB1ZprtX4bh_mMlfO1whjGJ4m1-NWWjifdKQ2GiFmmZ_f1vSqnXWlWy00Yml1RveAk8NmuNSt0u8PnYpWPvJcb4u30otegc41dlCm_6DjbKjxGfgcdYZC2FSXrObY7LtYePNm_XDTIggjZ-5p9IB5T4u5pqKOGVTj4yvzD6tiYZ0ELIQWoOZkKlxZPw8pM-JXF_nmFl0u-B6e9h74DHN7O0Xu9hqNce-lLePB3F_RsK0H2VZQvePmgViPUa02eM9gX6PD_gJFEWNFgqrsD6IrYhyUhoTBNuwwH7wQRY2Icj4K4Y3XScuuJaCiNhZwYFlKuZDqp1fvOM7X2PQMoPcU5n7xBPosIeahX-cxLKiiBHCfrMAVIgKIQA0y5WtVoawSG6m7eiw6DgB5tHnpRiQUIhbyR1xcFJ43FQFC7FtHOpjVxXLF05jwUZWe1NTjpi-PnOnhwipqj-9bPAhSZGXfNCzB0Okn5r4W2NRoVkh8xzqLXbRl7FWH3v8CL9bXseVZsPr3Oj4z9--0vriSGoDy_4MVmRf5VUqiC8lyGx72WTuCiBXi7F5STSVIeuaIfm511_10ejJfdgHfFM2KBAz6g4yY7bslF2YTVnXzCY3fu0BtYTemRgD7ZJRBAVXRcNg0jRJn4kpHVq3ZaL5ESIlj-WgbJK5of9xuSL7US27U9tDu2I7Jd3VPe3QqYhx_bYe5VrVfsjZDoTSpgLighh7f9-qnB7GrLLjCWByXwUnhI_BbnNrPIlPcE4kOvjdFe7NOxnX7OsOSfVpSgSZQJkZ_AEUHwZF42nYpnbmxb4atdmEactXmItm8RPb3vF1FLoTj1e_BZaHUIE6vivJCAyCMeds2m79dzso1m9Kl6zxqtbys_C9Y7Rfubz3L9dmt2v9Qdangy09AvaIcQdu3BAc_JwHbrPslpijUsEnB1-rOCYqzFs752LaXQQMzgPo47JVcJm-x794wfoDp31Zgm5LgHBcVWofuviiZRTtIAHFBiLc7xXD1vvb0eq-KgZuM8D9y5ZYTAig8q89hOe4hA=s64-c'} />
            <AvatarFallback>
                {user.name?.slice(0, 2)}
            </AvatarFallback>
        </Avatar>
    )
}