const express = require('express');
const bodyParser = require("body-parser");
const url = require("url")
const mysql = require('mysql')

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.json())

var connection = mysql.createConnection({
    host:'192.168.3.31',
    port:'3306',
    user:'root',
    password:'123456',
    database:'test'
});
connection.connect();

app.get('/', (req, res) => {
    console.log(req.sessionID)
    res.send(`hello world\n`)
})

function success(data) {
	data = {
        "result": "Success",
        "info": data
	}
	return data
}

function failed() {
	res = {
        "result": "Failed",
        "info": "some descriptions about the reason"
    }
    return res
}

app.post('/login/', function (req, res) {
	var user_name = req.body.username;
	var password = req.body.password;
	var sql = "SELECT * FROM user where username='"+ user_name +"' and password='" + password + "';";
	var ress = {"character":{}}
	connection.query(sql, function (err, result) {
	    if(err) {
	        console.log('[SELECT ERROR]:',err.message);
	    }
	    var len = 0;
	    
	    for(var item in result){
	    	len++;
	    }
	    if(len == 0) {
	    	ress = failed()
	    	res.end(JSON.stringify(ress))
	    }
	    else {
	    	ress['username'] = result[0].username;
	    	ress['password'] = result[0].password;
	    	ress['character']['gender'] = result[0].gender;
	    	ress['character']['class'] = result[0].class;
	    	ress = success(ress)
	    	res.end(JSON.stringify(ress))
	    }
	});
	
})


function handle(data) {
    ref = {
        "fire": "water",
        "water": "fire",
        "wind": "earth",
        "earth": "wind",
        "black": "white",
        "white": "black",
        "light": "dark",
        "dark": "light",
        "hope": "despair",
        "despair": "hope"
    }
    var ans = []
    for(var item in data) {
        ans.push(ref[data[item]])
    }
    var len = 0
    for(var i in ans) {
    	len++
    }

    res = {
        "counter": ans,
        "number": len
    }
    return res
}

app.get('/counter', function(req, res) {
	var words = req.query.magic.split()
	words = words[0].replace(new RegExp(' ', "gm"), ',').split(',')
	console.log(words)
	data = handle(words)
	res.end(JSON.stringify(data))
	
});

app.listen(5000, function(){
    console.log("start")
});
