$(document).ready(function() {
    console.log('runs');

    // bind to the form's submit event 
    $('#btnSubmit').on('click', function() {
        var fd = new FormData();
        var fileData = $('input[type="file"]')[0].files;
        console.log(fileData);
        fd.append('file', fileData[0]);
        console.log(fd);
        console.log('in id submit');
        $.ajax({
            method: 'post',
            url: '/api/upload',
            contentType: false,
            processData: false,
            data: fd,
            beforeSubmit: showRequest, // pre-submit callback 
            success: showResponse, // post-submit callback 
            error: function(err) {
                console.log(err);
            }
        });

        // $(this).ajaxSubmit(options);
        // // always return false to prevent standard browser submit and page navigation 
        return false;
        // // $.ajax({})
    });
});

// pre-submit callback 
function showRequest(formData, jqForm, options) {
    alert('Uploading is starting.');
    return true;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText);
}