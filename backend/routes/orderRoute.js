import express from "express"
import authMiddleware from "../middleware/auth.js"
import { placeOrder, verifyOrder, userOrders,listOrders,updateStaus, clearHistory } from "../controllers/orderController.js"

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get('/list',listOrders)
orderRouter.post('/status',updateStaus)
orderRouter.post('/clearhistory',authMiddleware,clearHistory)

export default orderRouter;