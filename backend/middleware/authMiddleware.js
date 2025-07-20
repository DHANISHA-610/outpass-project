const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });

  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
  if (!token) return res.status(401).json({ msg: 'Token missing in authorization header' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //debug logs
    console.log("Token:", token);
    console.log("Decoded:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid', error: err.message });
  }
};
