const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const gymRoutes = require('./routes/gym');
const userRoutes = require('./routes/user');
const macroRoutes = require('./routes/macro');
const bodyProgressRoutes = require('./routes/bodyProgress');
const announcementRoutes = require('./routes/announcement');
const chatRoutes = require('./routes/chat');
const aiAgentRoutes = require('./routes/aiAgent');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gym', gymRoutes);
app.use('/api/user', userRoutes);
app.use('/api/macro', macroRoutes);
app.use('/api/body-progress', bodyProgressRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai-agent', aiAgentRoutes);

app.get('/', (req, res) => {
  res.send('BeFit Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));