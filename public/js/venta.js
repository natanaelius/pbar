$(document).ready(function() {

  $(".btn-danger").click(function(e) {
    e.preventDefault();
    if (confirm("seguro que quieres borrar?")) {
      var link = $(this).attr('href');
      $.ajax({
        url : link,
        success : function(resp) {
          $(".container").html(resp);
        }
      });
    }
  });

  $('.btn-prod').tooltip({
    delay : {
      show : 1500,
      hide : 0
    }
  });

  $('#venta-add').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      type : "POST",
      cache : false,
      url : '/nueva-venta',
      data : {nombre:$('#venta-add input').val(),usuario:'nata'},
      error : function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      },
      success : function(data) {
        $('#ventas-cont').append($('#venta-add input').val());
        $('#venta-add').reset();
      }
    });
  });

});
