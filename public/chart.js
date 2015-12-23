function plot(container, temperature, humidity) {
  $(container).highcharts({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Humidor humidity'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },

    yAxis: {
      title: {
        text: 'Values'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} {point.unit}'
    },

    plotOptions: {
      spline: {
        animation: false,
        marker: {
          enabled: true
        }
      }
    },

    series: [{
      name: 'Humidity',
      data: humidity
    }, {
      name: 'Temperature',
      data: temperature
    }]
  });
}
