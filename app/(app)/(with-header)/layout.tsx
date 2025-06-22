import { AppHeader } from "@/components/app-header";
import { ClientOnly } from "@/components/client-only";

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <AppHeader />
            <div className="container">
                <ClientOnly>
                    {children}
                </ClientOnly>
            </div>
        </div>
    );
}