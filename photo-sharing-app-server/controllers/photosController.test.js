const {
  addPhoto,
  getUserPhotos,
  deleteUserPhotos,
} = require("./photosController");
const Photo = require("../models/photos");
const apiResponse = require("../middleware/apiResponseMiddleware");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

// Mock Photo model
jest.mock("../models/photos");
jest.mock("../middleware/apiResponseMiddleware");
// jest.mock("path");
// jest.mock("fs");
// jest.mock("util");

// Mock fs.unlink
fs.unlink = jest.fn((path, callback) => callback(null));

// Convert fs.unlink to use promises
const unlinkAsync = promisify(fs.unlink);

describe("Photos Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addPhoto", () => {
    test("should return bad request if required data is missing", async () => {
      const req = { body: {}, file: null, headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await addPhoto(req, res);

      expect(apiResponse.badRequest).toHaveBeenCalledWith(res, {
        message: "Required data not found in request !",
      });
    });

    test("should add new photo and return success", async () => {
      const req = {
        body: { title: "New Photo", description: "Adding a new photo" },
        file: { path: "path/to/image.jpg" },
        headers: { "user-id": "mocked-user-id" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockPhoto = {
        _id: "mocked-photo-id",
        title: "New Photo",
        description: "Adding a new photo",
        imageUrl: "path/to/image.jpg",
        userId: "mocked-user-id",
      };

      // Mock Photo.save to return the mockPhoto object
      Photo.prototype.save.mockResolvedValue(mockPhoto);

      await addPhoto(req, res);

      expect(apiResponse.success).toHaveBeenCalledWith(res, {
        message: "Photo added successfully !",
        photo: mockPhoto,
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        body: { title: "New Photo", description: "Adding a new photo" },
        file: { path: "path/to/image.jpg" },
        headers: { "user-id": "mocked-user-id" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      // Mock Photo.save to throw an error
      Photo.prototype.save.mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      await addPhoto(req, res);

      expect(apiResponse.internalServerError).toHaveBeenCalledWith(
        res,
        expect.any(Error)
      );
    });
  });

  describe("getUserPhotos", () => {
    test("should fetch user photos successfully", async () => {
      const req = {
        headers: { "user-id": "mocked-user-id" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock Photo.find to return an array of photos
      const mockedPhotos = [
        {
          _id: "photo1",
          title: "Photo 1",
          description: "Description 1",
          imageUrl: "uploads/dummy_image.jpg",
          uploadDate: new Date("2023-05-31T23:01:57.708+00:00"),
        },
        {
          _id: "photo2",
          title: "Photo 2",
          description: "Description 2",
          imageUrl: "uploads/dummy_image.jpg",
          uploadDate: new Date("2023-05-31T23:09:14.099+00:00"),
        },
      ];

      Photo.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValueOnce(mockedPhotos),
      });

      await getUserPhotos(req, res);
      expect(Photo.find).toHaveBeenCalledWith({ userId: "mocked-user-id" });
      //    expect(apiResponse.success).toHaveBeenCalledTimes(1);
      //   expect(mockedReadFile).toHaveBeenCalledTimes(2);
    });

    test("should handle internal server error", async () => {
      const req = {
        headers: { "user-id": "mocked-user-id" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Mock Photo.find to throw an error
      Photo.find.mockImplementation(() => {
        throw new Error("Internal Server Error");
      });

      await getUserPhotos(req, res);

      expect(apiResponse.internalServerError).toHaveBeenCalledWith(
        res,
        expect.any(Error)
      );
    });
  });

  describe("deleteUserPhotos", () => {
    test("should delete user photos and return success response", async () => {
      const req = {
        body: {
          imageIds: ["photo1", "photo2"],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Photo.findByIdAndDelete = jest
        .fn()
        .mockResolvedValueOnce({ imageUrl: "path/to/photo1" })
        .mockResolvedValueOnce({ imageUrl: "path/to/photo2" });
      deleteMultiplePhoto = jest.fn().mockResolvedValueOnce();

      await deleteUserPhotos(req, res);

      expect(Photo.findByIdAndDelete).toHaveBeenCalledTimes(2);
      expect(Photo.findByIdAndDelete).toHaveBeenCalledWith("photo1");
      expect(Photo.findByIdAndDelete).toHaveBeenCalledWith("photo2");
      expect(deleteMultiplePhoto).toHaveBeenCalledTimes(1);
      expect(deleteMultiplePhoto).toHaveBeenCalledWith([
        "path/to/photo1",
        "path/to/photo2",
      ]);
      expect(apiResponse.success).toHaveBeenCalledWith(res, {
        message: "Photo(s) deleted successfully !",
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        body: {
          imageIds: ["photo1", "photo2"],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Photo.findByIdAndDelete = jest
        .fn()
        .mockRejectedValueOnce("Error deleting photo");
      deleteMultiplePhoto = jest.fn().mockResolvedValueOnce();

      console.error = jest.fn();

      await deleteUserPhotos(req, res);

      expect(Photo.findByIdAndDelete).toHaveBeenCalledTimes(2);
      expect(Photo.findByIdAndDelete).toHaveBeenCalledWith("photo1");
      expect(deleteMultiplePhoto).toHaveBeenCalledTimes(0);
      expect(apiResponse.internalServerError).toHaveBeenCalledWith(
        res,
        "Error deleting photo"
      );
      expect(apiResponse.internalServerError).toHaveBeenCalledWith(
        res,
        expect.any(Error)
      );
    });
  });
});
