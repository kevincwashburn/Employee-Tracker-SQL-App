const mysql = require("mysql");
const inquirer = require("inquirer");
// const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "tracker_db"
});

const menuList = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "menu",
        choices: [
            "View All Employees",
            "View Departments",
            "View Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "Exit"
        ]
    }
];




const createEmployee = () => {
    connection.query("SELECT * FROM roles", function (err, roleRes) {
        connection.query("SELECT * FROM employees", function (err, employeeRes) {

            const employeeList = employeeRes.map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })

            employeeList.push({ name: "None", value: null })

            if (err) throw err;

            inquirer.prompt([
                {
                    type: "input",
                    message: "first name: ",
                    name: "firstName",
                },
                {
                    type: "input",
                    message: "last name: ",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "employee's role: ",
                    name: "roleId",
                    choices: roleRes.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                },
                {
                    type: "list",
                    message: "employee's role: ",
                    name: "managerId",
                    choices: employeeList
                }
            ]).then((res) => {
                connection.query(
                    "INSERT INTO employees SET ?",
                    {
                        first_name: res.firstName,
                        last_name: res.lastName,
                        role_id: res.roleId,
                        manager_id: res.managerId
                    },
                    (err, res) => {
                        if (err) console.log(err);
                        chooseAction();
                    }

                )
            })
        })
    })
};

const createDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "name"
        }
    ]).then((res) => {
        connection.query(
            "INSERT INTO departments SET ?",
            {
                name: res.name
            },
            (err, res) => {
                if (err) console.log(err);
                console.log("department added...\n")
                chooseAction();
            }

        )
    })
};

const createRole = () => {

    connection.query(
        "SELECT * FROM departments", function (err, deptRes) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "input",
                    message: "What roll do you want to add?",
                    name: "title"
                },
                {
                    type: "number",
                    message: "What is their salary?",
                    name: "salary"
                },
                {
                    type: "rawlist",
                    message: "enter a department ID",
                    name: "deptID",
                    choices: deptRes.map(dept => {
                        return {
                            name: dept.name,
                            value: dept.id,
                        }
                    })
                }
            ]).then(res => {
                connection.query(
                    "INSERT INTO roles SET ?",
                    {
                        title: res.title,
                        salary: res.salary,
                        department_id: res.deptID
                    },
                    (err, res) => {
                        if (err) console.log(err);
                        console.log("role added...\n");
                        chooseAction();
                    }

                )
            })
        })
};

const init = () => {
    connection.connect((err) => {
        if (err) console.log(err)
        chooseAction()
    })
};

const chooseAction = () => {
    inquirer.prompt(menuList).then(function (res) {

        if (res.menu === "View All Employees") {
            console.log("viewing all employees...\n");
            connection.query("SELECT employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    chooseAction();
                });

        } else if (res.menu === "View Roles") {
            console.log("viewing roles...\n");
            connection.query("SELECT roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    chooseAction();
                });

        } else if (res.menu === "View Departments") {
            console.log("viewing departments...\n");
            connection.query("SELECT name FROM departments",
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    chooseAction();
                });

        } else if (res.menu === "Add Employee") {
            createEmployee();

        } else if (res.menu === "Add Department") {
            createDepartment();

        } else if (res.menu === "Add Role") {
            createRole();

        } else if (res.menu === "Update Employee Role") {
            updateEmployeeRole();
        } else {
            connection.end();
        }
    })
}

init();