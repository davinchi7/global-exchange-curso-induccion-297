/**** VERSION ***************************/
/*     sortableGrid

/* Last Version: LBA 21/08/2012 12:30: anyadido changes=0 en clear() */
/* 							 LVE 26/07/2012 14:35 */
/**************************************/

//Codigo para que no se pueda selecciona el contenido de la pantalla con el raton
//ie
document.onselectstart = function(){return false;} 
// Firefox
document.onmousedown = function(){return false;}

var changes=0;
//var respuestasAlmacenadas="8|4|1|7|6|5|3";


var pathDatos='pag'+nombrePagina+'/datos.xml';
var estadoCheck="0";

var respuestasAlmacenadas;



	
pintarContenido();

function pintarContenido() {
	
if(pintarSolucion==true && getParametroXML("solucionCodificada"))
{
 	var nombreLocalStorage="sortableGrid"+nombrePagina;
	localStorage.setItem(nombreLocalStorage, getParametroXML("solucionCodificada"));	
	respuestasAlmacenadas=getParametroXML("solucionCodificada");
}	
	
	
	pintarContenidoNuevo();

	if(respuestasAlmacenadas!=null && respuestasAlmacenadas!='null' && respuestasAlmacenadas!='') {
	changes=1;
    pintarContenidoAlmacenado();
	}
	pintarPosicion();
	if(estadoCheck.toString()=="1") {
		changes=1;
		check();
	}
}

function pintarContenidoNuevo(){
	//pinta los traidos del xml en #actividad
	var cajas=pintarElementos();
	$('#actividad').html(cajas);
	colocarEjemplo();
	activarEventos();
}

function pintarContenidoAlmacenado() {
	var respuestas=respuestasAlmacenadas.split('|');
	var total=getNumItemsSortable();

	for (var i=0; i < getNumItemsSortable(); i++ ) {
		var imagenes = $('#caja-'+respuestas[i]).hasClass('imgItem');
		//Elimina item
		var contenidoItem = $('#caja-'+respuestas[i]).html();
		$('#caja-'+respuestas[i]).remove();
		//Reordena item
		if(imagenes == false) {
			$("#sortable").append('<div id="caja-'+respuestas[i]+'" class="caja it-changed">'+contenidoItem+'</div>');
		} else {
			$("#sortable").append('<div id="caja-'+respuestas[i]+'" class="caja it-changed imgItem" style="background-image:url(img/d'+respuestas[i]+'.jpg);"></div>');
		}
	};
}

function pintarElementos() { 
	var resultado = null;
	$.ajax({
	  url: pathDatos,
	  type: 'get',
	  dataType: 'xml',
	  async: false,
	  success: function(xml) {
  		resultado='<div id="elementos"><div id="sortable">';
			$(xml).find("elementos").find("items").each(function () {
				var contenido = $(this).text().split("|");	
				var imagenes = $(this).attr('imagen');
				for(var i=0; i<contenido.length; i++) {
					var idCaj=i+1;
					if(imagenes=="N") {
						resultado=resultado + '<div id="caja-'+idCaj+'" class="caja">'+contenido[i]+'</div>';
					} else {
						resultado=resultado + '<div id="caja-'+idCaj+'" class="caja imgItem" style="background-image:url(img/d'+idCaj+'.jpg);"></div>';
					}
				}
			});
			resultado=resultado + '</div></div>';	
    } 
	});
	return resultado; 
}

function pintarPosicion() {
	$.ajax({
	  url: pathDatos,
	  type: 'get',
	  dataType: 'xml',
	  async: false,
	  success: function(xml) {
	  	$(xml).find("elementos").find("posicion").each(function () {
	  		var posicion = $(this).text();
	  		if(posicion=="S") {
	  			$('#sortable .caja').each(function(index) {
						$(this).prepend('<span>'+(index+1)+'</span>');
	  			});
	  		}
			});
		}
	});
}

function colocarEjemplo() {
	var resultado = null;
	$.ajax({
	  url: pathDatos,
	  type: 'get',
	  dataType: 'xml',
	  async: false,
	  success: function(xml) {
			$(xml).find("elementos").find("ejemplo").each(function () {
				var ejemplos = $(this).text();	
				var arrEjemplos=ejemplos.split('|');

				if (arrEjemplos[0] != '') {
					//Si hay ejemplos
					for(var i=0; i<arrEjemplos.length; i++) {
						var contenidoItem = $('#caja-'+arrEjemplos[i]).html();
						var imagenes = $('#caja-'+arrEjemplos[i]).hasClass('imgItem');
						//Elimina item
						$('#caja-'+arrEjemplos[i]).remove();
						//Reordena item
						if(imagenes == false) {
							$("#elementos").prepend('<span id="caja-'+arrEjemplos[i]+'" class="caja ejemplo">'+contenidoItem+'</span>');
						} else {
							$("#elementos").prepend('<span id="caja-'+arrEjemplos[i]+'" class="caja imgItem ejemplo" style="background-image:url(img/d'+arrEjemplos[i]+'.jpg);"></span>');
						}
					}
					
				}
			});
  	} 
	});
 return false;
}

function getEjemplos() {
	var arrEjemplos = null;
	$.ajax({
	  url: pathDatos,
	  type: 'get',
	  dataType: 'xml',
	  async: false,
	  success: function(xml) {
			$(xml).find("elementos").find("ejemplo").each(function () {
				arrEjemplos = $(this).text();
			});
  	}
  });
	return arrEjemplos;
}

function getSoluciones() {
	var arrSolucion = null;
	$.ajax({
	  url: pathDatos,
	  type: 'get',
	  dataType: 'xml',
	  async: false,
	  success: function(xml) {
			$(xml).find("elementos").find("solucion").each(function () {
				arrSolucion = $(this).text();
			});
  	}
  });
	return arrSolucion;
}

function getAciertos() {
	var aciertos = 0;
	var arrRespuestas=calcularRespuestas().split('|');
	var arrSolucion=getSoluciones().split('|');
	
	for(var i=0; i<arrRespuestas.length; i++) {
		if (arrRespuestas[i] == arrSolucion[i]) {
			aciertos++;
		}
	}
	return aciertos;
}

// Marca los items correctos e incorrectos
function setAciertos() {
	
	var aciertos = 0;
	var arrRespuestas=calcularRespuestas().split('|');
	var arrSolucion=getSoluciones().split('|');
	$('.caja > img').remove();
	$('.caja > img').remove();
	for(var i=0; i<arrRespuestas.length; i++) {
		if (arrRespuestas[i] == arrSolucion[i]) {
			$('#caja-'+arrRespuestas[i]).append('<img src="../img/ok.png"/>');		} else {
			$('#caja-'+arrRespuestas[i]).append('<img src="../img/ko.png"/>');
		}
	}
}

function getNumItemsSortable() {
	return $('#sortable .caja').length;
}

function activarEventos(){
	sortableGridEvent();
}

function sortableGridEvent() {
	$( "#sortable" ).sortable({ scroll: false });
	$( "#sortable" ).bind( "sortchange", function(event, ui) {
  	changes=1;
		$('div.[class^="caja"] > img').remove();
		$('div.[class^="caja"] > img').remove();
		$('.caja').addClass('it-changed');
		estadoCheck="0";
	});
	$( "#sortable" ).bind( "sortupdate", function(event, ui) {
		$('#sortable .caja').each(function(index) {
			$(this).children('span').html((index+1))
		});
	});
	$( "#sortable" ).disableSelection();
}


//Funcion generica para obtener un valor concreto
function getParametroXML(pamametro)
{
	var valor = null;
	$.ajax(
	{
        url: pathDatos,
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function(xml) {
			$(xml).find(pamametro).each(function () 
			{ 
				valor=$(this).text();
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
}

function clear(){
	// limpia todos los valores y muestra la pantalla de cero 
	pintarContenidoNuevo();
	pintarPosicion();
	changes=0;
}

function respuestaCompletada(){
	//Evalua si el usuario ha respondido al ejercicio o no. 1-si, 0-no
	var resultado=0;
	if(changes==0)
	{
		resultado= 0;
	}
	else
	{
		resultado= 1;
	}
		
	var nombreLocalStorage="sortableGrid"+nombrePagina;
	localStorage.setItem(nombreLocalStorage, calcularRespuestas());	
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
	var respuestas="";
	$('#sortable .caja').each(function() {
		respuestas += $(this).attr('id').split('-')[1]+'|';
	});
	//Fix quita el Ultimo pipe
	return respuestas.substring(0, respuestas.length-1);
}

function calcularAciertos() {
	// retorna los aciertos barra apartados -> 6/7
	var aciertos=0;
	aciertos = getAciertos();
	var total=getNumItemsSortable();

	return  aciertos +'/'+ total;
}
