require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const startSlaScheduler = require('./utils/slaScheduler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

const PORT = process.env.PORT || 4000;
// simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

let server;
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/caseflow')
  .then(() => {
    server = app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
    const io = require('socket.io')(server, { cors: { origin: '*' } });
    io.on('connection', socket => console.log('io connected', socket.id));
    startSlaScheduler(io);
  }).catch(err => { console.error('Failed to start backend:', err); process.exit(1); });

// Graceful shutdown
async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`);
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      console.log('HTTP server closed');
    }

    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('Mongo connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
