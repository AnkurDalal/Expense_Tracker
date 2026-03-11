const express = require('express')
const { protect } = require('../middleware/authMiddleware.js')
const { validateRegistration, validateLogin, validateDateRange, handleValidationErrors } = require('../middleware/validationMiddleware.js')
const upload = require('../middleware/uploadMiddleware.js')
const { 
    registerUser, 
    loginUser, 
    getUserInfo,
    updateUserProfile,
    changePassword
} = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, handleValidationErrors, registerUser)
router.post('/login', validateLogin, handleValidationErrors, loginUser)

// Protected routes
router.get('/getUser', protect, getUserInfo)
router.put('/update-profile', protect, updateUserProfile)
router.post('/change-password', protect, changePassword)

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false,
            message: "No file uploaded" 
        });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({ 
        success: true,
        message: "Image uploaded successfully",
        data: { imageUrl } 
    });
});

module.exports = router;
