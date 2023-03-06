const CONFIG_TRACK_URL = 'http://localhost:8888/track';
const CONFIG_MAX_BUF_LENGTH = 3;
const CONFIG_TIMEOUT = 1000; // in ms

interface ITracker {
  track: (event: string, ...tags: string[]) => void;
}

class Tracker implements ITracker {
  private _buffer: Array<object>;
  private _timer_ids: Array<NodeJS.Timeout>;
  private _last_send_time: number;
  private _send: Function;

  constructor() {
    this._buffer = [];
    this._timer_ids = [];
    this._last_send_time = 0;

    this._send = function (arr: Array<object>) {
      return fetch(CONFIG_TRACK_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arr),
      }).catch((_err) => {
        setTimeout(() => {
          this._buffer.push(...arr);
        }, CONFIG_TIMEOUT);
      });
    };

    window.onbeforeunload = () => {
      if (this._buffer.length) {
        console.info(
          `send by onbeforeunload buffer.length = ${this._buffer.length}`,
        );
        this._send(this._buffer);
      }
    };
  }

  private _captureEvent() {
    this._send([...this._buffer]);
    this._buffer.length = 0;
    this._last_send_time = new Date().getTime();
    this._timer_ids.forEach((i) => clearTimeout(i));
    this._timer_ids.length = 0;
  }

  private _onPush() {
    let now = new Date().getTime();

    if (now - this._last_send_time > CONFIG_TIMEOUT) {
      console.info(`send immediately buffer.length = ${this._buffer.length}`);
      this._captureEvent();
    } else if (this._buffer.length >= CONFIG_MAX_BUF_LENGTH) {
      console.info(`send by length buffer.length = ${this._buffer.length}`);
      this._captureEvent();
    } else {
      const timerId = setTimeout(() => {
        console.info(`send by time length = ${this._buffer.length}`);
        this._captureEvent();
      }, CONFIG_TIMEOUT);

      this._timer_ids.push(timerId);
    }
  }

  track(event: string, ...tags: string[]): void {
    const url = window.location.href;
    const title = document.title;
    const ts = new Date().getTime();

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
