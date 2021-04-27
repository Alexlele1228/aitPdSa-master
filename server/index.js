const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userID",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 99999,
    },
  })
);




var db = mysql.createConnection({
  user: "9ab8b7_pdnsa",
  host: "MYSQL5030.site4now.net",
  password: "a1tpdnsa",
  database: "db_9ab8b7_pdnsa",
});

db.on('error', function (err) {
  console.log('db error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    db = mysql.createConnection({
      user: "9ab8b7_pdnsa",
      host: "MYSQL5030.site4now.net",
      password: "a1tpdnsa",
      database: "db_9ab8b7_pdnsa",
    });

  } else {
    throw err;
  }
});

app.get("/getAvtivities", (req, res) => {
  db.query('SELECT ID, Activity_Name FROM activity_type ', function (error, results) {
    if (error) throw error;
    res.json(results);
  });
});

// app.get("/getCategories", (req, res) => {
//   db.query('SELECT category_name, ID FROM sfia_cat', function (error, results) {
//     if (error) throw error;
//     res.json(results);
//   });
// });


// app.post("/getSubCategories", (req, res) => {

//   const id = req.body.main_category_id;
//   db.query(
//     "SELECT Subcategory_Name, ID FROM sfia_subcat Where ID_Cat=? ",
//     id,
//     (err, result) => {
//       console.log(err);
//       res.send(result);
//     }
//   );
// });

// app.get("/getSkills", (req, res) => {
//   db.query('SELECT Skill_Name, ID FROM sfia_skill', function (error, results) {
//     if (error) throw error;
//     res.json(results);
//   });
// });

app.get("/getAllRecord", (req, res) => {
  db.query('select staff_users.id as `ID`, staff_users.username as `Name`, sum(if(staff_record.ID_Activity_Type=1, staff_record.Activity_Duration,null)) as `Professional Development Total Hours`,sum(if(staff_record.ID_Activity_Type=2, staff_record.Activity_Duration,null)) as `Scholarly Activity Total Hours`FROM staff_users, staff_record WHERE staff_users.id=staff_record.ID_User group by staff_users.username order by staff_users.id', function (error, results) {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/getEligibleUser", (req, res) => {
  db.query('select email as Email FROM staff_users', function (error, results) {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/getIndividualRecord", (req, res) => {

  const id = req.body.user_id;
  db.query(
    "SELECT DISTINCT staff_record.id as `ID`, (select activity_type.activity_name from activity_type where activity_type.ID=staff_record.ID_Activity_Type) as `Activity Type`, staff_record.activity_date as `Activity_Date`, staff_record.activity_duration as `Activity Duration`, staff_record.id_skill_level as `Skill Level`, staff_record.topic as `Topic`, staff_record.description as `Description` from activity_type, staff_record Where staff_record.id_user=?",
    id,
    (err, result) => {
      console.log(err);
      res.send(result);
    }
  );
});

app.post("/judgeUserExits", (req, res) => {
  const email = req.body.email
  const name = req.body.name
  db.query(
    "SELECT * FROM staff_users where email = ?", email, (err, result) => {
      if (err)
        console.log(err);
      if (result[0]) {
        db.query(
          "update staff_users set `username`= ? where email = ?", [name, email], (err, result) => {
            if (err)
              console.log(err);
            if (result) {
              db.query(
                "SELECT * FROM staff_users where email = ?", email, (err, result) => {
                  if (err)
                    console.log(err);
                  if (result) {
                    req.session.user = result[0];
                    console.log("这里" + req.session.user)
                    res.send(result[0])
                  }
                  else
                    res.send(result);
                }
              );
            } else
              res.send(result);
          }
        );
      } else
        res.send(result);
    }
  );
});

app.post("/addToStaffTable", (req, res) => {
  const email = req.body.email;
  db.query(
    "SELECT * FROM staff_users where email = ?", email, (err, result) => {
      if (err)
        console.log(err);
      if (result[0]) {
        console.log(result[0])
        res.send({ exits: true });
      } else {
        db.query(
          "INSERT INTO `staff_users` ( `email`) values(?);",
          email,
          (err, result) => {
            console.log(err);
            if (result) {
              db.query(
                "SELECT * FROM staff_users where email = ?", email, (err, result) => {
                  if (err)
                    console.log(err);
                  res.send(result);
                }
              );
            }
          }
        );
      }
    }
  );

});


app.get("/getSkillLevel", (req, res) => {
  db.query(
    "SELECT Level, ID FROM sfia_skill_level", (err, result) => {
      if (err)
        console.log(err);
      res.send(result);
    }
  );
});



app.post("/submitRecord", (req, res) => {
  const uid = req.body.uid;
  const selected_avtivity_type = req.body.selected_avtivity_type;
  const selected_start_date = req.body.selected_start_date;
  const select_topic = req.body.selected_topic;
  const selected_duration = req.body.selected_duration;
  //const selected_main_category=req.body.selected_main_category;
  //const selected_sub_category=req.body.selected_sub_category;
  //const selected_skill=req.body.selected_skill;
  const selected_skill_level = req.body.selected_skill_level;
  const selected_description = req.body.selected_description;


  db.query(
    "INSERT INTO staff_record (ID_User, ID_Activity_Type, Activity_Date, Activity_Duration, ID_Skill_Level, Topic, Description) VALUES(?,?,?,?,?,?,?)",
    [uid, selected_avtivity_type, selected_start_date, selected_duration, selected_skill_level, select_topic, selected_description],

    (err, result) => {
      console.log(err);
      res.send(result);
    }
  );
});



app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;


  db.query(
    "SELECT user_id as `id`, username, id as `admin_id`, email, password FROM admin_users WHERE email =?;",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result[0];
            res.send(result)
          } else {
            res.send({ message: "Wrong email/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  if (req.session.user) {
    console.log("about to logout，req.session.user=：" + req.session.user);
    req.session.user = null;
    console.log("logged out，req.session.user=：" + req.session.user);
    res.send(true)
  } else {
    console.log("user in session:req.session.user=" + req.session.user)
    res.send(false);
  }
});

app.get("/checkIfAdmin", (req, res) => {
  console.log("--server check if current user is admin--");
  console.log("current user's user_id is: " + req.session.user.id);
  db.query(
    "select * from admin_users where user_id=?",
    req.session.user.id,
    (err, result) => {
      console.log(err);
      res.send(result);
    }
  );

});

app.post("/checkIfSpecificUserAdmin", (req, res) => {
  console.log("--server check if specific user is admin--");
  db.query(
    "select * from admin_users where user_id=?",
    req.body.user_id,
    (err, result) => {
      console.log(err);
      res.send(result);
    }
  );

});

app.post("/levelUpUser", (req, res) => {
  const password = 'admin'
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO admin_users (username, email, password, user_id) values((select username from staff_users where id=?),(select email from staff_users where id=?),?,?)",
      [req.body.user_id, req.body.user_id, hash, req.body.user_id],
      (err, result) => {
        console.log(err);
        res.send(result);
      }
    );
  });


});

app.post("/changePassword", (req, res) => {
  const user_id = req.body.user_id;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "UPDATE admin_users SET password=? where user_id=?",
      [hash, user_id],
      (err, result) => {
        console.log(err);
        req.session.user=null;
        res.send(result);
      }
    );
  });


});


app.get("/getStaffID", (req, res) => {
  console.log("--server trying to get user from session--")
  if (req.session.user) {
    console.log("--found user in session--")
    res.send({ user: req.session.user, loggedIn: true });
  } else {
    console.log("--nothing in session yet--")
    res.send({ loggedIn: false });
  }
});



app.listen(3001, () => {
  console.log("running server");
});
