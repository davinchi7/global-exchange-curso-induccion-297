/********************************/



function negrita() {
    document.execCommand('bold', false, null);
}

function italic() {
    document.execCommand('italic', false, null);
}

$(function () {
    /*
        $.getScript(rutaAbsoluta + 'js/shortcut.js').success(function () {
            iniciarAtajosTeclado();
        })
        */
})


$(document).bind("mouseup", function () {
    getSelText();
});

function getSelText() {
    var txt = '';
    if (window.getSelection) {
        txt = window.getSelection();
    }
    else if (document.getSelection) {
        txt = document.getSelection();
    }
    else if (document.selection) {
        txt = document.selection.createRange().text;
    }
    else return;

    if (txt.toString().length > 0) {
        window.parent.$('#textoSeleccionado').html(txt.toString());
    }

}

function iniciarAtajosTeclado() {
    shortcut.add("Ctrl+1+1", function () {
        maquetarDiv();
    });
    shortcut.add("Ctrl+1+2", function () {
        $('#actividad').after(respuestasAlmacenadas);
    });
}



function maquetarDiv() {


    $('body div').removeClass('marcar');

    $('#consola').remove();

    //Creamos el div de la consola	
    //$('body').after('<div id="consola" class="consola">Consola</div>');

    //anadimos la clase marcar para resaltar los elementos
    $('body  div, body').addClass('marcar');
    $('.intTexto').removeClass('marcar');

    $('body').addClass('marcarActividad');

    if ($('body').length) {

    } else {
        alert('Debes crear el div body.\n Créalo dentro de <div id="div_main"> [ Aquí ] </div>\n <div id="body"></div>');
    }


    $('body div').each(function () {
        if ($(this).css('clear') == "both") { $(this).removeClass = 'marcar'; }
    });

    //Mover y redimensionar
    $('#div_main div').draggable({
        // Find position where image is dropped.
        drag: function (event, ui) {
            getDatosDIV($(this));
        }
    }).resizable({

        resize: function (event, ui) {
            getDatosDIV($(this));
        }
    });



    $('#div_main div').click(function () {
        var elemento = $(this);
        if (elemento.attr('id') != undefined) {
            getDatosDIV(elemento);
        }
    });
    $(".intTexto").draggable("destroy");
    $(".intTexto").resizable("destroy");

}

function getDatosDIV(elemento) {
    var classes = elemento.attr('class').replace('ui-draggable', '').replace('ui-draggable-dragging', '').replace('marcar', '').replace('ui-resizable', '').replace('ui-resizable-resizing', '');
    var datos = "";
    //datos = datos + "ID: " + elemento.attr('id') + "<br>";
    //datos = datos + "Class: " + classes + "<br>";
    datos = datos + "<div id='param'>";
    datos = datos + "#" + elemento.attr('id') + "{<br>";
    datos = datos + "position: " + elemento.css('position') + ";<br>";
    datos = datos + "left: " + parseInt(elemento.css('left')) + "px;<br>";
    datos = datos + "top: " + parseInt(elemento.css('top')) + "px;<br>";
    datos = datos + "width: " + parseInt(elemento.css('width')) + "px;<br>";
    datos = datos + "height: " + parseInt(elemento.css('height')) + "px;<br>";
    //datos = datos + "background-color: " +  elemento.css('background-color')  + ";<br>";
    //datos = datos + "color: " +  elemento.css('color')  + ";<br>";
    //datos = datos + "background-position: " +  elemento.css('background-position')  + ";<br>";
    datos = datos + "}</div>";
    window.parent.document.getElementById('consola').innerHTML = datos;
    //$("#consola").html(datos);

}



$(function () {
    if (oPantalla.capitulo > 0) {
        var capitulo = oPantalla.capitulo;
        var subcapitulo = oPantalla.subcapitulo;
        $('#indiceLateral', window.parent.document).show();

        //borro las clases
        $('#indiceLateral ol li', window.parent.document).removeClass("cActivo");
        $('.sbc li', window.parent.document).removeClass("sbcLiActivo");
        $('.sbc li', window.parent.document).removeClass("sbcActivo");
        $('.sbc li', window.parent.document).hide();

        //pinto las clases
        $('#c' + capitulo, window.parent.document).addClass("cActivo");
        $('#sbc' + capitulo + '  li', window.parent.document).show();
        $('#sbc' + capitulo + ' li', window.parent.document).addClass("sbcLiActivo");
        $('#sbc' + capitulo + subcapitulo, window.parent.document).addClass("sbcActivo");

    } else {
        $('#indiceLateral', window.parent.document).hide();
    }
});

