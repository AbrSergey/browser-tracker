import { EventEmitter } from 'node:events';
import { createTrack } from './db-service';

class MyEmitter extends EventEmitter {}

export const myEmitter = new MyEmitter();
export const TRACK = 'TRACK';

myEmitter.on(TRACK, createTrack);
