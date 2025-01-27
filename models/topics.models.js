const db = require("../db/connection");

function selectTopics() {
  return db.query("SELECT * FROM topics").then((response) => {
    return response.rows;
  });
}

module.exports = { selectTopics };
