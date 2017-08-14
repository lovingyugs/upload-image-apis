var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    qt = require('quickthumb');

app.use(express.static(__dirname + '/public'));
// app.use('/js', express.static(__dirname + '/public'));
app.use(qt.static(__dirname + '/'));

app.post('/api/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write('received upload:\n\n');
        res.end(util.inspect({ fields: fields, files: files }));
    });

    form.on('end', function(fields, files) {
        console.log(this.openedFiles);
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'uploads/';

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
});

app.get('/', function(req, res) {
    res.redirect('/');
});

app.listen(3000, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Listening on 3000");
});