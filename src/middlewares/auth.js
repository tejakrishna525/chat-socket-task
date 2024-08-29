// Middleware to check if the user is logged in

const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
  if (req.cookies.token) {
    console.log("res token",req.cookies.token)
      jwt.verify(req.cookies.token, 'secretkey', (err, decoded) => {
          if (err) {
              return res.status(401).json({ message: 'Invalid token' });
          }

          req.userId = decoded.userId; // Save decoded token to request object

          next(); // Proceed to the next middleware or route handler
      });
  } else {
      res.redirect('/login'); // Redirect to login page if not logged in
  }
};

// Middleware to handle logout
exports.logout = (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/login'); // Redirect to login page
};