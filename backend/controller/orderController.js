const { Op } = require("sequelize");
const { orders, ordersummary, sequelize } = require("../models/index");

const addOrder = async (user_id, rest_id, order_status) => {
  try {
    const orderObject = await orders.create({
      user_id,
      rest_id,
      order_status,
    });
    return {
      statusCode: 201,
      body: {
        order_id: orderObject.order_id,
        rest_id: orderObject.rest_id,
        order_status: orderObject.order_status,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const addItemsToOrder = async (order_id, item_id, item_name, item_price) => {
  try {
    const itemObject = await ordersummary.create({
      order_id,
      item_id,
      item_name,
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

const removeFromCart = async (order_id, item_id) => {
  try {
    const itemObject = await ordersummary.destroy({
      where: {
        order_id: order_id,
        item_id: item_id,
      },
    });
    const itemsLeft = await ordersummary.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("item_name")), "items_left"],
      ],
    });
    if (itemObject === 1) {
      return {
        statusCode: 201,
        body: "Item removed from cart",
        itemsLeft: itemsLeft[0].dataValues.items_left,
      };
    } else {
      return {
        statusCode: 403,
        body: "Invalid Item Id",
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

const removeCart = async (order_id) => {
  try {
    const itemObject = await orders.destroy({
      where: {
        order_id: order_id,
      },
    });
    if (itemObject === 1) {
      return {
        statusCode: 201,
        body: "Cart Emptied",
      };
    } else {
      return {
        statusCode: 403,
        body: "Invalid Cart Id",
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

const updateOrder = async (order_id, order_status) => {
  try {
    const updateObject = await orders.update(
      { order_status },
      {
        where: {
          order_id: order_id,
        },
      }
    );
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

const getUserOrders = async (user_id) => {
  try {
    const orderObject = await orders.findAll({
      where: {
        user_id: user_id,
        order_status: {
          [Op.not]: "cart",
        },
      },
    });
    if (
      orderObject !== undefined &&
      orderObject !== null &&
      orderObject.length !== 0
    ) {
      return {
        statusCode: 200,
        body: orderObject,
      };
    } else {
      return {
        statusCode: 404,
        body: "No orders found",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getRestaurantOrders = async (rest_id) => {
  try {
    const orderObject = await orders.findAll({
      where: {
        rest_id: rest_id,
        order_status: {
          [Op.not]: "cart",
        },
      },
    });
    if (
      orderObject !== undefined &&
      orderObject !== null &&
      orderObject.length !== 0
    ) {
      return {
        statusCode: 200,
        body: orderObject,
      };
    } else {
      return {
        statusCode: 404,
        body: "No orders found",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getCartOrderId = async (user_id) => {
  try {
    const orderObject = await orders.findAll({
      where: {
        user_id: user_id,
        order_status: "cart",
      },
    });
    if (
      orderObject !== undefined &&
      orderObject !== null &&
      orderObject.length !== 0
    ) {
      return {
        statusCode: 200,
        body: {
          order_id: orderObject[0].dataValues.order_id,
          rest_id: orderObject[0].dataValues.rest_id,
          order_status: orderObject[0].dataValues.order_status,
        },
      };
    } else {
      return {
        statusCode: 404,
        body: "No items in cart",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const getOrderSummary = async (order_id) => {
  try {
    const itemObject = await ordersummary.findAll({
      where: {
        order_id: order_id,
      },
    });
    if (
      itemObject !== undefined &&
      itemObject !== null &&
      itemObject.length !== 0
    ) {
      return {
        statusCode: 200,
        body: itemObject,
      };
    } else {
      return {
        statusCode: 404,
        body: "No items found",
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
  getUserOrders,
  getCartOrderId,
  addOrder,
  getOrderSummary,
  addItemsToOrder,
  removeFromCart,
  removeCart,
  updateOrder,
  getRestaurantOrders,
};
