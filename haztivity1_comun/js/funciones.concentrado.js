/********************
funciones en el archivo _funcionesGenericas.js
********************/
var objSCO = new Object();
var _div = null;
var numPagActual = null;

function iniciaComunicacion() {
    _div = document.getElementById('divInfoLMS-value');

    //1. iniciar comunicaciOn con el lms
    loadPage();
    //2. preparar SCO
    objSCO.lesson_location = "";
    objSCO.lesson_status = "";
    objSCO.score = "";
	objSCO.notaActual=0; 
    objSCO.suspend_data = "";
    objSCO.arrayUnos = new Array();
    objSCO.setPaginasApartado = 0;
	objSCO.siguientePaginaVisitada = 0;
   
    objSCO.save = function () {
        doLMSSetValue("cmi.core.lesson_location", this.lesson_location);
        doLMSSetValue("cmi.core.lesson_status", this.lesson_status);
        doLMSSetValue("cmi.core.score.raw", this.score);



        var cadenaUnos = "";
        var todosUnos = true;
        for (var i = 0; i < this.arrayUnos.length; i++) {
            cadenaUnos += this.arrayUnos[i];
            todosUnos = this.arrayUnos[i] == "1";
        }

        var _sd = "|0,|1,|2";

        _sd = _sd.replace("|0", objSCO.setPaginasApartado);
        _sd = _sd.replace("|1", cadenaUnos);
        _sd = _sd.replace("|2", objSCO.numIntentosEvaluacion);
         


        doLMSSetValue("cmi.suspend_data", _sd);

        if (todosUnos) {
            doLMSSetValue("cmi.core.lesson_status", "completed");
        }
        doLMSCommit("");
    }


    objSCO.getPaginaActual = function () {
        for (var i = 0; i < this.arrayUnos.length; i++) {
            if (this.arrayUnos[i] == "0")
                break;
        }

        return i;
    }



    objSCO.sendTestResult = function (result, status) {

        //alert("sendTestResult:"+ objSCO.numIntentosEvaluacion);
        objSCO.numIntentosEvaluacion += "1";

        objSCO.save();

        //obtener la nota actual
        var notaActual = 0;

        if (parseInt(doLMSGetValue("cmi.objectives._count")) > 0) {
            notaActual = doLMSGetValue("cmi.objectives.0.score.raw");
        }

        if (notaActual != "") {
            notaActual = parseFloat(notaActual);
            if (result < notaActual) {
                result = notaActual;
            }
        }


        doLMSSetValue("cmi.objectives.0.id", "Evaluacion");
        doLMSSetValue("cmi.objectives.0.score.raw", result);
        doLMSSetValue("cmi.objectives.0.status", status);

        doLMSCommit();
    }


    objSCO.recuperarIntentos = function (donde) {
        var sDataIntentos = doLMSGetValue("cmi.suspend_data");
        var datosIntentos = sDataIntentos.split(",");
        var numIntentos = datosIntentos[2];
        objSCO.numIntentosEvaluacion = datosIntentos[2];
        if (parseInt(doLMSGetValue("cmi.objectives._count")) > 0) {
            var nota = doLMSGetValue("cmi.objectives.0.status");
        }
        else {
            var nota = "failed";
        }

        var datos = numIntentos + "," + nota;

        //alert(numIntentos);
        return datos
    }

    objSCO.miraNota = function () {
        return (nota);
    }



    //2. cargar info del SCO
    loadInfoSCO();

    //2. iniciar contenidos
    iniciaContenidos();

}

function terminaComunicacion() {
    unloadPage();
    window.location = "../html/_salir.html?idioma=" + idioma;
    //window.location = "http://www.esca.es/";
}


function loadInfoSCO() {
    objSCO.suspend_data = doLMSGetValue("cmi.suspend_data");

    if (objSCO.suspend_data == "") {
        objSCO.lesson_location = arrayPaginas[1][1];
        objSCO.lesson_status = "incomplete";
        objSCO.score = "0";
        objSCO.setPaginasApartado = 1;
        objSCO.numIntentosEvaluacion = "";

        for (var i = 0; i < arrayPaginas.length; i++)
            objSCO.arrayUnos[i] = "0";

        objSCO.arrayUnos[0] = 1;
        objSCO.arrayUnos[1] = 1;

        objSCO.save();
    }
    else {
        objSCO.lesson_location = doLMSGetValue("cmi.core.lesson_location");
        objSCO.lesson_status = doLMSGetValue("cmi.core.lesson_status");
        objSCO.score = doLMSGetValue("cmi.core.score.raw");

        objSCO.numIntentosEvaluacion = objSCO.suspend_data.split(',')[2];

        objSCO.setPaginasApartado = objSCO.suspend_data.split(',')[0];
        objSCO.arrayUnos = objSCO.suspend_data.split(',')[1].split('');
    }

    //console.log("Pantalla: " + objSCO.lesson_location );
}


function getValue() {
    var field = document.getElementById('txtField').value;
    var _div = document.getElementById('divInfoLMS-value');

    _div.innerHTML = field + ": " + doLMSGetValue(field);
}

function setValue() {
    var field = document.getElementById('txtField').value;
    var newValue = document.getElementById('txtNewValue').value;

    doLMSSetValue(field, newValue);
    doLMSCommit("");

    getValue();
}


/********************
funciones en el archivo _funcionesNavegacion.js
********************/
var setPaginasApartado = 1;
var actual = 0;
var arrayUnos = new Array();

function iniciaContenidos() {

    d = new dTree('d');
    d.config.useCookies = false;

    d.add(arrayIndice[0][0], arrayIndice[0][1], arrayIndice[0][2], arrayIndice[0][3], '', '', '../img/bullet_indice.png');
    d.add(arrayIndice[1][0], arrayIndice[1][1], arrayIndice[1][2], arrayIndice[1][3], '', '', '../img/bullet_indice.png');

    for (var q = 2; q < arrayIndice.length; q++) {

        //Si estamos en local podemos acceder a todo el indice
        if (entorno == "desarrollo") {
            d.add(arrayIndice[q][0], arrayIndice[q][1], arrayIndice[q][2], arrayIndice[q][3], '', '', '../img/bullet_indice_abierto.png');
        }
        else {
            //Comprueba si ya se ha pasado por esa p�gina(valor 1) o todav�a no (valor 0) y en ese caso la deshabilita
            if (objSCO.arrayUnos[getNumPagina(arrayIndice[q][3])] == "1") {
                d.add(arrayIndice[q][0], arrayIndice[q][1], arrayIndice[q][2], arrayIndice[q][3], '', '', '../img/bullet_indice_abierto.png');
            }
            else {
                d.add(arrayIndice[q][0], arrayIndice[q][1], '<span class="nodeDisabled">' + arrayIndice[q][2] + '</span>', arrayIndice[q][3], '', '', '../img/bullet_indice.png');
            }
        }

    }

    //Anade al div del �ndice todo el contenido generado din�micamente
    document.getElementById('divIndice').innerHTML = d;

    //Opci�n que muestra todos los puntos cerrados. Para que est�n abiertos utilizar  d.openAll()
    d.closeAll()

    //Llama al API para que guarde la p�gina a la que vamos
    colocaPagina(objSCO.lesson_location);
}

/***
--
***/
function colocaPagina(url, btnNav) {

   

    var _frm = document.getElementById('frmContenidos');
    numPagActual = getNumPagina(url);
    //localStorage["numPagina"] = numPagActual;


    //Si estamos en local podemos acceder a todo el indice
    if (entorno == "desarrollo") {
        //**Nos lleva a la p�gina
    } else {
        if (objSCO.arrayUnos[numPagActual] == "0" && btnNav == null) { return false; }
    }

    _frm.src = url; 

    /*
	//JLBO 30/11/2009
	//ACTIVAR EL BOT�N SIGUIENTE EN FUNCI�N DEL TIEMPO ASIGNADO PREVIAMENTE
    //recoger la variable del tiempo de la pagina especificada y activar el boton...
	//Hacemos que el bot�n desaparezca
	document.getElementById('btnSig').style.display="none";
	//Recogemos el tiempo para esa p�gina
	var tiempoPagina = arrayPaginas[actual][3];
	
	//Llamamos a la funci�n Activar bot�n una vez que pase el tiempo
	//setTimeout('fcActivar()', tiempoPagina);
    */


    objSCO.arrayUnos[numPagActual] = "1";
    ///arrayUnos[numPagActual] = "1";

    //Pintar de nuevo el �ndice si aplica
    if (arrayPaginas[numPagActual][0] == "1") {
        //Recorremos el array del indice
        for (var q = 0; q < arrayIndice.length; q++) {
            //Traemos de la BD el array de unos y ceros para saber el estado
            if (objSCO.arrayUnos[getNumPagina(arrayIndice[q][3])] == "0") {
                d.aNodes[q].name = arrayIndice[q][2];
            }

            d.aNodes[q]._is = false;
        }

        d.openTo(arrayIndice[getNumPaginaEnIndice(arrayPaginas[numPagActual][1])][0], true);
        document.getElementById('divIndice').innerHTML = d;
        objSCO.setPaginasApartado = 1;
    }
    else {
        d.openTo(arrayPaginas[numPagActual][2], true);
    }

    objSCO.score = getPorcentaje();
    objSCO.lesson_location = arrayPaginas[numPagActual][1];
    objSCO.setPaginasApartado = getSetApartado();
    objSCO.numeroTotalPantallas = parseInt(objSCO.arrayUnos.length - 1);
    objSCO.pantallaActual = getPantallaActual();
    objSCO.save();

        if (parseInt(doLMSGetValue("cmi.objectives._count")) > 0) {
            objSCO.notaActual = doLMSGetValue("cmi.objectives.0.score.raw");
        }

	 

    //pintar avance del alumno
    document.getElementById('idPantalla').innerHTML = "p." + arrayPaginas[numPagActual][1].replace('.htm', '');
    document.getElementById('spanPorcentaje').innerHTML = getPorcentaje().toString() + '%';
    document.getElementById('divSpriteAvance').style.backgroundPosition = '0 -' + getYPositionSprite(getPorcentaje()) + 'px';
    document.getElementById('spanAvanceParcial').innerHTML = getSetApartado() + '/' + arrayIndice[arrayPaginas[numPagActual][2]][4];
    //document.getElementById('spanAvanceParcial').innerHTML = getSetApartado() + '/' + getNumPaginasEnApartado(numPagActual);
    document.getElementById('spanAvanceParcial').innerHTML = objSCO.pantallaActual + '/' + objSCO.numeroTotalPantallas;


}

//Nos dice si la siguiente pagina a la actual se ha visitado o no.
function paginaSiguienteVisitada() {
/*
    if (getAPI()) {
		objSCO.siguientePaginaVisitada=objSCO.arrayUnos[numPagActual + 1];
    } else {
		objSCO.siguientePaginaVisitada=1;
    }
	*/
	return objSCO.siguientePaginaVisitada=objSCO.arrayUnos[numPagActual + 1];

}
/***
--
***/
function getNumPagina(url) {

    var numPagina = 0;
    var _url = url;

    if (!url) {
        _url = document.getElementById('frmContenidos').src;

        var datosURL = _url.split('/');
        _url = datosURL[datosURL.length - 1];
    }

    for (var q = 0; q < arrayPaginas.length; q++) {
        if (_url == arrayPaginas[q][1]) {
            break;
        }
        else
            numPagina++;
    }

    return numPagina;
}

function getNumPaginaEnIndice(url) {
    var numPagina = 0;
    var _url = url;

    if (!url) {
        _url = document.getElementById('frmContenidos').src;
        var datosURL = _url.split('/');
        _url = datosURL[datosURL.length - 1];
    }

    for (var q = 0; q < arrayIndice.length; q++) {
        if (_url == arrayIndice[q][3])
            break;
        else
            numPagina++;
    }

    return numPagina;
}

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    
    
    /***
     --
     ***/
    function irSiguiente() {


        //si existe el parámetro pagindex, nos lleva a esa página  
        if(getUrlParameter('pagindex')!=false){
            actual=getUrlParameter('pagindex');
        }else{
            actual = getNumPagina();
            actual++;
        }

        //si le pasamos el nombre de la pantalla nos lleva a ella
        if(getUrlParameter('pag')!=false){
             var pag= getUrlParameter('pag');
             for(var i =0; i <arrayPaginas.length; i++ ){
                 if(arrayPaginas[i][1] == pag +".htm"){
                     actual=i;
                     console.log("arrayPaginas[1]", arrayPaginas[i][1], actual, pag +".htm");
                    break;
                }
             }
        } 


    objSCO.setPaginasApartado++;

    if (actual >= arrayPaginas.length) {
        actual = arrayPaginas.length - 1;
        return;
    }

    if (actual < arrayPaginas.length) {
        colocaPagina(arrayPaginas[actual][1], true);
    }

    //JLBO 30/11/2009
    //ACTIVAR EL BOT�N SIGUIENTE EN FUNCI�N DEL TIEMPO ASIGNADO PREVIAMENTE
    //recoger la variable del tiempo de la pagina especificada y activar el boton...
    //Hacemos que el bot�n desaparezca
    //document.getElementById('btnSig').style.display="none";
    //Recogemos el tiempo para esa p�gina
    //var tiempoPagina = arrayPaginas[actual][3];
    //Llamamos a la funci�n Activar bot�n una vez que pase el tiempo
    //setTimeout('fcActivar()', tiempoPagina);  
}



//Cuando se carga una p�gina se llama a la funci�n activar bot�n siguiente

//setTimeout('fcActivar()',10000);

function fcActivar() {
    //Activa el bot�n siguiente
    document.getElementById('btnSig').style.display = "";
    //document.getElementById('mensajeCargando').style.display="none";
}

/***
--
***/
function irAnterior() {
    actual = getNumPagina();
    actual--;
    objSCO.setPaginasApartado--;

    if (actual < 1)
        actual = 1;

    colocaPagina(arrayPaginas[actual][1]);
}


//Al hacer F5 carga la p�gina actual
function recargarPagina(pagina) {

    actual = pagina;
    objSCO.setPaginasApartado--;

    if (actual < 1) {
        actual = 1;
    }

    //colocaPagina(arrayPaginas[actual][1]);
    colocaPagina(pagina);
}


/***
--
***/
function getPorcentaje() {
    var numUnos = 0;

    for (var q = 0; q < arrayPaginas.length; q++) {
        if (objSCO.arrayUnos[q] == "1")
            numUnos++;
    }

    var porcentaje = (numUnos / arrayPaginas.length) * 100;
    porcentaje = roundNumber(porcentaje, 0);

    return porcentaje;
}

/***
--
***/
function getSetApartado() {
    var paginaActual = objSCO.lesson_location;

    for (var indicePagina = 0; indicePagina < objSCO.arrayUnos.length; indicePagina++) {
        if (paginaActual == arrayPaginas[indicePagina][1])
            break;
    }

    var _id = indicePagina, _valor = 0;

    while (_valor == 0) {
        _valor = arrayPaginas[_id][0];
        _id--;
    }

    _id++;

    return (indicePagina - _id + 1);
}

function getPantallaActual() {
    var paginaActual = objSCO.lesson_location;

    for (var indicePagina = 0; indicePagina < objSCO.arrayUnos.length; indicePagina++) {
        if (paginaActual == arrayPaginas[indicePagina][1]) {
            break;
        }
    }

    return (indicePagina);
}
/***
funciones extras....
***/
function roundNumber(float, dec) {
    return Math.round(float * Math.pow(10, dec)) / Math.pow(10, dec);
}

function getYPositionSprite(porcentaje) {
    //alert(porcentaje);

    if (porcentaje == 0)
        return '0';

    if (porcentaje > 0 && porcentaje <= 5)
        return '20'

    if (porcentaje > 5 && porcentaje <= 10)
        return '20'

    if (porcentaje > 10 && porcentaje <= 15)
        return '40'

    if (porcentaje > 15 && porcentaje <= 20)
        return '60'

    if (porcentaje > 20 && porcentaje <= 25)
        return '80'

    if (porcentaje > 25 && porcentaje <= 30)
        return '100'

    if (porcentaje > 30 && porcentaje <= 35)
        return '120'

    if (porcentaje > 35 && porcentaje <= 40)
        return '140'

    if (porcentaje > 40 && porcentaje <= 45)
        return '160'

    if (porcentaje > 45 && porcentaje <= 50)
        return '180'

    if (porcentaje > 50 && porcentaje <= 55)
        return '200'

    if (porcentaje > 55 && porcentaje <= 60)
        return '220'

    if (porcentaje > 60 && porcentaje <= 65)
        return '240'

    if (porcentaje > 65 && porcentaje <= 70)
        return '260'

    if (porcentaje > 70 && porcentaje <= 75)
        return '280'

    if (porcentaje > 75 && porcentaje <= 80)
        return '300'

    if (porcentaje > 80 && porcentaje <= 85)
        return '320'

    if (porcentaje > 85 && porcentaje <= 90)
        return '340'

    if (porcentaje > 90 && porcentaje <= 95)
        return '380'

    if (porcentaje > 95 && porcentaje <= 99)
        return '380'

    if (porcentaje >= 100)
        return '400'

    return '0'
}

function getNumPaginasEnApartado(numPagina) {
    //calcular el numero de paginas q hay para esa seccion...
    var idApartado = arrayPaginas[numPagina][2];
    var numPaginasApartado = 0;
    for (var q = 0; q < arrayPaginas.length; q++) {
        if (arrayPaginas[q][2] == idApartado)
            numPaginasApartado++;
    }
    return (numPaginasApartado);
}

function write(str, add) {
    var _div = document.getElementById('divTMP');

    if (add)
        _div.innerHTML = _div.innerHTML + "<br>" + str;
    else
        _div.innerHTML = str;
}


function openPopup(url, nameWin, caracteristicas) {
    var win = window.open(url, nameWin, caracteristicas);
    win.focus();
}





function sendTestResult(nota, status) {
    objSCO.sendTestResult(nota, status);
}
//@ sourceURL=app/js/myapp.js