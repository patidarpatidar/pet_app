const express = require('express');
const { getPets, getPet, createPet, updatePet, deletePet } = require('../contoller/petController.js');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPets);

router.get('/:id', getPet);
router.post('/', auth, adminAuth, createPet);
router.put('/:id', auth, adminAuth, updatePet);
router.delete('/:id', auth, adminAuth, deletePet);

module.exports = router;
