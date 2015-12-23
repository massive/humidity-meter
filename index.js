"use strict";

const MIN_HUMIDITY = 68.0;
const MAX_HUMIDITY = 75.0;

// Require libs
const SensorTag = require('sensortag');
const EventEmitter = require('events');
const Promise = require('bluebird');
const Firebase = require('firebase');
const winston = require('winston');
const PushBullet = require('pushbullet');
const RateLimiter = require('limiter').RateLimiter;
require('dotenv').load();

let tag = null;
let device = null;

// Logger
const logger = new (winston.Logger)({
   transports: [
     new (winston.transports.Console)({ timestamp: true }),
     new (winston.transports.File)({ filename: 'somefile.log' })
   ]
});

// Firebase
const ref = new Firebase('https://humidor.firebaseio.com/');
const recordsRef = ref.child('records');

// Pushbullet
const pusher = Promise.promisifyAll(new PushBullet(process.env.PUSHBULLET_API_KEY));

// Limiter
var limiter = new RateLimiter(1, 'hour');

pusher.devicesAsync()
  .then((response) => {
    return response.devices.find((device) => { return device.nickname === 'Marlo'; });
  })
  .then((found) => {
    device = found.iden;
    startDiscover();
  });

function connectToDiscovered() {
  if (tag) {
    tag.connect();
  } else {
    console.log('...nothing found...yet');
    setTimeout(connectToDiscovered, 5000);
  }
}

function onDiscover(discovered) {
  tag = new Tag(discovered);
  logger.info(`Discovered: ${discovered.uuid}`);
}

function startDiscover() {
  console.log("Starting discovery listener...");
  SensorTag.discover(onDiscover);
  setTimeout(connectToDiscovered, 5000);
}

class Tag {
  constructor(tag) {
    this.tag = tag;
    this.humidityInterval = null;
    this.disconnected = false;
  }

  connect() {
    logger.info('Connecting...');

    this.tag.connectAndSetUp(error => {
      if(error) {
        logger.error('Error connecting...');
        return;
      }

      logger.info('Connected...');
      this.humidityInterval = setInterval(this.readHumidity.bind(this), 10000);

      logger.info(`Disconnect event count (tag): ${this.tag.listeners('disconnect').length}`);
      logger.info(`Disconnect event count (tag._peripheral): ${this.tag._peripheral.listeners('disconnect').length}`);
      logger.info(`Disconnect event count (tag._peripheral,direct): ${this.tag._peripheral._events.disconnect.length}`);

    });

    this.tag.on('disconnect', () => {
      if (this.disconnected) { return; }
      this.disconnected = true;
      this.destroy();
    });
  }

  disconnect() {
    this.tag.disconnect(() => {
      logger.info('Disconnected...');
    });
  }

  destroy() {
    logger.info('Destroyed...');

    if (this.humidityInterval !== null) {
      clearInterval(this.humidityInterval);
    }

    tag = null;
    startDiscover();
  }

  readHumidity() {
    this.tag.enableHumidity(error => {
      if (error) {
        logger.error(`Humidity error: ${error}`);
      } else {
        this.tag.readHumidity((error, temp, hum) => {
          this.humidityCallback(error, temp, hum);
          this.tag.disableHumidity();
        });
      }
    });
  }

  humidityCallback(error, temp, humidity) {
    if (error) {
      logger.error(`Humidity error: ${error}`);
    } else {
      logger.info(`${temp} ${humidity}`);
      const key = (new Date()).getTime();
      const newRecord = recordsRef.child(key);
      newRecord.set({temp: temp, humidity: humidity, timestamp: key});
      if (humidity < MIN_HUMIDITY || humidity > MAX_HUMIDITY) {
        const body = `Current humidity: ${humidity}`;
        limiter.removeTokens(1, (_err, remainingRequests) => {
          pusher.note(device, 'Humidity threshold exceeded', body, (error, response) => {
            logger.warn(`Humidity threshold exceeded: ${humidity}`);
            logger.debug(response);
            if (error) {
              logger.error(error);
            }
          });
        });
      }
    }
  }
}
