require.config({
  baseUrl : '/',
  paths : {
    jquery : 'js/jquery.min',
    underscore : 'js/underscore-min',
    bootstrap : 'bootstrap3/js/bootstrap',
    jUi : 'jquery-ui/jquery-ui',
    mustache : 'js/mustache',
    domReady : 'js/require_plugins/domReady',
    text : 'js/require_plugins/text',
    bar : 'js/bar'
  },
  shim : {
    jquery : {
      exports : '$'
    },
    underscore : {
      exports : '_'
    },
    bootstrap : {
      deps : ['jquery'],
    },
    jUi : {
      deps : ['jquery'],
    },
    mustache : {
      exports : 'Mustache',
      deps : ['jquery'],
    },
    bar : {
      exports : 'Bar',
      deps : ['jquery', 'mustache', 'jUi', 'bootstrap', 'underscore'],
    }
  }
});

require(['domReady','jquery'], function(domReady,j) {
  domReady(function() {
    console.log('DOM listo..');
    //j('#pacman').addClass('pacman');
    require(['bar','mustache', 'text!tmpl/jornada.mst', 'text!tmpl/productos.mst', 'text!tmpl/ventas.mst', 'text!tmpl/venta.mst', 'text!tmpl/msj.mst']
      , function(bar, Mustache, tmpl_jor, tmpl_productos, tmpl_ventas, tmpl_venta, tmpl_msj) {
      var debug = true;
      if (window.location.pathname == '/') {
        l('---raiz---');
        accion('/jor',function(j){
          l('jornada:');l(j);
          if(typeof j.msj == 'undefined'){
            act_cont_ajax('#izq', '/productos', tmpl_productos, Mustache);
            act_cont_ajax('#der', '/ventas', tmpl_ventas, Mustache);
            
            //cargo acciones
            cargar_acciones('#cuerpo', 
              function(data) {
              //callback acciones prod
              if (typeof data.msj != 'undefined'){
                act_cont('#msj', {msj:data.msj}, tmpl_msj, Mustache);
                window.setTimeout(function() { l('timer');$(".alert").alert('close'); }, 4000);
              }
              l(data);
              switch (data.key){
                case 'addProd':
                  l('id: '+data.venta.id);
                  act_cont('#venta-'+data.venta.id, data, tmpl_venta, Mustache);
                  break;
                case 'nuevaVenta':
                  l('nueva venta:');
                  nueva_venta('#ventas-cont',data,tmpl_venta, Mustache,function(){
                    l('nueva venta lista');
                  });
                  break;
                case 'servido':
                  l('servido:');
                  act_cont_ajax('#venta-'+data.linea.venta_id, '/venta/'+data.linea.venta_id, tmpl_venta, Mustache);
                  break;
                case 'verVenta':
                  $('#ventas-cont').sortable();
                  break;
                case 'listaVentas':
                  $('#ventas-cont').sortable();
                  break;
                default:
                  break;
              };
            }, function() {
              //callback fin 
              l('acciones cargadas!');
            });
          } else {
            //act_cont('#msj', {msj:j.msj}, tmpl_msj, Mustache);
            act_cont_ajax('#der', '/jor', tmpl_jor, Mustache);
            $('#izq').addClass('span5');
          }
        });
            
      }
      else if (window.location.pathname == '/jor/fin') {
        
      }
      j('#pacman').hide();

    });
  });
});

//Cargo request ajax en un template mustache
function act_cont_ajax(c, url, tmpl, Mustache) {
    $.ajax({
      url : url,
      success : function(data) {
        l('cargando template...');
        var rendered = Mustache.render(tmpl, data);
        $(c).html(rendered);
      }
    });
}

//Cargo data json en un template mustache
function act_cont(c, data, tmpl, Mustache) {
  require(['mustache'], function(Mustache) {
        l('cargando template...');
        var rendered = Mustache.render(tmpl, data);
        $(c).html(rendered);
  });
}
