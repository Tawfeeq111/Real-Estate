import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js"
import OAuth from '../../components/OAuth.jsx';


export default function SignIn() {

  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector(state => state.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const HandelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handelSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      console.log(data);
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  }

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-8'>Sign In</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input type="text" id="email" placeholder='email' className='border rounded-lg p-3 focus:outline-none' onChange={HandelChange} />
        <input type="text" id="password" placeholder='password' className='border rounded-lg p-3 focus:outline-none' onChange={HandelChange} />
        {loading ?
          <button disabled className='bg-slate-700 text-white rounded-lg p-3 opacity-75'>Loading...</button> :
          <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95'>SIGN IN</button>
        }
      <OAuth />
      </form>
      <div className='flex gap-1 mt-4'>
        <p>Dont have an account?</p><Link to="/sign-up" className='text-blue-700'>Sign up</Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}
