import './reset.css';
import './styles.css';

const findMeButton = document.querySelector(
  '#findMeButton',
) as HTMLButtonElement;
const mapsLink = document.querySelector('#mapsLink') as HTMLLinkElement;
const statusText = document.querySelector(
  '#statusText',
) as HTMLParagraphElement;

const watchMeButton = document.querySelector(
  '#watchMeButton',
) as HTMLButtonElement;
const stopWatchButton = document.querySelector(
  '#stopWatchButton',
) as HTMLButtonElement;

// starts/resets to -1 (to signify unused)
// stores the value returned from navigator.geolocation.watchPosition()
// used to stop watching with navigator.geolocation.clearWatch(watchID)
// (just like a timeoutID or intervalID)
let watchID = -1;

// receive a lat/long and timestamp
// display it in the DOM
// see https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates
const displayCoords = (coords: GeolocationCoordinates, timestamp: number) => {
  const date = new Date(timestamp);
  statusText.innerText = `Last seen ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
  Accuracy: ${coords.accuracy}
  Altitude: ${coords.altitude}
  AltitudeAccuracy: ${coords.altitudeAccuracy}
  Heading: ${coords.heading}
  Speed: ${coords.speed}`;
  mapsLink.href = `https://www.google.com/maps/@${coords.latitude},${coords.longitude},20z`;
  mapsLink.innerText = `Latitude: ${coords.latitude} °, Longitude: ${coords.longitude} °`;
};

// gets the position once
// (or sets a status message saying its unsupported/unavailable)
const findMe = () => {
  mapsLink.href = '';
  mapsLink.textContent = '';

  // https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
  const onPosition = (position: GeolocationPosition) => {
    displayCoords(position.coords, position.timestamp);
  };

  function onError() {
    statusText.innerText = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    statusText.innerText = 'Geolocation is not supported by your browser';
  } else {
    statusText.innerText = 'Locating…';
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
    navigator.geolocation.getCurrentPosition(onPosition, onError);
  }
};

// gets the position on a regular cadence / when it changes
const watchMe = () => {
  if (watchID === -1) {
    // https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
    const onPositionUpdated = (position: GeolocationPosition) => {
      console.log(position.coords);
      displayCoords(position.coords, position.timestamp);
    };

    function onError() {
      alert('Sorry, no position available.');
    }

    // see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition#options
    // for PositionOptions details
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    watchID = navigator.geolocation.watchPosition(
      onPositionUpdated,
      onError,
      options,
    );
  } else {
    console.log('Already watching!');
  }
};

// stops watching the position
const stopWatching = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/clearWatch
  navigator.geolocation.clearWatch(watchID);
  mapsLink.href = '';
  mapsLink.innerText = '';
  statusText.innerText = '';
  watchID = -1;
};

findMeButton.addEventListener('click', findMe);
watchMeButton.addEventListener('click', watchMe);
stopWatchButton.addEventListener('click', stopWatching);
