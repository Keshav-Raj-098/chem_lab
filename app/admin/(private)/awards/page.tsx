'use client'
import React, { useState } from 'react'
import AdminAwardsTable from '@/components/admin/awards/AdminAwardsTable'
import CreateAward from '@/components/admin/awards/createAwards'

const page = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <header className="flex items-center justify-between sticky top-0 bg-white z-10 px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Awards Management</h1>
        <CreateAward onSuccess={handleRefresh} />
      </header>
      <div className='p-6 bg-gray-50 min-h-[calc(100vh-73px)]'>
        <AdminAwardsTable refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
      </div>
    </div>
  )
}

export default page


