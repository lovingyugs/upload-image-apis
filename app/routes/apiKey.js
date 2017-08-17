/**
 * This file contains all the routes related to generation of API_KEY.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const superSecret = config.superSecret;

/**
 * validUniqueNumber, checks whether the number is a valid indian mobile number or not.
 * @param  {String} numberToValidate [mobile number passed]
 * @return {Boolean}                 [true if number is valid]
 */
function validUniqueNumber(numberToValidate) {
  numberToValidate = numberToValidate.toString();
  console.log(numberToValidate.match(/\^[789]\d{9}$/));
  if (numberToValidate.match(/^[789]\d{9}$/))
    return true;
  else
    return false;
};

/**
 * generateApiKey, generates the jwt token sends it back as the API_KEY. 
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function generateApiKey(req, res, next) {
  console.log(req.query.unique_number);
  if (validUniqueNumber(req.query.unique_number)) {

    let token = jwt.sign({
      user_id: req.query.unique_number
    }, superSecret, { expiresIn: '1d' });
    res.status(200).json({
      API_KEY: token,
      msg: 'This is your API_KEY to upload images.'
    });
  } else {
    res.status(400).json({
      message: 'Unique Number is not valid.',
      unique_number: req.query.unique_number
    });
  }
}

function regenerateApiKey() {
  res.json({ message: 'Not for regenerate.' });
}

/**
 * Relate routes and functions here. Functions are like callback functions and should be defined above.
 */
router.get('/', generateApiKey);
router.get('/regenerate', regenerateApiKey);

module.exports = router;