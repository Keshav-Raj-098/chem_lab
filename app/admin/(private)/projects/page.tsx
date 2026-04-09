'use client'
import React, { useState } from 'react'
import AdminProjectsTable from '@/components/admin/projects/AdminProjectsTable'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <header className="flex items-center justify-between sticky top-0 bg-white z-10 px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Research Projects Management</h1>
        <Button onClick={() => router.push('/admin/projects/create')} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </header>
      <div className='p-6 bg-gray-50 min-h-[calc(100vh-73px)]'>
        <AdminProjectsTable refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
      </div>
    </div>
  )
}

export default page

