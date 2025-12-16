const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profileController');

router.post('/getprofile', getProfile);

module.exports = router;