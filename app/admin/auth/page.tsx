"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axiosConfig'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ShowToast } from '@/components/showToast'
import { LoginSchema } from "@/types/types"
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { ZodError } from 'zod'
import Link from 'next/link'
import { signin } from './auth'

export default function Auth() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const body = LoginSchema.parse({ username, password });

      const response = await signin({ username, password });

      if(response.status){
        localStorage.setItem('token', response.token!);
        ShowToast("Login successful!", "success");
        router.push('/admin/dashboard');
      }else{
        ShowToast(response.message, "error");
      }

    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err) => err.message).join(", ");
        ShowToast(errorMessage, "error");
        return;
      }

      ShowToast("Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
      <Card className='w-100 p-6'>
        <CardTitle className='text-center text-2xl font-bold'>Admin Login</CardTitle>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col items-center'>
          <Button className='w-full' onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Link href="/" className='text-sm text-gray-500 mt-2 block text-center'>Back to Home</Link>
        </CardFooter>
      </Card>
    </div>
  )
}