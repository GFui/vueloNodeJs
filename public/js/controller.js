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

			if ($scope.origen == "" || $scope.origen == null) {
				window.alert("No has seleccionado una ciudad de origen!");
			} else if ($scope.destino == "" || $scope.destino == null) {

				window.alert("No has seleccionado una ciudad de destino!");
			} else if ($scope.salida == "" || $scope.salida == null) {
				window.alert("No has seleccionado fecha de salida!");
			} else {
				$scope.myData = [];
				$scope.bandera = 1;
				$http.get("vuelos/" + $scope.origen + '/' + $scope.destino + '/' + $scope.formatearFecha($scope.salida)).then(function (response) {

					$scope.myData = JSON.parse(JSON.stringify(response.data));
					if ($scope.myData.length == 0) {
						window.alert("No existe ningún vuelo que coincida con tu búsqueda");
					}

				});
			}

		};

		$scope.formatearFecha = function (fecha) { //Este es para buscar en la db, aqui fecha es un objeto tipo Date


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

		$scope.formatearFecha2 = function (fecha) { //Este para presentarla en tablas, aqui fecha se pasa como un string

			//2020-09-04T17:30:00.000Z

			var fechaYHora = fecha.split('T');
			var soloFecha = fechaYHora[0];
			var soloHora = fechaYHora[1].split('.')[0]; // para quitar el .00Z

			var horaTotal = soloFecha + ", a las " + soloHora;
			return horaTotal;


		};

		$scope.cambioHora = function (horaJ) {
			var fecha = new Date(horaJ);
			//return tempsin[0];
			return fecha + "";
		};


	})
	.controller('vueloCtrl', function ($scope, $routeParams, $http) {

		$scope.billeteIda = JSON.parse($routeParams.vueloSeleccionado);

		$scope.numeroDeBilletes = 1;

		$scope.salidaVuelta = "";

		$scope.addBillete = function (val) {

			$scope.numeroDeBilletes += val;

			if ($scope.numeroDeBilletes < 1) {
				$scope.numeroDeBilletes = 1;
			}
		}

		$scope.opcionesVueloIda = [{
			tipo: "Economy",
			precio: $scope.billeteIda.precio_economy
		}, {
			tipo: "Optima",
			precio: $scope.billeteIda.precio_optima
		}, {
			tipo: "Bussiness ",
			precio: $scope.billeteIda.precio_business
		}];

		$scope.opcionesIdaVuelta = [{
			tipo: "Ida",
			valor: 1
		}, {
			tipo: "Ida y vuelta",
			valor: 2
		}];

		$scope.formatearFecha = function (fecha) { //Este es para buscar en la db

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

		$scope.formatearFecha2 = function (fecha) { //Este para presentarla en tablas

			//2020-09-04T17:30:00.000Z

			var fechaYHora = fecha.split('T');
			var soloFecha = fechaYHora[0];
			var soloHora = fechaYHora[1].split('.')[0]; // para quitar el .00Z

			var horaTotal = soloFecha + ", a las " + soloHora;
			return horaTotal;

		};


		$scope.escogerVuelta = function (x) {

			$scope.billeteVuelta = x;

			$scope.opcionesVueloVuelta = [{
				tipo: "Economy",
				precio: $scope.billeteVuelta.precio_economy
			}, {
				tipo: "Optima",
				precio: $scope.billeteVuelta.precio_optima
			}, {
				tipo: "Bussiness",
				precio: $scope.billeteVuelta.precio_business
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

			window.alert("Su compra se ha realizado con éxito, recibirá el producto en su dirección habitual");

		};


		$scope.$watch('salidaVuelta', function updatePdfUrl(newsalidaVuelta, oldsalidaVuelta) {
			if (newsalidaVuelta != oldsalidaVuelta) {

				console.log("salida vuelta: " + $scope.formatearFecha($scope.salidaVuelta) + ", llegada ida: " + $scope.formatearFecha($scope.billeteIda.llegada));
				if ($scope.formatearFecha($scope.salidaVuelta) < $scope.formatearFecha($scope.billeteIda.llegada)) {
					window.alert("La fecha de salida del vuelo de vuelta es anterior a la fecha de llegada!");
					$scope.salidaVuelta = oldsalidaVuelta;
				} else {

					$scope.vuelosVuelta = [];
					$http.get("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.salidaVuelta)).
						then(function (response) {
							$scope.vuelosVuelta = JSON.parse(JSON.stringify(response.data));
							console.log($scope.vuelosVuelta);
							console.log("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.billeteIda.llegada));
						});
				}
			}
		});

	});
