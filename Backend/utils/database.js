import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect("mongodb+srv://hafizmuhammadarsalan16:ukdRmvPcj3UDZt1q@cluster0.99w3up4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
};
export default connectdb;
