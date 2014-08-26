$(document).ready(function() {
  
  $(window).load(function() {
    if (window.location.pathname == '/'){
      listaProds();
      actualizar_ventas('/ventas');
    }
  });
  
  //Agregar linea o incrementar prod
  $("#izq").on("click","a.inc", function(e) {
    e.preventDefault();
    $.ajax({
      url : $(this).attr('href'),
      beforeSend : function(){
        console.log('empezando');
      },
      success : function(data) {
        console.log(data);
        
        //$(idventa).html(data);
      }
    });
  });

  $(".del-prod.btn-danger,a.del-prod").click(function(e) {
    if (confirm("seguro que quieres borrar?")) {
      var link = $(this).attr('href');
      $.ajax({
        url : link,
        success : function(data) {
          if(data.ok){
            console.log('ok');
            listaProds();
          }
          
          //$(idventa).html(data);
        }
      });
      
    } else e.preventDefault();
  });

  $('.btn-prod').tooltip({
    delay : {
      show : 1500,
      hide : 0
    }
  });

  //Borrar venta
  $("#ventas-cont").on("click", ".del-venta.btn-danger", function(e) {
    e.preventDefault();
    if (confirm("seguro que quieres borrar?")) {
      var link = $(this).attr('href');
      var aux = link.split('/');
      var idventa = '#venta-'+aux[aux.length-1];
      console.log(idventa);
      $.ajax({
        url : link,
        success : function(data) {
          if(data.ok){
            console.log('ok');
            $(idventa).remove();
          }
          
          //$(idventa).html(data);
        }
      });
    }
  });

  //Activar venta
  $("#ventas-cont").on("click", ".act-venta.btn", function(e) {
    e.preventDefault();
    var link = $(this).attr('href');
    var aux = link.split('/');
    var idventa = '#venta-'+aux[aux.length-1];
    console.log(idventa);
    $.ajax({
      url : link,
      success : function(data) {
        if(data.ok){
          console.log('ok');
          $(".venta-head").removeClass('venta-activa');
          $(".venta-head button.act-venta").removeClass('disabled');
          $(idventa).find(".venta-head").addClass('venta-activa');
          $(idventa).find("button.act-venta").addClass('disabled');
        }
        
        //$(idventa).html(data);
      }
    });
  });

  //crear nueva venta
  $('#venta-add').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      type : "POST",
      dataType : "json",
      cache : false,
      timeout : 5000,
      url : '/venta/nuevo',
      data : {
        nombre : $('#venta-add input').val(),
        usuario_id : 'nata'
      },
      error : function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      },
      success : function(data) {
        console.log(data);
        actualizar_ventas('/ventas');
      }
    });

  });

  $("#ventas-cont").on("click", "a.toogle-venta", function(e) {
    e.preventDefault();
    if ($(this).closest('table').find('tbody').is(":visible")) {
      $(this).closest('table').find('tbody').hide();
      $(this).find('i').removeClass('icon-minus').addClass('icon-plus');
    } else {
      $(this).closest('table').find('tbody').show();
      $(this).find('i').removeClass('icon-plus').addClass('icon-minus');
    }

  });

  function actualizar_ventas(link) {
    $.ajax({
      url : link,
      success : function(data) {
        $.get('/tmpl/ventas.mst', function(template) {
          var rendered = Mustache.render(template, data);
          $('#ventas-cont').html(rendered);
          $('#venta-add').trigger("reset");
        });
        window.setTimeout(function() { $(".alert").alert('close'); }, 4000);
      }
    });
  }
  
  function listaProds() {
    $.ajax({
      url : '/productos',
      success : function(data) {
        console.log(data);
        $.get('/tmpl/productos.mst', function(template) {
          var rendered = Mustache.render(template, {productos:data});
          $('#izq').html(rendered);
        });
      }
    });
  }
  
  Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };


  $("#ventas-cont").sortable();

});
