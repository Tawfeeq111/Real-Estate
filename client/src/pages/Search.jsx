import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from './ListingItem.jsx';

function Search() {

    const navigate = useNavigate();

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);


    const handelChange = (e) => {


        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({
                ...sidebarData,
                type: e.target.id
            })
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: (e.target.checked || e.target.checked === 'true') ? true : false,
            })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'
            setSidebarData({
                ...sidebarData,
                sort, order
            })
        }
    }

    useEffect(() => {

        const urlParams = new URLSearchParams(location.search);

        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);
        }

        fetchListings();

    }, [location.search])

    const handelSubmit = (e) => {
        e.preventDefault();
        const urlPrams = new URLSearchParams();
        urlPrams.set('searchTerm', sidebarData.searchTerm);
        urlPrams.set('type', sidebarData.type);
        urlPrams.set('parking', sidebarData.parking);
        urlPrams.set('furnished', sidebarData.furnished);
        urlPrams.set('offer', sidebarData.offer);
        urlPrams.set('sort', sidebarData.sort);
        urlPrams.set('order', sidebarData.order);
        navigate(`/search?${urlPrams.toString()}`)

    }

    console.log(listings)

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:border-b-0  md:min-h-screen'>
                <form className='flex flex-col gap-8' onSubmit={handelSubmit}>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input type='text'
                            id="searchTerm"
                            value={sidebarData.searchTerm}
                            onChange={handelChange}
                            className='rounded-lg w-full p-3'
                            placeholder='Search...' />
                    </div>
                    <div className='flex gap-2 items-center flex-wrap'>
                        <label className='font-semibold'>Type: </label>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.type === 'all'}
                                onChange={handelChange}
                                type="checkbox" id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.type == 'rent'}
                                onChange={handelChange}
                                type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.type == 'sale'}
                                onChange={handelChange}
                                type="checkbox" id="sale" className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.offer}
                                onChange={handelChange}
                                type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center flex-wrap'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.parking}
                                onChange={handelChange}
                                type="checkbox" id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input checked={sidebarData.furnished}
                                onChange={handelChange}
                                type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div>
                        <label className='font-semibold'>Sort: </label>
                        <select className='p-3 rounded-lg border' id="sort_order"
                            onChange={handelChange}
                            defaultValue={'created_at_desc'}
                        >
                            <option value={'regularPrice_desc'} >Price high to low</option>
                            <option value={'regularPrice_asc'} >Price low to high</option>
                            <option value={'createdAt_desc'} >Latest</option>
                            <option value={'createdAt_asc'} >Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 rounded-lg text-white uppercase p-3 hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-slate-700 font-semibold text-3xl mt-5 p-3 border-b-2'>
                    Listing Results:
                </h1>
                <div className="flex flex-wrap p-7 gap-4">
                    {!loading && listings && listings.length === 0 &&
                        <p className='text-slate-700 text-2xl'>No listings found!</p>
                    }
                    {loading && (
                        <p className='text-slate-700 text-2xl text-center w-full'>Loading...</p>
                    )}
                    {!loading && listings && (
                        listings.map((listing) => {
                            return <ListingItem key={listing._id} listing={listing}/>
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search
