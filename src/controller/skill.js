const {v4: uuidv4} = require('uuid');
const commonHelper = require('../helper/common');
let {selectAllSkill, selectSkillUsers, deleteSkill, createSkill, updateSkill, findID, findUser, findSkill, countData} = require('../model/skill');

let skillController = {
  getAllSkill: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || 'id';
      const sort = req.query.sort || 'ASC';
      let result = await selectAllSkill({limit, offset, sort, sortby});
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
      commonHelper.response(res, result.rows, 200, 'Get Skill Success', pagination);
    } catch (err) {
      console.log(err);
    }
  },

  getSelectSkillUser: async (req, res) => {
    const id_users = String(req.params.id);
    selectSkillUsers(id_users)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'Get Skill Detail Success');
      })
      .catch((err) => res.send(err));
  },

  createSkill: async (req, res) => {
    const {skill_name, id_users} = req.body;
    const {rowCount: SkillName} = await findSkill(skill_name, id_users);
    // const { rowCount: WorkerID } = await findUser(id_users);

    if (SkillName) {
      return res.json({message: 'Skill already taken'});
    }
    const id = uuidv4();
    const data = {
      id,
      skill_name,
      id_users,
    };
    createSkill(data)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Create Skill Success'))
      .catch((err) => res.send(err));
  },

  updateSkill: async (req, res) => {
    try {
      const {skill_name} = req.body;
      const id = String(req.params.id);
      const {rowCount} = await findID(por_id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      const data = {
        id,
        skill_name,
      };

      updateSkill(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Update Skill Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteSkill: async (req, res) => {
    try {
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      deleteSkill(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Delete Skill Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = skillController;
