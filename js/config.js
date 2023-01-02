//Variables editables
//var urlAPI = "http://api.haztivity.com/";
var urlAPI = "https://haztivity.davinchi.es/"
var rutaComun = "../haztivity1_comun/";
var rutaAbsoluta = "../haztivity1_comun/";
var rutaCurso = "../";
var rutaSco = "";
var idCurso = 297;
var idSCO = getIdSCO();
var version = 1;
var idGrupo = 0;
var idDomain = 10;



//Variables del sistema
var ubicacion = window.location.hostname;
var entornoProduccion = true;
var entorno = "";

var idioma = "es";
//localStorage.clear();

var carpetaVideo = "videos/";
var carpetaAudio = "audio/";
var cfmultidioma = "N";

function getIdSCO() {
    var pathAbsoluta = self.location.href;
    var posicionUltimaBarra = pathAbsoluta.lastIndexOf("/");
    var pathRelativa = pathAbsoluta.substring(posicionUltimaBarra + "/".length, pathAbsoluta.length);
    var url1 = pathAbsoluta.replace("/" + pathRelativa, '');
    var barrSco = url1.lastIndexOf("/");
    var url2 = pathAbsoluta.substring(barrSco + "/".length, url1.length);
    var idSCO = url2.replace('sco', '');
    return idSCO;
}
