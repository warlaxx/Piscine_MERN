const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.send('Great ! it works.')
})

app.listen(4242, function() {
    console.log('ça fonctionne dans le port 4242')
})