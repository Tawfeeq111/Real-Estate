import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useRef, useState} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase.js';
import { updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signOutUserStart, signOutUserSuccess, signOutUserFailure
 } from "../redux/user/userSlice.js"
 import {Link} from "react-router-dom"

export default function Profile() {

  const fileRef = useRef(null);
  const {currentUser, error, loading} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [flag, setFlag] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState(null);

  const dispatch = useDispatch();

  useEffect(()=>{
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
          setFormData({ ...formData, avatar: downloadURL })}
        );
      }
    );
  };

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value});
  }


  const handelSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(currentUser._id);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success == false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setFlag(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }


  const handelDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE'
      })
      const data = await res.json();
      if(data.success == false){
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handelSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/user/signout');
      const data = await res.json();
      if(data.success == false){
        dispatch(signOutUserFailure());
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handelShowListings = async () => {
    try {
      setShowListingError(false);
      const data = await fetch(`/api/user/listings/${currentUser._id}`);
      const listings = await data.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(listings);
      setShowListingError(false);
    } catch (error) {
      setShowListingError(true);
    }
  } 


  const handelDeleteListing = async (id) => {
    try {
      const data = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE"
      });
      const res = await data.json();
      if(res.success === false){
        console.log(res.message);
        return;
      }

      await handelShowListings();      
      console.log("Listing deleted sucessfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} className='hidden' accept='image/*' />
        <img
          src={formData.avatar || currentUser.avatar}
          onClick={() => fileRef.current.click()}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg' onChange={handelChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg' onChange={handelChange}
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg' onChange={handelChange}
        />
        <button disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >{loading ? "Loading..." : "Update"}</button>
        <Link className='bg-green-700 rounded-lg p-3 text-white uppercase text-center hover:opacity-95' to="/create-listing" >create listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handelDelete}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handelSignOut} 
          className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700'>{error ? error : ""}</p>
      <p className='mt-3 text-green-700'>{flag ? "User updated successfully!" : ""}</p>
      <button onClick={handelShowListings} className='w-full text-green-700'>Show Listings</button>
      { showListingError &&
        <p className='text-red-700 mt-2'>Error showing listings</p>
      }
      { userListings && userListings.length > 0 &&
        userListings.map((listing) => {
          return <div key={listing._id} className='mt-5 border px-2 flex justify-between items-center rounded-lg gap-3'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing cover' className='h-20 w-20 object-contain' />
            </Link>
            <Link className='flex-1 px-2 font-semibold text-gray-600 hover:underline truncate' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col">
              <button onClick={()=>handelDeleteListing(listing._id)} className='text-red-700'>Delete</button>
              <Link to={`/update-listing/${listing._id}`} className='text-center'>
                <button className='text-green-700 text-center'>Edit</button>
              </Link>
            </div>
          </div>
        })
      }
    </div>
  )
}
