let allEmployees;
let filteredEmployees = [];
let filterString = "";

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}



function initTable() {

    let url = "http://dummy.restapiexample.com/api/v1/employees";
    document.getElementsByTagName("body")[0].style.cursor = "wait"
    httpGetAsync(url, (response) => {
        allEmployees = (JSON.parse(response));
        // filteredEmployees = Array.from(allEmployees);
        filteredEmployees = [...allEmployees]
        fillTable(allEmployees);
        document.getElementsByTagName("body")[0].style.cursor = "default"

    })
}

function fillTable(employees) {
    console.log(employees.length);

                // <li class="page-item active"><a class="page-link" href="#">1</a></li>
                // <li class="page-item"><a class="page-link" href="#">2</a></li>
                // <li class="page-item"><a class="page-link" href="#">3</a></li>

    // let numPages = Math.ceil(employees.length/50);
    for (let i = 0; i < employees.length; i++) {
        fillSingleRow(employees[i])
    }
    console.log("exit");
}

function fillSingleRow(employeeData) {
    let newRow = document.createElement("tr");
    let photoCell = document.createElement("td");
    let nameCell = document.createElement("td");
    let salaryCell = document.createElement("td");
    let ageCell = document.createElement("td");
    let actionsCell = document.createElement("td");

    // if (employeeData["employee_name"].length > 10) /*  == "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ") */ return;

    nameCell.innerText = employeeData["employee_name"];
    salaryCell.innerText = employeeData["employee_salary"];
    photoCell.style.backgroundImage = 'url("./user.jpg"';
    photoCell.style.backgroundSize = "contain";
    photoCell.style.backgroundRepeat = "no-repeat";
    ageCell.innerText = employeeData["employee_age"];
    actionsCell.appendChild(createActionButtons(employeeData["id"])); //apend

    newRow.appendChild(photoCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(salaryCell);
    newRow.appendChild(ageCell);
    newRow.appendChild(actionsCell);


    document.getElementsByTagName("tbody")[0].appendChild(newRow);
}

function createActionButtons(id) {
    let buttonGroup = document.createElement("div");
    buttonGroup.className = "btn-group";
    buttonGroup.setAttribute("role", "group");
    buttonGroup.setAttribute("aria-label", "actionButtons");

    let actionButton = document.createElement("button");
    actionButton.className = "btn btn-secondary";
    actionButton.setAttribute("onClick", `employeeDetailsModal(${id})`)
    actionButton.innerText = "Details";
    actionButton.setAttribute("data-toggle", "modal")
    actionButton.setAttribute("data-target", "#detailsModal")
    buttonGroup.appendChild(actionButton);
    actionButton = document.createElement("button");
    actionButton.className = "btn btn-secondary";
    actionButton.setAttribute("onClick", `employeeUpdateModal(${id})`)

    actionButton.innerText = "Update";
    actionButton.setAttribute("data-toggle", "modal")
    actionButton.setAttribute("data-target", "#updateModal")

    buttonGroup.appendChild(actionButton);
    actionButton = document.createElement("button");
    actionButton.className = "btn btn-secondary";
    actionButton.setAttribute("onClick", `employeeDeleteModal(${id})`)

    actionButton.innerText = "Delete";
    actionButton.setAttribute("data-toggle", "modal")
    actionButton.setAttribute("data-target", "#deleteModal")
    buttonGroup.appendChild(actionButton);

    return buttonGroup;
}

function employeeDetailsModal(id) {
    let selectedEmployee;
    let url = "http://dummy.restapiexample.com/api/v1/employee/" + id;
    httpGetAsync(url, (response) => {
        selectedEmployee = (JSON.parse(response));
        fillDetailsModal(selectedEmployee);
    })
}

function fillDetailsModal(employeeData) {
    document.getElementById("employeeDetails").innerText = "View: " + employeeData["employee_name"];
    let modalBody = document.getElementsByClassName("modal-body")[0];
    let newRow = document.createElement("div");
    newRow.className = "row";
    let newColKey = document.createElement("div");
    newColKey.classList = "col-lg-4 col-md-12";
    newColKey.innerText = "Name"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";

    let newColValue = document.createElement("div");
    newColValue.classList = "col-lg-8 col-md-12";
    newColValue.innerText = employeeData["employee_name"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);


    newRow.className = "row";
    newColKey = document.createElement("div");
    newColKey.classList = "col-lg-4 col-md-12";
    newColKey.innerText = "Age"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";
    newColValue = document.createElement("div");
    newColValue.classList = "col-lg-8 col-md-12";
    newColValue.innerText = employeeData["employee_age"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);

    newRow.className = "row";
    newColKey = document.createElement("div");
    newColKey.classList = "col-lg-4 col-md-12";
    newColKey.innerText = "Salary"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";

    newColValue = document.createElement("div");
    newColValue.classList = "col-lg-8 col-md-12";
    newColValue.innerText = employeeData["employee_salary"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);

}

function employeeUpdateModal(id) {
    let selectedEmployee;
    let url = "http://dummy.restapiexample.com/api/v1/employee/" + id;
    httpGetAsync(url, (response) => {
        selectedEmployee = (JSON.parse(response));
        console.log(selectedEmployee);
        fillUpdateModal(selectedEmployee);
        document.querySelectorAll("#updateModal > div > div > div.modal-footer > button.btn.btn-success")[0].setAttribute(`onclick`, `saveChanges(${id})`)

    })

}

function fillUpdateModal(employeeData) {
    document.getElementById("employeeUpdate").innerText = "ViewEdit view: " + employeeData["employee_name"];
    document.getElementById("updateName").value = employeeData["employee_name"];
    document.getElementById("updateAge").value = employeeData["employee_age"];
    document.getElementById("updateSalary").value = employeeData["employee_salary"]
    console.log("salary: " + document.getElementById("updateSalary").getAttribute("value"));
}

function httpPutAsync(theUrl, callback, body) {
    var xmlHttp = new XMLHttpRequest();
    console.log("url: " + theUrl);
    console.log("JSON: " + body);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("PUT", theUrl, true); // true for asynchronous 
    xmlHttp.send(body);
}

function saveChanges(id) {

    let age = document.getElementById("updateAge").value;
    let salary = document.getElementById("updateSalary").value;
    let name = document.getElementById("updateName").value;


    stringJSON = createJSON(name, age, salary);
    let url = "http://dummy.restapiexample.com/api/v1/update/" + id;


    httpPutAsync(url, (response) => {
        console.log(JSON.parse(response))
    }, stringJSON)
}


function createJSON(name, age, salary) {
    stringJSON = `{"name":"${name}","age":"${age}","salary":"${salary}"}`;
    return stringJSON;

}

function employeeDeleteModal(id) {
    document.querySelectorAll("#deleteModal > div > div > div.modal-footer > button.btn.btn-danger")[0].setAttribute(`onclick`, `deleteEmployee(${id})`)
}

function deleteEmployee(id) {
    let url = "http://dummy.restapiexample.com/api/v1/delete/" + id;
    console.log(url);
    httpDeleteAsync(url, (response) => {
        console.log(JSON.parse(response))
    })
}

function httpDeleteAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("DELETE", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function addRecord() {
    let age = document.getElementById("createAge").value;
    let salary = document.getElementById("createSalary").value;
    let name = document.getElementById("createName").value;
    // {"name":"test","salary":"123","age":"23"}

    let stringJSON = createJSON(name, age, salary);
    console.log(stringJSON);
    let url = "http://dummy.restapiexample.com/api/v1/create";


    httpPostAsync(url, (response) => {
        console.log(JSON.parse(response))
    }, stringJSON)
}

function httpPostAsync(theUrl, callback, body) {
    var xmlHttp = new XMLHttpRequest();
    console.log("url: " + theUrl);
    console.log("JSON: " + body);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(body);
}

function filterTable(event) {
    console.log("filter string: ", filterString)
    let tbody = document.getElementsByTagName("tbody");
    if (tbody.length > 0) {
        tbody[0].parentNode.removeChild(tbody[0]);
        document.getElementsByTagName("table")[0].appendChild(document.createElement("tbody"));
    }
    let pressedKey = ""
   
    if (event.key.match(/^[a-zA-Z0-9_]{1}$/g))  {
        console.log(event.key);
        pressedKey = event.key;
        filterString = document.querySelectorAll("body > div.container > table > thead > tr:nth-child(2) > th > input")[0].value + pressedKey;
    } else if (event.key == "Backspace"){
        console.log("before Backspace: ", filterString)
        // filteredEmployees = Array.from(allEmployees);
        filteredEmployees = [...allEmployees]
        filterString = filterString.substring(0, filterString.length-1)
        console.log("after Backspace: ", filterString)

    }
    console.log(filterString)



  
    let longitud = filteredEmployees.length;
    for (let i = 0; i < longitud; i++) {
        if ((filteredEmployees[i]["employee_name"].indexOf(filterString) == -1) && (filteredEmployees[i]["employee_age"].indexOf(filterString) == -1) && (filteredEmployees[i]["employee_salary"].indexOf(filterString) == -1)) {
            filteredEmployees.splice(i, 1);
            longitud = filteredEmployees.length;
            i--;
        } else {
            console.log(filteredEmployees[i]["employee_name"], filteredEmployees[i]["employee_name"].indexOf(filterString) ,  filteredEmployees[i]["employee_age"].indexOf(filterString), filteredEmployees[i]["employee_salary"].indexOf(filterString))
        }
    }
    fillTable(filteredEmployees);

}

/* 

TestApp = angular.module('TestApp', ['TestApp.controllers', 'smart-table', 'ui.bootstrap']);

angular.module('TestApp.controllers', []).controller('testController', ['$scope', '$http', '$uibModal', function ($scope, $http, $modal) {
    $scope.loading = false;
    var modalInstance = null;

    $scope.getData = function () {
        $scope.loading = true;
        $http.get("/demos/api/v1/employees")
            .then(function (response) {
                $scope.employees = response.data;
                $scope.loading = false;
            });
    }

    $scope.viewRecord = function (id) {
        if (id > 0) {
            $http.get("/demos/api/v1/employees?id=" + id)
                .then(function (response) {
                    modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'view/view_record.html',
                        controller: 'empViewCtrl',
                        scope: $scope,
                        size: '',
                        resolve: {
                            record: function () {
                                return response.data;
                            }
                        }
                    });
                });

        }


    }

    $scope.addRecord = function () {
        modalInstance = $modal.open({
            animation: false,
            templateUrl: 'view/add_record.html',
            controller: 'addEmpCtrl',
            scope: $scope,
            size: '',
            resolve: {}
        });

    }

    $scope.editRecord = function (id) {
        if (id > 0) {
            $http.get("/demos/api/v1/employees/?id=" + id)
                .then(function (response) {
                    modalInstance = $modal.open({
                        animation: false,
                        templateUrl: 'view/update_record.html',
                        controller: 'updateEmpCtrl',
                        scope: $scope,
                        size: '',
                        resolve: {
                            record: function () {
                                return response.data;
                            }
                        }
                    });
                });
        }

    }

    $scope.cancelModal = function () {
        modalInstance.dismiss('cancel');
    }

    $scope.saveRecord = function (params) {
        console.log(params);
        $http.post("/demos/api/v1/employees", params)
            .then(function (response) {
                console.log(response);
                $scope.getData();
            });
    }

    $scope.updateRecord = function (params) {
        $http.put("/demos/api/v1/employees/?id=" + params.id, params)
            .then(function (response) {
                console.log(response);
                $scope.getData();
            });
    }
    $scope.deletRecord = function (id) {
        if (confirm('Are you sure you want to delete this?')) {
            $http.delete("/demos/api/v1/employees/?id=" + id)
                .then(function (response) {
                    console.log(response);
                });
        }

    }
    $scope.getData();
}]);

TestApp.controller('empViewCtrl', ['$scope', '$http', 'record', function ($scope, $http, record) {
    function init() {
        $scope.employee = record[0];
    }
    init();

}]);

TestApp.controller('addEmpCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.saveEmp = function () {
        $scope.datas = {};

        if (!angular.isDefined($scope.employee_name) || $scope.employee_name === '') {
            alert('employee name is empty');
            return;
        } else if (!angular.isDefined($scope.employee_age) || $scope.employee_age === '') {
            alert('employee age is empty');
            return;
        } else if (!angular.isDefined($scope.employee_salary) || $scope.employee_salary === '') {
            alert('employee salary is empty');
            return;
        } else {
            $scope.datas.employee_name = $scope.employee_name;
            $scope.datas.employee_age = $scope.employee_age;
            $scope.datas.employee_salary = $scope.employee_salary;
            console.log($scope.datas);
        }
        $scope.cancelModal();
        $scope.saveRecord($scope.datas);
    };

}]);

TestApp.controller('updateEmpCtrl', ['$scope', '$http', 'record', function ($scope, $http, record) {
    $scope.employee = {};

    function init() {
        $scope.employee.employee_name = record[0].employee_name;
        $scope.employee.employee_age = parseInt(record[0].employee_age);
        $scope.employee.employee_salary = parseInt(record[0].employee_salary);

        $scope.employee.id = parseInt(record[0].id);
    }
    $scope.updateEmp = function () {
        $scope.cancelModal();
        if (!angular.isDefined($scope.employee.employee_name) || $scope.employee.employee_name === '') {
            alert('employee name is empty');
            return;
        } else if (!angular.isDefined($scope.employee.employee_age) || $scope.employee.employee_age === '') {
            alert('employee age is empty');
            return;
        } else if (!angular.isDefined($scope.employee.employee_salary) || $scope.employee.employee_salary === '') {
            alert('employee salary is empty');
            return;
        }
        $scope.updateRecord($scope.employee);
    }
    init();

}]); */