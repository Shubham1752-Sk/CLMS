"use client"
import { logout } from '@/actions/auth'

export default function Logout(){
  return (
    <div className='bg-slate-400 p-2 text-center rounded-md cursor-pointer'
        onClick={()=>logout()}
    >
      Logout 
    </div>
  )
}

// export default logout
