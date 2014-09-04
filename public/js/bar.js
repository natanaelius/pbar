var debug = true;
l('Iniciando app...');

function cargar_acciones(c, callback, fin) {
  //Agregar linea o incrementar prod
  $(c).on("click", "a.inc", function(e) {
    e.preventDefault();
    accion($(this).attr('href'), function(data) {
      callback(data);
    });
  });

  $(c).on("click", ".del-prod.btn-danger,a.del-prod", function(e) {
    if (confirm("seguro que quieres borrar?")) {
      var link = $(this).attr('href');
      $.ajax({
        url : link,
        success : function(data) {
          if (data.ok) {
            console.log('ok');
            listaProds();
          }
          //$(idventa).html(data);
        }
      });

    } else
      e.preventDefault();
  });

  $('.btn-prod').tooltip({
    delay : {
      show : 1500,
      hide : 0
    }
  });
  fin();
//******configuro acciones de lista de ventas*******
  //Cambiar estado de linea a servido
  $(c).on("click", "button.servido", function(e) {
    e.preventDefault();
    accion($(this).attr('href'), function(data) {
      $(this).closest('tr').hide();
      callback(data);
    });
  });
  
  //acordion ventas
  $(c).on("click", "a.toogle-venta", function(e) {
    e.preventDefault();
    acordion(this);
  });

  //Borrar venta
  $(c).on("click", ".del-venta", function(e) {
    e.preventDefault();
    if (confirm("seguro que quieres borrar?")) {
      var idventa = '#venta-' + p($(this).attr('href'));
      accion($(this).attr('href'), function(data) {
        l(data);
        $(idventa).remove();
        callback(data);
      });
    }
  });

  //Activar venta
  $(c).on("click", ".act-venta.btn", function(e) {
    e.preventDefault();
    var idventa = '#venta-' + p($(this).attr('href'));
    accion($(this).attr('href'),function(data){
      if (data.ok) {
        l('ok');
        activar_venta(idventa);
      }
      callback(data);
    });
  });

  //crear nueva venta
  $(c).on("submit", "#venta-add", function(e) {
    e.preventDefault();
    $.ajax({
      type : "POST",
      dataType : "json",
      cache : false,
      timeout : 5000,
      url : '/venta/nuevo',
      data : {
        nombre : $('#venta-add input').val()
      },
      error : function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      },
      success : function(data) {
        l('VENTA: ');l(data);
        callback(data);
      }
    });

  }); 
  
  //crear nueva venta
  $(c).on("submit", "#jor-add", function(e) {
    e.preventDefault();
    accion('/jor/nuevo',function(data){callback(data);});
  }); 
  
  fin();
}

//Funciones utiles

// muestra log en consola si debug=true
function l(mensaje) {
  if (debug)
    console.log(mensaje);
}

// retorna el parametro en url
function p(url){
  var aux = url.split('/');
  return aux[aux.length - 1];
}

// alias de $.ajax
function accion(link, callback) {
  $.ajax({
    url : link,
    beforeSend : function() {
      l(link + ': empezando acción...');
    },
    success : function(data) {
      l(data);
      callback(data);
      //$(idventa).html(data);
    }
  });
}

function nueva_venta(contVentas,data,tmpl, Mustache,callback){
        l('cargando template para nueva venta...');
        var rendered = Mustache.render(tmpl, data);
        $(contVentas).prepend("<div  id='venta-"+data.venta.id+"'>"+rendered+"</div>");
        $("#venta-"+data.venta.id).find("button.act-venta").trigger("click");
        $(contVentas).sortable();
        callback();
}

function activar_venta(idventa){
  l('idventa:'+idventa);
  $(".venta-head").removeClass('venta-activa');
  $(".venta-head button.act-venta").removeClass('disabled');
  $(idventa).find(".venta-head").addClass('venta-activa');
  $(idventa).find("button.act-venta").addClass('disabled');
  if (!$(idventa).find('tbody').is(":visible")) {
    $(idventa).find('tbody').show();
    $(idventa+' .toogle-venta i').removeClass('icon-plus').addClass('icon-minus');
  }
}

function acordion(id){
  if ($(id).closest('table').find('tbody').is(":visible")) {
    $(id).closest('table').find('tbody').hide();
    $(id).find('i').removeClass('icon-minus').addClass('icon-plus');
  } else {
    $(id).closest('table').find('tbody').show();
    $(id).find('i').removeClass('icon-plus').addClass('icon-minus');
  }
}

Number.prototype.formatMoney = function(c, d, t) {
  var n = this, c = isNaN( c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt( n = Math.abs(+n || 0).toFixed(c)) + "", j = ( j = i.length) > 3 ? j % 3 : 0;
  return s + ( j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ( c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

