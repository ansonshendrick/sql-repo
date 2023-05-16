// Import necessary packages
const mysql = require('mysql');
const inquirer = require('inquirer');

// Create MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'company_db',
});

// Establish database connection
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
  start();
});

// Function to display initial menu of choices
const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add department',
        'Add role',
        'Add employee',
        'Update employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          connection.end();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          start();
          break;
      }
    });
};

// Function to view all departments
const viewAllDepartments = () => {
  connection.query('SELECT id, name FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
};

// Function to view all roles
const viewAllRoles = () => {
  connection.query(
    `
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

// Function to view all employees
const viewAllEmployees = () => {
  connection.query(
    `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

// Function to add a department
const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the new department?',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answer.name },
        (err) => {
          if (err) throw err;
          console.log('New department added successfully!');
          start();
        }
      );
    });
};

// Function to add a role
const addRole = () => {
    connection.query('SELECT id, name FROM department', (err, res) => {
      if (err) throw err;
      const departments = res.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
  
      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the new role?',
            validate: (value) => {
              const valid = !isNaN(parseFloat(value));
              return valid || 'Please enter a number';
            },
          },
          {
            name: 'department_id',
            type: 'list',
            message: 'Which department does the new role belong to?',
            choices: departments,
          },
        ])
        .then((answer) => {
          connection.query(
            'INSERT INTO role SET ?',
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department_id,
            },
            (err) => {
              if (err) throw err;
              console.log('New role added successfully!');
              start();
            }
          );
        });
    });
  };
  