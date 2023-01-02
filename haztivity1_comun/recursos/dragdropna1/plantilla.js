/************************************/
/*      dragdropna1
/* 
/**** VERSION ***************************/
/* Last Version: JLBO  14/09/2012   * isDraggable /
/* JLBO  23/08/2012 17:51 */
/* RGZ  23/08/2012 13:10 */
/* LVE  07/08/2012 14:00 */
/* Last Version: JLBO 10/07/2012 19:00 */
/**************************************/

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0)
            return -1;
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n)
                n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        if (n >= len)
            return -1;
        var k = n >= 0
              ? n
              : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement)
                return k;
        }
        return -1;
    };
}

//respuestasAlmacenadas="1-1,2,3,9,10,11,4|2-6,7,8,12,13,5";

//Codigo para que no se pueda selecciona el contenido de la pantalla con el raton
//ie
//document.onselectstart = function () { return false; }
// Firefox
//document.onmousedown = function () { return false; }

var pathDatos = 'pag' + nombrePagina + '/datos.xml?version=' + Date.now();
var pathHtmlContenidos = 'pag' + nombrePagina + '/contenido.html?version='+Date.now();
var estadoCheck = "0";
var respuestasAlmacenadas = "";
var pintarSolucion = oPantalla.pintarSolucion;
var numeroIntentos = 0;

console.info("antes del initPlantilla");
initPlantilla();
function initPlantilla() {

    //Obtenemos las respuestas almacenadas en la base de datos
    respuestasAlmacenadas = oPantalla.misDatos.respuestas;

    numeroIntentos = oPantalla.allMisDatos.length;
    $('#numIntentos').html(numeroIntentos);


    //Cargamos la plantilla html en la que se pinta la sopa de letras
    var tpl = '<div id="actividad"></div><div id="texto"><div>';
    $("#div_main").append(tpl);

    //Cargamos el contenido de contenido.html
    $.get(pathHtmlContenidos, function (data) {
        $("#div_main").append(data);
        pintarContenido();
    });

}



//Iniciamos el primer elmento parpadeando
//$('#cajaOrigen1').click();

function pintarContenido() {

    //if(pintarSolucion==true)
    //{
    //  var nombreLocalStorage="dragdropna1"+nombrePagina;
    //  localStorage.setItem(nombreLocalStorage, getParametroXML("solucionCodificada"));	
    //  respuestasAlmacenadas=getParametroXML("solucionCodificada");
    //}


    if (pintarSolucion == true) {
        respuestasAlmacenadas = getParametroXML("solucionCodificada");
    }

    pintarContenidoNuevo();

    //Si existe información almacenada pintamos la información
    if (respuestasAlmacenadas != null && respuestasAlmacenadas != 'null' && respuestasAlmacenadas != '') {
        pintarContenidoAlmacenado();
        //Hacemos check para que 
        $('#numIntentos').html(numeroIntentos - 1);
        check();
    }

    //Si el usuario ha superado la actividad se muestra la pantalla de avance
    if (oPantalla.misDatos.aprobado) {
        oPantalla.mostrarBotonAvance();
    }
}


function pintarContenidoNuevo() {
    //pinta los traidos del xml en #actividad
    var cajasOrigen = pintarElementosOrigen();
    var cajasDestino = pintarElementosDestino();

    //Cunado los elementos parsan por detras de las cajas de destino
    if (getPasaPorDetras() == "S") {
        $('#actividad').html(cajasDestino + cajasOrigen);
    }
    else {
        $('#actividad').html(cajasOrigen + cajasDestino);
    }

    colocarEjemplo();
    $('#actividad').show('slow');
    activarEventos();
}


function pintarContenidoAlmacenado() {
    //pinta en #actividad lo que tenga almacenado
    var respuestas = respuestasAlmacenadas.split('|');
    var total = getNumeroElementosOrigen();

    for (z = 0; z < getNumeroElementosDestino() ; z++) {
        idDestino = z + 1;
        valoresElemento = respuestas[z].split('-');
        respuestasElemento = valoresElemento[1].split(',');
        for (r = 0; r < respuestasElemento.length; r++) {
            idOrigenSeleccionado = respuestasElemento[r];
            if (idOrigenSeleccionado != null && idOrigenSeleccionado != 'null' && idOrigenSeleccionado != '') {
                //Eliminas el elemento en el origen
                $('#cajaOrigen' + idOrigenSeleccionado).remove();
                ubicarElemento(idOrigenSeleccionado, idDestino);
            }

        }
    }
    $('#actividad').show('slow');
    activarEventos();

}


function pintarElementosOrigen() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        resultado = '<div id="cajasOrigen">';

	        var tipo = $(xml).find("elementos").find("tipo").text();

	        $(xml).find("elementos").find("elementosOrigen").each(function () {

	            if (tipo == "imagen") {
	                var contenidoOrigen = $(this).html().split("|");
	            } else {
	                var contenidoOrigen = $(this).text().split("|");
	            }

	            var imagenes = $(this).attr('imagen');

	            for (o = 0; o < contenidoOrigen.length; o++) {
	                var idcaj = o + 1;
	                resultado = resultado + '<div class="cajaOrigen espera" id="cajaOrigen' + idcaj + '">' + contenidoOrigen[o] + '</div>';
	            }

	        });
	        resultado = resultado + '<div style="clear:both;"></div></div>';

	    }
	});
    return resultado;
}



function pintarElementosDestino() {

    var cajasDestino = "<div id='cajasDestino'>";
    for (i = 1; i <= getNumeroElementosDestino() ; i++) {
        cajasDestino = cajasDestino + '<div id="cajaDestino' + i + '" class="cajaDestino">';

        if (getEsImagenElementoDestino() == "S") {
            cajasDestino = cajasDestino + '<div id="imagenDestino' + i + '" class="imagenDestino" style="background-image:url(pag' + nombrePagina + '/d' + i + '.png);"></div>';
        } else {
            cajasDestino = cajasDestino + '<div id="imagenDestino' + i + '" class="imagenDestino">' + getContenidoElementoDestino(i - 1) + '</div>';
        }

        cajasDestino = cajasDestino + '<div class="ubicacionDestino" id="ubicacionDestino' + i + '"></div></div>';

    }
    cajasDestino = cajasDestino + '</div>';


    return cajasDestino;

}

function getPasaPorDetras() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").each(function () {
	            resultado = $(this).find('pasaPorDetras').text();
	        });
	    }
	});
    return resultado;
}

function getNumeroElementosDestino() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").each(function () {
	            var numeroElementosDestino = $(this).find('numeroElementosDestino').text();
	            resultado = numeroElementosDestino;
	        });
	    }
	});
    return resultado;
}


function getNumeroElementosOrigen() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").each(function () {
	            var numeroElementosOrigen = $(this).find('numeroElementosOrigen').text();
	            resultado = numeroElementosOrigen;
	        });
	    }
	});
    return resultado;
}

function getContenidoElementoOrigen(idElementoOrigen) {
    idElementoOrigen = idElementoOrigen - 1;
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        var tipo = $(xml).find("elementos").find("tipo").text();
	        $(xml).find("elementos").find("elementosOrigen").each(function () {

	     

	            if (tipo == "imagen") {
	                var contenidoOrigen = $(this).html().split("|");
	            } else {
	                var contenidoOrigen = $(this).text().split("|");
	            }
 
	            var imagenes = $(this).attr('imagen');
	            for (o = 0; o < contenidoOrigen.length; o++) {
	                if (idElementoOrigen == o) {
	                    resultado = contenidoOrigen[o];
	                }
	            }

	        });
	    }
	});
    return resultado;
}

//Nos dice si el contenido de los elementos de destino son texto o imagen
function getEsImagenElementoDestino() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").find("elementosDestino").each(function () {
	            var tipo = $(this).attr("imagen");
	            resultado = tipo;
	        });
	    }
	});
    return resultado;
}

function getContenidoElementoDestino(idElemento) {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").find("elementosDestino").each(function () {
	            var contenido = $(this).text().split('|');
	            for (c = 1; c <= contenido.length; c++) {
	                resultado = contenido[idElemento];
	            }
	        });
	    }
	});
    return resultado;
}




function addElementosOrigen(idElemento) {
    var contenidoOrigen = getContenidoElementoOrigen(idElemento)
    var nuevoElemento = '<div class="cajaOrigen espera" id="cajaOrigen' + idElemento + '">' + contenidoOrigen + '</div>';
    var contenidoActual = $('#cajasOrigen').html();
    $('#cajasOrigen').html(nuevoElemento + contenidoActual);
    activarEventos();
}


function getSolucion() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("solucion").each(function () {
	            resultado = $(this).text();
	        });
	    }
	});
    return resultado;
}



function isDraggable() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("isDraggable").each(function () {
	            resultado = $(this).text();
	        });
	    }
	});
    return resultado;
}

//Funcion generica para obtener un valor concreto
function getParametroXML(pamametro) {
    var valor = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find(pamametro).each(function () {
	            valor = $(this).text();
	        });
	    }
	});
    return valor;
}


//************************************************************************//
//*******************gestion elementos************************************//
//************************************************************************//

//Nos devuelve los elementos pendientes de asignar
function setElementosPendientes() {
    elementosPendientes = "";
    $('.cajaOrigen').each(function () {
        var id = $(this).attr('id').replace('cajaOrigen', '');
        elementosPendientes = elementosPendientes + id + '|';
    });
    return elementosPendientes;
}




//Nos devuelve el id del elemento activo seleccionado actualmente
function getIdOrigenSeleccionado() {
    var idOrigenSeleccionado = 0;
    $('.cajaOrigen').each(function () {
        if ($(this).hasClass('activo') == true) {
            idOrigenSeleccionado = parseInt($(this).attr('id').replace('cajaOrigen', ''));
            return false;
        }
    });
    return idOrigenSeleccionado;

}

//**********************************************//
//Gestion de enventos
//*********************************************//

function activarEventos() {
    eventoSeleccionarElementoOrigen();
    recibirUbicacion();
    arrastrarElemento();
}

function eventoSeleccionarElementoOrigen() {
    $('#cajasOrigen .espera').click(function () {
        var idElementoSeleccionado = parseInt($(this).attr('id').replace('cajaOrigen', ''));
        activarElementoOrigenSeleccionado(idElementoSeleccionado);
        parpadeoDestino();
    })
}

function arrastrarElemento() {

    if (isDraggable() == "N") {

    }
    else {


        $('#cajasOrigen .espera').mousedown(function () { $(this).addClass('cursorArrastrar'); }).mouseup(function () { $(this).removeClass('cursorArrastrar'); });


        $('#cajasOrigen .cajaOrigen').draggable(
        {
            revert: "invalid",
            containment: "#actividad"
        });

        $('.ubicacionDestino, .imagenDestino').droppable({

            hoverClass: "hoverDestino",
            drop: function (event, ui) {
                var origen = ui.helper.attr('id');
                var destino = $(this).attr('id');
                recibirUbicacionDrop(origen, destino);
            }
        });

    }

}

function activarElementoOrigenSeleccionado(idElementoSeleccionado) {
    //Gestiona las clases de todos los elementos origen
    $('#cajasOrigen .cajaOrigen').removeClass('activo');
    $('#cajasOrigen .cajaOrigen').removeClass('espera');
    $('#cajasOrigen .cajaOrigen').addClass('inactivo');

    //Gestiona las clases del elemento seleccionado
    $('#cajasOrigen #cajaOrigen' + idElementoSeleccionado).addClass('activo');
    $('#cajasOrigen #cajaOrigen' + idElementoSeleccionado).removeClass('inactivo');

    parpadeoElementoSeleccionadoOrigen('#cajasOrigen #cajaOrigen' + idElementoSeleccionado.toString());

    cancelarParpadeoElementoSeleccionado();
}



function parpadeoElementoSeleccionadoOrigen(elemento) {
    var activo = $(elemento).hasClass('activo');
    if (activo == true) {
        // Se declara la funcion
        var laid = document.getElementById(elemento); // Seleccionamos el objeto (Texto, div, img, tabla, etc...)

        $(elemento).fadeOut('100', function () { // Con el fadeIn hacemos que aparesca (Con efecto) en 200 MS (200 MiliSegundos = 0.2 Segundos)
            //$(elemento).fadeIn('150', parpadeoElementoSeleccionadoOrigen(elemento)); // Con el fadeOut hacemos que desaparesca (Con efecto) en 200 MS
            $(elemento).fadeIn('150', parpadeoElementoSeleccionadoOrigen(elemento)); // Con el fadeOut hacemos que desaparesca (Con efecto) en 200 MS
        });
    }
    activarEventos();
}


function parpadeoDestino() {
    //Parpadeo destino
    for (p = 1; p <= getNumeroElementosDestino() ; p++) {
        var contenido = $('#ubicacionDestino' + p).html();
        parpadeoUbicacion('#ubicacionDestino' + p);
        //$('#ubicacionDestino'+p).html('<img src="img/flecha.gif"/>'); 
        //$('#ubicacionDestino'+p).addClass('receptor');

    }
    $('.cajaDestino').addClass('receptor');
    $('.ubicacionDestino').addClass('receptor2');
    // fin parpadeo destino	
}


//Escucha cuando el usuario hace click en una ubicacion para colocar un elemento
function recibirUbicacion() {
    $('.receptor').click(function () {
        var idOrigenSeleccionado = getIdOrigenSeleccionado();
        if (idOrigenSeleccionado > 0) {
            var idDiv = $(this).attr('id');
            var idDestino = idDiv.substring(idDiv.length - 1, idDiv.length);
            elimiarElemntoEnOrigen(idOrigenSeleccionado);
            ubicarElemento(idOrigenSeleccionado, idDestino);
            return false;
        }
    });
}

//Escucha cuando el usuario hace click en una ubicacion para colocar un elemento
function colocarEjemplo() {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").find("ejemplo").each(function () {
	            var ejemplos = $(this).text();
	            var arrEjemplos = ejemplos.split('|');

	            for (s = 0; s < arrEjemplos.length; s++) {
	                var ejemplo = arrEjemplos[s].split('-');
	                var idOrigenSeleccionado = ejemplo[1];
	                var idDestino = ejemplo[0];
	                elimiarElemntoEnOrigen(idOrigenSeleccionado);
	                //ubicarElemento(idOrigenSeleccionado,idDestino);
	                $('#ubicacionDestino' + idDestino).html("<div class='ejemplo'>" + getContenidoElementoOrigen(idOrigenSeleccionado) + "</div>");
	            }

	        });
	    }
	});

    return false;
}



//Escucha cuando el usuario hace click en una ubicacion para colocar un elemento
function recibirUbicacionDrop(origen, destino) {

    var idOrigenSeleccionado = origen.replace('cajaOrigen', '');
    var idDiv = destino;
    var idDestino = null;

    var idProvisional = idDiv.substring(idDiv.length - 2, idDiv.length);
    var numdigitos = 1;
    if (isNaN(idProvisional) == false) {
        numdigitos = 2;
    }

    if (numdigitos == 1) {
        idDestino = idDiv.substring(idDiv.length - 1, idDiv.length);
    } else {
        idDestino = idDiv.substring(idDiv.length - 2, idDiv.length);
    }

    $('.imagenDestino').removeClass('hoverDestino');
    elimiarElemntoEnOrigen(idOrigenSeleccionado);
    ubicarElemento(idOrigenSeleccionado, idDestino);

    return false;
}


function elimiarElemntoEnOrigen(idOrigenSeleccionado) {
    $('#cajaOrigen' + idOrigenSeleccionado).remove();
}

//Ubica el elemento seleccionado en el lugar de destino seleccionado
function ubicarElemento(idOrigenSeleccionado, idDestino) {
    //tomo el contenido del elemento a ubicar y lo escribo
    var contenido = getContenidoElementoOrigen(idOrigenSeleccionado);
 
    $('#ubicacionDestino' + idDestino).append('<div id="origen' + idOrigenSeleccionado + '">' + contenido + '<div>');

    $('.ubicacionDestino').css('background-color', 'white');
    //Add la clase ubiado y quitamos la clase receptor y dropable
    $('#origen' + idOrigenSeleccionado).addClass('ubicado');
    //$('#ubicacionDestino'+idDestino).removeClass('receptor');
    //$('#ubicacionDestino'+idDestino).removeClass('ui-droppable');
    //Desactivamos el estado de inactivo de los elementos orgien que tienen mientras un elemento esta seleccioando
    $('.cajaOrigen').removeClass('inactivo');
    $('.cajaOrigen').addClass('espera');

    //Cancelamos el parpadeo del destino
    //cancelarParpadeoDestino();
    //Ponemos a la escucha la accion desubicar (delete)
    desubicarElemento();
}

//Desubica el elemento (delete) y lo pone en la posicion de origen.
function desubicarElemento(event) {
    var evento = event;
    $('.ubicado').mouseover(function () {
        $(this).append('<span id="cartel" class="cartel">Quitar</span>');
        $(this).fadeIn(300);
    });

    $('.ubicado').mouseout(function () {
        $('#cartel').remove();
    });


    $('.ubicado').each(function () {
        $(this).click(function () {
            estadoCheck = 0;
            if ($(this).parent().attr('id') != undefined) {
                var idUbicacion = $(this).parent().attr('id').replace('ubicacionDestino', '');
                var idElemento = parseInt($(this).attr('id').replace('origen', ''));
                $('#origen' + idUbicacion).removeClass('correcta').removeClass('incorrecta');
                $(this).remove();

                //$(this).parent().html('').html('?');
                addElementosOrigen(idElemento);




                if (event) {
                    evento.preventDefault();
                }
                return false;
            }
        });
    });
}

function resetearUbicacionDestino(elemento) {
    $('.icono').remove();
    var idElemento = parseInt($(this).attr('id').replace('origen', ''));
    $(this).parent().html('');
    addElementosOrigen(idElemento);
}

function cancelarParpadeoElementoSeleccionado() {
    $('.activo').click(function () {
        cancelarParpadeoOrigen();
        cancelarParpadeoDestino();
    });
}


function cancelarParpadeoOrigen() {
    $('.cajaOrigen').removeClass('activo');
    $('.cajaOrigen').removeClass('inactivo');
    $('.cajaOrigen').addClass('espera');
}





function cancelarParpadeoDestino() {
    $('.ubicacionDestino').each(function () {
        if ($(this).hasClass('receptor') == true) {
            $(this).html('');
        }
    });
    $('.ubicacionDestino').removeClass('receptor');
}





function parpadeoUbicacion(elemento) {
    var activo = $('.cajaOrigen').hasClass('activo');
    if (activo == true) {
        // Se declara la funcion
        var laid = document.getElementById(elemento); // Seleccionamos el objeto (Texto, div, img, tabla, etc...)
        $(elemento).fadeOut('slow', function () { // Con el fadeIn hacemos que aparesca (Con efecto) en 200 MS (200 MiliSegundos = 0.2 Segundos)
            //$(elemento).fadeIn('slow', parpadeoUbicacion(elemento)); // Con el fadeOut hacemos que desaparesca (Con efecto) en 200 MS
            $(elemento).fadeIn('150'); // Con el fadeOut hacemos que desaparesca (Con efecto) en 200 MS
            $(elemento).css('background-color', 'yellow');
        });
    } else {
        //cancelarParpadeoDestino();

    }
}



//**********************************************
//Funciones Comunes
//**********************************************


//Funciones de los botones laterales
//**********************************
function check() {
    //devuelve correccion de las respuestas del alumno, por ejemplo: esta mal=>tacha, pero no muestra la respuesta buena. 

    var respuestas = calcularRespuestas().split('|');
    var total = getNumeroElementosOrigen();
    var aciertos = 0;

    var solucionesElemento = null;
    var respuestasElemento = null;
    var respuestasExcluyentes = null;
    for (z = 0; z < getNumeroElementosDestino() ; z++) {
        solucionesElemento = getSolucionElementoDestino(z).split('|');
        respuestasExcluyentes = getRespuestasExcluyentes(z);
        valoresElemento = respuestas[z].split('-');
        respuestasElemento = valoresElemento[1].split(',');
        for (r = 0; r < respuestasElemento.length; r++) {
            n = respuestasElemento[r];

            //Se comprueba que existen soluciones excluyentes
            if (respuestasExcluyentes != "") {
                if (respuestasExcluyentes.indexOf(n) != -1) {
                    var arrRespuestasExcluyentes = respuestasExcluyentes.split("|");

                    //Si las hay, se comprueba que la respuesta del alumno se encuentre en las soluciones excluyentes
                    for (var i = 0; i < arrRespuestasExcluyentes.length; i++) {
                        //Si se encuentra, se eliminan de las soluciones el resto de posibilidades
                        if (arrRespuestasExcluyentes[i] != n) {
                            var arrIndex = solucionesElemento.indexOf(arrRespuestasExcluyentes[i]);
                            if (arrIndex > -1) {
                                solucionesElemento.splice(arrIndex, 1);
                            }
                        }
                    }
                }
            }

            if (solucionesElemento.indexOf(respuestasElemento[r].toString()) > -1) {
                $('#origen' + n).addClass('correcta');
                $('#origen' + n).removeClass('hoverDestino');
            }
            else {
                $('#origen' + n).addClass('incorrecta');
                $('#origen' + n).removeClass('hoverDestino');
            }
        }
    }

    $('#numIntentos').html(parseInt($('#numIntentos').html()) + 1);

}



function clear() {
    // limpia todos los valores y muestra la pantalla de cero 
    $('#cajasOrigen').remove();
    $('#cajasDestion').remove();
    pintarContenidoNuevo();

}


function respuestaCompletada() {
    //Evalua si el usuario ha respondido al ejercicio o no. 1-si, 0-no
    var respuestaCompletada = 0;
    var elementos = setElementosPendientes().split('|');
    if (elementos.length == 1) {
        respuestaCompletada = 1;
    }
    else {
        respuestaCompletada = 0;
    }
    //var nombreLocalStorage = "dragdropna1" + nombrePagina;
    //localStorage.setItem(nombreLocalStorage, calcularRespuestas());

    return respuestaCompletada;
}


function elimniarRegistro() {
    console.log('elimniarRegistro en plantilla');
    oPantalla.deleteRegistro();
}


//Funciones para enviar los datos al API SCORM
//********************************************
function calcularRespuestas() {
    // retorna las respuestas separadas por pipes   
    var respuestas = "";

    for (x = 1; x <= getNumeroElementosDestino() ; x++) {
        var origen = "";
        $('#ubicacionDestino' + x + ' .ubicado').each(function () {
            origen = origen + $(this).attr('id').replace('origen', '') + ',';
        })

        respuestas = respuestas + x + '-' + origen + '|';
    }
    return respuestas;
}

function calcularAciertos() {
    // retorna los aciertos barra apartados -> 6/7
    var respuestas = calcularRespuestas().split('|');
    var total = getNumeroElementosOrigen();
    var aciertos = 0;

    var solucionesElemento = null;
    var respuestasElemento = null;
    var respuestasExcluyentes = null;

    for (z = 0; z < getNumeroElementosDestino() ; z++) {
        solucionesElemento = getSolucionElementoDestino(z).split('|');
        respuestasExcluyentes = getRespuestasExcluyentes(z);
        valoresElemento = respuestas[z].split('-');
        respuestasElemento = valoresElemento[1].split(',');
        for (r = 0; r < respuestasElemento.length; r++) {
            var n = respuestasElemento[r];

            if (respuestasExcluyentes != "") {
                if (respuestasExcluyentes.indexOf(n) != -1) {
                    var arrRespuestasExcluyentes = respuestasExcluyentes.split("|");

                    for (var i = 0; i < arrRespuestasExcluyentes.length; i++) {
                        if (arrRespuestasExcluyentes[i] != n) {
                            var arrIndex = solucionesElemento.indexOf(arrRespuestasExcluyentes[i]);
                            if (arrIndex > -1) {
                                solucionesElemento.splice(arrIndex, 1);
                            }
                        }
                    }
                }
            }

            if (respuestasElemento[r].toString() != '') {
                if (solucionesElemento.indexOf(respuestasElemento[r].toString()) > -1) {
                    aciertos = aciertos + 1;
                }
            }
        }
    }
    return aciertos + '/' + total;
}


function getSolucionElementoDestino(idElementoDestino) {
    var resultado = null;
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").find("soluciones").each(function () {
	            var soluciones = $(this).find("solucion:eq(" + idElementoDestino + ")").text();
	            resultado = soluciones;
	        });
	    }
	});
    return resultado;
}

function getRespuestasExcluyentes(idElementoDestino) {
    var resultado = "";
    $.ajax(
	{
	    url: pathDatos,
	    type: 'get',
	    dataType: 'xml',
	    async: false,
	    success: function (xml) {
	        $(xml).find("elementos").find("soluciones").each(function () {
	            var respuestasExcluyentes = $(this).find("solucion:eq(" + idElementoDestino + ")").attr("excluyentes") ? $(this).find("solucion:eq(" + idElementoDestino + ")").attr("excluyentes") : "";
	            resultado = respuestasExcluyentes;
	        });
	    }
	});
    return resultado;
}


//**********************************************
//**********************************************