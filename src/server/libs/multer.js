import multer from "multer";

const storage = multer.memoryStorage();

export const upload = () => {
  return multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
      const allowedMimeType = ["image/png", "image/jpg", "image/jpeg"];
      if (allowedMimeType.includes(file.mimetype)) {
        callback(null, true);
      } else {
        const err = new Error(`Only ${allowedMimeType.join(", ")} allowed to upload`);
        callback(err, false);
      }
    },
  });
};
