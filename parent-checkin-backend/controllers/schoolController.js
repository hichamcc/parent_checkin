// schoolController.js
const db = require('../config/db.config');

const getAllSchools = (req, res) => {
    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};

// Get school by ID
const getSchoolById = (req, res) => {
    const schoolId = req.params.id;

    db.query('SELECT * FROM schools WHERE id = ?', [schoolId], (err, results) => {
        if (err) {
            console.error('Error fetching school by ID:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'School not found' });
            }
        }
    });
};

const createSchool = (req, res) => {
    const { name, logo } = req.body;
    db.query('INSERT INTO schools (name, logo) VALUES (?, ?)', [name, logo], (err, result) => {
        if (err) {
            console.error('Error creating school:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ id: result.insertId });
        }
    });
};

const deleteSchool = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM schools WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting school:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ success: true });
        }
    });
};


module.exports = { getAllSchools, createSchool , deleteSchool , getSchoolById};
