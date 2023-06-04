var Photo = require("../models/photos");
const apiResponse = require("../middleware/apiResponseMiddleware");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

// API endpoint to add new photo
exports.addPhoto = (req, res) => {
  if (!(req.body && req.file && req.headers["user-id"])) {
    return apiResponse.badRequest(res, {
      message: "Required data not found in request !",
    });
  }
  const { title, description } = req.body;
  const imageUrl = req.file.path;
  const userId = req.headers["user-id"];
  const newPhoto = new Photo({
    title,
    description,
    imageUrl,
    userId: userId,
  });
  newPhoto
    .save()
    .then((photo) => {
      return apiResponse.success(res, {
        message: "Photo added successfully !",
        photo: photo,
      });
    })
    .catch((err) => {
      return apiResponse.internalServerError(res, err);
    });
};

// API endpoint to fetch all photos of a user
exports.getUserPhotos = (req, res) => {
  if (!(req.body && req.headers["user-id"])) {
    return apiResponse.badRequest(res, {
      message: "Required data not found in request !",
    });
  }
  const userId = req.headers["user-id"];
  Photo.find({ userId: userId })
    .sort({ uploadDate: -1 })
    .then(async (photos) => {
      const photosWithFiles = await Promise.all(
        photos.map(async (photo) => {
          const photoPath = path.join(__dirname, "../", photo.imageUrl);
          const readFileAsync = promisify(fs.readFile);
          const fileData = await readFileAsync(photoPath);
          const base64Image = fileData.toString("base64");
          return {
            id: photo._id,
            title: photo.title,
            description: photo.description,
            base64Image: base64Image,
          };
        })
      );
      return apiResponse.success(res, {
        message: "Photos fetched successfully!",
        data: photosWithFiles,
      });
    })
    .catch((err) => {
      return apiResponse.internalServerError(res, err);
    });
};

//delete photo from path
deletePhoto = (photoPath) => {
  const filePath = path.join(__dirname, "../", photoPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// API endpoint for deleting a photo
exports.deleteUserPhoto = (req, res) => {
  if (!req.params) {
    return apiResponse.badRequest(res, {
      message: "Required data not found in request !",
    });
  }
  const photoId = req.params.id;
  Photo.findByIdAndDelete(photoId)
    .then(async (photo) => {
      await deletePhoto(photo.imageUrl);
      return apiResponse.success(res, {
        message: "Photo deleted successfully !",
      });
    })
    .catch((err) => {
      return apiResponse.internalServerError(res, err);
    });
};
