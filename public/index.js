let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1MDI4MDQzMjAsImV4cCI6MTUwMjg5MDcyMH0.VAaDepNHi6FnIayLp1HwzGLi7roYEyXNmVTbTb5HqQw';

$(document).ready(function() {
  console.log('runs');

  $("#gen-btn").on('click', function(e) {
    $.ajax({
      method: 'get',
      url: '/api/generatekey/',
      success: function(res) {
        console.log(res);
        // token = res.API_KEY;
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $("#delete-image").on('click', function(e) {
    let fileToDelete = 'img.png';
    $.ajax({
      method: 'delete',
      url: '/api/images/' + fileToDelete + '/?token=' + token,
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
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
        console.log(err);
      }
    });
  });

  $("#get-single-image").on('click', function() {
    let fileToDelete = 'img.png';
    $.ajax({
      url: '/api/images/' + fileToDelete + '/?token=' + token,
      method: 'get',
      success: function(res) {
        console.log(res);
        $("#images").html('');
        $('#images').append('<img class="img" src=' + res.imgSrc + '/>');
      },
      error: function(err) {
        console.log(err);
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
        console.log(err);
      }
    });

    return false;
  });
});


function showResponse(res) {
  console.log(res);
}
