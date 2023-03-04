import fs from 'fs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { resolve } from 'path';

const trackerJSPath = resolve(__dirname, '../../static/tracker.js');
const bufferTrackerJS = fs.readFileSync(trackerJSPath);

export const trackerController = (
  _req: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.header('Content-Type', 'application/javascript').send(bufferTrackerJS);
};
