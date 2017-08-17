/**
 * This file contains all routes operations related to Images.
 * Storing images in the file-system and performing CRUD on them.
 * Look at the end of file to know more.
 */

const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const util = require('util');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const superSecret = config.superSecret;

/**
 * Function to check whether the object is empty or not.
 * @param  {Onject}  obj [the req obj to check]
 * @return {Boolean}     [false if object is not empty else true]
 */
function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

/**
 * uploadImage is used to post a image in file-system uploads folder.
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function uploadImage(req, res, next) {

  //get user_id from request object.
  const user_id = req.user.user_id;

  //check for incoming formdata.
  let form = new formidable.IncomingForm();

  //Parse the form and look for files.
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
      res.status(400).json({
        message: 'Some error occured while parsing file.',
        errorDetails: err
      });
      return;
    }

    // If no file is passed in the form we return.
    if (isEmptyObject(files)) {
      res.status(400).json({
        message: 'No File to upload was found.',
        fields: fields,
        files: files
      });
      return;
    }
  });

  // On file parse end.
  form.on('end', function(fields, files) {

    if (this.openedFiles.length > 0) {
      //Check whether file of particular types(jpg|jpeg|png|gif) exits or not.
      if (this.openedFiles[0].name && this.openedFiles[0].type && (this.openedFiles[0].type).toLowerCase().match(/\/(jpg|jpeg|png|gif)$/)) {
        // Files is of required type.
        console.log('File type allowed');
      } else {
        // Files is not of required type. We return the error.
        console.log('File Type Not Allowed.');
        res.status(400).json({
          message: 'File Type Not Allowed.',
          files: files,
          fields: fields
        });
        return;
      }

      /* Temporary location of our uploaded file */
      let temp_path = this.openedFiles[0].path;
      /* The file name of the uploaded file */
      let file_name = this.openedFiles[0].name;
      /* Location where we want to copy the uploaded file */
      let new_location = `uploads/${user_id}/`;

      //Send Success of uploading the Image with Image details.
      res.status(200).json({
        message: 'File uploaded successfully.',
        details: {
          name: this.openedFiles[0].name,
          lastModifiedDate: this.openedFiles[0].lastModifiedDate,
          type: this.openedFiles[0].type,
          size: this.openedFiles[0].size,
          uploaded_from: this.openedFiles[0].path,
          uploaded_to: `/uploads/${req.user.user_id}/${this.openedFiles[0].name}`
        }
      });

      // Copy files to new directory.
      fs.copy(temp_path, new_location + file_name, function(err) {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log("success!");

        }
      });
    }
  });
}

/**
 * getAllImages will send the image details for the respective api_key user.
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function getAllImages(req, res, next) {

  //getting user_id from req object and setting the user dir path where images are stored.
  const dir = `./uploads/${req.user.user_id}`;
  let dataToSend = [];

  /*
    Reading for all the files in the particular dir.
   */
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.status(400).json({
        message: 'Error in getting Images. Either there is no Image for this key.',
        errorDetails: err
      });
      return;
    }
    for (let i = 0; i < files.length; i++) {

      // Each file object.
      let data = {
        imageDefaultName: `${files[i]}`,
        imgSrc: `${config.hostname}/uploads/${req.user.user_id}/${files[i]}`,
        message: 'Above is the url to access your image.'
      }

      //Pushing it to the array.
      dataToSend.push(data);
    }

    //sending the array of images to the respective api_user.
    res.status(200).json(dataToSend);
  });
}

/**
 * getSingleImage, sends single image details with the given name if exists. 
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function getSingleImage(req, res, next) {

  //getting user_id from req object and setting the user dir path where image is stored.
  const dir = `./uploads/${req.user.user_id}/${req.params.id}`;
  fs.readFile(dir, (err, file) => {
    if (err) {
      res.status(400).json({
        'message': 'error while getting image.',
        'errorDetails': err
      });
      return;
    }
    let data = {
      imageDefaultName: `${req.params.id}`,
      imgSrc: `${config.hostname}/uploads/${req.user.user_id}/${req.params.id}`,
      message: 'Image Exists. Above is the url to access your image.'
    }
    res.status(200).json(data);
  });
}

/**
 * deleteImage, deletes the particular image with the given name. 
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function deleteImage(req, res, next) {
  const dir = `./uploads/${req.user.user_id}/${req.params.id}`;
  fs.unlink(dir, function(err, text) {
    if (err) {
      res.status(400).json({
        message: 'Some error occured while deleting the Image.',
        errorDetails: err
      });
      return;
    } else {
      res.json({ message: `Deleted ${req.params.id} successfully.`, info: text });
    }
  })
}

/**
 * authenticator, authenticates all the routes and check whether the valid token/api_key is passed with the request or not. 
 * @param  {Object}   req  [request parameters]
 * @param  {Object}   res  [response to send]
 * @param  {Function} next [nextclick function]
 */
function authenticator(req, res, next) {

  /*
    Getting token value from either body/ from url params/ from headers.
   */
  let token;
  token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {

    //If token exists we decode it with our secret key.
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        //If token is invalid.
        res.status(400).json({ success: false, message: 'Failed to authenticate token. Invalid Token', errorDetails: err });
        return;
      } else {
        console.log('Correct Key');

        //If token is valid we set the decoded details in the req object.
        req.user = {};
        req.user.user_id = decoded.user_id;
        req.user.status = true;
        next();
      }
    })
  } else {
    //If no token is passed we send this response.
    console.log('No Token');
    res.status(400).json({ success: false, message: 'No Token Provided' });
  }
}

/**
 * Relate routes and functions here. Functions are like callback functions and should be defined above.
 */
router.use(authenticator);
router.get('/', getAllImages);
router.get('/:id', getSingleImage);
router.post('/', uploadImage);
router.patch('/', uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;
