import dotenv from 'dotenv';
import ruuvi from 'node-ruuvitag';
import DB from './db';

dotenv.config();

console.log("Loading database");

const influx = DB.instance();

console.log("Starting...");

ruuvi.on('found', tag => {
  console.log('Found RuuviTag, id: ' + tag.id);
  tag.on('updated', data => {
    console.log('Got data from RuuviTag ' + tag.id + ':\n' +
      JSON.stringify(data, null, '\t'));
      influx.writePoints([
        {
          measurement: 'RuuviTag',
          tags: { id: tag.id },
          fields: data,
        }
      ]);
  });
});
