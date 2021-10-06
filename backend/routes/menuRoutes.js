const express = require("express");
const bcrypt = require("bcrypt");

const {
  addItem,
  getAllItemsByRestaurant,
  searchItems,
  getItemDetails,
  getItemsByType,
  updateItem,
  getItemByName,
} = require("../controller/menuController");

const router = express.Router();

/* 
    Get menu for a restaurant
*/
router.get("/items/:rest_id", async (req, res) => {
  const filters = req.query;
  console.log("filters: ", filters);
  const rest_id = req.params.rest_id;
  try {
    let menuItems = await getAllItemsByRestaurant(rest_id);
    if (menuItems.statusCode === 200) {
      if (filters) {
        const menu = menuItems.body.filter((item) => {
          let isValid = true;
          for (key in filters) {
            console.log(key, item["item_name"], filters[key]);
            if (key === "item_type") {
              isValid = isValid && item[key] == filters[key];
            } else if (key === "search") {
              isValid =
                isValid &&
                (item["item_type"] === filters[key] ||
                  item["item_name"]
                    .toLowerCase()
                    .includes(filters[key].toLowerCase()) ||
                  item["item_desc"]
                    .toLowerCase()
                    .includes(filters[key].toLowerCase()));
            }
          }
          return isValid;
        });
        menuItems = menu;
      }
      res.status(200).send({
        menu: menuItems,
      });
    } else if (menuItems.statusCode === 404) {
      res.status(404).send({
        errors: {
          message: menuItems.body,
        },
      });
    } else {
      res.status(500).send({
        errors: {
          message: menuItems.body,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

/* Add Menu Item */
router.post("/item", async (req, res) => {
  const ItemDetails = req.body;
  console.log("Item Details: ", ItemDetails);
  let { menu_id, item_image, item_name, item_desc, item_type, item_price } =
    ItemDetails;
  try {
    item_price = item_price + " $";
    item_type = item_type.toLowerCase();
    let item = await getItemByName(menu_id, item_name);
    if (item.statusCode === 200) {
      res.status(403).send({
        errors: {
          message: "An item with same name already exists.",
        },
      });
    } else {
      const createdItem = await addItem(
        menu_id,
        item_image,
        item_name,
        item_desc,
        item_type,
        item_price
      );
      if (createdItem.statusCode === 201) {
        res.status(201).send({
          item: {
            item_id: createdItem.body.dataValues.item_id,
            item_name: createdItem.body.dataValues.item_name,
          },
        });
      } else {
        res.status(500).send({
          errors: {
            message: createdItem.body.errors[0],
          },
        });
      }
    }
  } catch (err) {
    console.log("Error While Adding Menu Item: ", err);
    res.status(500).send({
      errors: {
        message: err,
      },
    });
  }
});

/* Get item details */
router.get("/item/:item_id", async (req, res) => {
  const item_id = req.params.item_id;
  console.log("Getting Item Details: ", req.body);
  const itemDetails = await getItemDetails(item_id);
  if (itemDetails.statusCode === 200) {
    res.status(200).send({
      user: itemDetails.body,
    });
  } else if (itemDetails.statusCode === 404) {
    res.status(404).send({
      errors: {
        message: itemDetails.body,
      },
    });
  } else {
    res.status(500).send({
      errors: {
        message: itemDetails.body,
      },
    });
  }
});

/* Update Item Details */
router.put("/item/:item_id", async (req, res) => {
  const { updateData } = req.body;
  const item_id = req.params.item_id;
  const updateRes = await updateItem(item_id, updateData);
  if (updateRes.statusCode === 200) {
    res.status(200).send("Item updated successfully!");
  } else {
    res.status(500).send({
      errors: {
        message: updateRes.body,
      },
    });
  }
});

router.get("/pingServer", (req, res) => {
  res.status(200).send("Ping to UberEats API succesful");
});

module.exports = router;
