/**** VERSION ***************************/
/* Last Version: JLBO  23/03/2016 21:43 */
/* Last Version: RGZ  23/08/2012 13:10 */
/* Last Version: LVE 26/07/2012 10:30 */
/**************************************/

//Codigo para que no se pueda selecciona el contenido de la pantalla con el raton
//ie
//document.onselectstart = function () { return false; }
// Firefox
//document.onmousedown = function () { return false; }


//estadoCheck=1;
//var respuestasAlmacenadas="a-4|b-2|c-6|d-3|e-1|f-5";
var pathDatos = 'pag' + nombrePagina + '/datos.xml';
var pathHtmlContenidos = 'pag' + nombrePagina + '/contenido.html';
var estadoCheck = "0";
var respuestasAlmacenadas = "";
var pintarSolucion = false;
var numeroIntentos = 0;
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




function pintarContenido() {

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
    var cajas = pintarElementos();
    $('#actividad').html(cajas);
    colocarEjemplo();
    activarEventos();
}


function pintarContenidoAlmacenado() {
    var arrRespuestas = respuestasAlmacenadas.split('|');
    var total = getNumItemsDestino();
    for (i = 0; i < arrRespuestas.length; i++) {
        var idOrigen = arrRespuestas[i].split('-')[1];
        var idDestino = arrRespuestas[i].split('-')[0];
        if (idDestino != null && idOrigen != null) {
            idOpcionText = $('#itemOrigen-' + idOrigen).html();
            setRespuesta(idDestino, idOrigen, idOpcionText);
        }
    }
}

function pintarElementos() {
    var resultado = null;
    $.ajax({
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            resultado = '<ul id="destino">';
            $(xml).find("elementos").find("elementoDestino").each(function () {
                var contenido = $(this).text();
                var idContenido = $(this).attr('id');

                resultado = resultado + '<li id="itemDestino-' + idContenido + '" class="itemDestino">' + contenido + '</li>';
            });
            resultado = resultado + '</ul><ul id="origen">';

            $(xml).find("elementos").find("elementoOrigen").each(function () {
                var contenido = $(this).text();
                var idContenido = $(this).attr('id');

                resultado = resultado + '<li id="itemOrigen-' + idContenido + '" class="itemOrigen">' + contenido + '</li>';
            });
            resultado = resultado + '</ul>';
        }
    });
    return resultado;
}

function colocarEjemplo() {
    var resultado = null;
    var ejemplos = getEjemplos();
    var arrEjemplos = ejemplos.split('|');
    if (arrEjemplos[0] != '') {
        //Si hay ejemplos
        var htmlEjemplos = '<div id="ejemplos"><ul>';
        for (var i = 0; i < arrEjemplos.length; i++) {
            var idOrigen = arrEjemplos[i].split('-')[1];
            var idDestino = arrEjemplos[i].split('-')[0];
            var contenidoOrigen = $('#itemOrigen-' + idOrigen).html();
            var contenidoDestino = $('#itemDestino-' + idDestino).html();
            // Elimina items
            $('#itemOrigen-' + idOrigen).remove();
            $('#itemDestino-' + idDestino).remove();
            //Reordena items de ejemplo
            htmlEjemplos = htmlEjemplos + '<li id="itemDestino-' + idDestino + '" class="ejemplo">' + contenidoDestino;
            // Añade etiqueta separador
            if (getEtiquetaSeparador().length == 0) {
                htmlEjemplos = htmlEjemplos + '<b> </b>';
            } else {
                htmlEjemplos = htmlEjemplos + ' <b>' + getEtiquetaSeparador() + '</b> ';
            }
            htmlEjemplos = htmlEjemplos + '<strong>' + contenidoOrigen + '</strong>' + '</li>';
        }
        htmlEjemplos = htmlEjemplos + '</ul></div>';
        $("#actividad").prepend(htmlEjemplos);
    }
    return false;
}

function getEjemplos() {
    var arrEjemplos = null;
    $.ajax({
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            $(xml).find("elementos").find("ejemplo").each(function () {
                arrEjemplos = $(this).text();
            });
        }
    });
    return arrEjemplos;
}

function getEtiquetaSeparador() {
    var separador = null;
    $.ajax({
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            $(xml).find("elementos").find("separador").each(function () {
                separador = $(this).text();
            });
        }
    });
    return separador;
}

function getSoluciones() {
    var arrSolucion = null;
    $.ajax({
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            $(xml).find("elementos").find("solucion").each(function () {
                arrSolucion = $(this).text();
            });
        }
    });
    return arrSolucion;
}

function getAciertos() {
    var aciertos = 0;
    var arrRespuestas = calcularRespuestas().split('|');
    var arrSolucion = getSoluciones().split('|');

    for (var i = 0; i < arrRespuestas.length; i++) {
        // if (arrRespuestas[i] == arrSolucion[i]) {
        // 	aciertos++;
        // }
        var arrSolucionTmp = new Array();

        if (arrSolucion[i].indexOf(",") === -1) {
            arrSolucionTmp.push(arrSolucion[i]);
        } else {
            var arrTmp = arrSolucion[i].split("-");
            var arrTmpDest = arrTmp[0].split(",");
            var arrTmpOrig = arrTmp[1].split(",");

            $.each(arrTmpDest, function (i1, e1) {
                $.each(arrTmpOrig, function (i2, e2) {
                    arrSolucionTmp.push(e1 + '-' + e2);
                });
            });
        }

        if ($.inArray(arrRespuestas[i], arrSolucionTmp) != -1) {
            aciertos++;
        }
    }
    return aciertos;
}

// Marca los items correctos e incorrectos
function setAciertos() {
    var aciertos = 0;
    var arrRespuestas = calcularRespuestas().split('|');
    var arrSolucion = getSoluciones().split('|');

    $('.itemDestino').removeClass('correcta');
    $('.itemDestino').removeClass('incorrecta');

    for (var i = 0; i < arrRespuestas.length; i++) {
        var arrSolucionTmp = new Array();

        if (arrSolucion[i].indexOf(",") === -1) {
            arrSolucionTmp.push(arrSolucion[i]);
        } else {
            var arrTmp = arrSolucion[i].split("-");
            var arrTmpDest = arrTmp[0].split(",");
            var arrTmpOrig = arrTmp[1].split(",");

            $.each(arrTmpDest, function (i1, e1) {
                $.each(arrTmpOrig, function (i2, e2) {
                    arrSolucionTmp.push(e1 + '-' + e2);
                });
            });
        }

        if ($.inArray(arrRespuestas[i], arrSolucionTmp) === -1) {
            $('#itemDestino-' + arrRespuestas[i].split('-')[0]).addClass('incorrecta');
        } else {
            $('#itemDestino-' + arrRespuestas[i].split('-')[0]).addClass('correcta');
        }
    }
}

function getNumItemsDestino() {
    // TODO hay que tener en cuenta cuando sean ejemplos => no contarlos.
    return $('#destino .itemDestino').length;
}

function activarEventos() {
    $(".itemOrigen").draggable({
        containment: "#actividad",
        opacity: 0.7,
        helper: "clone",
        // Arrastra si no se ha respondido
        drag: function (event, ui) {
            if ($(this).hasClass('setRespuesta'))
                return false;
        }
    });

    $(".itemDestino").droppable({
        accept: ".itemOrigen",
        activeClass: "ui-state-hover",
        drop: function (event, ui) {
            var idOpcion = ui.draggable.attr('id').split('-')[1];
            var idOpcionText = ui.draggable.html();
            var idDroppable = $(this).attr('id').split('-')[1];
            setRespuesta(idDroppable, idOpcion, idOpcionText);
        }
    });

    // Evento origen
    $(".itemOrigen").click(function () {
        estadoCheck = 0;
        $("#origen li").each(function () {
            $(this).removeClass('selected');
        });
        arrOpciones = "";
        if (!$(this).hasClass('selected')) {
            // Selecciona opcion
            var idOpcion = $(this).attr('id').split('-')[1];
            var idOpcionText = $(this).html();
            // Guarda la informacion en var temporal
            arrOpciones = idOpcion + '|' + idOpcionText;
            $(this).addClass('selected');
        }
    });

    // Evento destino
    $(".itemDestino").click(function () {
        estadoCheck = 0;
        if ($(this).hasClass('setRespuesta')) {
            var op = $(this).children("span").attr('id').split('-')[1];
            var idDroppable = $(this).attr('id').split('-')[1];

            $(this).children("b").remove();
            $(this).children("#respuesta-" + op).remove();
            $(this).removeClass('setRespuesta');

            $('.itemDestino').removeClass('correcta');
            $('.itemDestino').removeClass('incorrecta');

            $('#itemOrigen-' + op).show(1000);
        } else {
            try {
                arrOpciones = arrOpciones.split('|');
                var idOpcion = arrOpciones[0];
                var idOpcionText = arrOpciones[1];
                var idDroppable = $(this).attr('id').split('-')[1];
                $('#itemOrigen-' + idOpcion).removeClass('selected');
                if (idOpcion != null && idOpcionText != null) {
                    setRespuesta(idDroppable, idOpcion, idOpcionText);
                }
            } catch (e) { }
        }
    });
}

function setRespuesta(idDroppable, idOpcion, idOpcionText) {
    if ($('#itemDestino-' + idDroppable).hasClass('setRespuesta')) {
        // Ya tiene una respuesta
    } else {
        // Marcar como respondida
        $('#itemDestino-' + idDroppable).addClass('setRespuesta');
        // Añade etiqueta separador
        if (getEtiquetaSeparador().length == 0) {
            $('#itemDestino-' + idDroppable).append(' ');
        } else {
            $('#itemDestino-' + idDroppable).append(' <b>' + getEtiquetaSeparador() + '</b> ');
        }
        // Añade opcion en una etiqueta ID
        $('#itemDestino-' + idDroppable).append('</strong><span id="respuesta-' + idOpcion + '">' + idOpcionText + '</span>');
        $('#itemOrigen-' + idOpcion).hide(1000);
    }
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

//**********************************************
//Funciones Comunes
//**********************************************

//Funciones de los botones laterales
//**********************************
function check() {
    //devuelve correccion de las respuestas del alumno, por ejemplo: esta mal=>tacha, pero no muestra la respuesta buena. 
    setAciertos();

    $('#numIntentos').html(parseInt($('#numIntentos').html()) + 1);
}

function clear() {
    // limpia todos los valores y muestra la pantalla de cero 
    pintarContenidoNuevo();
}

function respuestaCompletada() {

    //Evalua si el usuario ha respondido al ejercicio o no. 1-si, 0-no
    var resultado = 0;
    var flag = true;

    $("#destino li").each(function () {

        if ($(this).hasClass('setRespuesta') == false) {
            flag = false;
            return false; // Hay un campo vacio, deja de buscar.
        }
    });

    if (flag) {
        resultado = 1;
    }
    else {
        resultado = 0;
    }

    return resultado;

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
    $('#destino .itemDestino').each(function () {

        var valor1 = $(this).attr('id').split('-')[1] + '-';
        //alert(valor1);	
        if ($(this).children("span").attr('id')) {
            var valor2 = $(this).children("span").attr('id').split('-')[1] + '|';
            respuestas = respuestas + valor1 + valor2;
        }
    });
    //Fix quita el Ultimo pipe
    return respuestas.substring(0, respuestas.length - 1);
}

function calcularAciertos() {
    // retorna los aciertos barra apartados -> 6/7
    var aciertos = 0;
    aciertos = getAciertos();
    var total = getNumItemsDestino();

    return aciertos + '/' + total;
}
