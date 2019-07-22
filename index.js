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
    let allEmployees;
    let url = "http://dummy.restapiexample.com/api/v1/employees";
    httpGetAsync(url, (response) => {
        allEmployees = (JSON.parse(response));
        fillTable(allEmployees);
    })
}

function fillTable(employees) {
    console.log(employees.length);
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

    if (employeeData["employee_name"].length > 10)/*  == "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ") */ return;

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
    actionButton.setAttribute("onClick" , `employeeUpdateModal(${id})`)

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

function employeeDetailsModal(id){
    let selectedEmployee;
    let url = "http://dummy.restapiexample.com/api/v1/employee/" + id;
    httpGetAsync(url, (response) => {
        selectedEmployee = (JSON.parse(response));
        fillDetailsModal(selectedEmployee);
    })
}

function fillDetailsModal(employeeData){
    document.getElementById("employeeDetails").innerText ="View: " +  employeeData["employee_name"];
    let modalBody = document.getElementsByClassName("modal-body")[0];
    let newRow = document.createElement("div");
    newRow.className = "row";
    let newColKey = document.createElement("div");
    newColKey.classList = "col-lg-4 col-md-12";
    newColKey.innerText = "Name"
    newColKey.style.textAlign ="right";
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
    newColKey.style.textAlign ="right";
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
    newColKey.style.textAlign ="right";
    newColKey.style.fontWeight = "bold";

    newColValue = document.createElement("div");
    newColValue.classList = "col-lg-8 col-md-12";
    newColValue.innerText = employeeData["employee_salary"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);

}

function employeeUpdateModal(id){
    let selectedEmployee;
    let url = "http://dummy.restapiexample.com/api/v1/employee/" + id;
    httpGetAsync(url, (response) => {
        selectedEmployee = (JSON.parse(response));
        fillUpdateModal(selectedEmployee);
    })

}

function fillUpdateModal(employeeData){
    document.getElementById("employeeUpdate").innerText ="ViewEdit view: " +  employeeData["employee_name"];


}


function employeeDeleteModal(id){}

function addRecord() {


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