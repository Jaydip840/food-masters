import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { UploadCloud, PlusCircle } from 'lucide-react'

import CustomSelect from '../../components/CustomSelect/CustomSelect'

const Add = ({ url }) => {

    const categories = ["Salad", "Rolls", "Desserts", "Sandwich", "Cake", "Soup", "Pasta", "Noodles", "Pizza", "Burger", "Drinks"];

    const [image, setImage] = useState(false)
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)
        const response = await axios.post(`${url}/api/food/add`, formData);

        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad"
            })
            setImage(false)
            toast.success(response.data.message)
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='add-page-container'>
            <div className="admin-page-header">
                <h2>Add New <span>Food Item</span></h2>
                <p>Manage your restaurant menu and add fresh delicacies</p>
            </div>
            
            <div className="admin-card">
              <form className='add-form-grid' onSubmit={onSubmitHandler}>
                  
                  {/* Left Column: Image Upload */}
                  <div className="form-column-left">
                      <div className="form-group flex-col">
                          <label>Upload Display Image</label>
                          <div className="add-image-upload-box">
                              <label htmlFor="image">
                                  {image ? (
                                    <div className="preview-container">
                                      <img src={URL.createObjectURL(image)} alt="Preview" />
                                      <div className="change-overlay">Change Image</div>
                                    </div>
                                  ) : (
                                    <div className="upload-placeholder">
                                      <UploadCloud size={48} color="var(--text-soft)" />
                                      <p>Click or drag to upload image</p>
                                      <span>Supports JPG, PNG (Max 2MB)</span>
                                    </div>
                                  )}
                              </label>
                              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Form Fields */}
                  <div className="form-column-right">
                      <div className="form-group flex-col">
                          <label>Product Name</label>
                          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='e.g., Gourmet Mediterranean Salad' required />
                      </div>

                      <div className="form-row-grid">
                        <div className="form-group flex-col">
                            <label>Product Category</label>
                            <CustomSelect 
                                options={categories} 
                                onChange={onChangeHandler} 
                                value={data.category} 
                                name="category" 
                            />
                        </div>
                        <div className="form-group flex-col">
                            <label>Price (₹)</label>
                            <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='250' required />
                        </div>
                      </div>

                      <div className="form-group flex-col">
                          <label>Product Description</label>
                          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="5" placeholder='Tell your customers what makes this dish special...' required></textarea>
                      </div>

                      <button type='submit' className='admin-submit-btn'>
                          <PlusCircle size={20} /> Add to Menu
                      </button>
                  </div>
              </form>
            </div>
        </div>
    )
}

export default Add
