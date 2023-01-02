
var HAZTIVITY = {};

HAZTIVITY.portadaCapitulo = {

    puntoActual: 1,
    delai: 1000,
    incremento: 500,
    altoDiv: 42,
    top: 143,

    init: function (puntoActual) {
        this.puntoActual = puntoActual;
        this.inicializar();
    },

    inicializar: function () {
        var that = this;
        
        var url = "../haztivity1_comun/recursos/portadaCapitulo/plantilla" + idSCO + ".html";
        //Cargamos el contenido de contenido.html
        $.get(url, function (data) {
            $("#div_main").append(data);

            $('#imagen').css('opacity', 0);
            $('.txt_puntos').css('opacity', 0);
            that.montarEscena();
         });

 
    },

    montarEscena: function () {
        that = this;

        $('#imagen').delay(200).animate({ opacity: 1 }, 1500, "swing");

        for (var i = 1; i < 8; i++) {
            $('#punto' + i).delay(that.delai).animate({ 'padding-left': "+=30", opacity: 1 }, 1000, "swing");
            that.delai = that.delai + that.incremento;
        }

        var texto = $('#punto' + that.puntoActual).html();

        var estetop = that.top + (that.puntoActual * that.altoDiv);

        $('.txt_puntos_destacado').html(texto);
        $('.textos_indice_destacado').css('top', estetop + 'px');

        setTimeout(function () {
            $('.textos_indice_destacado').css('width', 500);
            window.parent.document.getElementById('btnSig').style.display = 'block';
        }, that.delai);

    }
}