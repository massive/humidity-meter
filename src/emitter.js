import ruuvi from 'node-ruuvitag';
import influx from './db';

console.log("Starting");

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
