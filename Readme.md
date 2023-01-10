# Documentación
El curso SCORM en este modelo que llamamos haztivity1 se organiza de la siguiente manera. Existen carpetas con elementos comunes y otras con los elementos del contenido del curso.

## haztivity1_comun
En esta carpeta se almacena los archivos comunes del curso en relación a la lógica del comportamiento del mismo.
Las carpetas son:

- **css**: css con las clases de los elementos genéricos o de la carcasa del curso.
- **js**: archivos js con el comportamiento del cuso, sobre todo lo reference al comportamiento genérico y la interacción con el api scorm.
- **lib**: librerías del curso.
- **recursos**: plantillas, widgets o componentes para utilizar en las pantallas del curso.

## sco[identificador del sco]
En esta carpeta se guardan el contenido de las la páginas. El ID del sco se establece en la herramienta de autor de la intranet FINSI.
Dentro de la carpeta están las páginas y por cadda página hay una carpeta con los archivos de dicha página.

Ejemplo:
- 6054.htm > archivo html de la pantalla
- pag6054 > carperta con los archivos necesarios para la pantalla. eL Aspecto del archivo htm de la página es el siguiente.

```html
<html>
<head>
    <title>TITLE</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <script src="../js/config.js"></script>
    <script src="../haztivity1_comun/js/rutaAbsolutaPantalla.js"></script>

    <link rel="stylesheet" href="../haztivity1_comun/lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../haztivity1_comun/lib/bootstrap/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="../haztivity1_comun/lib/animate/animate.css">
  
    <link rel="stylesheet" type="text/css" id="estilo_contenidos" />
    <link rel="stylesheet" type="text/css" id="estilo_base" />
    <link rel="stylesheet" type="text/css" id="estilo_jquery2" />
    <link rel="stylesheet" type="text/css" id="estilo_plantilla" />
    <link rel="stylesheet" type="text/css" id="estilo_actividad" />
    <script src="../haztivity1_comun/js/modernizr.custom.30893.js"></script>

</head>
<body>
    <div id="div_main">
    </div>
</body>
</html>
```

 
## Índice del curso
El índice del curso y el orden de aparición de las pantallas se hace a partir de dos ficheros:
- _listaIndice.js
- _listaPaginas.js

En **_listaPaginas.js** aparecerá el listado de todas las páginas, una a una.

- arrayPaginas[q][0]: indica si es un elemento del indice de contenidos: 0=no, 1=si
- arrayPaginas[q][1]: nombre del archivo de contenidos (10521.htm)
- arrayPaginas[q][2]: ID del elemento en el indice de contenidos al que pertenece


```javascript
var arrayPaginas = new Array();
arrayPaginas[0] = new Array(1, 'null.htm', 0);
arrayPaginas[1] = new Array(1, '10521.htm', 1);
arrayPaginas[2] = new Array(1, '10522.htm', 2);
arrayPaginas[3] = new Array(1, '10523.htm', 3);
```

En **_listaIndice.js** es el que forma el índice que aparece visible en el curso para el alumno.

- arrayIndice[q][0]: ID del elemento en el indice
- arrayIndice[q][1]: ID del padre al que pertenece el elemento del indice
- arrayIndice[q][2]: texto que aparecera en el elemento del indice
- arrayIndice[q][3]: nombre del archivo de contenidos del elemento en el indice de contenidos


```javascript
var _tituloCurso = 'Gestión del tiempo';
var arrayIndice = new Array();
arrayIndice[0] = new Array(0, -1, ' ', 'null.htm');
arrayIndice[1] = new Array(1, 0, 'Portada', '10521.htm');
arrayIndice[2] = new Array(2, 0, 'Pr&oacute;logo', '10522.htm');
arrayIndice[3] = new Array(3, 0, '&Iacute;ndice', '10523.htm');
```

### Inicializar en una página
Si estamos trabajando en una página, y queremos que se cargue la primera, podemos cambiarlo en el archivo _listaPaginas y _listaIndice, poniendo como el primer elemento la página que queremos modificar.

Por ejemplo, si queremos que la primera pantalla sea 10523.html, cambiamos los dos archivos

```javascript

//en _listaPaginas modificamos el primer elmeno 
arrayPaginas[1] = new Array(1, '10523.htm', 1);


//en _listaIndice modificamos también el primer elmeno 
arrayIndice[1] = new Array(1, 0, 'Portada', '10523.htm');
 
```


## Estructura de pantallas
Cada pantalla tiene un archivo [idPantalla].htm con una carpeta pag[idPantalla]. Dentro de la carpeta hay varios archivos. 

- Un parametros.xml que indica el tipo de recurso que vamos a utilizar.
- contenido.html que es donde irá el código html, 
- así como actividad.css para los estilos 
- y actividad.js para los script de javascript. 

A partir de ahí podemos incluir cualquier archivo que queramos, bien sea un asset tipo imagen, vídeo, audio, pdf, etc., o bien una librería.

En el caso de una librería que se comparta en otros lugares, habría que incluirla en los directorios comunes, por encima de la carpeta del sco, dentro de haztiviti1_comun.

Igualmente los estilos, o recursos comunes habría que almacenarlos en el lugar raiz que sea común al resto. Si es común al SCO lo pondríamos dentro de sco[idSco] y si es común al curso en haztiviti1_comun.

## Avance entre pantallas
Cuando una pantalla se haya completado hay que activar la flecha de avance que se hará se la siguiente manera:
```javascript
 window.parent.document.getElementById('btnSig').style.display = 'block';
```

## Ubicación de la página actual
En la parte superior derecha de la página en modo visualización nos encontramos con el número de pantalla que estamos visualizando. Ej.: p.10549es
## Establecer página por defecto
De cara al desarrollo, para que la primera página que se cargue sea aquella con la que estamos trabajando, vamos a modificar los ficheros _listaIndice_es.js y _listaPaginas.js, estableciendo como primera página aquella que deseamos.

Para ello vamos a añadir a sendos ficheros la siguiente línea:
```javascript
//Primera página _listaIndice_es.js
arrayIndice[1] = new Array(	1, 	0, 	'Portada', 	'10549.htm');

//primera página _listaPaginas.js
arrayPaginas[1] = new Array(1,'10549.htm',1);
```
Iremos cambiando el nombre de la página por aquella en la que estamos trabajando.

Si queremos navegar normalmente hay que comentar dichas líneas o eliminarlas.

## Avanzar rápido entre páginas
Para avanzar rápido por las páginas sin tener que hacerlas, hacemos clic rápidamente sobre la palabra avance.

Si queremos ir a la pantalla que se llama 10554.html, ponemos en la url y hacemos clic en siguiente.
```javascript
_index.html?pag=10554
```

Si queremos ir a la pantalla que se encuentra en la posición cinco.
```javascript
_index.html?pagindex=4
```
Si queremos un comportamiento normal, quitamos el parámetro de la url.
