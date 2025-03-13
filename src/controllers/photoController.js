const Album = require('../models/Album');

// Ajouter une photo à un album
exports.addPhoto = async (req, res) => {
  const { albumId } = req.params;

  try {
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Ajouter les chemins des images téléchargées à l'album
    const photos = req.files.map(file => ({ url: file.path }));
    album.images.push(...photos);
    await album.save();

    req.flash('message', 'Photos ajoutées avec succès');

    res.redirect(`/albums/${albumId}/photos`)

    //res.status(201).json({ message: 'Photo added successfully', photo });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Récupérer toutes les photos
exports.getAllPhotos = async (req, res) => {
  try {
    const albums = await Album.find().populate('user', 'name');
    const photos = albums.reduce((allPhotos, album) => {
      return allPhotos.concat(album.images.map(photo => ({
        ...photo._doc,
        albumId: album._id,
        albumTitle: album.title
      })));
    }, []);
    res.status(200).json({ photos });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Récupérer toutes les photos d'un album
exports.getPhotos = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId);
    
    if (!album) return res.status(404).json({ message: 'Album not found' });
    
    res.render('albums/photos', {album: album, message : req.flash('message')})

    //res.status(200).json({photos: album.images});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Supprimer une photo d'un album
exports.deletePhoto = async (req, res) => {
  const { albumId, photoId } = req.params;

  try {
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const photo = album.images.id(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    album.images.pull(photoId)
    await album.save();

    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
