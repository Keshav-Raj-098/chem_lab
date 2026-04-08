"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosConfig'
import { ShowToast } from '@/components/showToast'

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setIsLoading(false)
        router.push('/admin/auth')
        return
      }

      try {
        const response = await axiosInstance.get('/admin')

        const data = response.data
        setUser(data.user)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push('/admin/auth')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  return { isLoading, user }
}
