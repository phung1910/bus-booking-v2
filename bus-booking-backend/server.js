const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

const busRoutes = require('./routes/busRoutes');
app.use('/api/buses', busRoutes);

app.get('/', (req, res) => {
    res.send('Server hệ thống đặt vé xe buýt đang chạy!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});