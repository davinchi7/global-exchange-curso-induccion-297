/**** VERSION **************************/
/* Last Version: LVE 03/10/2012 13:22  */
/* 							 LVE 02/10/2012 10:47  */
/* 							 LVE 01/10/2012 12:40  */
/* 							 LVE 28/09/2012 22:00  */
/***************************************/

//Codigo para que no se pueda selecciona el contenido de la pantalla con el raton
//ie
//document.onselectstart = function () { return false; }
// Firefox
//document.onmousedown = function () { return false; }

var pathDatos = 'pag' + nombrePagina + '/datos.xml';
var pathHtmlContenidos = 'pag' + nombrePagina + '/contenido.html';
var respuestasAlmacenadas = [];
var sopa = [];
var numPalabrasMarcadas = 0;
var palabrasMarcadas = [];
var soluciones = [];
var estadoCheck = "0";
var respuestasAlmacenadas = "";
var pintarSolucion = false;
var numeroIntentos = 0;

//respuestasAlmacenadas="SEFF-0,0:3,0||AFT-1,2:3,2|UIEVE-1,4:5,4|RDSUNF-1,5:6,5|YALSRQG-2,7:8,7|TSYE-3,9:6,9";



//if(pintarSolucion==true)
//{
// 	var nombreLocalStorage="sopadeletras"+nombrePagina;
//	localStorage.setItem(nombreLocalStorage, getParametroXML("solucionCodificada"));	
//	respuestasAlmacenadas=getParametroXML("solucionCodificada");
//}
initPlantilla();
console.info("antes del initPlantilla");
function initPlantilla() {

    //Obtenemos las respuestas almacenadas en la base de datos
    respuestasAlmacenadas = oPantalla.misDatos.respuestas;

    numeroIntentos = oPantalla.allMisDatos.length;
    $('#numIntentos').html(numeroIntentos);
 
    //Cargamos la plantilla html en la que se pinta la sopa de letras
    var tpl = '<div id="actividad"></div><div id="texto"><div>';
    $("#div_main").append(tpl);

    //Cargamos el contenido de contenido.html
    $.get("pag" + nombrePagina + "/contenido.html", function (data) {
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
    var tabla = pintarElementos();
    $('#actividad').html(tabla);
    actualizarContadorPalabrasRestantes();
    // colocarEjemplo();
    activarEventos();
}

function pintarContenidoAlmacenado() {
    var palabrasExistentes;

    palabrasMarcadas = deserializarRespuestas(respuestasAlmacenadas);

    $.each(palabrasMarcadas, function (id, palabra) {
        if (palabra != "") {
            numPalabrasMarcadas++;
            marcarPalabra(palabra.coordOrigen, palabra.coordDestino, id);
        }
    });

    palabrasExistentes = palabrasMarcadas.filter(function (palabra) {
        return palabra != "";
    });
    numPalabrasMarcadas = palabrasExistentes.length;

    actualizarContadorPalabrasRestantes();
}

function serializarRespuestas() {
    var tokenPattern = "{1}-{2},{3}:{4},{5}";
    return $.map(palabrasMarcadas, function (palabra) {
        if (!palabra) {
            return "";
        }
        return StringUtil.substitute(tokenPattern,
			palabra.palabra,
			palabra.coordOrigen[0], palabra.coordOrigen[1],
			palabra.coordDestino[0], palabra.coordDestino[1]);
    }).join('|');
}

var StringUtil = {
    substitute: function (str) {
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < args.length; i++) {
            str = str.replace(new RegExp("\\{" + (i + 1) + "\\}", "g"), args[i]);
        }
        return str;
    }
}

function deserializarRespuestas(respuestas) {
    var tokensRespuestas = respuestasAlmacenadas.split('|');
    var regexp = /(\w+)-(\d+),(\d+):(\d+),(\d+)/;
    return $.map(tokensRespuestas, function (tokenRespuesta) {
        var match = regexp.exec(tokenRespuesta);

        if (!match) {
            return "";
        }
        return {
            palabra: match[1],
            coordOrigen: [parseInt(match[2]), parseInt(match[3])],
            coordDestino: [parseInt(match[4]), parseInt(match[5])],
        };
    });
    // var tokensRespuestas = respuestasAlmacenadas.split('|');

    // var arr = $.map(tokensRespuestas, function(tokenRespuesta) {
    // 	if (!tokenRespuesta) {
    // 		return "";
    // 	}

    // 	var tokens = tokenRespuesta.split('-');
    // 	var tokenPalabra = tokens[0];
    // 	var tokensCoord = tokens[1].split(':');
    // 	var coordOrigen = tokensCoord[0].split(',');
    // 	var coordDestino = tokensCoord[1].split(',');

    // 	return {
    // 		'palabra': tokenPalabra,
    // 		'coordOrigen': [parseInt(coordOrigen[0]), parseInt(coordOrigen[1])],
    // 		'coordDestino': [parseInt(coordDestino[0]), parseInt(coordDestino[1])]
    // 	};
    // });

    // return arr;
}

function pintarElementos() {
    var resultado = "";
    var letras = "";
    var fila = [];
    var numFilas = 0;
    var numColums = 0;
    sopa = [];
    soluciones = [];
    numPalabrasMarcadas = 0;

    $.ajax({
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            $(xml).find("sopa > tabla > fila").each(function () {
                var filaLetras = $(this).text().toUpperCase().replace(/\s/g, "");
                letras += filaLetras;
                numColums = filaLetras.length; // Guarda nUmero columnas
                numFilas++; // Incrementa contador filas
            });

            $(xml).find("sopa > soluciones > solucion").each(function () {
                var solucion = $(this).text().toUpperCase();
                soluciones.push(solucion);
            });
            palabrasMarcadas = $.map(soluciones, function () { return ""; });
        }
    });

    for (var i = 0; i < numFilas; i++) {
        fila = [];
        for (var j = 0; j < numColums; j++) {
            fila.push(letras.charAt(i * numColums + j));
        }
        sopa.push(fila);
    }

    resultado += '<table id="tablaLetras"><tbody>';

    sopa.forEach(function (filaLetras, indiceFila) {
        resultado += '<tr>';
        filaLetras.forEach(function (letra, indiceColumna) {
            resultado += '<td id="item-' + indiceColumna + '-' + indiceFila + '">' + letra + '</td>';
        });
        resultado += '</tr>';
    });

    resultado += '</tbody></table><div id="respuestas"><div id="items-left"></div><ul id="lista-palabras">';

    for (var indicePalabra = 0; indicePalabra < soluciones.length; indicePalabra++) {
        if (indicePalabra < 12) {
            resultado += '<li class="palabra-' + (indicePalabra + 1) + '" style="display:none;"></li>';
        } else {
            resultado += '<li class="palabra-' + (indicePalabra + 1) + ' letra-color-def" style="display:none;"></li>';
        }
    };

    resultado += '</ul></div>';

    return resultado;
}

function getLetraByCoords(i, j) {
    return sopa[j][i];
}

function marcarPalabra(coordOrigen, coordDestino, id) {
    var palabra = "";
    var clasePalabra = getClasePalabra(id);

    recorrerPalabra(coordOrigen, coordDestino, function (i, j, letra) {
        $("#item-" + i + "-" + j).addClass('letra ' + clasePalabra);
        palabra += letra;
    });

    clasePalabra = clasePalabra.replace("letra-color-def", "");
    var itemPalabra = $('#actividad ul#lista-palabras .' + $.trim(clasePalabra));
    itemPalabra.html(palabra).show(600);

    return palabra;
}

function getClasePalabra(id) {
    var clasePalabra;

    indiceSiguientePalabra = id;
    clasePalabra = "palabra-" + (indiceSiguientePalabra + 1);

    // 12 es el mAximo de items con clases con diferentes colores
    if (numPalabrasMarcadas > 12) {
        clasePalabra += " letra-color-def";
    }

    return clasePalabra;
}

function activarEventos() {
    var letraSeleccionada;

    numPalabrasMarcadas = 0;

    $("#actividad table td").click(function (event) {

        if (letraSeleccionada == null) {
            if (numPalabrasMarcadas != soluciones.length) {
                $(this).addClass("marcada");
                letraSeleccionada = $(this);
            }
        } else {
            var coordOrigen = getCoordLetra(letraSeleccionada);
            var coordDestino = getCoordLetra($(this));
            var palabra = "";

            if (comprobarMovimiento(coordOrigen, coordDestino)) {
                $("#item-" + coordOrigen.join("-")).removeClass("marcada");
                letraSeleccionada = null;

                if (numPalabrasMarcadas == (soluciones.length)) {
                    // TODO: avisar al usuario de que ha llegado al max de palabras seleccionadas
                    return;
                }

                numPalabrasMarcadas++;
                var id = $.inArray("", palabrasMarcadas);
                palabra = marcarPalabra(coordOrigen, coordDestino, id);

                palabrasMarcadas[indiceSiguientePalabra] = {
                    'palabra': palabra,
                    'coordOrigen': [coordOrigen[0], coordOrigen[1]],
                    'coordDestino': [coordDestino[0], coordDestino[1]]
                };

                actualizarContadorPalabrasRestantes();
            } else {
                $("#item-" + coordOrigen.join("-")).removeClass("marcada");
                letraSeleccionada = null;
            }
        }
    });

    // Ocultar y vaciar contenido de la palabra de la sopa de letras y eliminar palabra de la lista palabraSeleccionada
    $('#actividad ul#lista-palabras li').click(function () {
        var clasePalabra = $(this).attr("class");

        clasePalabra = clasePalabra.replace("letra-color-def", "");
        // desmarcar elementos con clase palabra-n de la tabla
        var elemento = $("#actividad table td." + clasePalabra);

        elemento.removeClass($.trim(clasePalabra));
        elemento.each(function () {
            var letraTabla = $(this).attr("class");
            var match = null;
            var notColorDef = true;

            if (/palabra-(\d+)/.test(letraTabla)) {
                var re = /palabra-(\d+)/g;
                while (match = re.exec(letraTabla)) {
                    notColorDef = notColorDef && (parseInt(match[1]) < 12);
                }

                if (notColorDef) {
                    $(this).removeClass("letra-color-def");
                }
            } else {
                $(this).removeClass("letra letra-color-def");
            }
        });

        // borrar palabra de palabrasMarcadas
        var palabraSeleccionada = parseInt(clasePalabra.split("-")[1]) - 1;
        palabrasMarcadas[palabraSeleccionada] = "";
        numPalabrasMarcadas--;
        // borrar elemento li de la lista de palabras
        $(this).hide(600, function () {
            $(this).removeClass('correcta incorrecta');
            $(this).html("");
            actualizarContadorPalabrasRestantes();
        });
    });
}

function actualizarContadorPalabrasRestantes() {
    // Actualizar contador items left
    $('#actividad #items-left').html('<b>Quedan ' + (soluciones.length - numPalabrasMarcadas) + '</b> palabras');
}

function getCoordLetra(elLetra) {
    var coordenadas = elLetra.attr('id').split('-').slice(1);

    return [parseInt(coordenadas[0]), parseInt(coordenadas[1])];
}

function comprobarMovimiento(coordOrigen, coordDestino) {
    var difX = coordDestino[0] - coordOrigen[0];
    var difY = coordDestino[1] - coordOrigen[1];
    var flagCoord = false;

    // Comprueba si es el movimiento se realiza sobre el mismo punto
    if (difX == 0 && difY == 0) {
        return false;
    }
    // Comprueba si el movimiento ya existe en los movimientos previos del usuario
    $.each(palabrasMarcadas, function (id, palabra) {
        if (palabra.palabra) {
            var flagCoordOrigen0 = (coordOrigen[0] == palabra.coordOrigen[0]);
            var flagCoordOrigen1 = (coordOrigen[1] == palabra.coordOrigen[1]);
            var flagCoordDestino0 = (coordDestino[0] == palabra.coordDestino[0]);
            var flagCoordDestino1 = (coordDestino[1] == palabra.coordDestino[1]);

            if (flagCoordOrigen0 && flagCoordOrigen1 && flagCoordDestino0 && flagCoordDestino1) {
                flagCoord = true;
                return;
            }
        }
    });
    if (flagCoord) {
        return false;
    }
    // Comprueba si el movimiento es una horizontal, vertical o diagonal
    return difX == 0 || difY == 0 || Math.abs(difX) == Math.abs(difY);
}

function recorrerPalabra(coordOrigen, coordDestino, callback) {
    var incX = (coordOrigen[0] < coordDestino[0]) ? 1 : (coordOrigen[0] > coordDestino[0]) ? -1 : 0;
    var incY = (coordOrigen[1] < coordDestino[1]) ? 1 : (coordOrigen[1] > coordDestino[1]) ? -1 : 0;
    var startX = coordOrigen[0];
    var startY = coordOrigen[1];
    var endX = coordDestino[0] + incX;
    var endY = coordDestino[1] + incY;

    for (var i = startX, j = startY; i != endX || j != endY; i += incX, j += incY) {
        callback(i, j, getLetraByCoords(i, j));
    }
}

function setAciertos() {
    var tmpSoluciones = soluciones.concat();
    $('ul#lista-palabras [class^="palabra"]').removeClass('correcta incorrecta');
    $.each(palabrasMarcadas, function (id, palabra) {
        var idSolucion = tmpSoluciones.indexOf(palabra.palabra);
        if (idSolucion != -1) {
            $("#actividad ul#lista-palabras .palabra-" + (id + 1)).addClass('correcta');
        } else {
            $("#actividad ul#lista-palabras .palabra-" + (id + 1)).addClass('incorrecta');
        }
    });
}

function getAciertos() {
    var tmpSoluciones = soluciones.concat();
    $.each(palabrasMarcadas, function (id, palabra) {
        var idSolucion = tmpSoluciones.indexOf(palabra.palabra);
        if (idSolucion != -1) {
            tmpSoluciones.splice(idSolucion, 1);
        }
    });

    return soluciones.length - tmpSoluciones.length;
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

    window.parent.document.getElementById('btnSig').style.display = 'block';
}

function clear() {
    // limpia todos los valores y muestra la pantalla de cero 
    pintarContenidoNuevo();
}

function respuestaCompletada() {
    //Evalua si el usuario ha respondido al ejercicio o no. 1-si, 0-no
    var valor = 0;
    var totalPalabras = soluciones.length;
    if (numPalabrasMarcadas == totalPalabras) {
        valor = 1;
    } else {
        valor = 0;
    }

    var nombreLocalStorage = "sopadeletras" + nombrePagina;
    localStorage.setItem(nombreLocalStorage, calcularRespuestas());
    return valor;
}

function elimniarRegistro() {
    console.log('elimniarRegistro en plantilla');
    oPantalla.deleteRegistro();
}


//Funciones para enviar los datos al API SCORM
//********************************************
function calcularRespuestas() {
    // retorna las respuestas separadas por pipes
    return serializarRespuestas();

    // var respuestas = $.map(palabrasMarcadas, function(palabra) {
    // 	if (palabra == "") {
    // 		return "";
    // 	}

    // 	return (palabra.palabra + '-' +
    // 		palabra.coordOrigen[0] + ',' + palabra.coordOrigen[1] + ':' +
    // 		palabra.coordDestino[0] + ',' + palabra.coordDestino[1]
    // 	);
    // });

    // return respuestas.join('|');
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



function calcularAciertos() {
    // retorna los aciertos barra apartados -> 6/7
    var aciertos = 0;
    aciertos = getAciertos();
    var total = soluciones.length;

    return aciertos + '/' + total;
}


