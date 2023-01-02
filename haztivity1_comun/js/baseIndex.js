$(function() {

    //************************************************************//
    // BOTONES DE NAVEGACION

    //Carga la barra inferior de navegaciOn
    $.get(rutaCurso + "html/barraNavegacion.html?version=" + Date.now(), function(data) {
        $("#barraNavegacion").append(data);
    });


    //Activa el tooltip
    $('.tipsy').tipsy({ gravity: 's' });

    //Esconde el botOn siguiente
    $('#btnSig').hide();

    //Muestra el botOn de abrir Indice
    $('#abrirIndicie').fadeIn();

    //Cierra el Indice al cargar la pAgina
    $('#lateral_izq').hide();

    //********** Eventos

    //Al hacer clic en cerra Indice
    $('#cerrarIndicie').click(function() {
        $('#lateral_izq').hide('slow');
        $('#abrirIndicie').fadeIn('slow');
    });

    //indice lateral
    $('#divIndiceLateral').load(rutaCurso + "html/indiceLateral.html");




    $(document).on('click', '#glosario', function() {
        $('#popGlosario').dialog({
            width: 720,
            height: 520
        });
    });

});


function getEtiqueta(etiqueta, idioma) {
    var texto = "";
    $.ajax({
        url: '../xml/config.xml',
        type: 'get',
        dataType: 'xml',
        async: false,
        success: function(xml) {
            $(xml).find('texto[id="' + etiqueta + '"]').each(function() {
                texto = $(this).find(idioma).text();
            })
        }
    });
    return texto;
}