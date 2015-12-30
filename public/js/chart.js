'use strict';

function run() {
  var ref = new Firebase('https://humidor.firebaseio.com/records');
  ref.limitToLast(1000).orderByChild('timestamp').on('value', function (data) {
    var model = data.val();
    var keys = Object.keys(model);
    var humidity = keys.map(function (key) {
      var item = model[key];
      return { x: item.timestamp, y: item.humidity, unit: '%' };
    });

    var temperature = keys.map(function (key) {
      var item = model[key];
      return { x: item.timestamp, y: item.temp, unit: '°C' };
    });

    plot('#humidity', humidity, 'Humidity');
    plot('#temperature', temperature, 'Temperature', 'black');
  });
}

function plot(container, data, title, color) {
  $(container).highcharts({
    chart: {
      zoomType: 'x'
    },
    title: {
      text: 'Humidor ' + title
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: title
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.unit})<br/>',
      valueDecimals: 2
    },
    plotOptions: {
      series: {
        animation: false,
        color: color
      }
    },
    series: [{
      name: title,
      type: 'spline',
      data: data
    }]
  });
}
//# sourceMappingURL=chart.js.map
