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

const TrackModel = mongoose.model('tracks', trackSchema);

export async function createTrack(tracks: TrackType[]) {
  try {
    await TrackModel.insertMany(tracks)
      .then(() => console.info(`Mongodb: inserted ${tracks.length} docs`))
      .catch((err) => console.error(`Mongodb: error ${err}`));
  } catch (err) {
    console.error(err);
  }
}
