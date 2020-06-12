'use strict';

const users = require('./users.js');

module.exports = (req, res, next) => {

  if(!req.headers.authorization) { next('invalid login') };

  // req.headers.authorization = 'Bearer 09sf09jf09jf0stoken'
  let token = req.headers.authorization.split(' ').pop();

  users.authenticateToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(err => next(err));
}