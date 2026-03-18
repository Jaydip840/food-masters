import express from "express"
import { loginUser, registerUser, getUserProfile, sendOtp, resetPassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/profile", authMiddleware, getUserProfile)
userRouter.post("/send-otp", sendOtp)
userRouter.post("/reset-password", resetPassword)

export default userRouter;