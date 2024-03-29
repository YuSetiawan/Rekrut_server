const {v4: uuidv4} = require('uuid');
const commonHelper = require('../helper/common');
const cloudinary = require('../middlewares/cloudinary');
let {selectAllPortofolio, selectPortofolioUsers, deletePortofolio, createPortofolio, updatePortofolio, findID, countData} = require('../model/portofolio');

let portofolioController = {
  getAllPortofolio: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || 'id';
      const sort = req.query.sort || 'ASC';
      let result = await selectAllPortofolio({limit, offset, sort, sortby});
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
      commonHelper.response(res, result.rows, 200, 'Get Portofolio Data Success', pagination);
    } catch (err) {
      console.log(err);
    }
  },

  getSelectPortofolioUser: async (req, res) => {
    const id_users = String(req.params.id);
    selectPortofolioUsers(id_users)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'Get Portofolio Detail Success');
      })
      .catch((err) => res.send(err));
  },

  createPortofolio: async (req, res) => {
    const {name, repository, id_users} = req.body;
    const id = uuidv4();
    const result = await cloudinary.uploader.upload(req.file.path);
    const photo = result.secure_url;

    const data = {
      id,
      name,
      repository,
      photo,
      id_users,
    };
    createPortofolio(data)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Create Portofolio Success'))
      .catch((err) => res.send(err));
  },

  updatePortofolio: async (req, res) => {
    try {
      const {name, repository} = req.body;
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const photo = result.secure_url;
      const data = {
        id,
        name,
        repository,
        photo,
      };

      updatePortofolio(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Update Portofolio Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deletePortofolio: async (req, res) => {
    try {
      const id = String(req.params.id);
      const {rowCount} = await findID(id);
      if (!rowCount) {
        res.json({message: 'ID Not Found'});
      }
      deletePortofolio(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Delete Portofolio Success'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = portofolioController;
