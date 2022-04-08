const http = require("http");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const PORT = process.env.PORT || 9000;

//empty object for inserting in userData.json file
var addUserData = {
  completeUserData: [],
};

var saveDataToFile;

//creating server
const server = http.createServer((req, res) => {
  //getting response from user by POST request
  if (req.url === "/register") {
    let userData = "";
    req.on("data", (chunk) => {
      userData += chunk.toString();
    });

    //reading response and saving it in userData.json file
    req.on("end", () => {
      try {
        console.log(JSON.parse(userData));
        const parsedData = JSON.parse(userData);
        console.log("User id :", parsedData.id);

        //Reading userData.json file
        fs.readFile("userData.json", "utf-8", (err, data) => {
          if (err) {
            console.log(err);
          } else {
            addUserData = JSON.parse(data);

            console.log("Read data :", addUserData);

            for (var key in addUserData.completeUserData) {
              var obj = addUserData.completeUserData[key];


              //Email Validation
              if (obj.email === parsedData.email) {
                res.end("Email already exists...Please use another email");
                return;
              }
            }

            addUserData.completeUserData.push(parsedData);
            saveDataToFile = JSON.stringify(addUserData);
            //writing data received from POST request in to the file
            fs.writeFile(
              "userData.json",
              saveDataToFile,
              "utf-8",
              function (err) {
                if (err) throw err;
                //sending response back
                res.end("Registered Successfully...");
              }
            );
          }
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
  //Login code
  else if (req.url === "/login" && req.method === "POST") {
    var loginDetails = "";
    req.on("data", (chunk) => {
      loginDetails += chunk.toString();
    });
    req.on("end", () => {
      const parsedLoginData = JSON.parse(loginDetails);
      try {
        fs.readFile("userData.json", "utf-8", (err, data) => {
          if (err) throw err;
          else {
            const readData = JSON.parse(data);
            console.log("Received from user :", parsedLoginData);
            console.log("file data :", readData);

            console.log(parsedLoginData.email);
            var validLogin = false;
            for (var key in readData.completeUserData) {
              var obj = readData.completeUserData[key];
              console.log("from for loop :", obj.email);

              if (
                obj.email === parsedLoginData.email &&
                obj.password === parsedLoginData.password
              ) {
                validLogin = true;
              }
            }
            if (validLogin) {
              res.end("Login Success....");
            } else {
              res.statusCode = 404;
              res.end("Login failed....");
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  //update data
  else if (req.url === "/update" && req.method === "PATCH") {
    var updateUserData = "";
    req.on("data", (chunk) => {
      updateUserData += chunk.toString();
    });
    req.on("end", () => {
      var parsedUpdateUserData = JSON.parse(updateUserData);
      console.log(parsedUpdateUserData.id);

      fs.readFile("userData.json", "utf-8", (err, data) => {
        if (err) {
          res.end(err);
          return;
        } else {
          var oldData = JSON.parse(data);
          var updatedOrNot = false;
          for (var key in oldData.completeUserData) {
            console.log("Key :", oldData.completeUserData[key]["name"]);
            var obj = oldData.completeUserData[key];
            console.log("from for loop :", obj.id);

            if (obj.id === parsedUpdateUserData.id) {
              oldData.completeUserData[key] = parsedUpdateUserData;

              updatedOrNot = true;
              // addUserData.completeUserData.push(parsedData);
              // saveDataToFile = JSON.stringify(addUserData);
            }
          }
          if (updatedOrNot === false) {
            res.end("Data not found");
            return;
          }
          var addUpdatedData = JSON.stringify(oldData);

          fs.writeFile(
            "userData.json",
            addUpdatedData,
            "utf-8",
            function (err) {
              if (err) throw err;
              //sending response back
              res.end("Updated success");
            }
          );
        }
      });
    });
  }

  //Delete data
  else if (req.url === "/delete" && req.method === "DELETE") {
    var deleteId = "";
    req.on("data", (chunk) => {
      deleteId += chunk.toString();
    });
    req.on("end", () => {
      parsedDeleteId = JSON.parse(deleteId);
      // res.end(`Received ID :${parsedDeleteId.id}`);

      fs.readFile("userData.json", "utf-8", (err, data) => {
        if (err) {
          res.end(err);
          return;
        } else {
          var oldData = JSON.parse(data);
          var updatedOrNot = false;
          for (var key in oldData.completeUserData) {
            var obj = oldData.completeUserData[key];

            if (obj.id === parsedDeleteId.id) {
              oldData.completeUserData.splice(key, 1);
              updatedOrNot = true;
              // addUserData.completeUserData.push(parsedData);
              // saveDataToFile = JSON.stringify(addUserData);
            }
          }
          if (updatedOrNot === false) {
            res.end("Data not found");
            return;
          }
          var addUpdatedData = JSON.stringify(oldData);

          fs.writeFile(
            "userData.json",
            addUpdatedData,
            "utf-8",
            function (err) {
              if (err) throw err;
              //sending response back
              res.end("Delete success");
            }
          );
        }
      });
    });
  }
});

//listening to server
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

// http://127.0.0.1:8000/
