const User = require('../models/User');
const Album = require('../models/Album');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('error', 'Utilisateur déjà existant')
      return res.redirect('/signup')
      //return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    req.session.token = token;

    return res.redirect('/')

    //res.status(201).json({ user, token });
  } catch (err) {
    req.flash('error', err.message)
    return res.redirect('/signup')
    //res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Informations de connexion invalides')
      return res.redirect('/signin')
      //return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Informations de connexion invalides')
      return res.redirect('/signin')
      //return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    req.session.token = token;

    return res.redirect('/')

    //res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // req.user.id est défini par le middleware d'authentification
    const { userId } = req.user;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comptage des albums de l'utilisateur
    const albums = await Album.find({ user: userId });
    const albumCount = albums.length;

    // Comptage des photos dans les albums de l'utilisateur
    const photoCount = albums.reduce((total, album) => total + album.images.length, 0);

    res.status(200);
    res.render('users/profile', { user, albumCount, photoCount });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const {userId} = req.user

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({user: user, message: 'Profile updated'});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

  // Suppression du profil utilisateur authentifié
exports.deleteProfile = async (req, res) => {
  try {
    const {userId} = req.user

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    // Pour effacer le token côté client, on peut simplement supprimer le cookie (si c'est là où il est stocké)
    req.session.destroy()
    res.redirect('/signin')
    //res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
