/* eslint-disable consistent-return */
const { Op } = require("sequelize");
const { users, favorite } = require("../models/index");

// eslint-disable-next-line consistent-return
const createUser = async (
  first_name,
  last_name,
  phone_number,
  email,
  password,
  street_address,
  city,
  zip,
  state,
  country
) => {
  try {
    const userObject = await users.create({
      first_name,
      last_name,
      phone_number,
      email,
      password,
      street_address,
      city,
      zip,
      state,
      country,
    });
    return {
      statusCode: 201,
      body: userObject,
    };
  } catch (err) {
    console.log("Error while creating user row: ", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

// eslint-disable-next-line consistent-return
const getUser = async (userID) => {
  try {
    const userObject = await users.findByPk(userID);
    // console.log(userObject);
    if (userObject !== undefined && userObject !== null) {
      // console.log(200);
      return {
        statusCode: 200,
        body: userObject,
      };
    }
    return {
      statusCode: 404,
      body: "User Unauthorized",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getUserByCreds = async (email) => {
  try {
    const userObject = await users.findOne({
      where: {
        email,
      },
    });
    if (userObject !== undefined && userObject !== null) {
      return {
        statusCode: 200,
        body: userObject,
      };
    } else {
      return {
        statusCode: 404,
        body: "You are not registered. Please create an account.",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const updateUser = async (userID, updateData) => {
  try {
    const updateObject = await users.update(updateData, {
      where: { user_id: userID },
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

const addFavorite = async (rest_id, user_id) => {
  try {
    const userObject = await favorite.create({
      rest_id,
      user_id,
    });
    return {
      statusCode: 201,
      body: userObject,
    };
  } catch (err) {
    console.log("Error while creating user row: ", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getFavorite = async (user_id) => {
  try {
    const favObject = await favorite.findAll({
      where: { user_id: user_id },
    });
    if (favObject !== undefined && favObject !== null) {
      return {
        statusCode: 200,
        body: favObject,
      };
    } else {
      return {
        statusCode: 404,
        body: "You have not added any restaurants",
      };
    }
  } catch (err) {
    console.log("Error while creating user row: ", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const removeFavorite = async (user_id, rest_id) => {
  const favObj = await favorite.destroy({
    where: {
      user_id: user_id,
      rest_id: rest_id,
    },
  });
  if (favObj === 1) {
    return {
      statusCode: 201,
      body: "Remove restaurant from favorites",
    };
  } else {
    return {
      statusCode: 403,
      body: "Invalid Restaurant Id",
    };
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  getUserByCreds,
  addFavorite,
  getFavorite,
  removeFavorite,
};
