const Influx = require('influx');

function instance() {
  const influx = new Influx.InfluxDB({
    host: process.env.DB_HOST,
    database: 'humidor_db',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
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
    console.error(`Error creating Influx database! ${err}`);
  });

  return influx;
};

export default {
  instance
};
