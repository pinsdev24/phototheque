const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Route pour obtenir le profil de l'utilisateur (protégée)
router.get('/me', auth, userController.getProfile);

router.put('/me', auth, userController.updateProfile);

router.delete('/me', auth, userController.deleteProfile);

router.post('/logout', auth, userController.logout);

module.exports = router;
