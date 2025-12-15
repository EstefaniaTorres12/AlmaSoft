const PlanFunebre = require('./planFunebre');

const Plan = {
  createPlan: (planData) => {
    return new Promise((resolve, reject) => {
      PlanFunebre.create(planData, (err, data) => {
        if (err) return reject(err);
        // data includes { id: insertId, ...newPlan }
        resolve(data.id);
      });
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      PlanFunebre.getAll((err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      PlanFunebre.findById(id, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  updatePlan: (id, data) => {
    return new Promise((resolve, reject) => {
      PlanFunebre.updateById(id, data, (err, res) => {
        if (err) return reject(err);
        // consider success if no error
        resolve(true);
      });
    });
  },

  deletePlan: (id) => {
    return new Promise((resolve, reject) => {
      PlanFunebre.remove(id, (err, res) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
};

module.exports = Plan;