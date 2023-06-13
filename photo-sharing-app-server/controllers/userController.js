var User = require("../models/user");
const apiResponse = require("../middleware/apiResponseMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { environment } = require("../env");
const TOKEN_EXPIRY_HOURS = "2h";

createToken = (userId, email) => {
  return jwt.sign({ user_id: userId, email }, environment.TOKEN_KEY, {
    expiresIn: TOKEN_EXPIRY_HOURS,
  });
};

exports.registerUser = async (req, res) => {
  try {
    // User input
    const { name, email, password } = req.body;

    // Validating user input
    if (!(email && password && name)) {
      return apiResponse.badRequest(res, { message: "All input is required" });
      // res.status(400).send("All input is required");
    }

    // checking if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return apiResponse.alreadyExist(res, {
        message: "User Already Exist. Please Login.",
      });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Creating user in database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    // console.log("user:", user);
    // create and save user token
    user.token = createToken(user._id, email);
    // console.log("token:",user.token);

    // return new user
    return apiResponse.created(res, {
      message: "Registreed successfully !",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });
    // res.status(201).json(user);
  } catch (err) {
    return apiResponse.internalServerError(res, err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    // User input
    const { email, password } = req.body;

    // Validating user input
    if (!(email && password)) {
      return apiResponse.badRequest(res, { message: "All input is required" });
    }
    // Validating if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      // creating and saving user token
      user.token = createToken(user._id, email);

      res.set("Access-Control-Allow-Origin", "http://localhost:4200");
      return apiResponse.success(res, {
        message: "Loggedin successfully !",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: user.token,
        },
      });
    }
    return apiResponse.badRequest(res, { message: "Invalid Credentials" });
  } catch (err) {
    return apiResponse.internalServerError(res, err);
  }
};

exports.refreshToken = async (req, res) =>{
  let refreshedToken = createToken(req.user.user_id, req.user.email)
  return apiResponse.success(res, {
    message: "Token refreshed successfully !",
    data: {
      refreshedToken: refreshedToken
    },
  });
}