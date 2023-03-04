import mongoose from 'mongoose';
import client from './src/client';
import backend from './src/backend';

mongoose
  .connect(process.env.MONGO_DB_URL as string)
  .then(() => console.info('MongoDB connected...'))
  .catch((err) => console.error(err));

client.listen({ port: 50000 });
backend.listen({ port: 8888 });
