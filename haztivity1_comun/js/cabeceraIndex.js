function pintarHead() {

    jQuery.getScript(rutaAbsoluta + 'lib/jquery-ui/jquery-ui.min.js').success(function() {
        jQuery.getScript(rutaAbsoluta + 'lib/bootstrap/js/bootstrap.min.js').success(function() {
            jQuery.getScript(rutaAbsoluta + 'lib/tipsy/jquery.tipsy.js').success(function() {
                jQuery.getScript(rutaAbsoluta + '/js/baseIndex.js').success(function() {
                    jQuery.getScript(rutaAbsoluta + 'lib/dtree/dtree.min.js').success(function() {
                        jQuery.getScript(rutaAbsoluta + 'js/funciones.concentrado.js').success(function() {
                            jQuery.getScript(rutaAbsoluta + 'js/LMS_SCOFunctions.js').success(function() {
                                jQuery.getScript(rutaAbsoluta + 'js/APIWrapper.js').success(function() {
                                    jQuery.getScript(rutaCurso + 'sco' + idSCO + '/_listaIndice_' + idioma + '.js').success(function() {
                                        jQuery.getScript(rutaCurso + 'sco' + idSCO + '/_listaPaginas.js').success(function() {

                                            iniciaComunicacion();
                                            jQuery.getScript(rutaAbsoluta + 'js/etiquetasNavegacion.js').success(function() {

                                                $('#cargando').fadeOut('slow');
                                                $('#contenedor').show();
                                                $('#idioma').html(idioma);

                                                /*
                                                if ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))) {
                                                    function resize() {
                                                        var width;
                                                        if ((/iphone|ipad/i.test(navigator.userAgent.toLowerCase()))) {
                                                            //ios gives wrong width inside the iframe
                                                            width = $(window.parent.document.body).find("#scorm_object").parent().width();
                                                        } else {
                                                            width = document.body.clientWidth;
                                                        }
                                                        var scale = width / 950;
                                                        $("#contenedor").css({
                                                            "transform": "scale(" + scale + ")",
                                                            "transform-origin": "left top",
                                                            "overflow": "auto"
                                                        });
                                                    }
                                                    window.addEventListener("orientationchange", function() {
                                                        setTimeout(function() {
                                                            resize();
                                                            $("body").css("width", "99%");
                                                            setTimeout(function() {
                                                                $("body").css("width", "100%");
                                                            }, 200);
                                                        }, 200);
                                                    });
                                                    resize();
                                                } else {
                                                     
                                                    $('#contenedor').css({
                                                        'position': 'absolute',
                                                        'left': '50%',
                                                        'top': '50%',
                                                        'margin-left': -$('#contenedor').outerWidth() / 2,
                                                        'margin-top': -$('#contenedor').outerHeight() / 2
                                                    });
                                                     
                                                }
                                                 */
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    $('link#estilo_index').attr('href', '' + rutaAbsoluta + '/css/index.css');
    $('link#estilo_dtree').attr('href', '' + rutaAbsoluta + '/lib/dtree/dtree.css');
    $('link#estilo_tipsy').attr('href', '' + rutaAbsoluta + '/lib/tipsy/tipsy.css');
    $('link#estilo_jquery').attr('href', '' + rutaAbsoluta + '/lib/jquery-ui/jquery-ui.theme.min.css');

    //Carga la imagen de cabecera
    var urlImgCabecera = '../sco' + idSCO + '/img/imgCabecera.png';
    $('#cabecera').css({ 'background-image': 'url(' + urlImgCabecera + ')', 'background-repeat': 'no-repeat' });
}
//@ sourceURL=app/js/myapp.js