const AdoptionApplication = require('../models/AdoptionApplication.js');
const Pet = require('../models/Pet.js');

// Apply for adoption (user only)
const applyForAdoption = async (req, res) => {
  const { petId, message } = req.body;
  try {
    const pet = await Pet.findById(petId);
    if (!pet || pet.status !== 'available') return res.status(400).json({ message: 'Pet not available' });

    const existingApp = await AdoptionApplication.findOne({ user: req.user.id, pet: petId });
    if (existingApp) return res.status(400).json({ message: 'Application already exists' });

    const application = new AdoptionApplication({ user: req.user.id, pet: petId, message });
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's applications
const getUserApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ user: req.user.id }).populate('pet');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications (admin only)
const getAllApplications = async (req, res) => {
  try {
    const applications = await AdoptionApplication.find().populate('user pet');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve/Reject application (admin only)
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const application = await AdoptionApplication.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('pet');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status === 'approved') {
      await Pet.findByIdAndUpdate(application.pet._id, { status: 'adopted' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyForAdoption, getUserApplications, getAllApplications, updateApplicationStatus };
