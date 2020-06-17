angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'customersCtrl',
                templateUrl: 'vistas/buscadorVuelos.html'
            })
            .when('/vuelo/:vueloSeleccionado', {
                controller: 'vueloCtrl',
                templateUrl: '/vistas/vueloView.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('customersCtrl', function ($scope, $http) {

        $scope.Buscarvuelos = function () {
            $scope.bandera = 1;
            $http.get("js/vuelos.json").then(function (response) {
                $scope.myData = response.data.vuelos;                
            });
        };

        $scope.formatearFecha = function (fecha) {

            if (fecha != null) {
                var d = new Date(fecha),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('-');
            }

        };

        $scope.cambioHora = function (horaJ) {
            var fecha = new Date(horaJ);
            //return tempsin[0];
            return fecha + "";
        };


    }).controller('vueloCtrl', function ($scope, $routeParams, $http) {

        $scope.billeteIda = JSON.parse($routeParams.vueloSeleccionado);

        $scope.numeroDeBilletes = 1;

        $scope.addBillete = function (val) {

            $scope.numeroDeBilletes += val;

            if ($scope.numeroDeBilletes < 1) {
                $scope.numeroDeBilletes = 1;
            }
        }

        $scope.opcionesVueloIda = [{
            tipo: "Economy",
            precio: $scope.billeteIda.economy
            }, {
            tipo: "Optima",
            precio: $scope.billeteIda.optima
            }, {
            tipo: "Bussiness ",
            precio: $scope.billeteIda.bussiness
            }];

        $scope.opcionesIdaVuelta = [{
            tipo: "Ida",
            valor: 1
                }, {
            tipo: "Ida y vuelta",
            valor: 2
                }];
        $scope.formatearFecha2 = function (fecha) {

            if (fecha != null) {
                var d = new Date(fecha),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                console.log([year, month, day].join('-'));
                return [year, month, day].join('-');
            }

        };

        $scope.formatearFecha = function (fecha) {

            if (fecha != null) {
                var d = new Date(fecha),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear(),
                    hour = d.getHours(),
                    minutes = d.getMinutes();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                var horaTotal = [day, month, year].join('-') + ", a las " + [hour, minutes].join(':')
                return horaTotal;
            }

        };

        $scope.getVuelta = function () {
            $http.get("js/vuelos.json").then(function (response) {
                $scope.vuelosVuelta = response.data.vuelos;

            });
        }();


        $scope.escogerVuelta = function (x) {

            $scope.billeteVuelta = x;

            $scope.opcionesVueloVuelta = [{
                tipo: "Economy",
                precio: $scope.billeteVuelta.economy
            }, {
                tipo: "Optima",
                precio: $scope.billeteVuelta.optima
            }, {
                tipo: "Bussiness",
                precio: $scope.billeteVuelta.bussiness
            }];


        }

        $scope.getPrecioFinal = function () {

            if ($scope.claseSelecIda != null) {
                if ($scope.billeteVuelta == null || $scope.claseSelecVuelta == null || $scope.idaVuelta.valor == 1) {

                    return ($scope.claseSelecIda.precio * $scope.numeroDeBilletes) + '€';

                } else {
                    return (($scope.claseSelecIda.precio + $scope.claseSelecVuelta.precio) * $scope.numeroDeBilletes) + '€';
                }

            }
        }
           $scope.finalizarCompra = function () {
               
                 $window.alert("Su compra se ha realizado con éxito, recibirá el producto en su dirección habitual");
                
            }

    });
