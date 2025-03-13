const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMidlleware');

// Photo routes
router.post('/:albumId/photos', authMiddleware, upload.array('photo', 10), photoController.addPhoto);
router.get('/:albumId/photos', authMiddleware, photoController.getPhotos);
router.delete('/:albumId/:photoId', authMiddleware, photoController.deletePhoto);
router.get('/photos', authMiddleware, photoController.getAllPhotos);

module.exports = router;
