import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Navbar />
      <main>{children}</main>
        <Footer />
    </div>
  );
}