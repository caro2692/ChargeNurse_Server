const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries');

/* GET home page. */
Router.get('/', (req, res) => {
  Queries.getAllPatients()
    .then(result=>{
        res.send(result);
    });
});

module.exports = Router;
