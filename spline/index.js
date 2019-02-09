var app = angular.module('myapp', []);

app.controller('myController', function ($scope) {
    $scope.series = [{ data: [1, 5, 2, 6, 3] }];
    $scope.range = x => new Array(x);
    $scope.colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF'];
    $scope.opacity = 0.2;
    $scope.change = function () {
        function parseLine(line) {
            try {
                var x = line.split('\t');
                var y = x[1].substring(1, x[1].length - 1).split(', ').map(i => parseInt(i));
                return [x[0], y];
            } catch (err) {
                console.log(err);
                return undefined;
            }
        }
        function colorPicker(i) {
            var color = $scope.colors[i];
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)){
                var c = color.substring(1).split('');
                if(c.length == 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + $scope.opacity + ')';
            } else {
                throw new Error('Bad Hex Color');
            }
        }
        var numTypeHeight = $scope.inputTypeHeight;
        var finishedCounter = 0;
        var text = $scope.dataText;
        var arr = text.split('\n');
        var data = arr.map(a => parseLine(a)).filter(a => !!a);
        data.sort(function (a, b) {
            return a[0] - b[0];
        });
        var minHeight = 100, maxHeight = -1;
        data.forEach(d => {
            d[1].forEach(x => {
                minHeight = Math.min(minHeight, x);
                maxHeight = Math.max(maxHeight, x);
            });
        });
        console.log(data)
        // var colorPicker = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(0, 0, 255, 0.2)'];
        var series = data.map((d, index) => {
            var t = Math.floor(index / data.length * numTypeHeight);
            var th = t * ((maxHeight - minHeight) / (numTypeHeight - 1)) + minHeight;
            d[1].push(th);
            return {
                data: d[1],
                color: colorPicker(t),
                lineWidth: 1,
            };
        });
        $scope.series = series;
    }
});

app.directive('hcChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            series: '=',
        },
        link: function (scope, element) {
            var options = {
                exporting: {
                    chartOptions: { // specific options for the exported image
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        }
                    },
                    fallbackToExportServer: false
                },
                chart: {
                    type: 'spline',
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                },
                title: {
                    text: '呵呵哒曲线',
                    style: {
                        color: 'rgba(255, 255, 255, 1.0)',
                    }
                },
                subtitle: {
                    text: '没有副标题',
                    style: {
                        color: 'rgba(255, 255, 255, 0.8)',
                    }
                },
                legend: {
                    enabled: false
                },
                yAxis: [{
                    title: {
                        text: '建筑高度'
                    },
                }, {
                    lineWidth: 1,
                    opposite: true,
                    title: {
                        text: 'Secondary Axis'
                    },
                }],
                tooltip: {
                    enabled: false,
                },

                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },

                series: [
                    {
                        data: [1, 4, 2, 5, 3],
                    }
                ]
            };
            var chart = Highcharts.chart(element[0], options);
            scope.$watch('series', function (newVal) {
                while(chart.series.length > 0) {
                    chart.series[0].remove(true);
                }
                newVal.forEach(s => {
                    chart.addSeries(s, false);
                })
                chart.redraw();
            });
        }
    };
});

