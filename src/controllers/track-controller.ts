import { FastifyRequest, FastifyReply } from 'fastify';
import { myEmitter, TRACK_EVENTS } from '../services/event-emitter';
import { TrackType } from '../types/track-type';

export const trackSchema = {
  body: {
    type: 'array',
    items: {
      type: 'object',
      required: ['event', 'url', 'ts'],
      properties: {
        event: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        url: { type: 'string' },
        title: { type: 'string' },
        ts: { type: 'number' },
      },
    },
  },
};

export const trackController = (
  req: FastifyRequest<{ Body: TrackType[] }>,
  reply: FastifyReply,
) => {
  const tracks = req.body;

  /*
    Requirement: The application responds to the client without waiting for the data to be inserted into the database.

    Options:
    - make an asynchronous call to a promise and not wait for a response
        TrackModel.insertMany(tracks)
        .then(() => console.info(`Mongodb: inserted ${tracks.length} docs`))
        .catch((err) => console.error(`Mongodb: error ${err}`));

    - use EventEmitter
  */

  if (tracks.length) myEmitter.emit(TRACK_EVENTS, tracks);

  reply.code(200).send('ok');
};
