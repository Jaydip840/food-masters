import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets.js';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {

    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      // Create a new array and reverse it to prevent mutating the original state directly
      const reversedOrders = [...response.data.data].reverse();
      setOrders(reversedOrders); // Show newest first
    } else {
      toast.error("Error fetching orders");
    }
  }

  const statusHandler = async (event,orderId) =>{
    const newStatus = event.target.value;
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status: newStatus
    })    
    if (response.data.success) {
      toast.success(`Order status updated to ${newStatus}`);
      await fetchAllOrders();
    } else {
      toast.error("Failed to update status");
    }
  }

  // Helper to format the Date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='orders-page flex-col'>
      <div className="orders-header">
        <h2>Order Management</h2>
        <p>Monitor and update customer orders</p>
      </div>
      
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className={`order-card ${order.status === 'Cancelled' ? 'cancelled-order' : ''}`}>
            <div className="order-card-icon">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
            </div>
            
            <div className="order-details">
              <p className='order-item-food'>
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? item.name + " x " + item.quantity
                    : item.name + " x " + item.quantity + ", "
                )}
              </p>
              
              <div className="order-customer-info">
                <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
            </div>
            
            <div className="order-meta">
              <div className="meta-top">
                <p className="order-date"><i className="fa-regular fa-clock"></i> {formatDate(order.date)}</p>
                <p className="payment-status">
                  Payment: 
                  {order.paymentMethod === "UPI" ? (
                    <span className="paid">UPI (Paid)</span>
                  ) : order.paymentMethod === "Stripe" ? (
                    <span className={order.payment ? "paid" : "pending"}>Stripe ({order.payment ? "Paid" : "Pending"})</span>
                  ) : order.paymentMethod === "COD" ? (
                    <span className={order.payment ? "paid" : "pending"}>COD ({order.payment ? "Paid" : "Pending"})</span>
                  ) : (
                    <span className={order.payment ? "paid" : "pending"}>{order.payment ? "Online (Paid)" : "COD (Pending)"}</span>
                  )}
                </p>
              </div>

              <div className="meta-bottom">
                <div className="meta-info">
                  <p>Items: <b>{order.items.length}</b></p>
                  <p className="order-amount">₹{order.amount}</p>
                </div>
                
                <select 
                  onChange={(event)=>statusHandler(event,order._id)} 
                  value={order.status}
                  className={`status-select ${order.status.toLowerCase().replace(' ', '-')}`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="no-orders text-center">
            <img src={assets.parcel_icon} alt="No orders" style={{opacity: 0.3, width: '60px'}}/>
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
