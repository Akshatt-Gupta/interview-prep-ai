// controllers/imageController.js
const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    res.json({ 
      imageUrl: `/uploads/${req.file.filename}` 
    });
  });