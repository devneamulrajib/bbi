import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Trash2, X, Edit, Save, RotateCcw, Plus } from 'lucide-react'

const Category = ({ token }) => {
  const [list, setList] = useState([])
  
  // Form States
  const [name, setName] = useState('')
  
  // New SubCategory Logic
  const [subCatInput, setSubCatInput] = useState('')
  const [subCategories, setSubCategories] = useState([]) // Array to store multiple

  const [editId, setEditId] = useState(null) 

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setList(response.data.categories)
      } else {
        toast.error("Failed to load categories")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Add SubCategory to Local List
  const handleAddSubCat = (e) => {
    e?.preventDefault(); // Prevent form submit if triggered by enter key
    if (!subCatInput.trim()) return;
    if (subCategories.includes(subCatInput.trim())) {
        toast.error("Subcategory already added");
        return;
    }
    setSubCategories(prev => [...prev, subCatInput.trim()]);
    setSubCatInput('');
  };

  // Remove SubCategory from Local List
  const handleRemoveLocalSubCat = (index) => {
    setSubCategories(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Submit (Add OR Update)
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let response;
      const payload = { 
        name, 
        subCategories: subCategories // Sending the Array directly
      };

      if (editId) {
        response = await axios.post(backendUrl + '/api/category/update', { ...payload, id: editId }, { headers: { token } })
      } else {
        response = await axios.post(backendUrl + '/api/category/add', payload, { headers: { token } })
      }
      
      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
        fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Load Data into Form
  const loadEditData = (category) => {
    setEditId(category._id)
    setName(category.name)
    setSubCategories(category.subCategories || []) 
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }

  // Reset Form
  const resetForm = () => {
    setName('')
    setSubCatInput('')
    setSubCategories([])
    setEditId(null)
  }

  // Remove Category (Backend)
  const removeCategory = async (id) => {
    if(!window.confirm("Delete this category?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/category/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [token])

  return (
    <div className='w-full max-w-4xl'>
      <div className='flex justify-between items-center mb-4'>
          <p className="text-xl font-bold text-gray-700">{editId ? "Edit Category" : "Add Category"}</p>
          {editId && <button onClick={resetForm} className='text-sm text-red-500 flex items-center gap-1 hover:underline'><RotateCcw size={14}/> Cancel Edit</button>}
      </div>
      
      {/* --- FORM --- */}
      <form onSubmit={onSubmitHandler} className={`flex flex-col gap-4 mb-8 p-6 rounded-lg shadow-sm border ${editId ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
        
        {/* Category Name */}
        <div>
          <p className='mb-2 font-medium'>Category Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="e.g. Men" className='w-full px-3 py-2 border rounded' required />
        </div>

        {/* Sub Categories Input Area */}
        <div>
          <p className='mb-2 font-medium'>Sub Categories</p>
          <div className='flex gap-2 mb-2'>
            <input 
                onChange={(e) => setSubCatInput(e.target.value)} 
                value={subCatInput} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubCat(e)}
                type="text" 
                placeholder="Type and press Enter (e.g. Shirt)" 
                className='w-full px-3 py-2 border rounded' 
            />
            <button type='button' onClick={handleAddSubCat} className='bg-gray-200 hover:bg-gray-300 px-4 rounded border font-medium'>ADD</button>
          </div>

          {/* Display Added Subcategories (Tags) */}
          <div className='flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 border border-dashed rounded'>
             {subCategories.length === 0 && <span className='text-gray-400 text-sm p-1'>No subcategories added yet.</span>}
             {subCategories.map((sub, idx) => (
                <span key={idx} className='bg-white border text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm'>
                    {sub}
                    <X size={14} className='cursor-pointer text-gray-400 hover:text-red-500' onClick={() => handleRemoveLocalSubCat(idx)}/>
                </span>
             ))}
          </div>
        </div>
        
        <button type="submit" className={`px-8 py-2 w-max rounded text-white flex items-center gap-2 ${editId ? "bg-blue-600 hover:bg-blue-700" : "bg-black hover:bg-gray-800"}`}>
            {editId ? <><Save size={18}/> UPDATE CATEGORY</> : "ADD CATEGORY"}
        </button>
      </form>

      <hr className='mb-6' />

      {/* --- LIST --- */}
      <p className='mb-4 font-bold text-lg'>Existing Categories</p>
      <div className='flex flex-col gap-4'>
        
        <div className='hidden md:grid grid-cols-[2fr_3fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold rounded'>
          <p>Category Name</p>
          <p>Sub Categories</p>
          <p className='text-center'>Actions</p>
        </div>

        {list.map((item, index) => (
          <div key={index} className='grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] items-center gap-4 md:gap-0 py-4 px-4 border rounded bg-white shadow-sm'>
            
            <p className='font-bold text-lg md:text-base text-[#233a95]'>{item.name}</p>
            
            <div className='flex flex-wrap gap-2'>
                {item.subCategories.length > 0 ? item.subCategories.map((sub, idx) => (
                    <span key={idx} className='bg-gray-100 px-2 py-1 rounded text-xs border'>
                        {sub}
                    </span>
                )) : <span className='text-gray-400 text-sm italic'>No Subcategories</span>}
            </div>

            <div className='flex items-center justify-end md:justify-center gap-4'>
                <button onClick={() => loadEditData(item)} className='text-blue-500 hover:text-blue-700'>
                    <Edit size={20} />
                </button>
                <button onClick={() => removeCategory(item._id)} className='text-red-500 hover:text-red-700'>
                    <Trash2 size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category