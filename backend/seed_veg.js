import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const nameToIngredientsMap = {
    // Salads
    "Greek Salad": [{ name: "Extra Feta Cheese", extraPrice: 30 }, { name: "Extra Olives", extraPrice: 15 }],
    "Veg Salad": [{ name: "Extra Cucumber", extraPrice: 10 }, { name: "Diet Dressing", extraPrice: 15 }],
    "Clover Salad": [{ name: "Extra Sprouts", extraPrice: 20 }, { name: "Mustard Mayo", extraPrice: 15 }],
    "Paneer Salad": [{ name: "Double Paneer", extraPrice: 40 }, { name: "Spicy Mayo", extraPrice: 15 }],

    // Rolls
    "Lasagna Rolls": [{ name: "Extra Mozzarella", extraPrice: 35 }, { name: "Jalapenos", extraPrice: 15 }],
    "Peri Peri Rolls": [{ name: "Peri Peri Mayo", extraPrice: 15 }, { name: "Extra Veggies", extraPrice: 20 }],
    "Paneer Rolls": [{ name: "Extra Paneer", extraPrice: 40 }, { name: "Mint Chutney", extraPrice: 10 }],
    "Veg Rolls": [{ name: "Extra Veggies", extraPrice: 20 }, { name: "Schezwan Sauce", extraPrice: 15 }],

    // Desserts
    "Ripple Ice Cream": [{ name: "Extra Choco Chips", extraPrice: 15 }, { name: "Nuts", extraPrice: 20 }],
    "Fruit Ice Cream": [{ name: "Extra Fruit Chunks", extraPrice: 30 }, { name: "Strawberry Syrup", extraPrice: 15 }],
    "Jar Ice Cream": [{ name: "Extra Caramel", extraPrice: 15 }, { name: "Choco Sprinkles", extraPrice: 15 }],
    "Vanilla Ice Cream": [{ name: "Chocolate Sauce", extraPrice: 15 }, { name: "Wafer", extraPrice: 10 }],

    // Sandwich
    "Aloo Tikki Sandwich": [{ name: "Extra Tikki", extraPrice: 30 }, { name: "Cheese Slice", extraPrice: 20 }],
    "Vegan Sandwich": [{ name: "Tofu Slice", extraPrice: 40 }, { name: "Vegan Mayo", extraPrice: 20 }],
    "Grilled Sandwich": [{ name: "Double Cheese", extraPrice: 30 }, { name: "Green Chutney", extraPrice: 10 }],
    "Bread Sandwich": [{ name: "Extra Butter", extraPrice: 15 }, { name: "Cheese Slice", extraPrice: 20 }],

    // Cake
    "Cup Cake": [{ name: "Extra Frosting", extraPrice: 20 }, { name: "Sprinkles", extraPrice: 10 }],
    "Vegan Cake": [{ name: "Dairy-free Cream", extraPrice: 30 }, { name: "Fresh Berries", extraPrice: 40 }],
    "Butterscotch Cake": [{ name: "Extra Caramel", extraPrice: 20 }, { name: "Choco Chips", extraPrice: 15 }],
    "Sliced Cake": [{ name: "Vanilla Ice Cream Scoop", extraPrice: 30 }, { name: "Chocolate Sauce", extraPrice: 15 }],

    // Soup
    "Tomato Soup": [{ name: "Garlic Bread", extraPrice: 40 }, { name: "Extra Cream", extraPrice: 15 }],
    "Veg Manchow Soup": [{ name: "Extra Fried Noodles", extraPrice: 20 }, { name: "Paneer Chunks", extraPrice: 30 }],
    "Mixed Vegetable Soup": [{ name: "Garlic Bread", extraPrice: 40 }, { name: "Roasted Corn", extraPrice: 20 }],
    "Cream of Mushroom Soup": [{ name: "Garlic Bread", extraPrice: 40 }, { name: "Extra Cheese", extraPrice: 25 }],

    // Pasta
    "Cheese Pasta": [{ name: "Double Cheese", extraPrice: 40 }, { name: "Garlic Bread", extraPrice: 40 }],
    "Tomato Pasta": [{ name: "Extra Olives", extraPrice: 20 }, { name: "Jalapenos", extraPrice: 15 }],
    "Creamy Pasta": [{ name: "Extra Mushrooms", extraPrice: 30 }, { name: "Garlic Bread", extraPrice: 40 }],
    "Spinach Pasta": [{ name: "Extra Spinach", extraPrice: 20 }, { name: "Cheese Sprinkle", extraPrice: 25 }],

    // Noodles
    "Butter Noodles": [{ name: "Extra Butter", extraPrice: 20 }, { name: "Garlic Bits", extraPrice: 15 }],
    "Veg Noodles": [{ name: "Extra Veggies", extraPrice: 25 }, { name: "Schezwan Sauce", extraPrice: 15 }],
    "Somen Noodles": [{ name: "Tofu Cubes", extraPrice: 35 }, { name: "Chili Oil", extraPrice: 15 }],
    "Cooked Noodles": [{ name: "Manchurian Balls", extraPrice: 40 }, { name: "Extra Soy Sauce", extraPrice: 10 }],

    // Pizza
    "Margherita Pizza": [{ name: "Extra Mozzarella", extraPrice: 40 }, { name: "Black Olives", extraPrice: 20 }],
    "Farmhouse Pizza": [{ name: "Double Cheese", extraPrice: 50 }, { name: "Extra Mushrooms", extraPrice: 30 }],
    "Paneer Tikka Pizza": [{ name: "Extra Paneer", extraPrice: 50 }, { name: "Jalapenos", extraPrice: 20 }],
    "Corn & Cheese Pizza": [{ name: "Extra Sweet Corn", extraPrice: 25 }, { name: "Extra Cheese", extraPrice: 40 }],

    // Burger
    "Classic Veggie Burger": [{ name: "Cheese Slice", extraPrice: 20 }, { name: "Jalapenos", extraPrice: 15 }],
    "Aloo Tikki Burger": [{ name: "Double Tikki", extraPrice: 40 }, { name: "Cheese Slice", extraPrice: 20 }],
    "Double Cheese Veg Burger": [{ name: "Triple Cheese", extraPrice: 30 }, { name: "Spicy Mayo", extraPrice: 15 }],
    "Crispy Veg Supreme Burger": [{ name: "Extra Patty", extraPrice: 50 }, { name: "Extra Veggies", extraPrice: 20 }],

    // Drinks
    "Fresh Lime Soda": [{ name: "Extra Mint", extraPrice: 10 }, { name: "Large Size", extraPrice: 30 }],
    "Virgin Mojito": [{ name: "Extra Lemon", extraPrice: 15 }, { name: "Large Size", extraPrice: 40 }],
    "Iced Tea (Lemon)": [{ name: "Extra Ice", extraPrice: 0 }, { name: "Large Size", extraPrice: 30 }],
    "Orange Juice": [{ name: "No Ice", extraPrice: 0 }, { name: "Large Size", extraPrice: 30 }]
};

const seed = async () => {
    try {
        await mongoose.connect('mongodb+srv://FoodMasters:324445@cluster0.zyftnoz.mongodb.net/food-del');
        console.log("DB Connected");

        let modifiedCount = 0;

        const allItems = await foodModel.find({});
        for (const item of allItems) {
            const exactIngredients = nameToIngredientsMap[item.name] || [];
            if (exactIngredients.length > 0) {
                await foodModel.updateOne({ _id: item._id }, {
                    $set: { ingredients: exactIngredients }
                });
                modifiedCount++;
            } else {
                await foodModel.updateOne({ _id: item._id }, {
                    $set: { ingredients: [] }
                });
            }
        }

        console.log(`Ingredients seeded successfully! Updated ${modifiedCount} exact items out of ${allItems.length} total items.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

seed();
