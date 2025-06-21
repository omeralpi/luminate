import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { truncateWalletAddress } from "@/lib/utils"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

interface UserDropdownProps {
    user: {
        name?: string | null
        walletAddress: string
        avatar?: string | null
    }
    onLogout: () => void
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.walletAddress.slice(0, 2).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 border">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">
                            {user.name || "Anonymous User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {truncateWalletAddress(user.walletAddress)}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.walletAddress}`}>
                        <User className="mr-2 h-4 w-4" />
                        <span>View your profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}