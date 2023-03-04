import mongoose from 'mongoose';
import { TrackType } from '../types/track-type';

const trackSchema = new mongoose.Schema({
  event: String,
  tags: {
    type: Array,
    of: String,
  },
  url: String,
  title: String,
  ts: Number,
});

const TrackModel = mongoose.model('Event', trackSchema);

export async function createTrack(track: TrackType) {
  try {
    await new TrackModel(track).save();
  } catch (err) {
    console.error(err);
  }
}
