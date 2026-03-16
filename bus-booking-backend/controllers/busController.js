const pool = require('../config/database');

const createBus = async (req, res) => {
    try {
        console.log(">>> KIỂM TRA POOL LÀ GÌ:", pool);

        const { bus_number, capacity, bus_type } = req.body;

        if (!bus_number || !capacity) {
            return res.status(400).json({ message: "Vui lòng nhập biển số xe và sức chứa!" });
        }

        const [result] = await pool.query(
            'INSERT INTO Buses (bus_number, capacity, bus_type) VALUES (?, ?, ?)',
            [bus_number, capacity, bus_type || 'Thường']
        );

        res.status(201).json({
            message: "Thêm xe buýt thành công!",
            busId: result.insertId
        });

    } catch (error) {
        console.error("Lỗi khi thêm xe:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const getBuses = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Buses');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách xe", error: error.message });
    }
};

module.exports = { createBus, getBuses };