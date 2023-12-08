const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeeTracker_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
  console.log("Connected to the database.");
  startApp();
});

function startApp() {
  inquirer
    .prompt({
      type: "list",
      name: "Menu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then((answers) => {
      switch (answers.Menu) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Quit":
          quit();
          break;
      }
    });
}

function viewAllEmployees() {
  const query = "SELECT * FROM employee";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the first name of the employee",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the last name of the employee",
      },
      {
        type: "input",
        name: "role_id",
        message: "Enter the role ID of the employee",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Enter the manager ID of the employee",
      },
    ])
    .then((answers) => {
      const query = "INSERT INTO employee SET ?";
      db.query(query, answers, (err, results) => {
        if (err) throw err;
        console.log(
          `Employee ${answers.first_name} ${answers.last_name} has been added`
        );
        startApp();
      });
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message: "Enter the ID of the employee whose tole you want to update:",
      },
      {
        type: "input",
        name: "new_role_id",
        message: "Enter the new role ID for the employee: ",
      },
    ])
    .then((answers) => {
      const query = "UPDATE employee SET role_id = ? WHERE id = ?";
      db.query(
        query,
        [answers.new_role_id, answers.employee_id],
        (err, results) => {
          if (err) throw err;
          console.log("Employee updated");
          startApp();
        }
      );
    });
}

function viewAllRoles() {
  const query = "SELECT * FROM role";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

function viewAllDepartments() {
  const query = "SELECT * FROM department";
  db.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      const query = "INSERT INTO department SET ?";
      db.query(query, answers, (err, results) => {
        if (err) throw err;
        console.log(`Department ${answers.name} has been added`);
        startApp();
      });
    });
}

function quit() {
  process.exit();
}
