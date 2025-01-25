const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/db");
const cloudinaryConnection = require("./config/cloudinary");
const UserRouter = require("./router/user");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

cloudinaryConnection();
connectToDatabase();

app.use("/user", UserRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});