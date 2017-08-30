const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: '209.177.88.132',
  database: 'humidor_db',
  schema: [
    {
      measurement: 'RuuviTag',
      fields: {
        dataFormat: Influx.FieldType.INTEGER,
        rssi: Influx.FieldType.INTEGER,
        humidity: Influx.FieldType.FLOAT,
        temperature: Influx.FieldType.FLOAT,
        pressure: Influx.FieldType.INTEGER,
        accelerationX: Influx.FieldType.INTEGER,
        accelerationY: Influx.FieldType.INTEGER,
        accelerationZ: Influx.FieldType.INTEGER,
        battery: Influx.FieldType.INTEGER
      },
      tags: [
        'id'
      ]
    }
  ]
});

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('humidor_db')) {
      return influx.createDatabase('humidor_db');
    }
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  });


export default influx;
