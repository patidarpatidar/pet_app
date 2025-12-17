const Pet = require('../models/Pet');

// Get all pets with search/filter/pagination
const getPets = async (req, res) => {
  const { page = 1, limit = 10, search = '', species = '', breed = '', maxAge = '', status = 'available' } = req.query;
  try {
    let query = {};
    if (status !== 'all') query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (species) query.species = species;
    if (breed) query.breed = breed;
    if (maxAge) query.age = { $lte: parseInt(maxAge) };

    const pets = await Pet.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Pet.countDocuments(query);
    res.json({
      pets,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single pet
const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create pet (admin only)
const createPet = async (req, res) => {
  const { name, species, breed, age, description, photo } = req.body;
  try {
    const pet = new Pet({ name, species, breed, age, description, photo });
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update pet (admin only)
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete pet (admin only)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPets, getPet, createPet, updatePet, deletePet };
