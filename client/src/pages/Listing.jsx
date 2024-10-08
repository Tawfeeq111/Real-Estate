import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from './Contact';

function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector(state => state.user);
  

  useEffect(() => {
    fetch(`/api/listing/get/${params.listingId}`)
      .then((res) => {
        setLoading(true);
        res.json()
          .then((data) => {
            if (data.success == false) {
              setError(true);
              setLoading(false);
              return;
            }
            setListing(data);
            setLoading(false);
          })
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      })
  }, [])

  return (
    <div>
      {loading && <p className='text-center my-10 text-xl'>Loading...</p>}
      {error && <p className='text-center my-10 text-xl'>Something went wrong :(</p>}
      {listing && !loading && !error &&
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => {
              return <SwiperSlide key={url}>
                <div
                  className='h-[450px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>

            })}
          </Swiper>
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${''}
              {listing.offer
                ? listing.discountPrice
                : listing.regularPrice}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing?.userRef !== currentUser._id && !show &&
              <button onClick={() => setShow(true)} className='bg-gray-700 text-white uppercase p-3 rounded-lg hover:opacity-95 my-5'>Contact landlord</button>
            }
            { show &&
              <Contact listing={listing} />
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Listing;