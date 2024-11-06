import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const Server = async () => {

    const session = await auth();
    if(!session?.user){
        redirect("/");
    }

  return (
    <div>
      <h1 className='text-3xl'> Server Page</h1>
      <h1 className='text-3xl'>{session?.user?.email}</h1>
    </div>
  )
}

export default Server
