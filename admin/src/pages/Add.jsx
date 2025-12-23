import React, { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  const [catList, setCatList] = useState([]); 
  const [category, setCategory] = useState(""); 
  const [subCategory, setSubCategory] = useState(""); // Default empty
  const [currentSubCats, setCurrentSubCats] = useState([]);

  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // 1. Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/category/list')
            if(response.data.success && response.data.categories.length > 0) {
                setCatList(response.data.categories)
                // Set default first category
                setCategory(response.data.categories[0].name)
                setCurrentSubCats(response.data.categories[0].subCategories)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    fetchCategories()
  }, [])

  // 2. Update Subcategories when Category changes
  useEffect(() => {
    if(catList.length > 0) {
        const selectedCat = catList.find(c => c.name === category);
        if(selectedCat) {
            setCurrentSubCats(selectedCat.subCategories);
            setSubCategory(""); // Reset subcategory to empty when category changes
        }
    }
  }, [category, catList])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("category", category)
        formData.append("subCategory", subCategory) // Can be empty string now
        formData.append("bestseller", bestseller)
        formData.append("sizes", JSON.stringify(sizes))

        image1 && formData.append("image1", image1)
        image2 && formData.append("image2", image2)
        image3 && formData.append("image3", image3)
        image4 && formData.append("image4", image4)

        const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})
        if (response.data.success) {
            toast.success(response.data.message)
            setName('')
            setDescription('')
            setImage1(false)
            setImage2(false)
            setImage3(false)
            setImage4(false)
            setPrice('')
            setSizes([])
            setBestseller(false)
        } else {
            toast.error(response.data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  // Helper to toggle sizes
  const toggleSize = (size) => {
     setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <p className='mb-2'>Upload Images</p>
        <div className='flex gap-2'>
            <label htmlFor="image1">
                <div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50'>
                   {image1 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image1)} /> : <Upload className='text-gray-400' />}
                </div>
                <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
                <div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50'>
                   {image2 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image2)} /> : <Upload className='text-gray-400' />}
                </div>
                <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
                <div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50'>
                   {image3 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image3)} /> : <Upload className='text-gray-400' />}
                </div>
                <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
                <div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50'>
                   {image4 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image4)} /> : <Upload className='text-gray-400' />}
                </div>
                <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
        </div>

        <div className='w-full'>
            <p className='mb-2'>Product Name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Type here' required />
        </div>

        <div className='w-full'>
            <p className='mb-2'>Product description</p>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Write content here' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
                <p className='mb-2'>Category</p>
                <select onChange={(e)=>setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border rounded bg-white'>
                    {catList.map((cat, index) => (
                        <option key={index} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <p className='mb-2'>Sub Category <span className='text-xs text-gray-500'>(Optional)</span></p>
                <select onChange={(e)=>setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border rounded bg-white'>
                     <option value="">-- None --</option>
                     {currentSubCats.map((sub, index) => (
                        <option key={index} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>
            <div>
                <p className='mb-2'>Price</p>
                <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px] border rounded' type="Number" placeholder='25' required />
            </div>
        </div>

        <div>
            <p className='mb-2'>Product Sizes</p>
            <div className='flex gap-3'>
                {['S','M','L','XL','XXL'].map((item, index) => (
                    <div key={index} onClick={()=>toggleSize(item)}>
                      <p className={`${sizes.includes(item) ? "bg-pink-100 border-pink-500" : "bg-slate-100 border-transparent"} px-3 py-1 cursor-pointer border rounded`}>{item}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className='flex gap-2 mt-2'>
            <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
            <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white rounded active:bg-gray-700'>ADD</button>
    </form>
  )
}
export default Add