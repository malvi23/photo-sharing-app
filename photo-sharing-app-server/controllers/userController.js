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
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      return apiResponse.BadRequest(res, { message: "All input is required" });
      // res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return apiResponse.alreadyExist(res, {
        message: "User Already Exist. Please Login.",
      });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // create and save user token
    user.token = createToken(user._id, email);
    // user.token = token;

    // return new user
    return apiResponse.created(res, {
      message: "Registreed successfully !",
      data: user,
    });
    // res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return apiResponse.internalServerError(res, err);
  }
};

exports.loginUser = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return apiResponse.badRequest(res, { message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create and save user token
      user.token = createToken(user._id, email);
      // user.token = token;

      // user
      // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
      res.set("Access-Control-Allow-Origin", "http://localhost:4200");
      return apiResponse.success(res, {
        message: "Loggedin successfully !",
        data: user,
      });
    }
    return apiResponse.badRequest(res, { message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    return apiResponse.internalServerError(res, err);
  }
};
