import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"

const List = ({url}) => {

    const [list, setList] = useState([]);
    
    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [editFood, setEditFood] = useState(null);
    const [editImage, setEditImage] = useState(null);

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
            setList(response.data.data);
        }
        else {
            toast.error("Error fetching list")
        }
    }

    const removeFood = async(foodId) => {
        const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
        await fetchList();
        if (response.data.success){
            toast.success(response.data.message)
        }
        else{
            toast.error("Error removing food");
        }
    }

    // --- Edit Handlers ---
    const openEditModal = (food) => {
        setEditFood({...food});
        setEditImage(null);
        setIsEditing(true);
    }

    const closeEditModal = () => {
        setIsEditing(false);
        setEditFood(null);
        setEditImage(null);
    }

    const onEditChange = (e) => {
        const { name, value } = e.target;
        setEditFood(prev => ({ ...prev, [name]: value }));
    }

    const handleEditSubmit = async (e) => {
        e.e.preventDefault();
        const formData = new FormData();
        formData.append("id", editFood._id);
        formData.append("name", editFood.name);
        formData.append("description", editFood.description);
        formData.append("price", Number(editFood.price));
        formData.append("category", editFood.category);
        if (editImage) {
            formData.append("image", editImage);
        }

        try {
            const response = await axios.post(`${url}/api/food/update`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setIsEditing(false);
                fetchList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating food");
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='list flex-col'>
            <div className="list-header">
                <h2>All Foods List</h2>
                <p>Manage your menu items</p>
            </div>
            
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className="text-center">Action</b>
                </div>

                {list.map((item, index) => {
                    return (
                        <div key={index} className='list-table-format'>
                            <img src={`${url}/images/`+item.image} alt={item.name} className="food-img"/>
                            <p className="food-name">{item.name}</p>
                            <p className="food-category"><span className="cat-badge">{item.category}</span></p>
                            <p className="food-price">₹{item.price}</p>
                            <div className="action-buttons">
                                <button onClick={() => openEditModal(item)} className="edit-btn">Edit</button>
                                <button onClick={() => removeFood(item._id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Food Item</h2>
                        <form onSubmit={handleEditSubmit} className="edit-form">
                            <div className="form-group flex-col">
                                <label>Product name</label>
                                <input onChange={onEditChange} value={editFood.name} type="text" name='name' required />
                            </div>

                            <div className="form-group flex-col">
                                <label>Category</label>
                                <select onChange={onEditChange} name="category" value={editFood.category}>
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

                            <div className="form-group flex-col">
                                <label>Price (₹)</label>
                                <input onChange={onEditChange} value={editFood.price} type="number" name='price' required />
                            </div>

                            <div className="form-group flex-col">
                                <label>Description</label>
                                <textarea onChange={onEditChange} value={editFood.description} name="description" rows="3" required></textarea>
                            </div>

                            <div className="form-group flex-col">
                                <label>New Image (optional)</label>
                                <input onChange={(e) => setEditImage(e.target.files[0])} type="file" />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeEditModal} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default List
