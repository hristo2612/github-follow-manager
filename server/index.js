const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = process.env.PORT || 5000;
const clientFolder = '../client/build';

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, clientFolder)));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(bodyParser.json());
  app.use(cors());

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });


  app.post('/api/login', function (req, res) {
    axios.post('https://github.com/login/oauth/access_token', { client_id: '3145d9a7608514f31567', client_secret: 'Your_Client_Secret', code: req.body.code, accept: 'json' })
    .then(result => {
      var access = (result.data).match(/access_token=[A-Za-z0-9]+=*&/);
      access = access[0];
      access = access.replace("access_token=", "");
      access = access.slice(0, -1);
      console.log(access);
      res.json({"success": true, "tkn": access});
    })
    .catch(err => {
      console.log(err);
      res.json({"success": false, "error": "Something went wrong while trying to authenticate"});
    });
    //res.send('Hello World!');
    //res.send('{"message":"Hello from the custom server!"}');
  });


  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, clientFolder, 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
