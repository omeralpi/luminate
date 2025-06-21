import { SiteHeader } from "@/components/site-header";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <SiteHeader />
            <div className="container">
                {children}
            </div>
        </div>
    );
}