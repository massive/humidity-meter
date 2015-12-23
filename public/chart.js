function plot(container, data) {
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
        text: 'Snow depth (m)'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} %'
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
      // Define the data points. All series have a dummy year
      // of 1970/71 in order to be compared on the same x axis. Note
      // that in JavaScript, months start at 0 for January, 1 for February etc.
      data: data
    }]
  });
}
