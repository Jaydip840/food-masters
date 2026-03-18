import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Doesn't exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const token = createToken(user._id, user.role);
        res.json({
            success: true,
            message: "Login successful",
            token,
            userId: user._id,
            role: user.role,
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET)
}

// register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a storng password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: "user",
        })

        const user = await newUser.save()
        const token = createToken(user._id, user.role);

        res.json({
            success: true,
            message: "Registration successful",
            token,
            userId: user._id,
            role: user.role,
        });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error" })

    }
}

// Get user profile details
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
};

// Send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();
        
        // Output OTP to terminal since nodemailer was removed and test mode is safer
        console.log(`\n==========================================\n🔒 TEST MODE OTP FOR ${email}: ${otp}\n==========================================\n`);
        
        res.json({ success: true, message: "OTP generated (check server console)" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending OTP" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }
        
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = "";
        user.otpExpiry = null;
        await user.save();
        
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error resetting password" });
    }
};

export { loginUser, registerUser, getUserProfile, sendOtp, resetPassword }