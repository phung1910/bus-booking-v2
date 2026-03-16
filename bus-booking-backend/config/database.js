const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bus_booking_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Đã kết nối thành công với MySQL!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    });

module.exports = pool;