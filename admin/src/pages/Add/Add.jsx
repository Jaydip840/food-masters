import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({ url }) => {

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
        <div className='add'>
            <div className="add-header">
                <h2>Add New Item</h2>
                <p>Add a new food item to your menu</p>
            </div>
            
            <form className='add-form' onSubmit={onSubmitHandler}>
                <div className="form-group flex-col">
                    <label>Upload Image</label>
                    <div className="add-image-upload">
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload area" className="upload-preview" />
                            {!image && <span className="upload-hint">Click to upload</span>}
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group flex-col">
                        <label>Product name</label>
                        <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='e.g., Spicy Paneer Tikka' required />
                    </div>

                    <div className="form-group flex-col">
                        <label>Product category</label>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Soup">Soup</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burger</option>
                            <option value="Drinks">Drinks</option>
                        </select>
                    </div>
                </div>

                <div className="form-group flex-col">
                    <label>Product description</label>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Detailed description of the dish...' required></textarea>
                </div>

                <div className="form-row price-row">
                    <div className="form-group flex-col">
                        <label>Product price (₹)</label>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='250' required />
                    </div>
                </div>
                
                <button type='submit' className='add-btn'>
                    Add Item
                </button>
            </form>
        </div>
    )
}

export default Add
