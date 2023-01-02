/*******
JLCO|06.05.2010> construccion del array del indice de contenidos del SCO
arrayIndice[q][0]: ID del elemento en el indice
arrayIndice[q][1]: ID del padre al que pertenece el elemento del indice
arrayIndice[q][2]: texto que aparecera en el elemento del indice
arrayIndice[q][3]: nombre del archivo de contenidos del elemento en el indice de contenidos
*******/
 
var _tituloCurso = 'Global Exchange';
var arrayIndice = new Array();
arrayIndice[0] = new Array(0, -1, ' ', 'null.htm');
arrayIndice[1] = new Array(	1, 	0, 	'Portada', 	'10618.htm');

//Primera página
//arrayIndice[1] = new Array(	1, 	0, 	'Portada', 	'10549.htm');
