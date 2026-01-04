import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const LegalPage = () => {
    const { slug } = useParams();
    const { backendUrl } = useContext(ShopContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`${backendUrl}/api/pages/${slug}`)
            .then(res => {
                if(res.data.success) setData(res.data.page);
            })
            .catch(err => console.error(err));
    }, [slug, backendUrl]);

    if(!data) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-10 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-6 capitalize text-[#233a95]">{data.title}</h1>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {data.content}
            </div>
        </div>
    )
}
export default LegalPage;