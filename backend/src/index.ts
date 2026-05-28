import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initSocket } from './socket/socket';
import { initWorker } from './workers/worker';
import assignmentRoutes from './routes/assignment.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/assignments', assignmentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB();
  initSocket(httpServer);
  initWorker();

  httpServer.listen(PORT, () => {
    console.log(`VedaAI Server listening on port ${PORT}`);
  });
};

bootstrap().catch(err => {
  console.error('Server bootstrapping failed:', err);
  process.exit(1);
});
