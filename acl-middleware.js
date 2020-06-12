'use strict';

const users = require('./users.js');

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      console.log(req.user);
      if(req.user.capabilities.includes(capability)) {
        next();
      } else {
        next('access denied');
      }
    } catch (e) {
      next('invalid login');
    }
  }
}