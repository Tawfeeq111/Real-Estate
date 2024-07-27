import React from 'react'
import {Link} from "react-router-dom"

export default function SignUp() {
  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-8'>Sign up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border rounded-lg p-3' />
        <input type="text" placeholder='email' className='border rounded-lg p-3' />
        <input type="text" placeholder='password' className='border rounded-lg p-3' />
        <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>SIGN UP</button>
      </form>
      <div className='flex gap-1 mt-4'>
        <p>Have an account?</p><Link to="/sign-in" className='text-blue-700'>Sign in</Link>
      </div>
    </div>
  )
}
