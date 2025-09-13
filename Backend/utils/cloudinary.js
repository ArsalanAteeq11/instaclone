import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

cloudinary.config({
  cloud_name: "deneppcsp",
  api_key: "818336642587833",
  api_secret: "Abea8hHDuETlcELaL2rH6YLlABs",
});
export default cloudinary;
