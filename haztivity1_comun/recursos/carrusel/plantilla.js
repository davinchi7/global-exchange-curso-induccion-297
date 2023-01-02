var HAZTIVITY = {};

HAZTIVITY.carrusel = {
    idioma: idioma,
    idSCO: idSCO,
    nombrePagina: nombrePagina,
    numeroSlides: 0,
    idActivo: 0,
    colorVisto: '#00ccff',
    avanceSiguientePantalla: false,
    slides: [],

    init: function () {
   
        this.cargarSlides();
        this.eventos();
    },

    cargarSlides: function () {
        var that = this;
        

        $.get("pag" + nombrePagina + "/contenido.html", function (data) {
            $("#div_main").append(data);
            that.numeroSlides = parseInt($("#carrusel li").size());
            for (i = 0; i < that.numeroSlides; i++) {
                that.slides.push({
                    idSlide: i,
                    visto: false,
                    clickable: false
                });
            }
            that.slides[0].visto = true;
            that.slides[0].clickable = true;
            that.slides[1].clickable = true;
            that.pintarNavegacion();
        })


    },


    pintarNavegacion: function () {
        var that = this;
        var navegacion = '<ul id="navegacion">';
        for (i = 0; i < this.numeroSlides; i++) {
            navegacion = navegacion + "<li></li>"
        }
        $('#div_main').append(navegacion);

        //Pintamos la carcasa del carrusel y luego lanzamos el primer slide
        $('#carcasa').show('slide', function () {
            that.lanzar(0);
        });
    },

    lanzar: function (id) {
        var that = this;
        if (that.slides[id].clickable) {
            that.navegar(id);
            that.mostrarSlide(id);
        }
    },

    estaClickable: function (id) {
        var that = this;
        if ($('#carrusel li').eq(id).hasClass('numVisto') || $('#carrusel li').eq(id).hasClass('numActivo') || id == 0) {
            that.slides[1].clickable = true;
        }
     
    },

    mostrarSlide: function (idActivo) {
        var that = this;
        $('#carrusel li').hide();

        $('#carrusel li').eq(idActivo).show('fade', 2000, function () {
            that.setBotonAvance();
        });
    },

    navegar: function (idActivo) {
        var that = this;
        var idSiguiente = idActivo + 1;
        that.slides[idActivo].clickable = true;
        that.slides[idActivo].visto = true;

        if (idSiguiente < that.slides.length) {
            that.slides[idSiguiente].clickable = true;
        }
        $('#navegacion li').removeClass('parpadeo').removeClass('numActivo');
        $('#navegacion li').eq(idActivo).addClass('numVisto').addClass('numActivo');
        $('#navegacion li').eq(idSiguiente).addClass('parpadeo');

        that.comprobarLeidos();
    },

    comprobarLeidos: function () {
        var that = this;
        var contador = 0;
        var total = that.numeroSlides;

        for (i = 0; i < total; i++) {
            if (that.slides[i].visto) {
                contador = contador + 1;
            }
        }

        if (contador == total) {
            that.avanceSiguientePantalla = true;
        }



    },
    eventos: function () {
        var that = this;
        $(document).on('click', '#navegacion li', function () {
            var id = $(this).index();
            that.lanzar(id);
        });
    },

    setBotonAvance: function () {
        if (this.avanceSiguientePantalla) {
            window.parent.document.getElementById('btnSig').style.display = 'block';

        } else {
            window.parent.document.getElementById('btnSig').style.display = 'none';
        }
    }


}

$(function () {
    HAZTIVITY.carrusel.init();
});







