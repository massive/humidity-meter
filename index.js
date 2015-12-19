var Firebase = require('firebase');
var SensorTag = require('sensortag');

var winston = require('winston');
var logger = new (winston.Logger)({
   transports: [
     new (winston.transports.Console)({ timestamp: true }),
     new (winston.transports.File)({ filename: 'somefile.log' })
   ]
});

logger.info('Start');

const ref = new Firebase('https://humidor.firebaseio.com/');
const recordsRef = ref.child('records');
const newRecord = recordsRef.push();

logger.info('Starting to discover...');

  SensorTag.discover(function(sensorTag) {
  logger.info('Discovered: %s', sensorTag.toString());

  sensorTag.on('disconnect', function() {
    logger.info('Disconnected!');
    process.exit(0);
  });

  var onConnect = function(error) {
    logger.info('Connected');
    sensorTag.enableHumidity(() => {
      sensorTag.on('humidityChange', (temperature, humidity) => {
        logger.info('Temperature %s, humidity %s', temperature, humidity);
        newRecord.push({temperature, humidity, timestamp: new Date()});
        sensorTag.unnotifyHumidity();
      });
      sensorTag.notifyHumidity();
      setInterval(() => {
        sensorTag.notifyHumidity();
      }, 10000);
    });
  };

  sensorTag.connectAndSetUp(onConnect);
});
