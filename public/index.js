let token = '';

function valid(numberToValidate) {
  numberToValidate = numberToValidate.toString();
  console.log(numberToValidate.match(/\^[789]\d{9}$/));
  if (numberToValidate.match(/^[789]\d{9}$/))
    return true;
  else
    return false;
};

$(document).ready(function() {

  $("#api-key").on('change', function(e) {
    token = $('#api-key').val();
    $(".api-key-text").html(token);
  });


  $("#gen-btn").on('click', function(e) {
    let uniqueNumber = $("#unique-number").val();
    console.log(uniqueNumber);
    if (valid(uniqueNumber)) {
      console.log('valid number');
      $.ajax({
        method: 'get',
        url: '/api/generatekey/',
        data: {
          unique_number: uniqueNumber
        },
        success: function(res) {
          console.log(res);
          $(".api-key-text").html(res.API_KEY);
          $("#api-key").val(res.API_KEY);
          token = res.API_KEY;
        },
        error: function(err) {
          console.log(err.responseJSON);
          alert(err.responseJSON.message);
        }
      });
    } else {
      let msg = 'Enter a valid 10 digit number starting with 7/8/9';
      console.log(msg);
      alert(msg);
    }
  });

  $("#delete-image").on('click', function(e) {
    let fileToDelete = $('#delete-img-name').val();

    $.ajax({
      method: 'delete',
      url: '/api/images/' + fileToDelete + '/?token=' + token,
      success: function(res) {
        console.log(res.message);
        alert(res.message);
      },
      error: function(err) {
        console.log(err.responseJSON);
        alert(err.responseJSON.message);
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
        alert(err.responseJSON.message);
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
        alert(err.responseJSON.message);
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
        alert(err.responseJSON.message);
      }
    });

    return false;
  });
});


function showResponse(res) {
  console.log(res);
  alert('File uploaded successfully.');
}