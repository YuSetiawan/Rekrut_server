const {v4: uuidv4} = require('uuid');
const authHelper = require('../helper/auth');
const commonHelper = require('../helper/common');
let {selectAllExperience, selectExperienceUsers, deleteExperience, createExperience, updateExperience, findID, countData} = require('../model/experience');

let experienceController = {
  getAllExperience: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || 'id';
      const sort = req.query.sort || 'ASC';
      let result = await selectAllExperience({limit, offset, sort, sortby});
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, 'Get Experience Success', pagination);
    } catch (err) {
      console.log(err);
    }
  },

  getSelectExperienceUser: async (req, res) => {
    const id_users = String(req.params.id);
    selectExperienceUsers(id_users)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'Get Experience Detail Success');
      })
      .catch((err) => res.send(err));
  },

  createExperience: async (req, res) => {
    const {job_position, company_name, working_started, working_ended, description, id_users} = req.body;

    const id = uuidv4();

    const data = {
      id,
      job_position,
      company_name,
      working_started,
      working_ended,
      description,
      id_users,
    };
    createExperience(data)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Create Experience Success'))
      .catch((err) => res.send(err));
  },

  updateExperience: async (req, res) => {
    try {
      const {job_position, company_name, working_started, working_ended, description} = req.body;
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      const data = {
        id,
        job_position,
        company_name,
        working_started,
        working_ended,
        description,
      };

      updateExperience(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Update Experience Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteExperience: async (req, res) => {
    try {
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      deleteExperience(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Delete Experience Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = experienceController;
