import multer from "multer";
import path from "path";

const filename = (req, file, callback) => {
  const fileName = Date.now() + path.extname(file.originalname);
  callback(null, fileName);
};

const generateStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },
    filename,
  });
};

export const upload = multer({
  storage: generateStorage("public/images"),
  fileFilter: (req, file, callback) => {
    const allowedMimeType = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedMimeType.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only .png, .jpg, and .jpeg format allowed!"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});
