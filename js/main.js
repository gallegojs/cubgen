var capacubo, capacodigo;
var columna, capa, led;
var encendidos;
var pelicula;
var s = 0;
var ml = 1000;
var divframes;
var codigo = "";
var plantas, cubo;
var tx;
var intervaloReproduccion;
$(function(){
  //Se inicializan las variables globales.
  //TODO: Cambiar nombres variables globales para dejar claro que lo son en el resto del codigo.
   tx = 0;
   cubo = [[22,23,24,25,26],[27,28,29,30,31],[32,33,34,35,36],[37,38,39,40,41],[42,43,44,45,46]];
   plantas = [8,9,10,11,12];
   pelicula = [];
   capacodigo = $("#code");
   capacubo = $("#cubo");
   divframes = $("#frames");

   //Genera la plantilla vacia de una pelicula.
   generarCubo();
   generarCodigoBase();

   //Asigna los eventos de la interfaz
   $('#generar').on('click', anadirFrame);
   $('.led').on('click', encender);
   $('#saveframe').on('click', guardarFrame);
   $('#play').on('click', reproducirPelicula);
   $('#pause').on('click', pausarPelicula);
   $('#stop').on('click', detenerPelicula);
   $('#next').on('click', siguienteFrame);
   $('#prev').on('click', anteriorFrame);
   $('.btn-mov').on('click', function(){
      moverFigura($(this).data("movimiento"));
   });
   $(".ejemplocod").on('click', cargarEjemplo);
});

//Carga un ejemplo de pelicula
var cargarEjemplo = function(){
   if(confirm("Este ejemplo sobreescribirá su trabajo actual...")){
      pelicula = ejemplos[$(this).data("ejemname")];
      generarCodigo();
      reproducirPelicula();
   }
}

//Mueve la figura actual en los ejes xyz del cubo.
var moverFigura = function(dir){
   leerFigura();
   var ce = encendidos.slice();
   if(dir == "up"){
      for(var i=0 in ce){
         if(ce[i][0]<=0){
            ce[i][0]=4;
         }else{
            ce[i][0]--;
         }
      }
   }else if(dir=="down"){
         for(var i=0 in ce){
            if(ce[i][0]>=4){
               ce[i][0]=0;
            }else{
               ce[i][0]++;
            }
         }
   }else if(dir=="left"){
      for(var i=0 in ce){
         if(ce[i][2]<=0){
            ce[i][2]=4;
         }else{
            ce[i][2]--;
         }
      }
   }else if(dir=="right"){
         for(var i=0 in ce){
            if(ce[i][2]>=4){
               ce[i][2]=0;
            }else{
               ce[i][2]++;
            }
         }
   }else if(dir=="front"){
      for(var i=0 in ce){
         if(ce[i][1]<=0){
            ce[i][1]=4;
         }else{
            ce[i][1]--;
         }
      }
   }else if(dir=="back"){
         for(var i=0 in ce){
            if(ce[i][1]>=4){
               ce[i][1]=0;
            }else{
               ce[i][1]++;
            }
         }
   }
   dibujarFigura(ce);
}

//carga el frame siguiente en la reproduccion.
var siguienteFrame = function(){
   tx++;
   tx = (pelicula.length<=tx) ? 0 : tx;
   cargarFrame(tx);
}

//carga el frame anterior en la reproduccion.
var anteriorFrame = function(){
   tx--;
   tx = (tx<0) ? pelicula.length-1 : tx;
   cargarFrame(tx);
}

//Pausa la reproduccion de la pelicula sin perder la posicion.
var pausarPelicula = function(){
   clearInterval(intervaloReproduccion);
   intervaloReproduccion = undefined;
}

//detiene la reproduccion llevandola al principio.
var detenerPelicula = function(){
   clearInterval(intervaloReproduccion);
   intervaloReproduccion = undefined;
   tx = pelicula.length-1;
   cargarFrame(tx);
}

//Reproduce la secuencia de frames actuales.
var reproducirPelicula = function(){
   if(intervaloReproduccion == undefined)
   intervaloReproduccion = setInterval(function(){
      if(pelicula.length==tx){
         tx=0;
      }
      tx = (pelicula.length<=tx) ? 0 : tx;
      cargarFrame(tx);
      tx++;
   }, 200);
}

//Enciende un led.
var encender = function(){
   $(this).toggleClass("encendido");
}

//Genera el cubo de leds del editor.
var generarCubo = function(){
   var x = 5, y = 5, z = 5;
   generarCapas(x,y,z);
}

//Genera las capas/plantas del editor.
var generarCapas = function(x, y, z){
   for(var i = 0; i<x; i++){
      capa = $('<div id="capa'+i+'" class="capa" style="z-index: '+ml+'"></div>');
      ml--;
      generarColumnas(y,z,i);
      s=0;
      capacubo.append(capa);
   }
}

//Genera las columnas en el editor
var generarColumnas = function(y,z,i){
   for(var j = 0; j<y; j++){
      columna = $('<div class="columna"></div>');
      generarLeds(z,i,j);
      capa.append(columna);
   }
}

//Genera los leds de una columna del editor.
var generarLeds = function(z,i,j){
   for(var t = 0; t<z; t++){
      s++;
      led = $('<div class="led">'+s+'</div>');
      led[0].posicion = [i, j, t];
      columna.append(led);
   }
}

//Añade una posicion encendida en el cubo.
var anadirEncendido = function(){
   encendidos.push($(this)[0].posicion.slice());
}

//Carga el frame pasado como parámetro y luego lo dibuja.
var cargarFrame = function(x){
   frameactual = x;
   var toon = pelicula[x];
   dibujarFigura(toon);
}

//Dibuja la figura de un frame pasado como parámetro.
var dibujarFigura = function(toon){
   $(".encendido").removeClass("encendido");
   for(var i in toon){
      $('.led').each(function(){
         if($(this)[0].posicion[0] == toon[i][0] && $(this)[0].posicion[1] == toon[i][1] && $(this)[0].posicion[2] == toon[i][2]){
            $(this).addClass("encendido");
         }
      });
   }
}

//Guarda los cambios en el frame seleccionado.
var guardarFrame = function(){
   leerFigura();
   pelicula[frameactual] = encendidos;
   generarCodigo();
}

//Añade la figura actual a la pelicula.
var anadirFrame = function(){
   leerFigura();
   pelicula.push(encendidos.slice());
   generarCodigo();
}

//Genera el codigo propio de la pelicula.
var generarPelicula = function(){
   var arraypelicula = "{";
   var tamaniomax = 0;
   for(var x=0 in pelicula){
      arraypelicula+="{ ";
      if(pelicula[x].length>tamaniomax){
         tamaniomax = pelicula[x].length;
      }
      for(var y=0 in pelicula[x]){
         arraypelicula+="{";
         for(var z=0 in pelicula[x][y]){
            arraypelicula+=pelicula[x][y][z]+",";
         }
         arraypelicula = arraypelicula.substring(0, arraypelicula.length-1);
         arraypelicula += "},";
      }
      arraypelicula = arraypelicula.substring(0, arraypelicula.length-1);
      arraypelicula += "},";
   }
   arraypelicula = arraypelicula.substring(0, arraypelicula.length-1);
   arraypelicula += "};";

   arraypelicula = "int tammax="+tamaniomax+";<br>int tampeli="+pelicula.length+"; int pelicula["+pelicula.length+"]["+tamaniomax+"][3] = "+arraypelicula;
   $("#film").html(arraypelicula);
}

//Lee la figura dibujada.
var leerFigura = function(){
   encendidos = [];
   $(".encendido").each(anadirEncendido);
}

//Recarga los frames tras un cambio en la pelicula.
var generarCodigo = function(){
   divframes.empty();
   for(var x=0 in pelicula){
      var framevisual = $('<div class="col-xs-2"><div class="framevisual">'+((x*1)+1)+'</div></div>');
      framevisual[0].indicePelicula = x;
      framevisual.on('click', function(){
         $(".framevisual").css("background-color", "transparent");
         $(this).find(".framevisual").css("background-color", "rgb(186, 243, 171)");
         cargarFrame($(this)[0].indicePelicula);
      });
      divframes.append(framevisual);
   }
   capacodigo.html(codigo);
   generarPelicula();
}
//Genera el html con el código base c++ "reproductor" de la pelicula.
var generarCodigoBase = function(){
   var arrayled = "int cubo[5][5] = {";

   for(var x=0 in cubo){
      arrayled+="{";
      for(var y=0 in cubo[x]){
         arrayled+=cubo[x][y]+",";
      }
      arrayled = arrayled.substring(0, arrayled.length-1);
      arrayled+="},";
   }

   arrayled = arrayled.substring(0, arrayled.length-1);
   arrayled += "};";

   codigo += arrayled;

   var arrayplantas = "<br>int plantas[] = {";
   for(var x=0 in plantas){
      arrayplantas += plantas[x]+",";
   }
   arrayplantas = arrayplantas.substring(0, arrayplantas.length-1)+"};";

   codigo += arrayplantas;
   codigo += "int frame;"
   codigo += "<br>void setup(){";
   codigo += "<br>";
   codigo += "frame = -1;<br>";

   for(var x=0 in cubo){
      for(var y=0 in cubo[x]){
         codigo += "pinMode(cubo["+x+"]["+y+"]"+", OUTPUT);<br>"
      }
      codigo += "<br>"
   }
   for(var x=0 in plantas){
      codigo += "pinMode("+plantas[x]+",OUTPUT);<br>"
   }
   codigo += "}<br>";

   codigo += "void loop() {frame++; reproducir(frame); if (frame == tampeli-1) frame = -1;}<br>";
   codigo += "void reproducir(int frame) {"+
   "for (int i = 0; i < 5; i++) {"+
   "for (int j = 0; j < 5; j++) {"+
   "digitalWrite(cubo[i][j], LOW);"+
   "}"+
   "}"+
   "for (int m = 0; m < 500; m++) {"+
   "for (int i = 0; i < tammax; i++) {"+
   "digitalWrite(cubo[pelicula[frame][i][1]][pelicula[frame][i][2]], HIGH);"+
   "digitalWrite(plantas[pelicula[frame][i][0]], HIGH);"+
   "delayMicroseconds(10);"+
   "digitalWrite(cubo[pelicula[frame][i][1]][pelicula[frame][i][2]], LOW);"+
   "digitalWrite(plantas[pelicula[frame][i][0]], LOW);"+
   "}"+
   "}"+
   ""+
   "}"
}
