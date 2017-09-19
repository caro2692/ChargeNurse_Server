const knex = require('./knex');

module.exports = {
  getAllPatients: (shift_id) => {
    let shift_id_assigned = Number(shift_id) + 1;
    return knex('patient').innerJoin('patient_shift', 'patient.id', 'patient_shift.patient_id').where('shift_id', shift_id_assigned)
      .then(patients=> {
        //return Promise.all(
            const promise_1 = patients.map(patient=>{
            return knex('patient_nurse')
            .select(knex.raw('count(*) as assigned'))
            .where('patient_id', patient.id)
            .andWhere('shift_id',shift_id_assigned)
            .first()
            .then(assigned_val=>{
              patient.assigned = assigned_val.assigned;
            });
          });
          const promise_2 =  patients.map(patient=>{
            return knex('patient_objective_acuity')
            .leftJoin('objective_acuity', 'patient_objective_acuity.objective_acuity_id', 'objective_acuity.id')
            .select('objective_acuity_id', 'value', 'name', 'data_type')
            .where('patient_id', patient.id)
            .andWhere('patient_objective_acuity.shift_id',shift_id)
            .then(patient_oacuity=>{
              patient.oacuity = patient_oacuity;
            });
          });
          const promise_3 = patients.map(patient=>{
            return knex('patient_subjective_acuity')
            .leftJoin('subjective_acuity', 'patient_subjective_acuity.subjective_acuity_id', 'subjective_acuity.id')
            .select('subjective_acuity_id', 'value', 'name', 'data_type', 'nurse_id')
            .where('patient_id', patient.id)
            .andWhere('patient_subjective_acuity.shift_id',shift_id)
            .then(patient_sacuity=>{
              patient.sacuity = patient_sacuity;
            });
          });
          const promise_4 = patients.map(patient =>{
            return knex('patient_nurse')
            .innerJoin('shift','patient_nurse.shift_id','shift.id')
            .select(knex.raw('nurse_id, count(*) AS shift_count'))
            .where('patient_id', patient.id)
            .andWhereNot('shift.id', shift_id_assigned)
            .groupByRaw('patient_id, nurse_id')
            .then(patient_shifts=>{
              patient.previous_nurses = patient_shifts;
            });
          });
          return Promise.all(promise_1.concat(promise_2).concat(promise_3).concat(promise_4)).then(()=>{
            return patients;
        });
      });
  },
  getAllNurses: (shift_id) => {
    const promises = [
      knex('nurse').innerJoin('nurse_shift', 'nurse.id', 'nurse_shift.nurse_id').where('shift_id', shift_id),
      knex('patient_nurse')
      .select(['nurse_id', knex.raw('ARRAY_AGG(patient_id) as patients')])
      .where('shift_id', shift_id)
      .groupBy('nurse_id')
    ];
    return Promise.all(promises)
      .then(results=>{
        const nurses = results[0];
        const assignments = results[1];
        //reduce assignemnts so the key is nurse id and value is patients for more efficient assignemnts
        let initial_value = {};
        var reducer = function(tally, value) {
          console.log(value);
          tally[value.nurse_id] = value.patients;
          return tally;
        };
        var assignments_reduced = assignments.reduce(reducer,  initial_value);
        //go through assignment_nurse and have nurse_id: assignments
        return Promise.all(
          nurses.map(nurse=>{
            return knex('nurse_objective_acuity')
            .leftJoin('objective_acuity', 'nurse_objective_acuity.objective_acuity_id', 'objective_acuity.id')
            .select('objective_acuity_id', 'value', 'name', 'data_type')
            .where('nurse_id', nurse.id)
            .then(nurse_oacuity=>{
              nurse.oacuity = nurse_oacuity;
            });
          })
        ).then(()=>{
          nurses.forEach((nurse)=>{
            if(assignments_reduced[nurse.id]){
              nurse.patients = assignments_reduced[nurse.id];
            } else {
              nurse.patients = [];
            }
          });
          return nurses;
        });
      });
  },
  getOnePatient: (id) => {
    return knex('patient').where('id', id);
  },
  getOneNurse: (id) => {
    return knex('nurse').where('id', id);
  },
  insertOneAssignment: (assignment) => {
    return knex('patient_nurse').insert(assignment).returning('*');
  },
  deleteOneAssignment: (assignment) => {
    return knex('patient_nurse')
    .where('shift_id', assignment.shift_id)
    .andWhere('nurse_id', assignment.nurse_id)
    .andWhere('patient_id', assignment.patient_id)
    .del();
  },
  updateOneAssignment: (assignment) => {
    return knex('patient_nurse')
    .where('shift_id', assignment.shift_id)
    .andWhere('patient_id', assignment.patient_id)
    .update('nurse_id', assignment.nurse_id)
    .returning('*');
  }
};
