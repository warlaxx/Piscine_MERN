const express = require('express');
const app = express();
fs = require('fs');

app.get('/', function(req, res) {
    fs.readFile('index.html', 'utf8', function(err, html) {
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    });
})

app.listen(4242, function() {
    console.log('ça fonctionne dans le port 4242')
});