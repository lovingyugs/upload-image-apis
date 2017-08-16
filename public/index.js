let token = '';

$(document).ready(function() {
 
  $("#api-key").on('change', function(e) {
    token = $('#api-key').val();
    $(".api-key-text").html(token);
  });

  $("#gen-btn").on('click', function(e) {
    $.ajax({
      method: 'get',
      url: '/api/generatekey/',
      success: function(res) {
        console.log(res);
        $(".api-key-text").html(res.API_KEY);
        $("#api-key").val(res.API_KEY);
        token = res.API_KEY;
      },
      error: function(err) {
        console.log(err.responseJSON);
      }
    });
  });

  $("#delete-image").on('click', function(e) {
    let fileToDelete = $('#delete-img-name').val();

    $.ajax({
      method: 'delete',
      url: '/api/images/' + fileToDelete + '/?token=' + token,
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err.responseJSON);
      }
    });
  });

  $("#get-images").on('click', function() {
    $.ajax({
      url: '/api/images/?token=' + token,
      method: 'get',
      success: function(res) {
        console.log(res);
        $('#images').html('');
        for (var i = 0; i < res.length; i++) {
          $('#images').append('<img class="img" title=' + res[i].imageDefaultName + ' src=' + res[i].imgSrc + '/>');
        }
      },
      error: function(err) {
        console.log(err.responseJSON);
      }
    });
  });

  $("#get-single-image").on('click', function() {
    let fileToFind = $('#single-img-name').val();
    $.ajax({
      url: '/api/images/' + fileToFind + '/?token=' + token,
      method: 'get',
      success: function(res) {
        console.log(res);
        $("#single-image").html('');
        $('#single-image').append('<img class="img" src=' + res.imgSrc + '/>');
      },
      error: function(err) {
        console.log(err.responseJSON);
      }
    });
  });

  $('#btnSubmit').on('click', function() {
    var fd = new FormData();
    var fileData = $('input[type="file"]')[0].files;
    console.log(fileData);
    fd.append('file', fileData[0]);
    console.log(fd);
    console.log('in id submit');
    $.ajax({
      method: 'post',
      url: '/api/images?token=' + token,
      contentType: false,
      processData: false,
      data: fd,
      success: showResponse, // post-submit callback
      error: function(err) {
        console.log(err.responseJSON);
      }
    });

    return false;
  });
});


function showResponse(res) {
  console.log(res);
}