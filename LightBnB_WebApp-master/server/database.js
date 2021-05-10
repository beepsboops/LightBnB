const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 *
 */
const getUserWithEmail = function (email) {
  // let values = [email];
  return pool
    .query(
      `SELECT * FROM users
    WHERE email = $1`,
      [email]
    )
    .then(function (res) {
      if (res.rows.length === 0) {
        // Checks the database to see if there is a row that exists with given email
        console.log("getUserWithEmail: email doesn't exist!!");
        return null;
      }
      console.log("getUserWithEmail: email exists!!");
      return res.rows[0];
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.

const getUserWithId = function (id) {
  return Promise.resolve(users[id]);
};
exports.getUserWithId = getUserWithId;
*/

const getUserWithId = function (id) {
  return pool
    .query(
      `SELECT * FROM users
    WHERE id = $1`,
      [id]
    )
    .then(function (res) {
      if (res.rows.length === 0) {
        // Checks the database to see if there is a row that exists with given email
        console.log("getUserWithId: id doesn't exist!!");
        return null;
      }
      console.log("getUserWithId: id does exist!!:", res.rows[0]);
      return res.rows[0];
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 * 
 const addUser = function (user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
};
exports.addUser = addUser;
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [user.name, user.email, user.password]
    )
    .then(function (res) {
      console.log("addUser:", res);
      return res.rows[0];
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT *
      FROM properties p
      JOIN reservations r ON p.id = r.property_id
      WHERE guest_id = $1
      LIMIT $2
      `,
      [guest_id, limit]
    )
    .then(function (res) {
      console.log("getAllReservations res:", res);
      return res.rows;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3a)
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // 3b) if an owner_id is passed in, only return properties belonging to that owner.
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}`;
  }

  // // 3c) if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `AND cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night <= $${queryParams.length}`;
  }
  console.log("trace1");
  console.log(queryString);
  queryString += "GROUP BY properties.id";
  console.log("trace2");
  console.log(queryString);
  // 3d) if a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString = `SELECT * FROM (
      ${queryString}) t
      WHERE t.average_rating > ${queryParams.length}`;
    // let qs2 = `SELECT * FROM (
    //   ${queryString}) t
    //   WHERE t.average_rating > ${queryParams.length}`;
    // queryString = qs2;
  }
  console.log("trace3");
  console.log(queryString);

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;

  // My code
  return pool.query(
    `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country,
    parking_spaces, number_of_bathrooms,
    number_of_bedrooms)
    VALUES (${property})
    `,
    [guest_id, limit]
  );

  return Promise.resolve(property);
};
exports.addProperty = addProperty;

/* addProperty Test
INSERT INTO properties
{
  owner_id: int ,
  title: string,
  description: string,
  thumbnail_photo_url: string,
  cover_photo_url: string,
  cost_per_night: string,
  street: string,
  city: string,
  province: string,
  post_code: string,
  country: string,
  parking_spaces: int,
  number_of_bathrooms: int,
  number_of_bedrooms: int
}

*/
