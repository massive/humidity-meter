const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: '199.245.58.214',
  database: 'humidor_db',
  username: 'admin',
  password: 'DJNK8r44Ln9a)9dgtU#]=g=vQ',
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
