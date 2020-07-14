export function getTempo(url, onSuccess) {
  fetchBuffer(url, onSuccess);
  function fetchBuffer(url, resolve) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () { resolve(request) }
    request.send();
  }
}