import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://FoodMasters:324445@cluster0.zyftnoz.mongodb.net/food-del').then(() => console.log("DB Connected"));
}