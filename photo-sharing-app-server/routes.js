const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const photosController = require("./controllers/photosController");
const auth = require("./middleware/auth");
const uploadFile = require("./middleware/fileUpload");

// Define your API routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/refreshToken", auth, userController.refreshToken);
router.post(
  "/addPhoto",
  auth,
  uploadFile.single("image"),
  photosController.addPhoto
);
router.get("/getAllUserPhotos", auth, photosController.getAllUserPhotos);
router.get("/getUserPhotos", auth, photosController.getUserPhotos);
router.post("/deletePhotos", auth, photosController.deleteUserPhotos);

// Export the router
module.exports = router;
