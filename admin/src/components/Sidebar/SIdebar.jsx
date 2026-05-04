import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { PlusSquare, List, ShoppingBag, MessageSquare } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <PlusSquare size={22} className="nav-icon" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to='/list' className="sidebar-option">
          <List size={22} className="nav-icon" />
          <p>List Items</p>
        </NavLink>

        <NavLink to='/orders' className="sidebar-option">
          <ShoppingBag size={22} className="nav-icon" />
          <p>Orders</p>
        </NavLink>

        <NavLink to='/contact-messages' className="sidebar-option">
          <MessageSquare size={22} className="nav-icon" />
          <p>Messages</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
