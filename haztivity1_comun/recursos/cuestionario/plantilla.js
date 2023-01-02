
$(function () {
    var idioma = "es";
    var pathDatos = 'pag' + nombrePagina + '/datos.xml';
    var itemActual = 0;
    var aciertos = 0;
    var errores = 0;




    /*
       if(window.parent.document.getElementById('alinkSig')!=null){
           window.parent.document.getElementById('alinkSig').style.display="none";
           var d= window.parent.document.getElementById('divSig');
           $(d).after('<img id="imgSustituta" style="margin:9px 10px 0px 0px;" src="../img/btnSgte_.png"/>');
       }
       */
    //pinto el número de items
    var numItems = parseInt(getNumeroItems());
    $('#totalPreguntas').html("/" + numItems);
    $('#test').append("<div><h1 id='comenzar'><div style='font-size:14px;'>" + getMensajeInicial() + "<p></div>Comenzar test</h1></div>")

    $('#comenzar').on("click", function (e) {
        $('#item').fadeIn();
        $('#comenzar').hide();
        pintarItem(itemActual);
        pintarOpciones(itemActual);
    });

    $(document).on('click', '.opcion', function (e) {
        $('#siguiente').fadeIn('slow');
        $('.opcion').removeAttr('data-toggle');
        $('.opcion').removeClass('opcion');

        var id = parseInt($(this).attr('id').replace('op', ''));
        var solucion = getSolucion(itemActual);
        if (solucion == id) {
            resultado = "acierto";
            aciertos = aciertos + 1;
            $('#puntuacion').html('OK: ' + aciertos + ' - ' + 'KO: ' + errores);
        } else {
            resultado = "error";
            errores = errores + 1;
            $('#puntuacion').html('OK: ' + aciertos + ' - ' + 'KO: ' + errores);
        }

        if (resultado == "acierto") {
            $(this).addClass('acierto');
            $(this).append('<span id="icoAcierto"></span>');
            var feed = getFeedback(itemActual, "ok");
        } else {
            $(this).addClass('error');
            $(this).append('<span id="icoError"></span>');
            var feed = getFeedback(itemActual, "ko");
        }
       
        $('#feedback').html(feed);
       // $('#feedback').dialog();


      

    });


    $('#siguiente').click(function () {
        //$('#feedback').dialog("close");
        $('#item').fadeOut('slow');
        $(this).fadeOut('slow');
        itemActual = itemActual + 1;

        //Comprobamos si hemos llegado al final
        if (itemActual < numItems) {
            pintarItem(itemActual);
            $('#item').fadeIn('slow');
            pintarOpciones(itemActual);
        } else {
            var total = aciertos + errores;
            var puntacion = (aciertos * 100) / total;
            var notafinal = parseInt(puntacion);
            var status = "";

            //Comprobamos si ha aprobado
            var notaMinima = getNotaMinima();
            var mensaje = "";
            if (puntacion >= notaMinima) {
                mensaje = getFeedbackAprobado();
                //mensaje="Lo has hecho muy bien.";
                $('#item').fadeIn('slow').html("<div id='resultado'><h1>" + notafinal + "%</h1>" + mensaje + "</div><div style='color:red; margin-top:30px;text-align:center;'>Recuerda que para completar el curso debes avanzar a la siguiente pantalla.<div id='avanzar'>Avanzar</div></div>");
                status = "passed";
            } else {
                mensaje = getFeedbackSuspenso();
                $('#item').fadeIn('slow').html("<div id='resultado'><h1>" + notafinal + "%</h1>" + mensaje + "</div><div style='color:red; margin-top:30px;text-align:center;'>Recuerda que para completar el curso debes avanzar a la siguiente pantalla. <div id='avanzar'>Avanzar</div></div>");
                status = "failed";
            }

            //Enviamos la nota
            window.parent.document.getElementById('btnSig').style.display = 'block';
            parent.sendTestResult(notafinal, status);

            //window.parent.document.getElementById('imgSustituta').style.display="none";
            //window.parent.document.getElementById('alinkSig').style.display="block";

        }

    });



    function pintarItem(itemActual) {
        $('#numPregunta').html(itemActual + 1);
        $('#textoEnunciado').html(getEnunciado(itemActual));
    }


    function getNumeroItems() {
        var valor = null;

        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = $(xml).find('numPreguntas').text();
            }
        });
        return valor;
    }


    function getEnunciado(itemActual) {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                $(xml).find("pregunta:eq(" + itemActual + ")").each(function () {
                    valor = $(this).find('enunciado').text();
                });
            }
        });
        return valor;
    }



    function pintarOpciones(itemActual) {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = "<ul>";
                var contador = 1;
                $(xml).find("opciones:eq(" + itemActual + ")").find('opcion').each(function () {
                    valor = valor + '<li id="op' + contador + '"  class="opcion" data-toggle="modal" data-target="#myModal">' + $(this).text() + '</li>';
                    contador++;
                });
                valor = valor + "</ul>";
                $('#opciones').html(valor);
            }
        });

    }


    function getSolucion(itemActual) {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                $(xml).find("pregunta:eq(" + itemActual + ")").each(function () {
                    valor = $(this).find('solucion').text();
                });
            }
        });
        return valor;
    }

    function getFeedback(itemActual, tipo) {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                $(xml).find("pregunta:eq(" + itemActual + ")").each(function () {
                    if (tipo=="ok"){
                        valor = $(this).find('feedback_ok').text();
                    }
                    if (tipo == "ko") {
                        valor = $(this).find('feedback_ko').text();
                    }
                });
            }
        });
        return valor;
    }

    function getNotaMinima() {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = $(xml).find('notaMinima').text();
            }
        });
        return valor;
    }


    function getFeedbackAprobado() {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = $(xml).find('feedbackAprobado').text();
            }
        });
        return valor;
    }



    function getFeedbackSuspenso() {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = $(xml).find('feedbackSuspenso').text();
            }
        });
        return valor;
    }

    function getMensajeInicial() {
        var valor = null;
        $.ajax({
            url: pathDatos,
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function (xml) {
                valor = $(xml).find('mensajeInicial').text();
            }
        });
        return valor;
    }


});