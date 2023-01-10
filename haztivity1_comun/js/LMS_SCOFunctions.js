var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;

var startDate;
var exitPageStatus;
var PUNTUACION_APROBACION = 50;
var PUNTUACION_MAXIMA = 100;
var PUNTUACION_MINIMA = 0;

var estado_actividad;
var puntuacion_actividad;
var debe_ejecutar = true;
var idioma= "es";

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function loadPage(){

    var result = doLMSInitialize();
    var status = doLMSGetValue( "cmi.core.lesson_status" );
	
	/*
	idioma= doLMSGetValue("cmi.student_preference.language");
 	if(idioma==""){
		idioma="es";
	}
	 */
	 
    status = status.toLowerCase();
    if (status == "not attempted"){
        // the student is now attempting the lesson
        doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
    }

    exitPageStatus = false;
    startTimer();
}

function loadPage_evaluacion(pagina){
    var result = doLMSInitialize();
    var status = doLMSGetValue( "cmi.core.lesson_status" );
    status = status.toLowerCase();

    if (status == "not attempted"){
        // the student is now attempting the lesson
        doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
    }


    exitPageStatus = false;

    startTimer();
    if (status == "passed"){
        //computeTime(); FAM esta linea estaba activa
        //exitPageStatus = true; FAM esta linea estaba activa
        //doLMSCommit(); FAM esta linea estaba activa
        //doLMSFinish(); FAM esta linea estaba activa
        //debe_ejecutar = false; FAM esta linea estaba activa
        //pagina = String(pagina); FAM esta linea estaba activa
        //document.location = pagina.replace(".htm","_redirigir.htm");
        //window.location.replace(pagina.replace(".htm","_redirigir.htm"));	 FAM esta linea estaba activa
        //document.location.href = pagina.replace(".htm","_redirigir.htm");	
        ActivaAviso();
    }
}

function startTimer(){
    startDate = new Date().getTime();
}

function computeTime(){
    if ( startDate != 0 ){
        var currentDate = new Date().getTime();
        var elapsedSeconds = ( (currentDate - startDate) / 1000 );
        var formattedTime = convertTotalSeconds( elapsedSeconds );
    }
    else{
        formattedTime = "00:00:00.0";
    }

    doLMSSetValue( "cmi.core.session_time", formattedTime );
}

function doQuit(){
    if(!LMSIsInitialized())
        return;
    
    // enviamos un exit
    doLMSSetValue("cmi.core.exit","");

    //los tiempos
    computeTime();

    exitPageStatus = true;
    
    //lmscommit
    doLMSCommit();

    var result = doLMSFinish();
}

function unloadPage() {
	if (exitPageStatus != true){
		doQuit();
	}
}

/*******************************************************************************
** Esta funci�n convertir� segundos en horas, los minutos(actas), y segundos en 
** el formato de tipo de CMITIMESPAN - HHHH:MM:SS.SS (Horas tienen m�ximo de 4 
** d�gitos y Minuto de 2 d�gitos
*******************************************************************************/
function convertTotalSeconds(ts)
{
   var sec = (ts % 60);

   ts -= sec;
   var tmp = (ts % 3600);  //# of seconds in the total # of minutes
   ts -= tmp;              //# of seconds in the total # of hours

   // convert seconds to conform to CMITimespan type (e.g. SS.00)
   sec = Math.round(sec*100)/100;
   sec = Math.round(sec);
   var strSec = new String(sec);
   
   var strWholeSec = strSec;
   var strFractionSec = "";

   if (strSec.indexOf(".") != -1)
   {
      strWholeSec =  strSec.substring(0, strSec.indexOf("."));
      strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
   }
   
   if (strWholeSec.length < 2)
   {
      strWholeSec = "0" + strWholeSec;
   }
   strSec = strWholeSec;
   
   if (strFractionSec.length)
   {
      strSec = strSec+ "." + strFractionSec;
   }
   
   if ((ts % 3600) != 0 )
      var hour = 0;
   else var hour = (ts / 3600);
   if ( (tmp % 60) != 0 )
      var min = 0;
   else var min = (tmp / 60);

   if ((new String(hour)).length < 2)
      hour = "0"+hour;
   if ((new String(min)).length < 2)
      min = "0"+min;
      

   var rtnVal = hour+":"+min+":"+strSec;

   return rtnVal;
}

function Finalizar()
{
	  doLMSSetValue("cmi.core.lesson_status","completed");
  	  var nombre_pagina = UltimaPgVisitada (document.location);
	//  alert ("almacena el path " + nombre_pagina);
	  doLMSSetValue("cmi.core.lesson_location",nombre_pagina);
  	  unloadPage();  

  }
  
function Inicializar()
{
   loadPage(); 
  }	
  
// SCORM Activity page Interface
// --------------------------------------------------------------------------------------------------
function sendIncomplete()
{
	computeTime();
	doLMSSetValue("cmi.core.lesson_status","incomplete");
	doLMSCommit();
	doLMSFinish();
}

function sendIncompleteSinTime()
{
   var result = doLMSInitialize();
	startTimer();
	doLMSSetValue("cmi.core.lesson_status","incomplete");
	doLMSSetValue("cmi.core.score.raw", 0);		
	doLMSCommit();
	doLMSFinish();
}

function sendComplete()
{
	computeTime();
	doLMSSetValue("cmi.core.lesson_status", "completed");
	doLMSCommit();
	doLMSFinish();
}

function sendScore(PuntuacionUsuario)
{
		//computeTime();
		doLMSSetValue("cmi.core.score.raw", PuntuacionUsuario);
		doLMSSetValue("cmi.core.score.max", PUNTUACION_MAXIMA);			
		doLMSSetValue("cmi.core.score.min", PUNTUACION_MINIMA);						
		doLMSSetValue("cmi.core.lesson_status", (PuntuacionUsuario < PUNTUACION_APROBACION)? "failed" : "passed");
		doLMSCommit();		
}

function sendWithoutChanges()
{
	doLMSFinish();
}

function Inicializar_Actividad(pagina) 
{
	loadPage_evaluacion(pagina);
	
	if (debe_ejecutar){
		estado_actividad = doLMSGetValue("cmi.core.lesson_status");
		puntuacion_actividad = doLMSGetValue("cmi.core.score.raw");
	}
}

function Finalizar_Actividad()
{
		estado_actividad = doLMSGetValue("cmi.core.lesson_status");
		var nombre_pagina = UltimaPgVisitada (document.location);
//		alert ("almacena el path " + nombre_pagina);
		doLMSSetValue("cmi.core.lesson_location",nombre_pagina);
		
		if (estado_actividad == "passed"){
			 sendWithoutChanges();
		}
		else sendIncomplete();
	}

function UltimaPgVisitada (pagina)
{
	 pagina = String(pagina);
	 return (pagina.substring (pagina.indexOf("/masteres/")+1,pagina.length));
}

function getIdUsuario() {
    return doLMSGetValue("cmi.core.student_id");
}
