import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>
      <Analytics/>
      <Footer />
    </div>
  )
}