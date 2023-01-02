var HAZTIVITY = {};

HAZTIVITY.cartas = {
    idioma: idioma,
    idSCO: idSCO,
    nombrePagina: nombrePagina,
    avanceSiguientePantalla: false,
    numeroFichas: 0,
    posInicialTop: 260,
    fichas: [],

    init: function () {
        this.cargarFichas();

    },


    cargarFichas: function () {
        var that = this;
        var left = 50;
        $.get("pag" + nombrePagina + "/contenido.html", function (data) {
            $("#div_main").append(data);

            that.numeroFichas = parseInt($("#fichas li").size());
            $("#fichas li").addClass('fichaPeque');


            for (i = 0; i < that.numeroFichas; i++) {

                $("#fichas li").eq(i).css('left', left);
                $("#fichas li").eq(i).css('top', that.posInicialTop);
                $("#fichas li").eq(i).append('<div class="cerrar"><span class="glyphicon glyphicon-remove-circle"></span></div>');
                
 
                that.fichas.push({
                    idFicha: i,
                    vista: false,
                    clickable: false,
                    posLeftInicial: $("#fichas li").eq(i).css('left'),
                    posTopInicial: that.posInicialTop,
                    heightAbierto:200
                });
                left = left + 170;
                //console.log(that.fichas[i].posLeftInicial + '-' + that.fichas[i].posTopInicial);
            }
            that.fichas[4].heightAbierto=300;
            that.fichas[0].clickable = true;
            that.eventos();
        });


    },

    lanzar: function (idActual) {

        var that = this;
        if (that.fichas[idActual].clickable) {
            that.mostrarSlide(idActual);
        }
    },


    cerrarFicha: function (idActual) {
        var that = this;
        $('.cerrar').hide();
        var idSiguiente = idActual + 1;
        console.log(that.fichas[idActual].posLeftInicial + '-' + that.fichas[idActual].posTopInicial);
        $('#fichas li').eq(idActual).removeClass('parpadeo').removeClass('fichaActual').removeClass('fichaTransicion');
        $('#fichas li').eq(idActual).animate({
            top: that.fichas[idActual].posTopInicial,
            left: that.fichas[idActual].posLeftInicial,
            height: "150px",
            width: "100px",
            paddingTop: '10px'
        }, 1000, function () {
            //that.girar($('#fichas li').eq(idActual));
            if (!$('#fichas li').eq(idActual).hasClass('fichaVista')) {
                $('#fichas li').eq(idSiguiente).addClass('parpadeo');
            }
            $('#fichas li').eq(idActual).addClass('fichaVista').removeClass('fichaPeque');
            if (idSiguiente < that.numeroFichas) {
                that.fichas[idSiguiente].clickable = true;
            }
            if (idActual == that.numeroFichas-1) {
            
            window.parent.document.getElementById('btnSig').style.display = 'block';
        }
            
        });

    },


    mostrarSlide: function (idActual) {
        var that = this;
        $('#fichas li').eq(idActual).removeClass('parpadeo').removeClass('fichaVista').addClass('fichaPeque').css('color', '#000');

        $('#fichas li').eq(idActual).addClass('fichaTransicion').animate({
            height: that.fichas[idActual].heightAbierto+"px",
            width: "400px",
            top: "100px",
            left: "250px",
            paddingTop:'50px'
        }, 1000, function () {
           // that.girar($('#fichas li').eq(idActual));

            $('#fichas li').eq(idActual).addClass('animated rotateIn');

            setTimeout(function () {
                $('#fichas li').eq(idActual).addClass('fichaActual');
                $('#fichas li:eq('+idActual+') > .cerrar').show();
            }, 500);
            //that.setBotonAvance();
        });
    },


    eventos: function () {
        var that = this;

        $(document).on('click', '.parpadeo, .fichaVista', function () {
            var idActual = $(this).index();
            that.lanzar(idActual);
        });

        $(document).on('click', '.fichaActual', function () {
            var idActual = $(this).index();
            that.cerrarFicha(idActual);
        });

        $('#fichas li').addClass('animated bounceInLeft');
    },

    girar: function (elemento) {
        $(elemento).animate({ borderSpacing: -360 }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 'slow'
        }, 'linear');

    }


}

$(function () {
    HAZTIVITY.cartas.init();
});


