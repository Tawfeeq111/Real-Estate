import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import OAuth from '../../components/OAuth.jsx';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const HandelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handelSubmit = async (e) => {
    try {

      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-8'>Sign up</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input type="text" id="username" placeholder='username' className='border rounded-lg p-3 focus:outline-none' onChange={HandelChange} />
        <input type="email" id="email" placeholder='email' className='border rounded-lg p-3 focus:outline-none' onChange={HandelChange} />
        <input type="password" id="password" placeholder='password' className='border rounded-lg p-3 focus:outline-none' onChange={HandelChange} />
        {loading ?
          <button disabled className='bg-slate-700 text-white rounded-lg p-3 opacity-75'>Loading...</button> :
          <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>SIGN UP</button>
        }
        <OAuth />
      </form>
      <div className='flex gap-1 mt-4'>
        <p>Have an account?</p><Link to="/sign-in" className='text-blue-700'>Sign in</Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}
