const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const photosController = require("./controllers/photosController");
const auth = require("./middleware/auth");
const uploadFile = require("./middleware/fileUpload");

// Define your API routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post(
    "/addPhoto",
    auth,
    uploadFile.single('image'),
    photosController.addPhoto
  );
router.get('/getUserPhotos', auth, photosController.getUserPhotos); 
router.delete('/deletePhoto/:id', auth, photosController.deleteUserPhoto);

// Export the router
module.exports = router;
