import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { cookies } from 'next/headers';
import { Card, CardBody } from '@heroui/react';
import { User } from '../lib/auth';
async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  if (!accessToken) return null
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken.trim()}`);
  headers.append('Content-Type', 'application/json');
  const response = await fetch(`${process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL}/me`, {
    method: 'GET',
    headers,
    credentials: 'include'
  })
  if (!response.ok) return null

  return response.json()
}
export default async function ProfilePage() {
  const user = await getCurrentUser()
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {user && (
          <Card>
            <CardBody>
              <p>User ID: {user.id}</p>
            </CardBody>
            <CardBody>
              <p>Name: {user.name}</p>
            </CardBody>
            <CardBody>
              <p>Email: {user.email}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}