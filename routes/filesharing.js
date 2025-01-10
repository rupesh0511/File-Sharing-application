const express = require('express');

const fileSharingController = require('../controllers/filesharing')

const router = express.Router();

router.post('/api/files',fileSharingController.uploadFile);
router.get('/files/:uuid',fileSharingController.generateLink);
router.get('/files/download/:uuid',fileSharingController.downloadFile);
router.post('/api/files/send',fileSharingController.sendFileonEmail );

module.exports = router;