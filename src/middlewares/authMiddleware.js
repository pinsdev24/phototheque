const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).redirect('/signin')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).redirect('/signin')
  }
};
