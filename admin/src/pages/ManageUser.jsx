import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'

const ManageUser = ({ token }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const userId = location.state?.id || null // If ID exists, it's Edit mode

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("") // Empty by default
    
    // Address
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zipcode, setZipcode] = useState("")
    const [country, setCountry] = useState("")

    useEffect(() => {
        if(userId) {
            const fetchUser = async () => {
                try {
                    const res = await axios.post(backendUrl + '/api/user/single', { id: userId }, { headers: { token } });
                    if(res.data.success) {
                        const u = res.data.user;
                        setName(u.name); setEmail(u.email); setPhone(u.phone);
                        if(u.address) {
                            setStreet(u.address.street || "");
                            setCity(u.address.city || "");
                            setState(u.address.state || "");
                            setZipcode(u.address.zipcode || "");
                            setCountry(u.address.country || "");
                        }
                    }
                } catch(e) { toast.error(e.message) }
            }
            fetchUser();
        }
    }, [userId, token])

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: userId, // If null, backend handles as create
                name, email, phone, password,
                street, city, state, zipcode, country
            };

            const res = await axios.post(backendUrl + '/api/user/manage', payload, { headers: { token } });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/users');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full max-w-2xl gap-4 bg-white p-8 rounded shadow'>
            <h2 className='text-2xl font-bold mb-4'>{userId ? "Edit User" : "Add New User"}</h2>
            
            <div className='flex gap-4'>
                <div className='w-1/2'>
                    <p className='mb-2'>Full Name</p>
                    <input onChange={e=>setName(e.target.value)} value={name} className='w-full border px-3 py-2 rounded' required />
                </div>
                <div className='w-1/2'>
                    <p className='mb-2'>Email</p>
                    <input onChange={e=>setEmail(e.target.value)} value={email} type='email' className='w-full border px-3 py-2 rounded' required />
                </div>
            </div>

            <div className='flex gap-4'>
                <div className='w-1/2'>
                    <p className='mb-2'>Phone</p>
                    <input onChange={e=>setPhone(e.target.value)} value={phone} className='w-full border px-3 py-2 rounded' required />
                </div>
                <div className='w-1/2'>
                    <p className='mb-2'>Password {userId && <span className='text-xs text-gray-400'>(Leave blank to keep current)</span>}</p>
                    <input onChange={e=>setPassword(e.target.value)} value={password} type='password' className='w-full border px-3 py-2 rounded' placeholder={userId ? "******" : "Required"} required={!userId} />
                </div>
            </div>

            <p className='font-bold mt-4 border-b pb-2'>Address Details</p>
            
            <div className='w-full'>
                <p className='mb-2'>Street</p>
                <input onChange={e=>setStreet(e.target.value)} value={street} className='w-full border px-3 py-2 rounded' />
            </div>

            <div className='flex gap-4'>
                <div className='w-1/2'><p className='mb-2'>City</p><input onChange={e=>setCity(e.target.value)} value={city} className='w-full border px-3 py-2 rounded'/></div>
                <div className='w-1/2'><p className='mb-2'>State</p><input onChange={e=>setState(e.target.value)} value={state} className='w-full border px-3 py-2 rounded'/></div>
            </div>

            <div className='flex gap-4'>
                <div className='w-1/2'><p className='mb-2'>Zipcode</p><input onChange={e=>setZipcode(e.target.value)} value={zipcode} className='w-full border px-3 py-2 rounded'/></div>
                <div className='w-1/2'><p className='mb-2'>Country</p><input onChange={e=>setCountry(e.target.value)} value={country} className='w-full border px-3 py-2 rounded'/></div>
            </div>

            <button type='submit' className='bg-black text-white py-3 rounded mt-4 font-bold hover:bg-gray-800'>
                {userId ? "UPDATE USER" : "CREATE USER"}
            </button>
        </form>
    )
}

export default ManageUser