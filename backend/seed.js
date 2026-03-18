import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const ingredientMap = {
    "Salad": [
        { name: "Extra Paneer", extraPrice: 30 },
        { name: "Extra Veggies", extraPrice: 20 },
        { name: "Diet Mayo", extraPrice: 15 }
    ],
    "Rolls": [
        { name: "Extra Mayo", extraPrice: 10 },
        { name: "Extra Egg", extraPrice: 15 },
        { name: "Double Filling", extraPrice: 40 }
    ],
    "Deserts": [
        { name: "Extra Chocolate Sauce", extraPrice: 20 },
        { name: "Extra Choco Chips", extraPrice: 15 },
        { name: "Vanilla Scoop", extraPrice: 30 }
    ],
    "Sandwich": [
        { name: "Extra Cheese", extraPrice: 20 },
        { name: "Double Patty", extraPrice: 50 },
        { name: "Spicy Mayo", extraPrice: 15 },
        { name: "Crispy Bacon", extraPrice: 40 },
        { name: "Olives", extraPrice: 10 }
    ],
    "Cake": [
        { name: "Extra Frosting", extraPrice: 20 },
        { name: "Extra Choco Chips", extraPrice: 15 },
        { name: "Candles", extraPrice: 5 }
    ],
    "Pure Veg": [
        { name: "Extra Cheese", extraPrice: 20 },
        { name: "Extra Paneer", extraPrice: 30 },
        { name: "Jalapenos", extraPrice: 15 }
    ],
    "Pasta": [
        { name: "Extra Cheese", extraPrice: 25 },
        { name: "Garlic Bread", extraPrice: 40 },
        { name: "Extra Olives", extraPrice: 15 }
    ],
    "Noodles": [
        { name: "Extra Schezwan", extraPrice: 10 },
        { name: "Extra Veggies", extraPrice: 20 },
        { name: "Fried Egg", extraPrice: 15 }
    ]
};

const seed = async () => {
    try {
        await mongoose.connect('mongodb+srv://FoodMasters:324445@cluster0.zyftnoz.mongodb.net/food-del');
        console.log("DB Connected");

        let modifiedCount = 0;

        const allItems = await foodModel.find({});
        for (const item of allItems) {
            const categoryIngredients = ingredientMap[item.category] || [];
            if (categoryIngredients.length > 0) {
                await foodModel.updateOne({ _id: item._id }, {
                    $set: { ingredients: categoryIngredients }
                });
                modifiedCount++;
            } else {
                // If it doesn't match a specific category, just wipe out the generic "Extra Cheese" etc, or leave as empty
                await foodModel.updateOne({ _id: item._id }, {
                    $set: { ingredients: [] }
                });
            }
        }

        console.log(`Ingredients seeded successfully! Updated ${modifiedCount} categories out of ${allItems.length} total items.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

seed();
