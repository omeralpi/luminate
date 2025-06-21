import { cn } from "@/lib/utils"

function PageHeader({
    className,
    children,
    ...props
}: React.ComponentProps<"section">) {
    return (
        <section className={cn("border-grid", className)} {...props}>
            <div className="flex flex-col">
                {children}
            </div>
        </section>
    )
}

function PageHeaderHeading({
    className,
    ...props
}: React.ComponentProps<"h1">) {
    return (
        <h1
            className={cn(
                "leading-tighter max-w-2xl text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter",
                className
            )}
            {...props}
        />
    )
}

function PageHeaderDescription({
    className,
    ...props
}: React.ComponentProps<"p">) {
    return (
        <p
            className={cn(
                "text-foreground max-w-3xl text-base text-balance sm:text-lg",
                className
            )}
            {...props}
        />
    )
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none",
                className
            )}
            {...props}
        />
    )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
