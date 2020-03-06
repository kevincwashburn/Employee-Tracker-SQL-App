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
        message:"What would you like to do?",
        name: "menu",
        choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Role",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role"
        ]
    }
];

const employeeList = [
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
        name: "role",
        // choices:[]
    },
    {
        type: "boolean",
        message: "Does this employee have a manager?",
        name: "managerYN"
    }
];


// const createEmployee = () => {
//     inquirer.prompt(employeeList).then((res) => {
//         connection.query(
//             "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
//             [
//                 res.firstName,
            
//                 res.lastName,
            
//                 res.roleId,
        
//                 res.managerId,
//             ],
//             (err, res) => {
//                 if (err) console.log(err);
//                 chooseAction();
//             }

//         )
//     })
// }

const createDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "name"
        }
    ]).then((res) => {
        connection.query(
            "INSERT INTO department (dept_name) VALUES (?)",
            [
                res.name
            ],
            (err, res) => {
                if (err) console.log(err);
                console.log("department added...\n")
                chooseAction();
            }
            
        )
    })
};

const createRole = () => { // UNFINISHED

    connection.query(
        "SELECT * FROM department", function(err, deptRes) {
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
                choices: "",
            }
        ])
    })
};

const init = () => {
    connection.connect((err) => {
        if (err) console.log(err)
        chooseAction()
    })
};

const chooseAction = () => {
    inquirer.prompt(menuList).then(function(res) {

        if (res.menu === "View All Employees") {
            console.log("viewing all employees...\n");
            connection.query("SELECT * FROM employee", 
            function(err, res) {
                if (err) throw err;
                console.table(res);
                chooseAction();
            });
        
        } else if (res.menu === "View All Employees By Department") {                   // INCOMPLETE
            console.log("viewing employees by department...\n");
            connection.query("SELECT * FROM department", function(err, res) {
                if (err) throw err;

                console.table(res);
            });

        } else if (res.menu === "View All Employees By Role") {                         // INCOMPLETE
            console.log("viewing employees by role...\n");
            connection.query("SELECT * FROM roles", function(err, res) {
                if (err) throw err;
                console.table(res);
            });

        } else if (res.menu === "Add Employee") {
            createEmployee();

        } else if (res.menu === "Add Department") {
            createDepartment();
            
        } else if (res.menu === "Add Role") {
            createRole();

        } else if (res.menu === "Update Employee Role") {
            updateEmployeeRole();
        }
    })
}

init();