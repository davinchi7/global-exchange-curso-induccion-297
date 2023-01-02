

var pathHtmlContenidos = 'pag' + nombrePagina + '/contenido.html?version=' + Date.now();
var respuestasAlmacenadas = "";
var pintarSolucion = oPantalla.pintarSolucion;



/*Declaramos las variables*/
var respuestas = "";
var aciertos = "";
var respuestasAlmacenadas = null;
obtenerDato();


function obtenerDato() {
    console.info("entro en obtenerDato");
    $("#div_main").append("<div style='margin:200px;' id='cargandoHaztivity'>Comprobando la base de datos. Esta operación puede tardar unos segundos... <img src='../img/processing.gif'/><p>Si la pantalla no se carga, haz clic en el botón de actualizar: </p><p> <img src='http://www.campusblended.com/mods/scorm/cursos/203/scorm/img/recargar.png'/></p></h1>");
    
    oPantalla.getUsu();

    var urlAccion = urlAPI + 'api/functions/get/' + idDomain + '/' + oPantalla.usu + '/' + oPantalla.key;
    console.log("urlAccion", urlAccion);
    $.ajax({
        url: urlAccion,
        type: "GET",
        dataType: 'json',
        success: function (data) {
            console.log("data obtenerDato", data);

            if (data.length > 0) {
                console.log("hay datos");
                oPantalla.dateTime2 = data[0].dateTime2;
                respuestasAlmacenadas = JSON.parse(data[0].value);
                oPantalla.misDatos = JSON.parse(data[0].value);
                console.log("es diagnostico");
                initPlantilla();

            } else {
                console.log("no hay datos");
                initPlantilla();
            }

            $("#cargandoHaztivity").remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            initPlantilla();
            
            $("#cargandoHaztivity").remove();
            console.log("error en obtenerDato: " + textStatus);

        }
    });

}




function initPlantilla() {
    console.info("initPlantilla");

    //var respuestasAlmacenadas = oPantalla.misDatos;
    console.log("respuestasAlmacenadas", respuestasAlmacenadas);

    $.get(pathHtmlContenidos, function (data) {
        $("#div_main").append(data);
        window.parent.document.getElementById('btnSig').style.display = 'none';

        //respuestasAlmacenadas = null;
        //Si la respuesta no existe o viene vacía iniciamos la actividad
        if (respuestasAlmacenadas==null) {
            console.log("No hay respuestasAlmacenadas. inicializar");
            inicializar();
        } else {
            console.log("Hay respuestasAlmacenadas.");
            var seleccionado = parseInt(respuestasAlmacenadas.respuestas);
            $('.aviso').hide();
            $('.aviso2').show();
            $('.boton_respuesta').unbind("click").addClass("inactivo");

            setTimeout(function () {

                var idresp = null;
                for (var i = 1; i < 5; i++) {

                    //console.log("resp",$('#respuesta_' + i).attr('valor'), '  selec: ', seleccionado ,   i);

                    if ($('#respuesta_' + i).attr('valor') == seleccionado) {
                        //console.log(seleccionado+'-'+ i);
                        idresp = i;
                        break;
                    }
                }
                //console.log(seleccionado+'-'+ i);
                $('#respuesta_' + idresp).addClass("activo").addClass("select").removeClass("inactivo");
                $('#feedback_respuesta_' + idresp).removeClass("oculto");
                $('#feedback').removeClass("oculto");
            }, 1000);


            window.parent.document.getElementById('btnSig').style.display = 'block';
        }


    });
}



function inicializar() {
    $('.aviso2').hide();
    setTimeout(function () {
        comprobarRealizado();
        $('.boton_respuesta').click(comprobarRespuesta);
    }, 800);

    console.log("inicio");
}


function comprobarRespuesta() {
    $('.boton_respuesta').unbind("click");

    $('#respuesta_1').addClass("inactivo");
    $('#respuesta_2').addClass("inactivo");
    $('#respuesta_3').addClass("inactivo");
    $('#respuesta_4').addClass("inactivo");

    $(this).addClass("select");

    var respuesta = $(this).attr('id');
    var valor = $(this).attr('valor');

    /*Cargamos las variables*/
    respuestas = valor;
    aciertos = valor + "/3";

    $('#feedback_' + respuesta).removeClass("oculto");
    $('#feedback').removeClass("oculto");

    /*Guardamos datos*/
    oPantalla.guardarDato();

    window.parent.document.getElementById('btnSig').style.display = 'block';
}


function calcularRespuestas() {
    return respuestas;
}

function calcularAciertos() {
    return aciertos;
}

function elimniarRegistro() {
    console.log('elimniarRegistro en plantilla');
    oPantalla.deleteRegistro();
}

function comprobarRealizado() {


}


function pintarRespuestaAnterior() {


}




