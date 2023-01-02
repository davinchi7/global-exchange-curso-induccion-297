
function pintarHead() {
    var idioma = window.parent.document.getElementById('idioma').innerHTML;
    $('body').after('<div id="cargando" style="position:absolute; top:0px; left:0px; z-index:10;opacity:0.7; width:100%; height:600px; background-color:#000; color:#fff;font-size:30px; text-align:center; padding-top:200px;"><img style="margin:50px;" src="../img/loading.gif" /><p>' + getEtiqueta("cargando", idioma) + '</p> </div>')
    jQuery.getScript(rutaAbsoluta + 'lib/jquery-ui/jquery-ui.min.js').success(function () {

        //Obtenemos el nombre de la página
        var pathAbsoluta = self.location.href;
        var posicionUltimaBarra = pathAbsoluta.lastIndexOf("/");
        var pathRelativa = pathAbsoluta.substring(posicionUltimaBarra + "/".length, pathAbsoluta.length);
        nombrePagina = pathRelativa.replace('.htm', '');

        //Obtenemos el ID del SCO
        var url1 = pathAbsoluta.replace("/" + pathRelativa, '');
        var barrSco = url1.lastIndexOf("/");
        var url2 = pathAbsoluta.substring(barrSco + "/".length, url1.length);
        var idSCO = url2.replace('sco', '');

        jQuery.getScript(rutaAbsoluta + 'lib/bootstrap/js/bootstrap.min.js').success(function () {
            jQuery.getScript(rutaAbsoluta + 'js/APIHaztivity.js').success(function () {
                    jQuery.getScript(rutaAbsoluta + 'js/base.js').success(function () {
                        $('#cargando').fadeOut('slow');
                        jQuery.getScript(rutaAbsoluta + 'js/editorPantalla.js').success(function () { });
                    });
                });
            });
        });

    $('link#estilo_contenidos').attr('href', '' + rutaAbsoluta + 'css/contenidos.css');
    $('link#estilo_base').attr('href', '' + rutaAbsoluta + 'css/base.css');
    $('link#estilo_jquery2').attr('href', '' + rutaAbsoluta + 'lib/jquery-ui/jquery-ui.theme.min.css');


}

function getEtiqueta(etiqueta, idioma) {
    var texto = "";
    $.ajax(
    {
        url: '../xml/config.xml',
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function (xml) {
            $(xml).find('texto[id="' + etiqueta + '"]').each(function () {
                texto = $(this).find(idioma).text();
            })
        }
    });
    return texto;
}




