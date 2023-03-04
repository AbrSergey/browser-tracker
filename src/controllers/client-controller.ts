import fs from 'fs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { resolve } from 'path';

const indexHtmlPath = resolve(__dirname, '../../static/index.html');
const bufferIndexHtml = fs.readFileSync(indexHtmlPath);

export const clientController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  reply
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(bufferIndexHtml);
};
