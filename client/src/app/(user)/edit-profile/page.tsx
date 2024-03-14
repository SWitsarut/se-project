import React from 'react'
import EditProfile from './EditProfile'
import { getCurrentSession } from '@/libs/getCurrentSession'
import { redirect } from 'next/navigation'
import { Center, TextInput } from '@mantine/core'

export default async function page() {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/')
  }

  return (
    <Center>
      <EditProfile session={session} />
    </Center>
  )
}
