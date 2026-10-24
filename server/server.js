require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/farms', require('./routes/farms'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/soil', require('./routes/soil'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);
app.listen(process.env.PORT || 5000, () => console.log('Server running'));
