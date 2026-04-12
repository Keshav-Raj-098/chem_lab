import React from 'react'
import { NewsList } from '@/components/pub/NewsList'
import { prisma } from '@/lib/prisma'

const page = async () => {
  const news = await prisma.newsAndAnnouncements.findMany({
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  })


  return (
    <div className="container px-8 py-24 bg--c-off-white" >
      <h1 className="text-4xl font-bold mb-12">News & Announcements</h1>
      <NewsList initialNews={news} />
    </div>
  )
}

export default page
