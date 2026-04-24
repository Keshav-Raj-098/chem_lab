import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Awards",
    description: "Awards and recognition",
}


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}