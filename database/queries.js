const knex = require('./knex');

module.exports = {
  getAllPatients: () => {
    return knex('patient');
  },
  getAllNurses: () => {
    return knex('nurse');
  },
  getOnePatient: (id) => {
    return knex('patient').where('id', id);
  },
  getOneNurse: (id) => {
    return knex('nurse').where('id', id);
  }
};
