 angular.module('myApp', ['ngRoute'])
     .config(function ($routeProvider) {
         $routeProvider
             .when('/', {
                 controller: 'customersCtrl',
                 templateUrl: 'vistas/buscadorVuelos.html'
             })
             .when('/vuelo/:vueloSeleccionado/:numeroDePasajeros', {
                 controller: 'vueloCtrl',
                 templateUrl: '/vistas/vueloView.html'
             })
             .otherwise({
                 redirectTo: '/'
             });
     })
     .controller('customersCtrl', function ($scope, $http) {
         $scope.usuarioBase = sessionStorage.getItem("usuario");
         $scope.idBase = sessionStorage.getItem("id");

         $scope.numeroDePasajeros = 0;
         $scope.buscarVuelos = function () {

             if ($scope.origen == "" || $scope.origen == null) {
                 window.alert("No has seleccionado una ciudad de origen!");
             } else if ($scope.destino == "" || $scope.destino == null) {
                 window.alert("No has seleccionado una ciudad de destino!");
             } else if ($scope.salida == "" || $scope.salida == null) {
                 window.alert("No has seleccionado fecha de salida!");
             } else if ($scope.numeroDePasajeros == 0) {
                 window.alert("No has seleccionado un número de pasajeros!");
             } else {
                 $scope.myData = [];
                 $scope.bandera = 1;
                 $http.get("vuelos/ida/" + $scope.origen + '/' + $scope.destino + '/' + $scope.formatearFecha($scope.salida) + '/' + $scope.numeroDePasajeros).then(function (response) {
                     $scope.myData = JSON.parse(JSON.stringify(response.data));
                     if ($scope.myData.length == 0) {
                         window.alert("No existe ningún vuelo que coincida con tu búsqueda");
                     }
                 });
             }

         };

         $scope.login = function () {
             if ($scope.usuario == "" || $scope.usuario == null) {
                 window.alert("No se ha introducido usuario!");
             } else if ($scope.password == "" || $scope.password == null) {
                 window.alert("No se ha introducido contraseña!");
             } else {
                 $scope.usu = [];
                 $http.get("vuelos/log/" + $scope.usuario + '/' + $scope.password).then(function (response) {
                     $scope.usu = JSON.parse(JSON.stringify(response.data));
                     if ($scope.usu.length == 0) {
                         window.alert("No existe ningún usuario/contraseña que coincida con tus datos ");
                     } else {
                         sessionStorage.setItem("usuario", $scope.usu[0].name);
                         $scope.usuarioBase = sessionStorage.getItem("usuario");
                         sessionStorage.setItem("id", $scope.usu[0].id);
                         $scope.idBase = sessionStorage.getItem("id");
                         $("#login").modal("hide");
                     }
                 });
             }

         };

         $scope.unlogin = function () {
             sessionStorage.clear();
             var nombre = sessionStorage.getItem("usuario");
             console.log(nombre);
             window.alert("Se ha desconectado correctamente");
             window.location.reload();
         };

         $scope.crearVuelo = function () {
             console.log('Entro');
             if ($scope.vueloC == "" || $scope.vueloC == null) {
                 window.alert("No se ha introducido vuelo!");
             } else if ($scope.origenC == "" || $scope.origenC == null) {
                 window.alert("No se ha introducido origen!");
             } else if ($scope.destinoC == "" || $scope.destinoC == null) {
                 window.alert("No se ha introducido destino!");
             } else if ($scope.salidaC == "" || $scope.salidaC == null) {
                 window.alert("No se ha introducido salida!");
             } else if ($scope.llegadaC == "" || $scope.llegadaC == null) {
                 window.alert("No se ha introducido llagada!");
             } else if ($scope.precio_businessC == "" || $scope.precio_businessC == null) {
                 window.alert("No se ha introducido precio business!");
             } else if ($scope.precio_optimaC == "" || $scope.precio_optimaC == null) {
                 window.alert("No se ha introducido precio optima!");
             } else if ($scope.precio_economyC == "" || $scope.precio_economyC == null) {
                 window.alert("No se ha introducido precio economy!");
             } else if ($scope.plazas_businessC == "" || $scope.plazas_businessC == null) {
                 window.alert("No se ha introducido plazas business!");
             } else if ($scope.plazas_optimaC == "" || $scope.plazas_optimaC == null) {
                 window.alert("No se ha introducido plazas optima!");
             } else if ($scope.plazas_economyC == "" || $scope.plazas_economyC == null) {
                 window.alert("No se ha introducido plazas economy!");
             } else {
                 $scope.usu = [];
                 $http.get("vuelos/vuelosC/" + $scope.vueloC + '/' + $scope.origenC + '/' + $scope.destinoC + '/' + $scope.salidaC + '/' + $scope.llegadaC + '/' + $scope.precio_businessC + '/' + $scope.precio_optimaC + '/' + $scope.precio_economyC + '/' + $scope.plazas_businessC + '/' + $scope.plazas_optimaC + '/' + $scope.plazas_economyC).then(function (response) {
                    window.alert("vuelo añadido");   
                     $("#vuelosC").modal("hide");
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

         $scope.actualizarVuelta = function () {
             console.log("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.salidaVuelta));
             $scope.vuelosVuelta = [];
             $http.get("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.salidaVuelta)).
             then(function (response) {
                 console.log("hello?");
                 $scope.vuelosVuelta = JSON.parse(JSON.stringify(response.data));
             });
         };

     });
