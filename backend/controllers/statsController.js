import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";

// Get dashboard stats
const getStats = async (req, res) => {
    try {
        const totalItems = await foodModel.countDocuments();

        const orders = await orderModel.find({});
        const totalOrders = orders.length;

        // Calculate total revenue from all orders
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.amount;
        });

        res.json({
            success: true,
            data: {
                totalItems,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error) {
        console.log("Error fetching stats:", error);
        res.json({ success: false, message: "Error fetching statistics" });
    }
}

export { getStats }
