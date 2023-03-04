const MAX_BUF_LENGTH = 3;
const TIMEOUT = 1000;

let last_send_time = 0;
const timer_ids = [];
const buffer = [];

const send = function(arr){
  return fetch('http://localhost:8888/track', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr)
    }).catch(_err => {
      setTimeout(() => {
        buffer.push(...arr)
      }, TIMEOUT)
    })
}

const captureEvent = function(){
  send([...buffer])
  buffer.length = 0
  last_send_time = new Date().getTime();
  timer_ids.forEach(i => clearTimeout(i))
  timer_ids.length = 0;
}

buffer.push = function(item) {
  Array.prototype.push.call(this, item);
  this.onPush(item);
};

buffer.onPush = function() {
  let now = new Date().getTime();

  if (now - last_send_time > TIMEOUT){
    // console.log(`send immediately buffer.length = ${buffer.length}`)
    captureEvent()
  } else if (buffer.length >= MAX_BUF_LENGTH) {
    // console.log(`send by length buffer.length = ${buffer.length}`)
    captureEvent()
  } else {
    const timerId = setTimeout(() => {
      // console.log(`send by time length = ${buffer.length}`)
      captureEvent()
    }, TIMEOUT)

    timer_ids.push(timerId)
  }
};

window.onbeforeunload = function () {
  send([...buffer])
};

function Tracker() {
  this.track = function (event, ...tags) {
    const url = window.location.href;
    const title = document.title;
    const ts = new Date().getTime()
  
    buffer.push({
      event,
      tags,
      url,
      title,
      ts
    })
  }
}

tracker = new Tracker()