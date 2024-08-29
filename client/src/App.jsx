import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './pages/Header'
import CreateListing from "./pages/createListing.jsx"
import PrivateRouter from '../components/PrivateRouter.jsx'
import UpdateListing from './pages/UpdateListing.jsx'
import Listing from './pages/Listing.jsx'

export default function App() {
  return (
    <BrowserRouter >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
