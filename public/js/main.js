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

require(['domReady'], function(domReady) {
  domReady(function() {
    console.log('DOM listo..');
    require(['bar', 'text!tmpl/productos.mst', 'text!tmpl/ventas.mst', 'text!tmpl/venta.mst'], function(bar, tmpl_productos, tmpl_ventas, tmpl_venta) {
      var debug = true;
      if (window.location.pathname == '/') {
        l('---raiz---');
        act_cont_ajax('#izq', '/productos', tmpl_productos);
        act_cont_ajax('#ventas-cont', '/ventas', tmpl_ventas);
      }
      //cargo acciones
      productos_cont('#izq', 
        function(data) {
        //callback acciones prod
        l(data);
        switch (data.key){
          case 'addProd':
            l('id: '+data.venta.id);
            act_cont('#venta-'+data.venta.id, data, tmpl_venta);
            break;
          default:
            break;
        }
      }, function() {
          //callback fin productos
          ventas_cont('#der',
            function(data){
              //callback acciones ventas
              l('callback ventas');
              l(data);
              switch (data.key){
                case 'nuevaVenta':
                  l('nueva venta:');
                  nueva_venta('#ventas-cont',data,tmpl_venta,function(){
                    //activar_venta('#venta'+data.venta.id);
                  });
                  break;
                default:
                  break;
              }
            }, function() {
              //callback fin ventas
              l('acciones cargadas!');
            });
      });

      //ventas_cont('#der');

    });
  });
});

//Cargo request ajax en un template mustache
function act_cont_ajax(c, url, tmpl) {
  require(['mustache'], function(Mustache) {
    $.ajax({
      url : url,
      success : function(data) {
        l(data);
        l('cargando template...');
        var rendered = Mustache.render(tmpl, data);
        $(c).html(rendered);
        $(c).sortable();
      }
    });
  });
}

//Cargo data json en un template mustache
function act_cont(c, data, tmpl) {
  require(['mustache'], function(Mustache) {
        l('cargando template...');
        var rendered = Mustache.render(tmpl, data);
        $(c).html(rendered);
  });
}
