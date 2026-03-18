import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item

const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}

//update food item
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        const updateData = { name, description, price, category };

        // If a new image is provided, delete the old one and use the new one's filename
        if (req.file) {
            const food = await foodModel.findById(id);
            if (food.image) {
                fs.unlink(`uploads/${food.image}`, () => { })
            }
            updateData.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: Error })
    }
}

//remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
//rate food item
const rateFood = async (req, res) => {
    try {
        const { itemId, rating } = req.body;
        const userId = req.body.userId; // Provided by auth middleware

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const food = await foodModel.findById(itemId);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Set or update the user's rating in the Map
        food.ratings.set(userId, Number(rating));
        await food.save();

        res.json({ success: true, message: "Rating added successfully", ratings: food.ratings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding rating" });
    }
}

export { addFood, listFood, removeFood, updateFood, rateFood }
