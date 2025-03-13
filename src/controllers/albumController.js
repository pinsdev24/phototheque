const Album = require('../models/Album');

exports.createAlbum = async (req, res) => {
  const { title, description } = req.body;
  const {userId} = req.user;

  try {
    const album = new Album({ title, description, user: userId });
    await album.save();
    
    res.render('albums/photos', {album: album, message: "Album crée avec succès"})

    //res.status(201).json({ message: 'Album created successfully', album });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAlbums = async (req, res) => {
  const {userId} = req.user;

  try {
    const albums = await Album.find({ user: userId });
    res.render('home/index', {albums: albums, message: req.flash('message')})
    //res.status(200).json({ albums });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAlbum = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const album = await Album.findByIdAndUpdate(
      id,
      { title, description, updatedAt: Date.now() },
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({ message: 'Album updated successfully', album });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  const { id } = req.params;

  try {
    const album = await Album.findByIdAndDelete(id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
