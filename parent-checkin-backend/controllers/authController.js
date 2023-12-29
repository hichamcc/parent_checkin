// authController.js
const bcrypt = require('bcrypt');
const db = require('../config/db.config');

const authController = {

    register: async (req, res) => {
        // Implement registration logic here
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        // Retrieve user from the database
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], async (err, results) => {
            if (err) {
                console.error('Login error:', err);
                res.status(500).send('Login failed');
            } else if (results.length > 0) {
                const match = await bcrypt.compare(password, results[0].password);
                if (match) {
                    console.log('Login successful');
                    res.status(200).send('Login successful');
                } else {
                    console.log('Invalid password');
                    res.status(401).send('Invalid password');
                }
            } else {
                console.log('User not found');
                res.status(404).send('User not found');
            }
        });
    },
};

module.exports = authController;