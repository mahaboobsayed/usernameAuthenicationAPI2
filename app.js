//bismilla
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const dbpath = path.join(__dirname, "userData.db");
app.use(express.json());
let db = null;
const initiliaseDBandServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () =>
      console.log("Server running at http://localhost:3000/users/")
    );
  } catch (e) {
    console.log(`DB error:${message.e}`);
  }
};
initiliaseDBandServer();
const validatepassword = (password) => {
  return password.length > 4;
};
//API 1
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedpassword = await bcyrpt.hash(password, 10);
  const dbQuery = `SELECT *
  FROM
  user
  WHERE
  username='${username}'`;
  const userdetails = await db.get(dbQuery);
  if (userdetails === undefined) {
    const newuserQuery = `INSERT INTO user [(username,name,password,gender,location)]
      VALUES('${username}','${name}','${hashedpassword}','${gender}','${location}')`;
    if (validatepassword(password)) {
      await db.run(dbQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
//AP1 2
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const Dbquery = `SELECT *
  FROM
  user
  WHERE
  username='${username}'`;
  const userDb = await db.get(Dbquery);

  if (userDb === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const passwordmatched = bcrypt.compare(password, userDb.password);
    if (passwordmatched === true) {
      response.send("Login success");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});
app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const dbQuery = `SELECT *
  FROM
  user
  WHERE
  username='${username}`;
  const userdetails = db.get(dbQuery);
  if (userdetails === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const ispasswordmatched = bcrypt.compare(oldPassword, userdetails.password);
    if (ispasswordmatched === true) {
      if (validatepassword(newPassword)) {
        const hashedpassword = bcrypt.hash(newPassword, 10);
        const updatePasswordQuery = `UPDATE user
                  SET password='${hashedpassword}'
                  WHERE
                  username='${username}'`;
        const user = await db.run(updatePasswordQuery);
        response.send("Successful password update");
      } else {
        response.status(400);
        response.send("Password is too short");
      }
    } else {
      reposnse.status(400);
      response.send("Invalid current password");
    }
  }
});

module.exports = app;
