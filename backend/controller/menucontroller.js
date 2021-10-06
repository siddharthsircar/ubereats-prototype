/* eslint-disable consistent-return */
const { Op } = require("sequelize");
const { menu } = require("../models/index");

// eslint-disable-next-line consistent-return
const addItem = async (
  menu_id,
  item_image,
  item_name,
  item_desc,
  item_type,
  item_price
) => {
  try {
    const itemObject = await menu.create({
      menu_id,
      item_image,
      item_name,
      item_desc,
      item_type,
      item_price,
    });
    return {
      statusCode: 201,
      body: itemObject,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getItemDetails = async (item_id) => {
  try {
    const itemObject = await menu.findByPk(item_id);
    if (itemObject !== undefined && itemObject !== null) {
      return {
        statusCode: 200,
        body: itemObject,
      };
    }
    return {
      statusCode: 404,
      body: "Item not found",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getItemByName = async (rest_id, item_name) => {
  try {
    const itemObject = await menu.findOne({
      where: {
        item_name: item_name,
        menu_id: rest_id,
      },
    });
    if (itemObject !== undefined && itemObject !== null) {
      return {
        statusCode: 200,
        body: itemObject,
      };
    }
    return {
      statusCode: 404,
      body: "Item not found",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// eslint-disable-next-line consistent-return
const getAllItemsByRestaurant = async (rest_id) => {
  try {
    const menuObj = await menu.findAll({
      where: {
        menu_id: rest_id,
      },
    });
    if (menuObj !== undefined && menuObj !== null) {
      return {
        statusCode: 200,
        body: menuObj,
      };
    } else
      return {
        statusCode: 404,
        body: "No items in Menu.",
      };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// eslint-disable-next-line consistent-return
const searchItems = async (searchQuery) => {
  try {
    const menuObj = await menu.findAll({
      where: {
        [Op.or]: [
          {
            item_name: {
              [Op.substring]: searchQuery,
            },
          },
          {
            item_desc: {
              [Op.substring]: searchQuery,
            },
          },
          {
            item_type: searchQuery,
          },
        ],
      },
    });
    if (menuObj !== undefined && menuObj !== null) {
      return {
        statusCode: 200,
        body: menuObj,
      };
    } else
      return {
        statusCode: 404,
        body: "No items found",
      };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// eslint-disable-next-line consistent-return
const getItemsByType = async (item_type) => {
  try {
    const menuObj = await menu.findAll({
      where: {
        item_type: item_type,
      },
    });
    // console.log(userObject);
    if (menuObj !== undefined && menuObj !== null) {
      return {
        statusCode: 200,
        body: menuObj,
      };
    } else
      return {
        statusCode: 404,
        body: "No items Found",
      };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const updateItem = async (item_id, updateData) => {
  try {
    const updateObject = await menu.update(updateData, {
      where: {
        item_id: item_id,
      },
    });
    if (updateObject !== undefined && updateObject !== null) {
      return {
        statusCode: 200,
        body: updateObject,
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

module.exports = {
  addItem,
  getItemByName,
  getAllItemsByRestaurant,
  getItemDetails,
  searchItems,
  getItemsByType,
  updateItem,
};
