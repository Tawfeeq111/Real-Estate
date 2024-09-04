import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from './ListingItem';

export default function Home() {

  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {

    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  }, [])

  

  return (
    <div>
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          MDTEstate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => {
          return <SwiperSlide key={listing._id}>
            <div
              className='h-[450px]'
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        })
        }
      </Swiper>

      {offerListings && offerListings.length > 0 && (
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          <div className=''>
            <div className="my-3">
              <h2 className='text-slate-600 text-2xl font-semibold'>Recent offers</h2>
              <Link className='text-blue-800 test-sm hover:underline' to={`/search?offer=true`}>Show more offers...</Link>
            </div>
            <div className='flex gap-4 flex-wrap'>
              {offerListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />
              })}
            </div>
          </div>
        </div>
      )}


      {saleListings && saleListings.length > 0 && (
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          <div className=''>
            <div className="my-3">
              <h2 className='text-slate-600 text-2xl font-semibold'>Recent places for sale</h2>
              <Link className='text-blue-800 test-sm hover:underline' to={`/search?offer=true`}>Show more offers...</Link>
            </div>
            <div className='flex gap-4 flex-wrap'>
              {saleListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />
              })}
            </div>
          </div>
        </div>
      )}


      {rentListings && rentListings.length > 0 && (
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          <div className=''>
            <div className="my-3">
              <h2 className='text-slate-600 text-2xl font-semibold'>Recent places for rent</h2>
              <Link className='text-blue-800 test-sm hover:underline' to={`/search?offer=true`}>Show more offers...</Link>
            </div>
            <div className='flex gap-4 flex-wrap'>
              {rentListings.map((listing) => {
                return <ListingItem listing={listing} key={listing._id} />
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
