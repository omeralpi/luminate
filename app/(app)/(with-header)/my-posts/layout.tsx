import { PageHeader, PageHeaderHeading } from "@/components/ui/page-header";

export default function MyPostsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container py-8 space-y-6">
            <PageHeader>
                <PageHeaderHeading>
                    My posts
                </PageHeaderHeading>
            </PageHeader>
            {children}
        </div>
    )
}