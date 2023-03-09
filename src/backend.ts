import fastify from 'fastify';
import cors from '@fastify/cors';
import { trackController, trackSchema } from './controllers/track-controller';
import { trackerController } from './controllers/tracker-controller';

const backend = fastify();

backend.register(cors, {
  maxAge: 86400,
});

backend.setErrorHandler(function (error, _request, reply) {
  reply.code(422).send(error);
});

backend.get('/tracker', trackerController);
backend.post('/track', { schema: trackSchema }, trackController);

export default backend;
