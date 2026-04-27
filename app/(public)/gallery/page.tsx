import { Metadata } from "next"
import GalleryClient from "./galleryClient"
import fetchGalleryAction from "@/lib/load_data/load_gallery"

const SITE_TITLE = "Gallery | ChemLab"
const SITE_DESCRIPTION =
    "A visual record of our laboratory — research activities, experimental setups, events, and milestones from the Chemical Research Lab."

export const metadata: Metadata = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    keywords: [
        "Gallery",
        "ChemLab Gallery",
        "Chemistry Lab Photos",
        "Research Equipment Photos",
        "Laboratory Events",
        "Chemistry Research Visuals",
        "IIT Delhi Chemistry",
    ],
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
}

const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return ""
    if (url.startsWith("http") || url.startsWith("/")) return url
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL
    return publicUrl
        ? `${publicUrl}/${url}`
        : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`
}

const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()

export default async function Page() {
    const result = await fetchGalleryAction(1, 12)
    const galleryItems = result.success ? result.data : []
    const hasMore = result.success ? result.hasMore : false

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        image: galleryItems.slice(0, 12).map((item) => ({
            "@type": "ImageObject",
            contentUrl: getFullImageUrl(item.imgUrl),
            name: item.title,
            description: stripHtml(item.description).slice(0, 200),
            datePublished: new Date(item.createdAt).toISOString(),
        })),
    }

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
                    Gallery
                </h1>
            </div>

            <main className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20">
                {galleryItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 font-light">No gallery items yet.</p>
                    </div>
                ) : (
                    <GalleryClient
                        initialGallery={galleryItems}
                        hasMoreInitial={hasMore}
                    />
                )}
            </main>
        </div>
    )
}
