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
                "Add Department",
                "Add Role",
                "Update Employee Role",
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
                    addEmployee();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Update Employee Role":
                    // songAndAlbumSearch();
                    break;
            }
        });
}

//PRINT ALL EMPLOYEES
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

//FIND EMPLOYEES BY DEPARTMENT NAME
function viewEmployeesbyDepartment() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the Department would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.name);
            connection.query("SELECT * FROM employee WHERE id IN (SELECT id FROM department WHERE ?);", { name: answer.name }, function (err, res) {
                console.table(res);
                runSearch();
            });
        });
}

//FIND EPLOYEES BY MANAGER ID
function viewEmployeesbyManager() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the ID of the Manager would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.name);
            connection.query("SELECT * FROM employee WHERE manager_id IN (SELECT id FROM employee WHERE ?);", { id: answer.name }, function (err, res) {
                console.table(res);
                runSearch();
            });
        });
}

//ADD NEW EMPLOYEE
function addEmployee() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "Enter New Employee's First Name:"
        }, {
            name: "last_name",
            type: "input",
            message: "Enter New Employee's Last Name:"
        }, {
            name: "role_id",
            type: "input",
            message: "Enter New Employee's Role ID:"
        },
        {
            name: "manager_id",
            type: "input",
            message: "Enter New Employee's Manager ID:"
        }]
        )
        .then(function (answer) {
            connection.query("INSERT INTO employee SET ?", {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id
            }, function (err, res) {
                viewAllEmployees();
                runSearch();
            });
        });

}

function viewAllEmployees() {
    let query = `SELECT * FROM employee`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

//ADD NEW DEPARTMENT
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Enter New Department Name:"
        })
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", {
                name: answer.department
            }, function (err, res) {
                viewAllDepartments();
                runSearch();
            });
        });
}

function viewAllDepartments() {
    let query = `SELECT * FROM department`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

//ADD NEW ROLE
function addRole() {
    inquirer
      .prompt([{
        name: "title",
        type: "input",
        message: "Enter New Role Title:"
      }, {
        name: "salary",
        type: "input",
        message: "Enter New Role Salary:"
      }, {
        name: "department_id",
        type: "input",
        message: "Enter New Role Department ID:"
      },]
      )
      .then(function (answer) {
        connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id
          }, function (err, res) {
            if (err) throw err;
            viewAllRoles();
            runSearch();
          });
      });
  }

  function viewAllRoles() {
    let query = `SELECT * FROM role`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}