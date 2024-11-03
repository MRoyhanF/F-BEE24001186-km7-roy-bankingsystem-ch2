export const uploadController = (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

  return res.status(200).json({
    status: true,
    massage: "success",
    data: {
      image_url: imageUrl,
    },
  });
};
