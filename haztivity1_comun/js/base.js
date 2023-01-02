var oPantalla = {

    avanceSiguientePantalla: false,
    gplantilla: "estatica",
    idPantalla: nombrePagina,
    usu: 'anonimo',
    nombreUsuario: 'anonimo',
    key: idCurso + '.' + idSCO + '.' + nombrePagina,
    idDomain: idDomain,
    dateTime2: null,
    from: '2016-01-01',
    misDatos: {
        "respuestas": "",
        "aciertos": "",
        "aprobado": false
    },

    allMisDatos: [],
    pintarSolucion: false,

    init: function() {
        //this.getUsu();
        this.cargarPlantilla();
        this.setBotonAvance();
        this.setBotones();

    },

    getUsu: function() {
        var usu = window.parent.doLMSGetValue("cmi.core.student_id");

        if (usu == "") {
            usu = "anonimo";
        }
        this.usu = usu;

        var nombreUsuario = window.parent.doLMSGetValue("cmi.core.student_name");
        if (nombreUsuario == "") {
            nombreUsuario = "anonimo";
        }
        this.nombreUsuario = nombreUsuario;
    },

    cargarPlantilla: function() {
        //Carga el archivo parámetros en el que se almacena la plantilla a usar y otros parámetros.
        var that = this;
        var gplantilla = "estatica";
        $.ajax({
            url: rutaSco + "pag" + that.idPantalla + "/parametros.xml?version=" + Date.now(),
            type: 'get',
            dataType: 'xml',
            async: false,
            success: function(xml) {
                $(xml).find("parametros").each(function() {
                    that.gplantilla = $(this).find('plantilla').text();
                    that.cargarCssJsDinamico();
                });
            }
        });

    },

    cargarCssJsDinamico: function() {
        //Incluye los archivos css y js dinámicamente
        var that = this;
        var gplantilla = that.gplantilla;
        //Importamos el css y js general de la actividad
        if (gplantilla != "ninguna") {
            //Cargamos el css de la plantilla
            var cssPlantilla = jQuery("<link>");
            cssPlantilla.attr({
                rel: "stylesheet",
                type: "text/css",
                href: rutaAbsoluta + "recursos/" + gplantilla + "/plantilla.css?version=" + Date.now()
            });

            $('link#estilo_plantilla').attr('href', '' + rutaAbsoluta + 'recursos/' + gplantilla + '/plantilla.css?version=' + Date.now());


            //Cargamos el css de la actividad
            var cssActividad = jQuery("<link>");
            cssActividad.attr({
                rel: "stylesheet",
                type: "text/css",
                href: rutaSco + 'pag' + that.idPantalla + '/actividad.css?version=' + Date.now()
            });

            $('link#estilo_actividad').attr('href', '' + rutaSco + 'pag' + that.idPantalla + '/actividad.css?version=' + Date.now());


        }


        if (gplantilla != "ninguna") {
            console.log("gplantilla", gplantilla);
            //Cargamos el js de la plantilla y luego el de la actividad
            $.getScript(rutaAbsoluta + 'recursos/' + gplantilla + '/plantilla.js?version=' + Date.now()).success(function() {
                $.getScript(rutaSco + 'pag' + that.idPantalla + '/actividad.js?version=' + Date.now()).success(function() {
                    window.parent.document.getElementById('btnSig').src = "../img/btnSgte.png";
                    window.parent.document.getElementById('btnAtras').src = "../img/btnAtras.png";
                });
            });
        }


    },

    getIdioma: function() {
        return window.parent.document.getElementById('idioma').innerHTML;
    },

    setBotonAvance: function() {
        var that = this;
        //Si la pagina siguiente ya se ha visitado, nos deja avanzar

        if (parent.paginaSiguienteVisitada() == 1) {
            that.avanceSiguientePantalla = true;
            window.parent.document.getElementById('btnSig').style.display = 'block';
        }


        if (that.avanceSiguientePantalla) {
            that.pintarSolucion = true;
            window.parent.document.getElementById('btnSig').style.display = 'block';
        } else {
            window.parent.document.getElementById('btnSig').style.display = 'none';
        }


    },

    mostrarBotonAvance: function() {
        window.parent.document.getElementById('btnSig').style.display = 'block';
    },

    isiPad: function() {
        //Nos indica si el usuario está usando un IPAD
        var ua = navigator.userAgent.toLowerCase();
        var bisiPad = ua.indexOf("ipad") > -1;
        return bisiPad;
    },

    setBotones: function() {
        var that = this;

        var plantilas = ["sopadeletras", "dragdropna1", "unirExpresion"];

        if (that.gplantilla == "diagnostico") {
            //that.obtenerDato();
        }


        if (plantilas.indexOf(that.gplantilla) != -1) {

            //Solamente si tiene plantilla de datos se comprueban los datos
            //this.obtenerDato();
            window.parent.document.getElementById('btnSig').style.display = 'block';

            var botonera = '<div id="botonera">';
            //botonera = botonera + '<div id="numIntentos"    data-toggle="tooltip" title="N&uacute;mero de intentos"> </div>';
            botonera = botonera + '<div id="btnCheck" class="glyphicon glyphicon-ok-circle" data-toggle="tooltip" title="Corregir el ejercicio"></div>';
            botonera = botonera + '<div id="btnClear"  class="glyphicon glyphicon-refresh" data-toggle="tooltip" title="Volver a realizar el ejercicio"></div>';
            botonera = botonera + '<div id="btnSolucion" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" title="Mostrar la soluci&oacute;n del ejercicio"></div>';
            botonera = botonera + '</div>';

            $('#div_main').after(botonera);


            var key = '<div id="divKey" style="display:none;"><div id="close"  class="glyphicon glyphicon-remove-circle"></div><div id="keyAviso">Intenta completar el ejercicio en primer lugar.</div></div>';
            $('#div_main').after(key);


            $('[data-toggle="tooltip"]').tooltip();

        }


        $('#btnCheck').click(function() {

            if (respuestaCompletada() == 1) {
                check();
                estadoCheck = 1;
                //Si la respuesta es correcta se deja que avance
                if (that.evaluaAprobado() == true) {
                    window.parent.document.getElementById('btnSig').style.display = 'block';
                }

                that.guardarDato();
            } else {
                that.showAvisoCumplimentar();
            }
        });

        $('#btnClear').click(function() {
            clear();
        });

        $('#btnSolucion').click(function() {

            if (respuestaCompletada() == 1) {
                $('#div_main').after('<div id="divSolucion" title="Respuesta Correcta"><div id="closeSolucion"  class="glyphicon glyphicon-remove-circle"></div><div class="imgSolucion"><img src="pag' + that.idPantalla + '/solucion.png"/></div></div>');
                $('#divSolucion').show();
                $('#divSolucion').draggable({ containment: "body" });
                $('#closeSolucion').click(function() {
                    $('#divSolucion').fadeOut();
                });
            } else {
                that.showAvisoCumplimentar();
            }

        });

    },

    showAvisoCumplimentar: function() {

        $('#divKey').show();
        $('#divKey').draggable({ containment: "body" });
        $('#close').click(function() {
            $('#divKey').fadeOut();
        });

    },

    evaluaAprobado: function() {
        var aciertos = calcularAciertos().split('/');
        var aprobado = false;
        if (aciertos[0] == aciertos[1]) {
            aprobado = true;
        } else {
            aprobado = false;
        }
        return aprobado;
    },

    //Funciones de datos

    guardarDato: function() {
        var that = this;

        var misDatos = {
            "respuestas": calcularRespuestas(),
            "aciertos": calcularAciertos(),
            "aprobado": that.evaluaAprobado()
        }

        var datos = JSON.stringify({ idDomain: that.idDomain, entity: that.usu, key: that.key, multiple: true, value: JSON.stringify(misDatos) });

        var urlAccion = urlAPI + 'api/functions/post';
        $.ajax({
            data: datos,
            url: urlAccion,
            type: "POST",
            contentType: 'application/json',
            success: function(data) {},
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error en cargarDato: " + textStatus);
            }
        });
    },

    obtenerDato: function() {

        console.info("entro en obtenerDato");
        $("#div_main").append("<div style='margin:200px;' id='cargandoHaztivity'>Comprobando la base de datos. Esta operación puede tardar unos segundos... <img src='../img/processing.gif'/><p>Si la pantalla no se carga, haz clic en el botón de actualizar: </p><p> <img src='http://www.campusblended.com/mods/scorm/cursos/203/scorm/img/recargar.png'/></p></h1>");
        var that = this;
        console.log("gplantilla", that.gplantilla);
        if (that.gplantilla) {
            var urlAccion = urlAPI + 'api/functions/get/' + idDomain + '/' + that.usu + '/' + that.key;
            console.log("urlAccion", urlAccion);
            $.ajax({
                url: urlAccion,
                type: "GET",
                dataType: 'json',
                success: function(data) {
                    console.log("data obtenerDato", data);

                    if (data.length > 0) {
                        console.log("hay datos");
                        that.dateTime2 = data[0].dateTime2;
                        that.misDatos = JSON.parse(data[0].value);

                        if (that.gplantilla == "diagnostico") {
                            console.log("es diagnostico");
                            initPlantilla();
                        } else {
                            that.obtenerDatos();
                        }


                    } else {
                        console.log("no hay datos");
                        setTimeout(initPlantilla(), 5000);
                    }

                    $("#cargandoHaztivity").remove();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    setTimeout(initPlantilla(), 5000);
                    that.setBotonAvance();
                    $("#cargandoHaztivity").remove();
                    console.log("error en obtenerDato: " + textStatus);

                }
            });
        }
    },

    obtenerDatos: function() {
        var that = this;
        var urlAccion = urlAPI + 'api/functions/get/' + idDomain + '/' + that.usu + '/' + that.key + '/' + that.from;
        $.ajax({
            url: urlAccion,
            type: "GET",
            dataType: 'json',
            success: function(data) {
                if (data.length > 0) {
                    for (var d = 0; d < data.length; d++) {
                        that.allMisDatos.push(JSON.parse(data[d].value));
                    }
                }

                setTimeout(initPlantilla(), 5000);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error en obtenerDato: " + textStatus);

            }
        });
    },

    deleteRegistro: function() {
        //Para borrar teclear Alt+A
        var that = this;
        alert('Registro eliminado. Actualiza la página');

        var urlAPI = 'https://haztivity.davinchi.es/api/functions/delete';
        var datos = {
            "idDomain": idDomain,
            "entity": that.usu,
            "key": that.key,
            "dateTime": that.dateTime2 // "2016-06-03T19:48:11.0800000",
        }

        $.ajax({
            url: urlAPI,
            type: "DELETE",
            dataType: 'json',
            data: datos,
            success: function(data) {
                console.log('Datos eliminados');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("error en obtenerDato: " + textStatus);

            }
        });
    }

}



$(function() {
    jQuery.support.cors = true;
    oPantalla.init();

    /*
        //Elimina los datos del registro actual con la combinación de comandos Alt+a
        $.getScript("https://rawgit.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js", function(data, textStatus, jqxhr) {
            $(document).bind('keydown', 'Alt+a', function() {
                console.log("Llamada a eliminar registro");
                elimniarRegistro();
            });
        });
    */

});




/*******************************************************/
//Estos metodos no son compatibles con IE8 por lo que los definimos aquí
/*******************************************************/

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */ ) {
        "use strict";

        if (this == null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}



//@ sourceURL=dynamicScript.js

/*******************************************/