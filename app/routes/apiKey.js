/**
 * This file contains all the routes related to generation of API_KEY.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const superSecret = config.superSecret;

/**
 * generateApiKey, generates the jwt token sends it back as the API_KEY. 
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function generateApiKey(req, res, next) {
  config.global_user_cnt++;
  config.global_user_cnt = config.global_user_cnt;
  // config.global_user_cnt = 4;
  let token = jwt.sign({
    user_id: config.global_user_cnt
  }, superSecret, { expiresIn: '1d' });
  res.status(200).json({
    API_KEY: token,
    msg: 'This is your API_KEY to upload images.'
  });
}


function regenerateApiKey() {
  res.json({message: 'Not for regenerate.'});
}

/**
 * Relate routes and functions here. Functions are like callback functions and should be defined above.
 */
router.get('/', generateApiKey);
router.get('/regenerate', regenerateApiKey);

module.exports = router;
