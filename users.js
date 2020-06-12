'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SECRET = 'appsecret'; // this is used as part of jwt for extra auth layers

// here is where you need to focus your lab assignment requirements -> you need mongoose/mongo
let db = {}; // you need mongo here -> this is your DB for your app
let users = {}; // you need to create a users model/schema
let roles = {
  user: ['read'],
  editor: ['read', 'create', 'update'],
  admin: ['read', 'create', 'update', 'delete']
}

// these will come in handy
// mongoose pre hook -> for hashing a pw before saving it (ex: user.pre('save', doStuff))

users.save = async function(record) {
  console.log('user', record);
  if (!db[record.username]) {
    record.password = await bcrypt.hash(record.password, 5);
    db[record.username] = record;

    return record;
  }

  return Promise.reject();
}

// username:pw -> req.headers.authorization
// decode username:pw
// check that the decoded pw is the same as the hashed one in the db
// if so, give me back the user
users.authenticateBasic = async function(user, pw) {
  let valid = await bcrypt.compare(pw, db[user].password);
  return valid ? db[user] : Promise.reject();
}

users.authenticateToken = async function(token) {
  try {
    let tokenObject = jwt.verify(token, SECRET);

    if (db[tokenObject.username]) {
      return Promise.resolve(tokenObject);
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}

// if the user has proper login creds
// generate a token that will be used in the future for accessing routes in our app
users.generateToken = function(user) {
  let userData = {
    username: user.username,
    capabilities: roles[user.role]
  }

  let token = jwt.sign(userData, SECRET);
  return token;
}

// give me back a list of users
users.list = () => db;

module.exports = users;