const CONFIG_TRACK_URL = 'http://localhost:8888/track';
const CONFIG_MAX_BUF_LENGTH = 3;
const CONFIG_TIMEOUT = 1000; // in ms

interface ITracker {
  track: (event: string, ...tags: string[]) => void;
}

class Tracker implements ITracker {
  private buffer: Array<object>;
  private timer_ids: Array<NodeJS.Timeout>;
  private last_send_time: number;
  private send: Function;

  constructor() {
    this.buffer = [];
    this.timer_ids = [];
    this.last_send_time = 0;

    this.send = function (arr: Array<object>) {
      return fetch(CONFIG_TRACK_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arr),
      }).catch((_err) => {
        setTimeout(() => {
          this.buffer.push(...arr);
        }, CONFIG_TIMEOUT);
      });
    };

    window.onbeforeunload = () => {
      if (this.buffer.length) {
        console.info(
          `send by onbeforeunload buffer.length = ${this.buffer.length}`,
        );
        this.send(this.buffer);
      }
    };
  }

  private captureEvent() {
    this.send([...this.buffer]);
    this.buffer.length = 0;
    this.last_send_time = new Date().getTime();
    this.timer_ids.forEach((i) => clearTimeout(i));
    this.timer_ids.length = 0;
  }

  private onPush() {
    let now = new Date().getTime();

    if (now - this.last_send_time > CONFIG_TIMEOUT) {
      console.info(`send immediately buffer.length = ${this.buffer.length}`);
      this.captureEvent();
    } else if (this.buffer.length >= CONFIG_MAX_BUF_LENGTH) {
      console.info(`send by length buffer.length = ${this.buffer.length}`);
      this.captureEvent();
    } else {
      const timerId = setTimeout(() => {
        console.info(`send by time length = ${this.buffer.length}`);
        this.captureEvent();
      }, CONFIG_TIMEOUT);

      this.timer_ids.push(timerId);
    }
  }

  track(event: string, ...tags: string[]): void {
    const url = window.location.href;
    const title = document.title;
    const ts = new Date().getTime();

    this.buffer.push({
      event,
      tags,
      url,
      title,
      ts,
    });

    this.onPush();
  }
}

const tracker = new Tracker();
