import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("/")) return url;
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return publicUrl ? `${publicUrl}/${url}` : `https://res.cloudinary.com/${cloudName}/image/upload/${url}`;
};

const ResearchAreaCard = ({ item, index }: { item: any, index: number }) => {
    const isEven = index % 2 === 0;
    const imgUrl = getFullImageUrl(item.imgUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`research-area-card ${isEven ? 'even' : 'odd'}`}
        >
            <div className="research-area-image-container">
                {imgUrl ? (
                    <Image
                        src={imgUrl}
                        alt={item.name}
                        fill
                        className="research-area-image"
                    />
                ) : (
                    <div className="research-area-image-placeholder">No Image Available</div>
                )}
            </div>
            <div className="research-area-content">
                <h2 className="research-area-name">{item.name}</h2>
                <div
                    className="research-area-body prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                />
            </div>
        </motion.div>
    )
}

export default ResearchAreaCard
