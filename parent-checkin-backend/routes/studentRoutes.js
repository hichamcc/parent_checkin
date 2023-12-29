const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/get-students/:id', studentController.getRecentStudents);
router.post('/add-student', studentController.createStudent);
router.delete('/delete-students/:id', studentController.deleteStudent);

module.exports = router;