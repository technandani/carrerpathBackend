const jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const secret = "Nandani@123";

// async function loginWithGoogle(req, res) {
//   console.log("User hit the Google login button"); // This should print in the server logs

//   try {
//     const { rowtoken } = req.body;
//     console.log("Received token:", rowtoken);

//     if (!rowtoken) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Token is missing" });
//     }

//     // Decode and verify the token
//     try {
//       const res = await axios.get(
//         "https://www.googleapis.com/oauth2/v3/userinfo",
//         {
//           headers: {
//             Authorization: `Bearer ${rowtoken}`,
//           },
//         }
//       );
//       // console.log("user data:", res.data);
//       userFromGoogle = res.data;
//     } catch (error) {
//       console.log("error: ", error);
//     }

//     if (!userFromGoogle) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired token" });
//     }

//     const { email, name, picture } = userFromGoogle;
//     let profilePicUrl = picture || "images/user.png";

//     // console.log("name: ", name);
//     // console.log("email: ", email);
//     // console.log("profilePic: ", profilePicUrl);

//     //cheak user exiest or not
//     const findUser = await User.findOne({ email });
    
//     if (!findUser) {
//       // If user doesn't exist, create a new user
//       const hashedPassword = await bcrypt.hash(name, 10);
//       const newUser = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         profilePic: profilePicUrl,
//       });
//     }
    
//     const user = await User.findOne({ email });

//       const token = jwt.sign(
//         { email: user.email, _id: user._id },
//         secret,
//         {
//           expiresIn: "120h",
//         }
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Login successful.",
//         token,
//         data: {
//           email: user.email,
//           name: user.name,
//           profilePic: user.profilePic,
//         },
//       });
      
//   } catch (error) {
//     console.error("Error during Google login:", error);
//     return res
//       .status(500)
//       .json({
//         success: false,
//         message: "Error during login",
//         error: error.message,
//       });
//   }
// }

async function Register(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log("Request Body:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters long.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use. Please use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully.",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Error during registration.",
      error: error.message,
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Request Body:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, secret, {
      expiresIn: "120h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { Register, Login };
