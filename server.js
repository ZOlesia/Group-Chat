const express = require('express');
const app = express();
const path = require('path');

var bodyParser = require('body-parser');
var session = require('express-session');
app.unsubscribe(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "./static")));
app.set('views', path.join(__dirname + "/views"));
app.use(session({
    secret: 'somesuperdupersecret',
    resave: true,
    saveUninitialized: true
}))
app.set('view engine', 'ejs');

const server = app.listen(8000);
const io = require('socket.io')(server);
// var currentUser = "";
var messages = [];
io.on('connection', function (socket) { //2

    socket.on('got_a_new_user', function (data) {
        
        socket.broadcast.emit('new_user_join', data);
    })

    socket.on('message', function(user, message){
        var line = user + ": " + message[0].value;
        console.log(line);
        messages.push(line);
        io.emit('broad', messages);
    })

});

app.get('/', function (req, res) {
    res.render('index');
});


