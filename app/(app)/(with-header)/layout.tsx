import { AppHeader } from "@/components/app-header";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <AppHeader />
            <div className="container">
                {children}
            </div>
        </div>
    );
}