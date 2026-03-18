import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId })
        let cartData = await userData.cartData;

        // itemId could now be a compositeID like '5f1..._cheese_bacon'
        let compositeId = req.body.itemId;

        if (!cartData[compositeId]) {
            cartData[compositeId] = 1;
        }
        else {
            cartData[compositeId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        let compositeId = req.body.itemId;

        if (cartData[compositeId] > 0) {
            cartData[compositeId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//fetch user cart data
const getcart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addToCart, removeFromCart, getcart }