const mongoose = require('mongoose');

module.exports.connectDB = async() =>{
    try{
        await mongoose.connect(process.env.mongo_url);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}