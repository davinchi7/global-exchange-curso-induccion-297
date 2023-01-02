 $(function(){
	 
     $.get("pag" + nombrePagina + "/contenido.html?version=" + Date.now(), function (data) {
  		$( "#div_main" ).append( data );
  		window.parent.document.getElementById('btnSig').style.display = 'none';
	});	
});

