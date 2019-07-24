let allEmployees;
let filteredEmployees = [];
let filterString = "";
let numPages = 0;
let currentPage = 0;
// TO DO --> instead of location-reload, update table with new/updated/deleted data, changing arrays, global variables, etc.

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}



function initTable() {

    let url = "http://dummy.restapiexample.com/api/v1/employees";
    document.getElementsByTagName("body")[0].style.cursor = "wait"
    httpGetAsync(url, (response) => {
        allEmployees = (JSON.parse(response));
        numPages = Math.ceil(allEmployees.length / 50)
        filteredEmployees = [...allEmployees]
        fillTable(allEmployees.slice(0, 50));
        document.getElementsByTagName("body")[0].style.cursor = "default"

    })
}

function fillTable(employees) {

    createPagination();
    for (let i = 0; i < employees.length; i++) {
        fillSingleRow(employees[i])
    }
}

function createPagination() {

    document.getElementById("prevButton").setAttribute("onclick", "loadPrevious()");
    document.getElementById("nextButton").setAttribute("onclick", "loadNext()");
    document.getElementById("currentPage").innerText = "Page " + (currentPage + 1) + " of " + numPages;
}

function loadPrevious() {

    if (currentPage > 0) {
        let tbody = document.getElementsByTagName("tbody");
        if (tbody.length > 0) {
            tbody[0].parentNode.removeChild(tbody[0]);
            document.getElementsByTagName("table")[0].appendChild(document.createElement("tbody"));
        }
        currentPage--;
        document.getElementById("currentPage").innerText = "Page " + (currentPage + 1) + " of " + numPages;

        fillTable(filteredEmployees.slice(currentPage * 50, currentPage * 50 + 50))
    }
}

function loadNext() {

    if (currentPage < numPages - 1) {
        currentPage++;
        let tbody = document.getElementsByTagName("tbody");
        if (tbody.length > 0) {
            tbody[0].parentNode.removeChild(tbody[0]);
            document.getElementsByTagName("table")[0].appendChild(document.createElement("tbody"));
        }
        document.getElementById("currentPage").innerText = "Page " + (currentPage + 1) + " of " + numPages;

        fillTable(filteredEmployees.slice(currentPage * 50, currentPage * 50 + 50))
    }
}


function fillSingleRow(employeeData) {
    let newRow = document.createElement("tr");
    let photoCell = document.createElement("td");
    let nameCell = document.createElement("td");
    let salaryCell = document.createElement("td");
    let ageCell = document.createElement("td");
    let actionsCell = document.createElement("td");


    nameCell.innerText = employeeData["employee_name"];
    salaryCell.innerText = employeeData["employee_salary"];
    photoCell.style.backgroundImage = 'url("./user.jpg"';
    photoCell.style.backgroundSize = "contain";
    photoCell.style.backgroundRepeat = "no-repeat";
    ageCell.innerText = employeeData["employee_age"];
    actionsCell.appendChild(createActionButtons(employeeData["id"]));

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
    let detailsModalBody = document.querySelectorAll("#detailsModal > div > div > div.modal-body")[0]
    let detailsModalDialog = detailsModalBody.parentNode;
    detailsModalDialog.removeChild(detailsModalBody);
    let newDetailsModalBody = document.createElement("div");
    newDetailsModalBody.className = "modal-body";
    detailsModalDialog.insertBefore(newDetailsModalBody, detailsModalDialog.childNodes[4]);

    httpGetAsync(url, (response) => {
        selectedEmployee = (JSON.parse(response));
        fillDetailsModal(selectedEmployee);
    })
}

function fillDetailsModal(employeeData) {
    document.getElementById("employeeDetails").innerText = "View: " + employeeData["employee_name"];
    let modalBody = document.getElementsByClassName("modal-body")[1];
    let newRow = document.createElement("div");
    newRow.className = "row";
    let newColKey = document.createElement("div");
    newColKey.classList = "col-3 ";
    newColKey.innerText = "Name"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";

    let newColValue = document.createElement("div");
    newColValue.classList = "col-8 ";
    newColValue.innerText = employeeData["employee_name"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);


    newRow.className = "row";
    newColKey = document.createElement("div");
    newColKey.classList = "col-3 ";
    newColKey.innerText = "Age"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";
    newColValue = document.createElement("div");
    newColValue.classList = "col-8 ";
    newColValue.innerText = employeeData["employee_age"];
    newRow.appendChild(newColKey);
    newRow.appendChild(newColValue);

    modalBody.appendChild(newRow);

    newRow.className = "row";
    newColKey = document.createElement("div");
    newColKey.classList = "col-3 ";
    newColKey.innerText = "Salary"
    newColKey.style.textAlign = "right";
    newColKey.style.fontWeight = "bold";

    newColValue = document.createElement("div");
    newColValue.classList = "col-8 ";
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
        fillUpdateModal(selectedEmployee);
        document.querySelectorAll("#updateModal > div > div > div.modal-footer > button.btn.btn-success")[0].setAttribute(`onclick`, `saveChanges(${id})`)

    })

}

function fillUpdateModal(employeeData) {
    document.getElementById("employeeUpdate").innerText = "ViewEdit view: " + employeeData["employee_name"];
    document.getElementById("updateName").value = employeeData["employee_name"];
    document.getElementById("updateAge").value = employeeData["employee_age"];
    document.getElementById("updateSalary").value = employeeData["employee_salary"]
}

function httpPutAsync(theUrl, callback, body) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("PUT", theUrl, true); 
    xmlHttp.send(body);
}

function saveChanges(id) {

    let age = document.getElementById("updateAge").value;
    let salary = document.getElementById("updateSalary").value;
    let name = document.getElementById("updateName").value;

    if (!(age.match(/^[0-9]*$/g)) || !(salary.match(/^[0-9]*$/g))) {
        document.getElementById("inputErrorUpdate").innerText = "Age and Salary must be a number!";
        return;
    } else if (name.length == 0) {
        document.getElementById("inputErrorUpdate").innerText = "Need to add a name to the new worker!";
        return;
    } else {
        stringJSON = createJSON(name, age, salary);
        let url = "http://dummy.restapiexample.com/api/v1/update/" + id;


        httpPutAsync(url, (response) => {
            location - reload();
        }, stringJSON)
    }
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
    httpDeleteAsync(url, (response) => {
        location.reload();
    })
}

function httpDeleteAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("DELETE", theUrl, true);
}

function addRecord() {
    let age = document.getElementById("createAge").value;
    let salary = document.getElementById("createSalary").value;
    let name = document.getElementById("createName").value;
    if (!(age.match(/^[0-9]*$/g)) || !(salary.match(/^[0-9]*$/g))) {
        document.getElementById("inputErrorCreate").innerText = "Age and Salary must be a number!";
        return;
    } else if (name.length == 0) {
        document.getElementById("inputErrorCreate").innerText = "Need to add a name to the new worker!";
        return;
    } else {
        let stringJSON = createJSON(name, age, salary);
        let url = "http://dummy.restapiexample.com/api/v1/create";


        httpPostAsync(url, (response) => {
            location.reload();
        }, stringJSON)
    }
}

function httpPostAsync(theUrl, callback, body) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true);
}

function filterTable(event) {

    setTimeout(() => {
        let pressedKey = ""

        if (filterString.length > document.querySelectorAll("body > div.container > table > thead > tr:nth-child(2) > th > input")[0].value.length) {
            filteredEmployees = [...allEmployees]
            if (event.key == "Backspace") {
                filterString = document.querySelectorAll("body > div.container > table > thead > tr:nth-child(2) > th > input")[0].value + " ";;
            }
        }
        if (event.key.match(/^[a-zA-Z0-9_]{1}$/g)) {
            filterString = document.querySelectorAll("body > div.container > table > thead > tr:nth-child(2) > th > input")[0].value + pressedKey;
        } else if (event.key == "Backspace") {
            filteredEmployees = [...allEmployees];
            filterString = filterString.substring(0, filterString.length - 1);
        } else {
            return;
        }
        let tbody = document.getElementsByTagName("tbody");
        if (tbody.length > 0) {
            tbody[0].parentNode.removeChild(tbody[0]);
            document.getElementsByTagName("table")[0].appendChild(document.createElement("tbody"));
        }





        let longitud = filteredEmployees.length;
        for (let i = 0; i < longitud; i++) {
            if ((filteredEmployees[i]["employee_name"].indexOf(filterString) == -1) && (filteredEmployees[i]["employee_age"].indexOf(filterString) == -1) && (filteredEmployees[i]["employee_salary"].indexOf(filterString) == -1)) {
                filteredEmployees.splice(i, 1);
                longitud = filteredEmployees.length;
                i--;
            }
        }
        numPages = Math.ceil(filteredEmployees.length / 50)
        currentPage = 0;
        fillTable(filteredEmployees.slice(0, 50));

    }, 1000);

}


function preventCloseModal(event) {
    event.preventDefault();
}