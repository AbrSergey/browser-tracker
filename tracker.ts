const CONFIG_TRACK_URL = 'http://localhost:8888/track';
const CONFIG_MAX_BUF_LENGTH = 3;
const CONFIG_TIMEOUT = 1000; // in ms

interface ITracker {
  track: (event: string, ...tags: string[]) => void;
}

class Tracker implements ITracker {
  private _buffer: Array<object>;
  private _last_send_time: number;
  private _timer_is_working: boolean;

  constructor() {
    this._buffer = [];
    this._last_send_time = 0;
    this._timer_is_working = false;

    document.onvisibilitychange = () => {
      if (document.visibilityState === 'hidden' && this._buffer.length) {
        console.info(`send by close; buffer.length = ${this._buffer.length}`);
        this._send(this._buffer);
      }
    };
  }

  private async _send(arr: Array<object>) {
    const retry = () => {
      setTimeout(() => {
        this._buffer.push(...arr);
        this._onPush();
      }, CONFIG_TIMEOUT);
    };

    const response = (await fetch(CONFIG_TRACK_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arr),
      keepalive: true,
    }).catch((err) => {
      console.error(err);
      retry();
    })) as { status: number };

    if (response?.status !== 200) retry();
  }

  private _captureEvent() {
    this._send([...this._buffer]);
    this._buffer.length = 0;
    this._last_send_time = new Date().getTime();
  }

  private _onPush() {
    let now = new Date().getTime();

    if (now - this._last_send_time > CONFIG_TIMEOUT) {
      console.info(`send immediately; buffer.length = ${this._buffer.length}`);
      this._captureEvent();
    } else if (this._buffer.length >= CONFIG_MAX_BUF_LENGTH) {
      console.info(`send by length; buffer.length = ${this._buffer.length}`);
      this._captureEvent();
    } else if (!this._timer_is_working) {
      setTimeout(() => {
        console.info(`send by time; buffer.length = ${this._buffer.length}`);
        this._captureEvent();
        this._timer_is_working = false;
      }, CONFIG_TIMEOUT);
      this._timer_is_working = true;
    } else {
      console.info(`timer is working; buffer.length = ${this._buffer.length}`);
    }
  }

  track(event: string, ...tags: string[]): void {
    const url = window.location.href;
    const title = document.title;
    const ts = Math.floor(new Date().getTime() / 1000);

    this._buffer.push({
      event,
      tags,
      url,
      title,
      ts,
    });

    this._onPush();
  }
}

const tracker = new Tracker();
