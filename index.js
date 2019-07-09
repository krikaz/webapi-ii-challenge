const express = require('express');
const postsRoutes = require('./data/db-routes');
const server = express();

server.use(express.json());

server.listen(3000, () => {
	console.log('listening on 3000');
});
