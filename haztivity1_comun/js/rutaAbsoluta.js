 var fileJquery = rutaAbsoluta + "lib/jquery.min.js";
 var callback = null;


 incluirJquery(fileJquery, callback);

 function incluirJquery(url, callback) {
     var script = document.createElement("script");
     script.type = "text/javascript";
     script.setAttribute("id", "urlJquery");
     script.setAttribute("src", url);
     if (script.readyState) { //IE
         script.onreadystatechange = function() {
             if (script.readyState == "loaded" || script.readyState == "complete") {
                 script.onreadystatechange = null;
                 //callback();
                 jQuery.getScript(rutaAbsoluta + 'js/cabeceraIndex.js').success(function() {
                     pintarHead();
                 });
             }
         };
     } else { //Others
         script.onload = function() {
             //callback();
             jQuery.getScript(rutaAbsoluta + 'js/cabeceraIndex.js').success(function() {
                 pintarHead();
             });
         };
     }
     script.src = url;
     document.getElementsByTagName("head")[0].appendChild(script);
 }