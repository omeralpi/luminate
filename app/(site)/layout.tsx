
export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <div className="container">
                {children}
            </div>
        </div>
    );
}