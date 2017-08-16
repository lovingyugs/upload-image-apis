/**
 *
 * This file should export all the subroutes under the entity to which
 * this folder belongs to. It must be ensured that the folder name matches
 * the entity name and the subroute to which it is related to.
 *
 * For example: this file is only going to export all the sub-routes under
 * /api/images and under /api/generatekey
 *
 */


const express = require('express');
const router = express.Router();
const imagesRoutes = require('./images');
const apiKeyRoutes = require('./apiKey');

router.use('/generatekey', apiKeyRoutes);
router.use('/images', imagesRoutes);
module.exports = router;
