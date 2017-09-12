const knex = require('./knex');

module.exports = {
  getAllPatients: () => {
    return knex('patient');
  }
};
