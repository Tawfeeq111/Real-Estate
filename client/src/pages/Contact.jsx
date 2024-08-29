import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Contact({ listing }) {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/getUser/${listing.userRef}`);
                const data = await res.json();
                if (data.success == false) {
                    console.log(data.message);
                    return;
                }
                setUser(data);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchUser();
    }, [])


    return (<>
        {user && <div className='flex gap-4 flex-col my-5'>
            <p>Contact <span className='font-semibold'>{ user?.email }</span> for <span className='font-semibold'>{(listing.name).toLowerCase()}</span></p>
            <textarea onChange={(e) => setMessage(e.target.value)} name="messgae" rows={2} placeholder='Enter the message...' className='w-full p-2 border rounded-lg'></textarea>
            <Link 
            to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}>
                <button className='w-full bg-gray-700 text-white uppercase p-3 rounded-lg hover:opacity-95'>Send Message</button>
            </Link>
        </div>}
    </>
    )
}

export default Contact
