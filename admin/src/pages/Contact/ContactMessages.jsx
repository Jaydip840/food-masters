import React, { useEffect, useState } from "react";
import "./ContactMessages.css";
import axios from "axios";
import { toast } from "react-toastify";

const ContactMessages = ({ url }) => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${url}/api/contact`);
      setMessages(res.data);
    } catch (err) {
      console.log("Error fetching messages:", err);
    }
  };

  const removeMessage = async (id) => {
    const res = await axios.post(`${url}/api/contact/remove`, { id });

    if (res.data.success) {
      toast.success("Message removed");
      fetchMessages();
    } else {
      toast.error(res.data.message);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="contact-messages-page">
      <h2>Contact Messages</h2>

      <div className="contact-table">
        <div className="contact-header">
          <b>Name</b>
          <b>Email</b>
          <b>Message</b>
          <b>Date</b>
          <b>Action</b>
        </div>

        {messages.map((msg) => (
          <div className="contact-row" key={msg._id}>
            <p className="name">{msg.name}</p>
            <p>{msg.email}</p>
            <p>{msg.message}</p>
            <p>{new Date(msg.createdAt).toLocaleString()}</p>

            <p className="cursor" onClick={() => removeMessage(msg._id)}>
              x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactMessages;
