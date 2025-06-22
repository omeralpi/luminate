"use client"

import { Search } from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"

interface SearchFormProps {
    onSearch?: (query: string) => void
    placeholder?: string
}

export function SearchForm({
    onSearch,
    placeholder = "Search...",
}: SearchFormProps) {
    const [query, setQuery] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim() && onSearch) {
            onSearch(query.trim())
        }
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
