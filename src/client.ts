import fastify from 'fastify';
import { clientController } from './controllers/client-controller';

const client = fastify();

client.get('/1.html', clientController);
client.get('/2.html', clientController);
client.get('/3.html', clientController);

export default client;
