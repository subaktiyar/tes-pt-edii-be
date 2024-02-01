const Joi = require("joi");
const { isEmptyArray } = require("../common/helper");
const debug = require("debug")("backend:module:user");

const DB = {
  User: require("../models/user.model"),
  Authentication: require("../models/authentication.model"),
};

const updateSchema = Joi.object().keys({
  nama: Joi.string(),
  no_ktp: Joi.string(),
  tempat_lahir: Joi.string(),
  tanggal_lahir: Joi.string(),
  jenis_kelamin: Joi.string(),
  agama: Joi.string(),
  golongan_darah: Joi.string(),
  status: Joi.string(),
  alamat_ktp: Joi.string(),
  alamat_tinggal: Joi.string(),
  no_telepon: Joi.string(),
  kontak_darurat: Joi.object().allow(null),
  posisi: Joi.string(),
  pendidikan: Joi.array(),
  pelatihan: Joi.array(),
  riwayat_pekerjaan: Joi.array(),
});

const deleteSchema = Joi.object().keys({});

function validateUpdateSchema(schema) {
  return updateSchema.validate(schema);
}

function validateDeleteSchema(schema) {
  return deleteSchema.validate(schema);
}

async function read(query, curUser) {
  try {
    debug(query, "===> QUERY read");

    let filter = { is_active: true };

    if (query?.nama) {
      filter = { ...filter, nama: { $regex: query?.nama, $options: "i" } };
    }

    if (query?.posisi) {
      filter = { ...filter, posisi: query?.posisi };
    }

    if (query?.tingkat_pendidikan) {
      filter = {
        ...filter,
        "pendidikan.jenjang_pendidikan": query?.tingkat_pendidikan,
      };
    }

    debug(filter, "===> FILTER read");

    // sort
    const sortOrder = query?.sortOrder?.toLowerCase() == "asc" ? 1 : -1;
    const sortField = query?.sortField ?? "created_at";
    const sort = { [sortField]: sortOrder };

    // skip
    const sizePerPage = query?.sizePerPage ? Number(query.sizePerPage) : 10;
    const page = query?.page ? Number(query.page) : 1;
    const skip = sizePerPage * page - sizePerPage;

    // limit
    const limit = sizePerPage;

    // find data
    let found_data = [];

    if (query?.showAll) {
      found_data = await DB.User.find(filter)
        .sort(sort)
        .collation({ locale: "en_US", numericOrdering: true })
        .select("-__v")
        .lean();
    } else {
      found_data = await DB.User.find(filter)
        .sort(sort)
        .collation({ locale: "en_US", numericOrdering: true })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean();
    }

    let result = {
      foundData: [],
      currentPage: page,
      countPages: 0,
      countData: 0,
    };

    if (!isEmptyArray(found_data)) {
      const count = await DB.User.countDocuments(filter).lean();
      const current_page = query.showAll ? 1 : page;
      const count_page = query.showAll ? 1 : Math.ceil(count / sizePerPage);

      result = {
        foundData: found_data,
        currentPage: current_page,
        countPages: count_page,
        countData: count,
      };
    }

    return result;
  } catch (err) {
    debug(err, "===> ERROR read");
    throw { error: true, message: "Error Read Data" };
  }
}

async function readByID(id, query, curUser) {
  try {
    debug(query, "===> QUERY readByID");

    const filter = { _id: id, is_active: true };
    const findData = await DB.User.findOne(filter).lean();

    if (!findData || findData?.errors) {
      return { error: true, message: "User not found" };
    }

    debug(findData, "===> RESULT findData");

    return findData;
  } catch (err) {
    debug(err, "===> ERROR readByID");
    throw { error: true, message: "Error Read Data" };
  }
}

async function updateByID(id, payload, curUser) {
  try {
    debug(payload, "===> PAYLOAD updateByID");

    const validate = validateUpdateSchema(payload);
    if (validate.error) {
      debug(validate.error.message, "===> ERROR VALIDATION");
      return { error: true, message: validate.error.details[0].message };
    }

    const new_value = {
      ...payload,
      updated_at: new Date(),
      updated_by: curUser?.username,
    };

    const result = await DB.User.findOneAndUpdate(
      { _id: id, is_active: true },
      { ...new_value },
      { useFindAndModify: false, new: true }
    );

    if (!result || result?.errors) {
      return { error: true, message: "Failed to update user" };
    }

    debug(result, "===> RESULT updateByID");

    return result;
  } catch (err) {
    debug(err, "===> ERROR updateByID");
    throw { error: true, message: "Error Read Data" };
  }
}

async function deleteByID(id, payload, curUser) {
  try {
    debug(payload, "===> PAYLOAD deleteByID");

    const validate = validateDeleteSchema(payload);
    if (validate.error) {
      debug(validate.error.message, "===> ERROR VALIDATION");
      return { error: true, message: validate.error.details[0].message };
    }

    const new_value = {
      ...payload,
      is_active: false,
      updated_at: new Date(),
      updated_by: curUser?.username,
      deleted_at: new Date(),
      deleted_by: curUser?.username,
    };

    const result = await DB.User.findOneAndUpdate(
      { _id: id, is_active: true },
      { ...new_value },
      { useFindAndModify: false, new: true }
    );

    if (!result || result?.errors) {
      return { error: true, message: "Failed to delete user" };
    }

    await DB.Authentication.findOneAndUpdate(
      { username: result?.username, is_active: true },
      {
        is_active: false,
        updated_at: new Date(),
        updated_by: curUser?.username,
        deleted_at: new Date(),
        deleted_by: curUser?.username,
      },
      { useFindAndModify: false, new: true }
    );

    debug(result, "===> RESULT deleteByID");

    return result;
  } catch (err) {
    debug(err, "===> ERROR deleteByID");
    throw { error: true, message: "Error Read Data" };
  }
}

module.exports = { read, readByID, updateByID, deleteByID };
