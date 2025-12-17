const express = require('express');
const AdoptionApplication = require('../models/AdoptionApplication.js');
const Pet = require('../models/Pet.js');
const { auth, adminAuth } = require('../middleware/auth.js');
const { applyForAdoption, getAllApplications, getUserApplications, updateApplicationStatus } = require('../contoller/applicationController.js');

const router = express.Router();

router.post('/', auth, applyForAdoption);

router.get('/my', auth, getUserApplications);

router.get('/', auth, getAllApplications);

router.put('/:id', auth, adminAuth, updateApplicationStatus);

module.exports = router;
