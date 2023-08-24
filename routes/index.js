// requiring express and its router
const express = require('express');
const router = express.Router();

// we're using multer to use multipart form-data which helps in uploading files
const multer  = require('multer');

const upload = multer({ dest: 'files_to_upload/' });

const homeController = require('../controllers/home_Controller');

//setting our routes
router.get('/', homeController.home)
router.get('/csv/:id',homeController.view_File)
router.post('/upload',upload.single('csv_file'),homeController.upload_File)


module.exports = router;