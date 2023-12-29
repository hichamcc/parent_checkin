const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.get('/get-schools', schoolController.getAllSchools);
router.post('/add-schools', schoolController.createSchool);
router.delete('/delete-schools/:id', schoolController.deleteSchool);
router.get('/get-school/:id', schoolController.getSchoolById);

module.exports = router;