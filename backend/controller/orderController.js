const { Op } = require("sequelize");
const { orders, ordersummary, sequelize } = require("../models/index");

const addOrder = async (
  user_id,
  rest_id,
  store_name,
  store_address,
  cust_name,
  cust_address,
  order_status,
  order_total,
  mode
) => {
  try {
    const orderObject = await orders.create({
      user_id,
      rest_id,
      store_name,
      store_address,
      cust_name,
      cust_address,
      order_status,
      order_total,
      mode,
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
    console.log("Add Order Error: ", err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};

const addItemsToOrder = async (
  order_id,
  item_id,
  item_name,
  item_price,
  item_quantity
) => {
  try {
    const itemObject = await ordersummary.create({
      order_id,
      item_id,
      item_name,
      item_price,
      item_quantity,
    });
    return {
      statusCode: 201,
      body: itemObject,
    };
  } catch (err) {
    console.log("Error encountered while adding to cart: ", err);

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

const removeAllItems = async (order_id) => {
  try {
    const itemObject = await ordersummary.destroy({
      where: {
        order_id: order_id,
      },
    });
    if (itemObject !== 0) {
      return {
        statusCode: 201,
        body: "Items removed",
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
        order_status: "cart",
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

const updateOrder = async (order_id, updateData) => {
  try {
    const updateObject = await orders.update(updateData, {
      where: {
        order_id: order_id,
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

const getUserOrders = async (user_id) => {
  try {
    const orderObject = await orders.findAll({
      where: {
        user_id: user_id,
        order_status: {
          [Op.not]: "cart",
        },
      },
      order: [["updatedAt"]],
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
          store_name: orderObject[0].dataValues.store_name,
          store_address: orderObject[0].dataValues.store_address,
          cust_address: orderObject[0].dataValues.cust_address,
          order_status: orderObject[0].dataValues.order_status,
          order_total: orderObject[0].dataValues.order_total,
          delivery_mode: orderObject[0].dataValues.delivery_mode,
        },
      };
    } else {
      return {
        statusCode: 404,
        body: "No items in cart",
      };
    }
  } catch (err) {
    console.log("Error encountered while gettingcart: ", err);

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
  removeAllItems,
};
