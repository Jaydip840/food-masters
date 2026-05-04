import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets.js';
import { Package, MapPin, Phone, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect/CustomSelect';

const Orders = ({ url }) => {
  const statusOptions = ["Processing", "Out for delivery", "Delivered", "Cancelled"];
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      const reversedOrders = [...response.data.data].reverse();
      setOrders(reversedOrders);
    } else {
      toast.error("Error fetching orders");
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    const response = await axios.post(url + "/api/order/status", {
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
    <div className='orders-page-container'>
      <div className="admin-page-header">
        <h2>Order <span>Management</span></h2>
        <p>Track, manage and process customer orders in real-time</p>
      </div>

      <div className="orders-grid">
        {orders.map((order, index) => (
          <div key={index} className={`order-premium-card ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
            
            {/* Order Head */}
            <div className="order-card-head">
              <div className="order-id-box">
                <Package size={24} className="order-icon" />
                <div className="id-details">
                  <span className="label">ORDER ID</span>
                  <span className="id">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
              <div className="order-date-box">
                <Calendar size={16} />
                <span>{formatDate(order.date)}</span>
              </div>
            </div>

            <div className="order-card-body">
              {/* Items Section */}
              <div className="order-items-section">
                <h4>Items Ordered ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map((item, i) => (
                    <div key={i} className="item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Address */}
              <div className="order-delivery-section">
                <h4>Delivery Details</h4>
                <div className="customer-main">
                  <span className="customer-name">{order.address.firstName} {order.address.lastName}</span>
                  <div className="contact-info">
                    <Phone size={14} /> {order.address.phone}
                  </div>
                </div>
                <div className="address-box">
                  <MapPin size={16} className="pin-icon" />
                  <p>{order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}</p>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="order-status-section">
                <div className="payment-badge">
                  <CreditCard size={16} />
                  <span>{order.paymentMethod} • <b className={order.payment ? 'paid' : 'pending'}>{order.payment ? 'PAID' : 'PENDING'}</b></span>
                </div>
                <div className="total-amount">
                  <span className="label">Total Amount</span>
                  <span className="value">₹{order.amount}</span>
                </div>
                
                <div className="status-control">
                  <label>Update Status</label>
                  <CustomSelect 
                    options={statusOptions} 
                    onChange={(e) => statusHandler(e, order._id)} 
                    value={order.status} 
                    name="status" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="admin-card empty-orders">
            <Package size={64} opacity={0.2} />
            <h3>No Active Orders</h3>
            <p>Customer orders will appear here once placed.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
