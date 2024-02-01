const Joi = require("joi");
const { isEmptyArray } = require("../common/helper");
const debug = require("debug")("backend:module:agama");

const DB = {
  Agama: require("../models/agama.model"),
};

async function read(query, curUser) {
  try {
    debug(query, "===> QUERY read");

    let filter = { is_active: true };

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
      found_data = await DB.Agama.find(filter)
        .sort(sort)
        .collation({ locale: "en_US", numericOrdering: true })
        .select("-__v")
        .lean();
    } else {
      found_data = await DB.Agama.find(filter)
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
      const count = await DB.Agama.countDocuments(filter).lean();
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

module.exports = { read };
