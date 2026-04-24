'use client'
import React, { useState } from 'react'
import AdminEquipmentTable from './_components/AdminEquipmentTable'
import CreateEquipment from './_components/createEquipment'

const page = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <header className="flex items-center justify-between sticky top-0 bg-white z-10 px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Equipments Management</h1>
        <CreateEquipment onSuccess={handleRefresh} />
      </header>
      <div className='p-6 bg-gray-50 min-h-[calc(100vh-73px)]'>
        <AdminEquipmentTable refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
      </div>
    </div>
  )
}

export default page


