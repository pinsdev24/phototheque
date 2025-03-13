const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash-plus');
const cors = require('cors')

const userRoute = require('./src/routes/userRoute')
const albumRoute = require('./src/routes/albumRoute')
const photoRoute = require('./src/routes/photoRoute')
const auth = require('./src/middlewares/authMiddleware')

// Load environment variables
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressLayouts);
app.use(flash())
app.use(cors({origin: "*"}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2*30*60*1000
  }
}))


// View engine setup
app.set('view engine', 'ejs');
app.set('layout', './layouts/layout');
app.set('views', './src/views');
app.set("layout extractScripts", true)

// Routes
app.use('/', userRoute);
app.use('/albums', albumRoute);
app.use('/albums', photoRoute);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.redirect('/albums')
})

app.get('/explore', auth, (req, res) => {
  res.render('albums/explore')
})

app.get('/signin', (req, res) => {
  res.render('users/login', { messages: req.flash('error'), layout: false })
})

app.get('/signup', (req, res) => {
  res.render('users/register', { messages: req.flash('error'), layout: false})
})

if (process.env.NODE_ENV != 'test'){
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/phototeque_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;