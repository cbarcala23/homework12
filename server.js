var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "@Lph@20!!",
    database: "emp_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees By Department":
                    viewEmployeesbyDepartment();
                    break;

                case "View All Employees By Manager":
                    viewEmployeesbyManager();
                    break;

                case "Add Employee":
                    // songSearch();
                    break;

                case "Remove Employee":
                    // songAndAlbumSearch();
                    break;

                case "Update Employee Role":
                    // songAndAlbumSearch();
                    break;

                case "Update Employee Manager":
                    // songAndAlbumSearch();
                    break;
            }
        });
}
function viewAllEmployees() {
    let query = `SELECT t.id, t.first_name, t.last_name, title, name 'department', salary, IFNULL(CONCAT(m.first_name, ' ' , m.last_name),
    'null') AS 'manager' FROM employee t
    LEFT JOIN role on t.role_id = role.id
    LEFT JOIN employee m ON t.manager_id = m.id
    LEFT JOIN department ON department_id = department.id;`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    })
    runSearch();
}

// function viewAllDepartments() {
//     let query = `SELECT * FROM department WHERE ?`;
//     connection.query(query, function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         start();
//     })
//     runSearch();
// }

function viewEmployeesbyDepartment() {
    inquirer
      .prompt({
        name: "name",
        type: "input",
        message: "What Department would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.name);
        connection.query("SELECT * FROM employee WHERE id IN (SELECT id FROM department WHERE ?);", { name: answer.name }, function(err, res) {
            console.table(res);
          runSearch();
        });
      });
  }

  function viewEmployeesbyManager() {
    inquirer
      .prompt({
        name: "name",
        type: "input",
        message: "What Manager would you like to look for?"
      })
      .then(function(answer) {
        console.log(answer.name);
        connection.query("SELECT * FROM employee WHERE id IN (SELECT id FROM department WHERE ?);", { name: answer.name }, function(err, res) {
            console.table(res);
          runSearch();
        });
      });
  }