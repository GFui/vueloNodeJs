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

         $scope.banderaH = 0;
         $scope.Hcompras = function () {
             if ($scope.idBase == "" || $scope.idBase == null) {
                 window.alert("Ha ocurrido un error en el inicio de sesión, no podemos recuperar su historial de compras!");
             } else {
                 $scope.myCompra = [];
                 $http.get("vuelos/Hcompras/").then(function (response) {
                     $scope.myCompra = JSON.parse(JSON.stringify(response.data));
                     if ($scope.myCompra.length == 0) {
                         window.alert("No existe ninguna compra");
                     }
                     if ($scope.banderaH == 0) {
                         $scope.banderaH = 1;
                     } else {
                         $scope.banderaH = 0;
                     }

                 });
             }

         };
         //cargar datos en modal de modificacion de vuelos
         $scope.Mod = function (x) {
             $scope.vueloC = x.vuelo;
             $scope.origenC = x.origen;
             $scope.destinoC = x.destino;
             $scope.salidaC = x.salida;
             $scope.llegadaC = x.llegada;
             $scope.precio_businessC = x.precio_business;
             $scope.precio_optimaC = x.precio_optima;
             $scope.precio_economyC = x.precio_economy;
             $scope.plazas_businessC = x.plazas_business;
             $scope.plazas_optimaC = x.plazas_optima;
             $scope.plazas_economyC = x.plazas_economy;
             $("#vueloM").modal("show");
         }
         //modifica el vuelo en cuestion
         $scope.modificarVuelo = function () {
             if ($scope.precio_businessC == "" || $scope.precio_businessC == null) {
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
                 $http.get("vuelos/vueloM/" + $scope.vueloC + '/' + $scope.origenC + '/' + $scope.destinoC + '/' + $scope.salidaC + '/' + $scope.llegadaC + '/' + $scope.precio_businessC + '/' + $scope.precio_optimaC + '/' + $scope.precio_economyC + '/' + $scope.plazas_businessC + '/' + $scope.plazas_optimaC + '/' + $scope.plazas_economyC).then(function (response) {
                     window.alert("vuelo modificado");
                     //limpia variables
                     $scope.vueloC = '';
                     $scope.origenC = '';
                     $scope.destinoC = '';
                     $scope.salidaC = '';
                     $scope.llegadaC = '';
                     $scope.precio_businessC = '';
                     $scope.precio_optimaC = '';
                     $scope.precio_economyC = '';
                     $scope.plazas_businessC = '';
                     $scope.plazas_optimaC = '';
                     $scope.plazas_economyC = '';
                     
                     $("#vueloM").modal("hide");
                 });
             }

         };
         //crea vuelo desde apartado de aerolinea
         $scope.crearVuelo = function () {
             var salidaC = formatearFecha3($scope.salidaC);
             var llegadaC = formatearFecha3($scope.llegadaC);
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
                 $http.get("vuelos/vuelosC/" + $scope.vueloC + '/' + $scope.origenC + '/' + $scope.destinoC + '/' + salidaC + '/' + llegadaC + '/' + $scope.precio_businessC + '/' + $scope.precio_optimaC + '/' + $scope.precio_economyC + '/' + $scope.plazas_businessC + '/' + $scope.plazas_optimaC + '/' + $scope.plazas_economyC).then(function (response) {
                     window.alert("vuelo añadido");
                     //limpia variables
                     $scope.vueloC = '';
                     $scope.origenC = '';
                     $scope.destinoC = '';
                     $scope.salidaC = '';
                     $scope.llegadaC = '';
                     $scope.precio_businessC = '';
                     $scope.precio_optimaC = '';
                     $scope.precio_economyC = '';
                     $scope.plazas_businessC = '';
                     $scope.plazas_optimaC = '';
                     $scope.plazas_economyC = '';
                     
                     $("#vueloC").modal("hide");
                 });
             }

         };

         function addZero(i) {
             if (i < 10) {
                 i = "0" + i;
             }
             return i;
         }

         function formatearFecha3(fecha) { //cambio formato fecha a //2020-09-04T17:30:00.000Z

             if (fecha != null) {
                 var d = new Date(fecha),
                     month = '' + (d.getMonth() + 1),
                     day = '' + d.getDate(),
                     year = d.getFullYear(),
                     hour = addZero(d.getHours()),
                     min = addZero(d.getMinutes());

                 if (month.length < 2)
                     month = '0' + month;
                 if (day.length < 2)
                     day = '0' + day;

                 var formato = [year, month, day].join('-') + 'T' + hour + ':' + min + ':' + '00.000Z';
                 return formato;
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
         $scope.Npasajeros = JSON.parse($routeParams.numeroDePasajeros);


         $scope.numeroDeBilletes = 1;

         $scope.salidaVuelta = "";

         $scope.addBillete = function (val) {

             $scope.numeroDeBilletes += val;

             if ($scope.numeroDeBilletes < 1) {
                 $scope.numeroDeBilletes = 1;
             }
         }

         var Vplazas_businnes = 0;
         var Vplazas_optima = 0;
         var Vplazas_economy = 0;

         $scope.escogerVuelta = function (x) {

             //compruebo si quedan plazas de vuelta
             if (x.plazas_business <= 0 && x.plazas_optima <= 0 && x.plazas_economy <= 0) {
                 return window.alert("No quedan plazas de vuelta");
             }
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

             Vplazas_businnes = $scope.billeteVuelta.plazas_business;
             Vplazas_optima = $scope.billeteVuelta.plazas_optima;
             Vplazas_economy = $scope.billeteVuelta.plazas_economy;
             console.log("dentro de:");
             console.log('O:' + Vplazas_businnes + '/B:' + Vplazas_optima + '/E:' + Vplazas_economy);
         }
         var plazas_businnes = $scope.billeteIda.plazas_business;
         var plazas_optima = $scope.billeteIda.plazas_optima;
         var plazas_economy = $scope.billeteIda.plazas_economy;



         $scope.compra = function () {
             if ($scope.idaVuelta.tipo == "Ida") { //compruebo si se a elegido Solo ida
                 var npas_businnes = 0;
                 var npas_optima = 0;
                 var npas_economy = 0;
                 //compruebo la clase de vuelo Ida elegido
                 if ($scope.claseSelecIda == "" || $scope.claseSelecIda == null) {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo ida!");
                 } else if ($scope.claseSelecIda.tipo == "Optima") {
                     npas_optima = 1;
                 } else if ($scope.claseSelecIda.tipo == "Bussiness") {
                     npas_businnes = 1;
                 } else if ($scope.claseSelecIda.tipo == "Economy") {
                     npas_economy = 1;
                 } else {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo ida!");
                 }
                 console.log('O:' + npas_optima + '/B:' + npas_businnes + '/E:' + npas_economy);

                 //actualizo valores de numero de plazas
                 plazas_businnes = plazas_businnes - npas_businnes;
                 plazas_optima = plazas_optima - npas_optima;
                 plazas_economy = plazas_economy - npas_economy;

                 console.log('O:' + plazas_businnes + '/B:' + plazas_optima + '/E:' + plazas_economy);

                 //Fecha de hoy
                 $scope.CurrentDate = new Date();
                 $scope.formatear = formatearFecha($scope.CurrentDate);

                 if ($scope.nombreP == "" || $scope.nombreP == null) {
                     window.alert("No se ha introducido nombre!");
                 } else if ($scope.apellidoP == "" || $scope.apellidoP == null) {
                     window.alert("No se ha introducido apellido!");
                 } else {
                     //añado pasajero a BD
                     $http.get("vuelos/pasajero/" + $scope.nombreP + '/' + $scope.apellidoP).then(function (response) {
                         console.log('insercion pasajero');
                     });
                     //actualizo numero plazas en BD
                     $http.get("vuelos/restar/" + $scope.billeteIda.vuelo + '/' + $scope.billeteIda.salida + '/' + plazas_businnes + '/' + plazas_optima + '/' + plazas_economy).then(function (response) {
                         console.log('actualizacion plazas del vuelo');
                     });
                     //añado compra a BD
                     $http.get("vuelos/compra/" + $scope.formatear + '/' + $scope.billeteIda.salida + '/' + $scope.billeteIda.vuelo + '/' + $scope.billeteIda.origen + '/' + npas_businnes + '/' + npas_optima + '/' + npas_economy).then(function (response) {
                         console.log('insercion compra');
                         //borro datos modal
                         $scope.nombreP = '';
                         $scope.apellidoP = '';
                         //compruebo cuantos pasajeros quedan por comprar billete
                         $scope.Npasajeros = $scope.Npasajeros - 1;
                         console.log($scope.Npasajeros);
                         if ($scope.Npasajeros == 0) {
                             window.alert("compra finalizada");
                             window.location.href = "index.html";
                             $("#pass").modal("hide");
                         } else {
                             window.alert("introduzca los datos del siguiente pasajero");
                         }
                     });
                 };
             } else if ($scope.idaVuelta.tipo == "Ida y vuelta") { //compruebo si se a elegido ida y vuelta
                 var Inpas_businnes = 0;
                 var Inpas_optima = 0;
                 var Inpas_economy = 0;
                 //compruebo la clase de vuelo Ida elegido
                 if ($scope.claseSelecIda == "" || $scope.claseSelecIda == null) {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo ida!");
                 } else if ($scope.claseSelecIda.tipo == "Optima") {
                     Inpas_optima = 1;
                 } else if ($scope.claseSelecIda.tipo == "Bussiness") {
                     Inpas_businnes = 1;
                 } else if ($scope.claseSelecIda.tipo == "Economy") {
                     Inpas_economy = 1;
                 } else {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo ida!");
                 }

                 console.log('O:' + Inpas_optima + '/B:' + Inpas_businnes + '/E:' + Inpas_economy);

                 //actualizo valores de numero de plazas
                 plazas_businnes = plazas_businnes - Inpas_businnes;
                 plazas_optima = plazas_optima - Inpas_optima;
                 plazas_economy = plazas_economy - Inpas_economy;

                 console.log('O:' + plazas_businnes + '/B:' + plazas_optima + '/E:' + plazas_economy);

                 var Vnpas_businnes = 0;
                 var Vnpas_optima = 0;
                 var Vnpas_economy = 0;
                 //compruebo la clase de vuelo Vuelta elegido y qsi quedan plazas para esa clase
                 if ($scope.claseSelecVuelta == "" || $scope.claseSelecVuelta == null) {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo vuelta!");
                 } else if ($scope.claseSelecVuelta.tipo == "Optima") {
                     Vnpas_optima = 1;
                     Vplazas_optima = Vplazas_optima - Vnpas_optima;
                     if (Vplazas_optima <= 0) {
                         Vplazas_optima = Vplazas_optima + Vnpas_optima;
                         $("#pass").modal("hide");
                         return window.alert("No quedan plazas de vuelta en la categoria Optima");
                     }
                 } else if ($scope.claseSelecVuelta.tipo == "Bussiness") {
                     Vnpas_businnes = 1;
                     Vplazas_businnes = Vplazas_businnes - Vnpas_businnes;
                     if (Vplazas_businnes <= 0) {
                         Vplazas_businnes = Vplazas_businnes + Vnpas_businnes;
                         $("#pass").modal("hide");
                         return window.alert("No quedan plazas de vuelta en la categoria Bussiness");
                     }
                 } else if ($scope.claseSelecVuelta.tipo == "Economy") {
                     Vnpas_economy = 1;
                     Vplazas_economy = Vplazas_economy - Vnpas_economy;
                     if (Vplazas_economy <= 0) {
                         Vplazas_economy = Vplazas_economy + Vnpas_economy;
                         $("#pass").modal("hide");
                         return window.alert("No quedan plazas de vuelta en la categoria Economy");
                     }
                 } else {
                     $("#pass").modal("hide");
                     return window.alert("No se ha introducido tipo de vuelo vuelta!");
                 }
                 console.log('O:' + Vnpas_optima + '/B:' + Vnpas_businnes + '/E:' + Vnpas_economy);
                 console.log('O:' + Vplazas_businnes + '/B:' + Vplazas_optima + '/E:' + Vplazas_economy);
                 console.log('O:' + Vplazas_businnes + '/B:' + Vplazas_optima + '/E:' + Vplazas_economy);

                 //fecha de hoy
                 $scope.CurrentDate = new Date();
                 $scope.formatear = formatearFecha($scope.CurrentDate);

                 if ($scope.nombreP == "" || $scope.nombreP == null) {
                     window.alert("No se ha introducido vuelo!");
                 } else if ($scope.apellidoP == "" || $scope.apellidoP == null) {
                     window.alert("No se ha introducido origen!");
                 } else {
                     //añado pasajero a BD
                     $http.get("vuelos/pasajero/" + $scope.nombreP + '/' + $scope.apellidoP).then(function (response) {
                         console.log('insercion pasajero');
                     });
                     //actualizo plazas Ida en BD
                     $http.get("vuelos/restar/" + $scope.billeteIda.vuelo + '/' + $scope.billeteIda.salida + '/' + plazas_businnes + '/' + plazas_optima + '/' + plazas_economy).then(function (response) {
                         console.log('actualizacion plazas del vuelo ida');
                     });
                     //actualizo plazas Vuelta en BD
                     $http.get("vuelos/restar/" + $scope.billeteVuelta.vuelo + '/' + $scope.billeteVuelta.salida + '/' + Vplazas_businnes + '/' + Vplazas_optima + '/' + Vplazas_economy).then(function (response) {
                         console.log('actualizacion plazas del vuelo vuelta');
                     });
                     //añado compra Vuelta a BD
                     $http.get("vuelos/compra/" + $scope.formatear + '/' + $scope.billeteVuelta.salida + '/' + $scope.billeteVuelta.vuelo + '/' + $scope.billeteVuelta.origen + '/' + Vnpas_businnes + '/' + Vnpas_optima + '/' + Vnpas_economy).then(function (response) {
                         console.log('insercion compra Vuelta');
                     });
                     //añado compra Vuelta a BD y finalizo funcion
                     $http.get("vuelos/compra/" + $scope.formatear + '/' + $scope.billeteIda.salida + '/' + $scope.billeteIda.vuelo + '/' + $scope.billeteIda.origen + '/' + Inpas_businnes + '/' + Inpas_optima + '/' + Inpas_economy).then(function (response) {
                         console.log('insercion compra Ida');
                         //borro datos modal
                         $scope.nombreP = '';
                         $scope.apellidoP = '';
                         //compruebo cuantos pasajeros quedan por comprar billete
                         $scope.Npasajeros = $scope.Npasajeros - 1;
                         console.log($scope.Npasajeros);
                         if ($scope.Npasajeros == 0) {
                             window.alert("compra finalizada");
                             window.location.href = "index.html";
                             $("#pass").modal("hide");
                         } else {
                             window.alert("introduzca los datos del siguiente pasajero");
                         }
                     });
                 };
             } else {
                 $("#pass").modal("hide");
                 window.alert("Error");
             }
         }
         $scope.opcionesVueloIda = [{
             tipo: "Economy",
             precio: $scope.billeteIda.precio_economy
		}, {
             tipo: "Optima",
             precio: $scope.billeteIda.precio_optima
		}, {
             tipo: "Bussiness",
             precio: $scope.billeteIda.precio_business
		}];

         $scope.opcionesIdaVuelta = [{
             tipo: "Ida",
             valor: 1
		}, {
             tipo: "Ida y vuelta",
             valor: 2
		}];

         function formatearFecha(fecha) { //Este es para buscar en la db

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


         $scope.getPrecioFinal = function () {

             if ($scope.claseSelecIda != null) {
                 if ($scope.billeteVuelta == null || $scope.claseSelecVuelta == null || $scope.idaVuelta.valor == 1) {

                     return ($scope.claseSelecIda.precio * $scope.numeroDeBilletes) + '€';

                 } else {
                     return (($scope.claseSelecIda.precio + $scope.claseSelecVuelta.precio) * $scope.numeroDeBilletes) + '€';
                 }

             }
         }

         $scope.actualizarVuelta = function () {
             console.log("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.salidaVuelta));
             $scope.vuelosVuelta = [];
             $http.get("vuelos/vuelta/" + $scope.billeteIda.destino + '/' + $scope.billeteIda.origen + '/' + $scope.formatearFecha($scope.salidaVuelta)).
             then(function (response) {
                 $scope.vuelosVuelta = JSON.parse(JSON.stringify(response.data));
             });
         };

     });
