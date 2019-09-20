const express = require('express'),
fs = require('fs-extra'),
https = require('https'),
got = require('got'),
bodyParser = require('body-parser'),
cors = require('cors'),
config = require('./config'),
options = {
  key: fs.readFileSync('./cert/.localhost.key'),
  cert: fs.readFileSync('./cert/.localhost.cert'),
  ciphers: "ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:!MEDIUM:!LOW",
  ecdhCurve: "secp521r1:sect409k1:sect409r1:sect571k1:sect571r1:secp384r1",
  honorCipherOrder: true,
  minVersion: "TLSv1.2"
},
cl = console.log;

app = express();

app.use(cors({
  "origin": '*',
  "methods": 'GET,HEAD,POST',
  "credentials": true,
}))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));


app.post('/api/search', function(req, res){
  let body = req.body;

  (async () => {
      try {
        let response = await got(decodeURIComponent(body.url), config.got);
        return res.json(response.body)
      } catch (err) {
        if(err){return cl(err)}
      }
  })();
})

// init server
const server = https.createServer(options, app);

server.listen(config.port, function(){
  console.log('proxy listening on port:' +config.port )
})
