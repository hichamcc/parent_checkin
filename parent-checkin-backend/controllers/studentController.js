const db = require('../config/db.config');

// Get all students
exports.getRecentStudents = (req, res) => {
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    const schoolId = req.params.id;
    const query = 'SELECT * FROM students WHERE created_at >= ? and school_id = ? order by id desc';
    db.query(query, [twoMinutesAgo , schoolId], (err, results) => {
        if (err) {
            console.error('Error fetching recent students:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};

// Create a new student
exports.createStudent = (req, res) => {
    const { name , schoolId } = req.body;
    const query = 'INSERT INTO students (name , school_id) VALUES (? , ?)';
    const queryDeleteOld = 'DELETE FROM students WHERE created_at < ?';

    // Get the current timestamp for 1 day ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    db.query(query, [name , schoolId], (err, result) => {
        if (err) {
            console.error('Error creating student:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const newStudent = { id: result.insertId, name };
            res.status(201).json(newStudent);
            // Delete students older than 1 day
            db.query(queryDeleteOld, [oneDayAgo], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error('Error deleting old students:', deleteErr);
                } else {
                    console.log('Deleted old students:', deleteResult.affectedRows);
                }
            });
        }
    });
};

// Delete a student by ID
exports.deleteStudent = (req, res) => {
    const studentId = parseInt(req.params.id);
    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [studentId], (err) => {
        if (err) {
            console.error('Error deleting student:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Student deleted successfully' });
        }
    });
};