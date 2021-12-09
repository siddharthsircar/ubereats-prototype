const graphql = require("graphql");
const {
  createRestaurant,
  getRestaurantProfile,
  updateRestaurant,
  getRestaurantbyEmail,
  getRestaurantsByUserZip,
  getRestaurants,
} = require("../controller/restaurantController");

const {
  createUser,
  getUser,
  updateUser,
  getUserByCreds,
  addFavorite,
  getFavorite,
  removeFavorite,
} = require("../controller/userController");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const StoreType = new GraphQLObjectType({
  name: "restaurant",
  fields: () => ({
    rest_id: { type: GraphQLString },
    store_image: { type: GraphQLString },
    store_name: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    timings: { type: GraphQLString },
    email: { type: GraphQLString },
    delivery_mode: { type: GraphQLString },
    street_address: { type: GraphQLString },
    city: { type: GraphQLString },
    zip: { type: GraphQLInt },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    user_id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    email: { type: GraphQLString },
    street_address: { type: GraphQLString },
    city: { type: GraphQLString },
    zip: { type: GraphQLInt },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "order",
  fields: () => ({
    order_id: { type: GraphQLString },
    rest_id: { type: GraphQLString },
    store_name: { type: GraphQLString },
    store_address: { type: GraphQLString },
    user_id: { type: GraphQLString },
    cust_name: { type: GraphQLString },
    cust_address: { type: GraphQLString },
    order_status: { type: GraphQLString },
    total_items: { type: GraphQLString },
    mode: { type: GraphQLString },
    order_total: { type: GraphQLString },
  }),
});

const SummaryType = new GraphQLObjectType({
  name: "ordersummary",
  fields: () => ({
    order_id: { type: GraphQLString },
    item_id: { type: GraphQLString },
    item_name: { type: GraphQLString },
    item_quantity: { type: GraphQLInt },
    item_price: { type: GraphQLString },
  }),
});

const MenuType = new GraphQLObjectType({
  name: "menu",
  fields: () => ({
    item_id: { type: GraphQLString },
    menu_id: { type: GraphQLString },
    item_image: { type: GraphQLInt },
    item_name: { type: GraphQLString },
    item_desc: { type: GraphQLString },
    item_type: { type: GraphQLString },
    category: { type: GraphQLString },
    item_price: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query",
  fields: {
    getRestaurant: {
      type: StoreType,
      args: { rest_id: { type: GraphQLString } },
      async resolve(parent, args) {
        console.log("Resolving Get Restaurant.");
        const restDetails = await getRestaurantProfile(args.rest_id);
        console.log(restDetails.body.dataValues);
        if (restDetails.statusCode === 200) {
          return restDetails.body.dataValues;
        } else {
          return "User not found";
        }
      },
    },
    getUser: {
      type: UserType,
      args: { user_id: { type: GraphQLString } },
      async resolve(parent, args) {
        console.log("Resolving Get User.");
        try {
          const userDetails = await getUser(args.user_id);
          if (userDetails.statusCode === 200) {
            return userDetails.body.dataValues;
          } else if (userDetails.statusCode === 404) {
            return "User not found";
          }
        } catch (err) {
          console.log("Error encountered while getting user profile: ", err);
        }
      },
    },
    getRestaurants: {
      type: new GraphQLList(StoreType),
      args: { zip: { type: GraphQLInt }, searchQuery: { type: GraphQLString } },
      async resolve(parent, args) {
        try {
          const zip = args.zip;
          const searchQuery = args.searchQuery;
          console.log("Zip: ", zip, "Search: ", searchQuery);
          let restDetails = null;
          if (zip !== undefined) {
            restDetails = await getRestaurantsByUserZip(zip);
          } else {
            restDetails = await getRestaurants();
          }
          if (restDetails.statusCode === 200) {
            if (searchQuery) {
              const restaurants = restDetails.body.filter((restaurant) => {
                let isValid = true;
                isValid =
                  isValid &&
                  (restaurant["store_name"]
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    restaurant["city"]
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()));
                return isValid;
              });
              restDetails.body = restaurants;
              console.log("RestDetails: ", restDetails);
            }
            return restDetails.body;
          } else if (restDetails.statusCode === 404) {
            return {
              errors: {
                message: "No Restaurants Found!!",
              },
            };
          } else {
            return {
              errors: {
                message: restDetails.body,
              },
            };
          }
        } catch (err) {
          console.log("Error encountered while getting restaurants: ", err);
          return {
            errors: {
              message: "Internal Server Error",
            },
          };
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        street_address: { type: GraphQLString },
        city: { type: GraphQLString },
        zip: { type: GraphQLInt },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          let user = await getUserByCreds(args.email);
          if (user.statusCode === 200) {
            return {
              errors: {
                message: "Email address already registered.",
              },
            };
          } else {
            const createRes = await createUser(
              args.first_name,
              args.last_name,
              args.phone_number,
              args.email,
              args.password,
              args.street_address,
              args.city,
              args.zip,
              args.state,
              args.country
            );
            if (createRes.statusCode === 201) {
              return createRes.body.dataValues;
            } else {
              return {
                errors: {
                  message: "Internal Server Error",
                },
              };
            }
          }
        } catch (err) {
          console.log("Error encountered while registering user: ", err);
          return {
            errors: {
              message: "Internal Server Error",
            },
          };
        }
      },
    },

    addRestaurant: {
      type: StoreType,
      args: {
        store_image: { type: GraphQLString },
        store_name: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        timings: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        delivery_mode: { type: GraphQLString },
        street_address: { type: GraphQLString },
        city: { type: GraphQLString },
        zip: { type: GraphQLInt },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          let restaurant = await getRestaurantbyEmail(args.email);
          if (restaurant.statusCode === 200) {
            return {
              errors: {
                message: "Email address already registered.",
              },
            };
          } else {
            const createRes = await createRestaurant(
              args.store_image,
              args.store_name,
              args.phone_number,
              args.timings,
              args.email,
              args.password,
              args.delivery_mode,
              args.street_address,
              args.city,
              args.zip,
              args.state,
              args.country
            );
            if (createRes.statusCode === 201) {
              return createRes.body.dataValues;
            } else {
              return {
                errors: {
                  message: "Internal Server Error",
                },
              };
            }
          }
        } catch (err) {
          console.log("Error encountered while registering restaurant: ", err);
          return {
            errors: {
              message: "Internal Server Error",
            },
          };
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
