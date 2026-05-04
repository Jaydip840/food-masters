import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"
import { Pencil, Trash2, X } from 'lucide-react'
import CustomSelect from '../../components/CustomSelect/CustomSelect'

const List = ({url}) => {

    const categories = ["Salad", "Rolls", "Desserts", "Sandwich", "Cake", "Soup", "Pasta", "Noodles", "Pizza", "Burger", "Drinks"];

    const [list, setList] = useState([]);
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
        if(!window.confirm("Are you sure you want to remove this item?")) return;
        const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
        await fetchList();
        if (response.data.success){
            toast.success(response.data.message)
        }
        else{
            toast.error("Error removing food");
        }
    }

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
        e.preventDefault();
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
        <div className='list-page-container'>
            <div className="admin-page-header">
                <h2>Menu <span>Inventory</span></h2>
                <p>Monitor and manage your food items in real-time</p>
            </div>
            
            <div className="admin-card inventory-card">
                <div className="inventory-table-wrapper">
                  <table className="inventory-table">
                      <thead>
                          <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th className="text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {list.map((item, index) => (
                              <tr key={index} className="inventory-row">
                                  <td>
                                    <div className="row-img-box">
                                      <img src={`${url}/images/`+item.image} alt={item.name} />
                                    </div>
                                  </td>
                                  <td className="font-bold">{item.name}</td>
                                  <td><span className="cat-pill">{item.category}</span></td>
                                  <td className="price-tag">₹{item.price}</td>
                                  <td className="text-right">
                                      <div className="action-flex">
                                          <button onClick={() => openEditModal(item)} className="icon-btn edit">
                                            <Pencil size={16} />
                                          </button>
                                          <button onClick={() => removeFood(item._id)} className="icon-btn delete">
                                            <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                          <h3>Edit <span>Menu Item</span></h3>
                          <button onClick={closeEditModal} className="close-modal"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="edit-modal-form">
                            <div className="form-group flex-col">
                                <label>Product Name</label>
                                <input onChange={onEditChange} value={editFood.name} type="text" name='name' required />
                            </div>

                            <div className="form-grid-2">
                              <div className="form-group flex-col">
                                  <label>Category</label>
                                  <CustomSelect 
                                      options={categories} 
                                      onChange={onEditChange} 
                                      value={editFood.category} 
                                      name="category" 
                                  />
                              </div>

                              <div className="form-group flex-col">
                                  <label>Price (₹)</label>
                                  <input onChange={onEditChange} value={editFood.price} type="number" name='price' required />
                              </div>
                            </div>

                            <div className="form-group flex-col">
                                <label>Description</label>
                                <textarea onChange={onEditChange} value={editFood.description} name="description" rows="3" required></textarea>
                            </div>

                            <div className="form-group flex-col">
                                <label>Update Image</label>
                                <div className="modal-image-input">
                                  <input onChange={(e) => setEditImage(e.target.files[0])} type="file" />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeEditModal} className="btn-cancel">Discard</button>
                                <button type="submit" className="btn-save">Update Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default List
