import express from "express";
import Contact from "../models/ContactMode.js";

const router = express.Router();

// POST contact form data
router.post("/", async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    await newMessage.save();
    res.json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// REMOVE message
router.post("/remove", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Message removed" });
  } catch (err) {
    res.json({ success: false, message: "Error deleting message" });
  }
});

export default router;
