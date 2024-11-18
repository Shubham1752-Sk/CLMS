'use client'

import ProfileDialouge from '@/components/dashboard/ProfileDialouge'
import React from 'react'
import useAppContext from '@/contexts'

const MyProfile = () => {

  const { token, user, setUser } = useAppContext();

  console.log("profile: ",user);

  return (
    <div className='w-full h-full text-center px-2 py-2 flex flex-col justify-center'>
      <div className='fixed top-2 mx-auto text-center font-bold text-2xl '>Welcome to AGC Central Library  {user?.name}</div>
      <div className='border-1 p-2'>
        <ProfileDialouge />
      </div>
    </div>
  )
}

export default MyProfile
