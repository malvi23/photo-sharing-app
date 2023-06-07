const { registerUser, loginUser } = require("./userController");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const apiResponse = require("../middleware/apiResponseMiddleware");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../models/user");
jest.mock("../middleware/apiResponseMiddleware");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    test("should return bad request if required fields are missing", async () => {
      const req = { body: { name: "" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await registerUser(req, res);

      expect(apiResponse.badRequest).toHaveBeenCalledWith(res, {
        message: "All input is required",
      });
    });

    test("should create a new user, generate token, and return success response", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const createMock = jest.fn().mockResolvedValue({
        _id: "mocked-id",
        name: req.body.name,
        email: req.body.email,
      });

      User.create.mockImplementation(createMock);
      bcrypt.hash.mockResolvedValue("hashed-password");
      jwt.sign.mockReturnValue("mocked-token");

      await registerUser(req, res);

      expect(User.create).toHaveBeenCalledWith({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: "hashed-password",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: "mocked-id", email: req.body.email },
        expect.any(String),
        { expiresIn: "2h" }
      );
      expect(apiResponse.created).toHaveBeenCalledWith(res, {
        message: "Registreed successfully !",
        data: {
          _id: "mocked-id",
          name: req.body.name,
          email: req.body.email,
          token: "mocked-token",
        },
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const error = new Error("Internal Server Error");

      //   Mocking user creation to throw an error
      User.create.mockImplementation(() => {
        throw error;
      });

      await registerUser(req, res);
      expect(apiResponse.internalServerError).toHaveBeenCalledWith(
        res,
        expect.any(Error)
      );
    });

    test("should return already exist if user with the same email already exists", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const findOneMock = jest.fn().mockResolvedValue(true);
      User.findOne.mockImplementation(findOneMock);

      await registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(apiResponse.alreadyExist).toHaveBeenCalledWith(res, {
        message: "User Already Exist. Please Login.",
      });
    });
  });

  describe("loginUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("should return bad request if required fields are missing", async () => {
        const req = { body: { email: "", password: "" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
    
        await loginUser(req, res);
    
        expect(apiResponse.badRequest).toHaveBeenCalledWith(res, {
          message: "All input is required",
        });
      });

      test("should return bad request if credentials are invalid", async () => {
        const req = { body: { email: "test@example.com", password: "invalidpassword" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
    
        // Mock User.findOne to return null, indicating no user found
        User.findOne.mockResolvedValue(null);
    
        await loginUser(req, res);
    
        expect(apiResponse.badRequest).toHaveBeenCalledWith(res, {
          message: "Invalid Credentials",
        });
      });

      test("should return success if credentials are valid", async () => {
        const req = { body: { email: "test@example.com", password: "validpassword" } };
        const res = {
          set: jest.fn(),
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        const mockUser = {
          _id: "mocked-id",
          name: "John",
          email: "test@example.com",
          password: "hashedpassword",
          token: "mocked-token",
        };
    
        // Mock User.findOne to return the mockUser object
        User.findOne.mockResolvedValue(mockUser);
    
        // Mock bcrypt.compare to return true, indicating valid password
        bcrypt.compare.mockResolvedValue(true);
    
        await loginUser(req, res);
    
        expect(res.set).toHaveBeenCalledWith("Access-Control-Allow-Origin", "http://localhost:4200");
        expect(apiResponse.success).toHaveBeenCalledWith(res, {
          message: "Loggedin successfully !",
          data: {
            _id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
            token: mockUser.token,
          },
        });
      });

      test("should handle internal server error", async () => {
        const req = { body: { email: "test@example.com", password: "validpassword" } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
    
        // Mock User.findOne to throw an error
        User.findOne.mockRejectedValue(new Error("Internal Server Error"));
    
        await loginUser(req, res);
    
        expect(apiResponse.internalServerError).toHaveBeenCalledWith(res, expect.any(Error));
      });
  });
});
