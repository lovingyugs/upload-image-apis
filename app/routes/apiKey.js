const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config');
const superSecret = config.superSecret;

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

router.get('/', generateApiKey);
router.get('/regenerate', regenerateApiKey);

module.exports = router;
