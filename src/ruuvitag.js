import ruuvi from 'node-ruuvitag';
import InfluxDB from './db';
import logger from './logger';

class RuuviTag {
  static start() {
    const influx = InfluxDB.connect();

    logger.info("Searching for to RuuviTag...");
    ruuvi.on('found', tag => {
      logger.info('Found RuuviTag, id: ' + tag.id);
      tag.on('updated', data => {
        logger.debug('Got data from RuuviTag ' + tag.id + ':\n' + JSON.stringify(data, null, '\t'));
          influx.writePoints([{
              measurement: 'RuuviTag',
              tags: { id: tag.id },
              fields: data,
            }])
            .catch(e => logger.error(`influx writing error: ${e.message}`)
          );
      });
    });
  }
}

export default RuuviTag;
