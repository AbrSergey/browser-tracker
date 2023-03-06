import { FastifyRequest, FastifyReply } from 'fastify';
import { myEmitter, TRACK_EVENT } from '../services/event-emitter';
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
  tracks.forEach((track) => myEmitter.emit(TRACK_EVENT, track));
  console.info(tracks);
  reply.code(200).send('ok');
};
