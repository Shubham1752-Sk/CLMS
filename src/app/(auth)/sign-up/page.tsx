"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const [user, setUser] = useState({
  email:"",
  password:"",
  userName:"",
  rollNo:"",
})

const [buttonDisabled, setButtonDisabled] = useState(false);
const [loading, setLoading] = useState(false);

const onSignup = () =>{
  try {
    setLoading(true);
    axios.post('/api/users/auth/signup',user)
  } catch (error: any) {
    console.log(error)
  }
}

export default function Page(){
    return (
        <div>
          Signup Page
        </div>
      )
}
