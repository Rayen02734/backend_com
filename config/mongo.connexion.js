const mongo= require('mongoose');

export const connectDB = async() =>{
    try{
        await mongo.connect(process.env.mongo_url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}