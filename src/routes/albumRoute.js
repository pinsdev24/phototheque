const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');

// Album routes
router.post('/', authMiddleware, albumController.createAlbum);
router.get('/', authMiddleware, albumController.getAlbums);
router.put('/:id', authMiddleware, albumController.updateAlbum);
router.delete('/:id', authMiddleware, albumController.deleteAlbum);

module.exports = router;