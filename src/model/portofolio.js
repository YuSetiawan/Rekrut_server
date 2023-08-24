const Pool = require('../config/db');

const selectAllPortofolio = ({limit, offset, sort, sortby}) => {
  return Pool.query(`SELECT * FROM portofolio ORDER BY ${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const selectPortofolioUsers = (id_users) => {
  return Pool.query(`SELECT * FROM portofolio WHERE id_users = '${id_users}'`);
};

const deletePortofolio = (id) => {
  return Pool.query(`DELETE FROM portofolio WHERE id  = '${id}'`);
};

const createPortofolio = (data) => {
  const {id, name, repository, photo, id_users} = data;
  return Pool.query(`INSERT INTO portofolio(id, name, repository, photo, id_users) 
    VALUES ('${id}','${name}','${repository}','${photo}','${id_users}')`);
};

const updatePortofolio = (data) => {
  const {id, name, repository, photo} = data;
  return Pool.query(`UPDATE portofolio SET  name = '${name}', repository = '${repository}', photo = '${photo}' WHERE id = '${id}'`);
};

const findID = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM portofolio WHERE id= '${id}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findUser = (id_users) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM portofolio WHERE id_users= '${id_users}' `, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM portofolio`);
};

module.exports = {
  selectAllPortofolio,
  selectPortofolioUsers,
  deletePortofolio,
  createPortofolio,
  updatePortofolio,
  findID,
  findUser,
  countData,
};
