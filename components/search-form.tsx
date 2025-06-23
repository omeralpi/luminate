"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useDebounce } from "use-debounce"

import { Input } from "@/components/ui/input"

interface SearchFormProps {
    placeholder?: string
}

export function SearchForm({
    placeholder = "Search...",
}: SearchFormProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [query, setQuery] = React.useState(searchParams.get("search") || "")
    const [debouncedQuery] = useDebounce(query, 500)

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (debouncedQuery) {
            params.set("search", debouncedQuery)
        } else {
            params.delete("search")
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, [debouncedQuery, pathname, router])

    React.useEffect(() => {
        setQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 relative max-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 rounded-full bg-gray-200 border-none"
            />
        </form >
    )
}
