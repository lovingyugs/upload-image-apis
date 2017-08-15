const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const util = require('util');
const fs = require('fs-extra');
const jwt = require('jsonwebtoken');
let config = require('../../config');
const superSecret = config.superSecret;

function uploadImage(req, res, next) {
  const user_id = req.user.user_id;
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // res.writeHead(200, { 'content-type': 'text/plain' });
    // res.write('received upload:\n\n');
    // res.end(util.inspect({ fields: fields, files: files }));
    res.status(200).json({
      message: 'File uploaded successfully.',
      fields: fields,
      files: files
    })
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = `uploads/${user_id}/`;

    fs.copy(temp_path, new_location + file_name, function(err) {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("success!")
      }
    });
  });
}

function getAllImages(req, res, next) {
  const dir = `./uploads/${req.user.user_id}`;
  let dataToSend = [];
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.status(200).json({
        message: 'Error in getting Images. Either there is no Image for this key.',
        errorDetails: err
      });
      return;
    }
    for (let i = 0; i < files.length; i++) {
      let data = {
        imageDefaultName: `${files[i]}`,
        imgSrc: `${config.hostname}/uploads/${req.user.user_id}/${files[i]}`,
        message: 'Above is the url to access your image.'
      }
      dataToSend.push(data);
    }
    res.status(200).json(dataToSend);
  });
}

function getSingleImage(req, res, next) {
  const dir = `./uploads/${req.user.user_id}/${req.params.id}`;
  //  var form = new formidable.IncomingForm(dir);
  // form.on('fileBegin', function(name, value) {
  //   console.log(name);
  // });

  fs.readFile(dir, (err, file) => {
    if (err) {
      res.status(200).json({
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

function deleteImage(req, res, next) {
  const dir = `./uploads/${req.user.user_id}/${req.params.id}`;
  fs.unlink(dir, function(err, text) {
    if (err) {
      res.json({
        message: 'Some error occured while deleting the Image.',
        errorDetails: err
      });
      return;
    } else {
      res.json({ message: `Deleted ${req.params.id} successfully.`, info: text });
    }
  })
}

function authenticator(req, res, next) {
  let token;
  token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        res.status(200).json({ success: false, message: 'Failed to authenticate token.', errorDetails: err });
        return;
      } else {
        console.log('Correct Key');
        //console.log(decoded);
        req.user = {};
        req.user.user_id = decoded.user_id;
        req.user.status = true;
        next();
      }
    })
  } else {
    console.log('No Token');
    res.status(200).json({ success: false, message: 'No Token Provided' });
  }
}

router.use(authenticator);
router.get('/', getAllImages);
router.get('/:id', getSingleImage);
router.post('/', uploadImage);
router.patch('/', uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;