// JavaScript Document
function guardarDato(valor) {

    var aplicacionUsuario = getAplicacionUsuario();
    var aplicacionClave = getAplicacionClave();
    var usuario = getUsuario();
    var campo = idCurso + '|' + idSCO + '|' + nombrePagina; //idCurso|idScorm|idPantalla > "124|855|1216"

    datos = '&aplicacionUsuario=' + aplicacionUsuario + '&aplicacionClave=' + aplicacionClave + '&usuario=' + usuario + '&campo=' + campo + '&valor=' + valor;
    $.getJSON('http://www.enproyecto.com/haztivity/serviciosJSONP.svc/guardarDato?callback=?', datos, function (resultado) {
        //alert(resultado);
        $('#btnSave').effect("pulsate");
        $('textarea').effect("highlight", "slow");
    });
}

/*
function obtenerDatosCompletos(usuario, campo, fechaDesde, fechaHasta) {
    datos = '&aplicacionUsuario=finsiUsuario&aplicacionClave=1234&usuario=' + usuario + '&campo=' + campo + '&fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta;
    $.getJSON('http://www.enproyecto.com/haztivity/serviciosJSONP.svc/obtenerDatos?callback=?', datos, function (resultado) {
        alert(resultado[0].valor);
		return resultado[0].valor;
    });
}
*/
function obtenerDatosCompletos(usuario, campo, fechaDesde, fechaHasta) {
    var result;
    datos = '&aplicacionUsuario=finsiUsuario&aplicacionClave=1234&usuario=' + usuario + '&campo=' + campo + '&fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta;
    $.ajax(
    {
        url: 'http://www.enproyecto.com/haztivity/serviciosJSONP.svc/obtenerDatos?callback=?' + datos,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (resultado) {
            result = resultado[0].valor;
        }
    });

    return result;
}



function obtenerDatos(usuario, campo, fechaDesde, fechaHasta) {
    datos = '&aplicacionUsuario=finsiUsuario&aplicacionClave=1234&usuario=' + usuario + '&campo=' + campo + '&fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta;
    $.getJSON('http://www.enproyecto.com/haztivity/serviciosJSONP.svc/obtenerDatos?callback=?', datos, function (resultado) {
        //alert(resultado[0].valor);
    });
}

function getAplicacionUsuario() {
    var aplicacionUsuario = "finsiUsuario";
    return aplicacionUsuario;
}

function getAplicacionClave() {
    var aplicacionClave = "1234";
    return aplicacionClave;
}

function getUsuario() {
    var usuario = 172;// window.parent.document.getElementById('lblIdUsuario').innerHTML;
    return usuario;
}



