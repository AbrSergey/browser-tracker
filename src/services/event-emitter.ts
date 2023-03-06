import { EventEmitter } from 'node:events';
import { createTrack } from './db-service';

class MyEmitter extends EventEmitter {}

export const myEmitter = new MyEmitter();
export const TRACK_EVENTS = 'TRACK_EVENTS';

myEmitter.on(TRACK_EVENTS, createTrack);
