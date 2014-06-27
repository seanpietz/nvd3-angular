var app = angular.module('example_app', ['nvd3-angular'])

app.controller('mainCtrl', function($scope, $http, $q, $window, chartObjectConstructor) {

	var gen_data = function() {
	  var sin = [],
	      cos = [];

	  for (var i = 0; i < 100; i++) {
	    sin.push({x: i, y: Math.sin(i/10)});
	    cos.push({x: i, y: .5 * Math.cos(i/10)});
	  }

	  return [
	    {
	      values: sin,
	      key: 'Sine Wave',
	      color: '#6600CC'
	    },
	    {
	      values: cos,
	      key: 'Cosine Wave',
	      color: '#0099FF'
	    }
	  ];
	}

	$scope.changeChartType = function() {
		if ($scope.test.chartType == "line") {
			$scope.test.chartType = "bar";
		} else {
			$scope.test.chartType = "line";
		};
	};

	$scope.changeData = function(data) {
		for (i in data) {
			data[i].values = data[i].values.map(function(d) {
				return {"x": d["x"], "y": d["y"] * Number.random(0, 2) }
			})
		}
	};

	var dat = gen_data()

	$scope.test = chartObjectConstructor.getChart(dat);

	// alter chart data
	$scope.changeData(dat)
	// set new defaults
    chartObjectConstructor.setDefault('height', 200)
    	.setDefaults({'xAxisLabel': "This is a test", 'chartType': 'line'})
    	
	$scope.test2 = chartObjectConstructor.getChart(dat);
	console.log($scope.test)		
	console.log($scope.test2)
});