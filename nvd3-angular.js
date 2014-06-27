'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('nvd3-angular', [])

app.directive('nvChart', function() {
    return {
      restrict: 'E',
      scope: {
        chartObject: '='
      },
      controller: function ($scope, $element, $attrs) {
        $scope.get_chart = function(type) {
          if (type == 'line') {
            var chart = nv.models.lineChart()
              .useInteractiveGuideline(true);
          } else if (type == 'bar') {
            var chart = nv.models.multiBarChart()
                  .transitionDuration(500)
                  .groupSpacing(.5);
          } else {
            console.log("incorrect chart type");
          };
          $scope.chart = chart
          return chart;
        };
      },
      link: function (scope, element, attrs) {

        console.log(scope.chartObject)

        var id = "#" + scope.chartObject['id'];

        function render(chart) {
          chart.xAxis
            .axisLabel(scope.chartObject.xAxisLabel)
            .tickFormat(d3.format(',r'));

          chart.yAxis
            .axisLabel(scope.chartObject.yAxisLabel)
            .tickFormat(d3.format('.02f'));

          d3.select(element[0])
            .attr('id', scope.chartObject.id)
            .append('svg')
            .style("height", scope.chartObject.height)
            .style("width", scope.chartObject.width)
            .datum(scope.chartObject.data)
            .transition().duration(500)
            .call(chart);
        }

        // Watcher function
        scope.$watch('chartObject.chartType', function(newVal, oldVal) {
          d3.select(id + ' svg').remove()
          render(scope.get_chart(newVal));
        });
        scope.$watch('chartObject.data', function(newVal, oldVal) {
          d3.select(id + ' svg').remove()
          render(scope.get_chart(scope.chartObject.chartType));
        }, true);
        
      }
    };
});


app.service('chartObjectConstructor', function() {
  var chartId = 1;
  var chartAttrs = [
    'chartType',
    'data',
    'height',
    'width',
    'xAxisLabel',
    'yAxisLabel'
  ];
  var defaultObject = {
    chartType: 'bar',
    data: null,
    height: 500,
    width: 800,
    xAxisLabel: "",
    yAxisLabel: ""
  };

  function clone(obj){
      if(obj == null || typeof(obj) != 'object')
          return obj;

      var temp = obj.constructor(); // changed

      for(var key in obj)
          temp[key] = clone(obj[key]);
      return temp;
  }

  this.setDefault = function(attr, val) {
    if (chartAttrs.indexOf(attr) === -1) {
      console.log("Invalid default attribute");
    } else {
      defaultObject[attr] = val;

    };
    return this;
  };

  this.setDefaults = function(defaults) {
    for (i in defaults) {
      this.setDefault(i, defaults[i]);
    };
    return this;
  };

  this.getChart = function(data) {
    var ret = clone(defaultObject)
    ret['id'] = 'chart' + chartId;
    ret.data = clone(data)
    chartId = chartId + 1;
    return ret;
  };
});