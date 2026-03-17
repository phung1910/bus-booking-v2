const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// DANG KY
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu!"});
        }
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if( existingUsers.length > 0) {
            return res.status(400).json({ message: "Email này đã được sử dụng!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role || 'customer';
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, userRole]
        );

        res.status(201).json({ message: "Đăng ký thành công!", userId: result.insertId });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message});
    }
};

// DANG NHAP
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if(users.length == 0) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = { register, login };