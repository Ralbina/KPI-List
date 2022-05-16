const API = "http://localhost:8001/students";
let inpSurname = document.getElementById("inpSurname");
let inpName = document.getElementById("inpName");
let inpPhoneNum = document.getElementById("inpPhoneNum");
let inpWeekKpi = document.getElementById("inpWeekKpi");
let inpMonthKpi = document.getElementById("inpMonthKpi");
let btnAdd = document.getElementById("btnAdd");
let tabSurname = document.getElementById("tabSurname");
let tabName = document.getElementById("tabName");
let tabPhoneNum = document.getElementById("tabPhoneNum");
let tabWeekKpi = document.getElementById("tabWeekKpi");
let tabMonthKpi = document.getElementById("tabMonthKpi");
let tabBtnDelEdit = document.getElementById("tabBtnDelEdit");
let tabBtnEdit = document.getElementById("tabBtnEdit");
let tabBtnDel = document.getElementById("tabBtnDel");
let sectionStudents = document.getElementById("sectionStudents");
let btnOpenForm = document.getElementById("flush-collapseOne"); //при нажатии на кнопку "Добавить" она закрывается
let searchValue = ""; //todo создаем  для того что бы передать внизу для посика в ф-ии  readBooks
let currentPage = 1; //todo переменная для пагиннации , текущая страница что бы передать внизу для посика в ф-ии  readBooks
let countPage = 1; // todo  количество всех страниц
//! Навешиваем событие на кнопку Добавить контакт
btnAdd.addEventListener("click", () => {
  if (
    !inpSurname.value.trim() ||
    !inpName.value.trim() ||
    !inpPhoneNum.value.trim() ||
    !inpWeekKpi.value.trim() ||
    !inpMonthKpi.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  //! Создаем новый контакт с ключами, куда добавляем значение наших инпутов
  let newStudent = {
    studentSurname: inpSurname.value,
    studentName: inpName.value,
    studentPhoneNum: inpPhoneNum.value,
    studentWeekKpi: inpWeekKpi.value,
    studentMonthKpi: inpMonthKpi.value,
  };
  createStudent(newStudent);
  readStudent();
});
//! ============================== CREATE ==============================
// Функция для добавления нового контакта в базу данных (db.json)
function createStudent(student) {
  fetch(API, {
    // отправляем запрос с помощью метода post для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(student),
  }).then(() => readStudent());
  //Совершаем очистку
  inpSurname.value = "";
  inpName.value = "";
  inpPhoneNum.value = "";
  inpWeekKpi.value = "";
  inpMonthKpi.value = "";
  btnOpenForm.classList.toggle("show");
}
//! ============================== READ ==============================
// Создаём функцию для отображения
let tbody = document.getElementById("tbody");
let list = document.getElementById("list");
let count = 1;
function readStudent() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=10`)
    .then((res) => res.json())
    .then((data) => {
      tbody.innerHTML = "";
      data.forEach((item) => {
        tbody.innerHTML += `
    <tr>
        <td>${count++}</td>
        <td>${item.studentSurname}</td>
        <td>${item.studentName}</td>
        <td>${item.studentPhoneNum}</td>
        <td>${item.studentWeekKpi}</td>
        <td>${item.studentMonthKpi}</td>
        <td>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}">
          Удалить
          </button>
          <button class="btn btn-outline-danger btnEdit" id="${
            item.id
          }" data-bs-toggle="modal"
          data-bs-target="#exampleModal">
          Изменить
          </button>
        </td>
        
    </tr>`;
      });
      sumPage();
    });
}
readStudent();
// //! ============================== DELETE ==============================
// Событие на кнопку Удалить
document.addEventListener("click", (event) => {
  // с помощью обьекта event ищем id нашего элемента
  let btnDelete = [...event.target.classList];
  if (btnDelete.includes("btnDelete")) {
    // если в нашем btnDelete есть класс btnDelete
    let btnId = event.target.id;
    fetch(`${API}/${btnId}`, {
      method: "DELETE",
    }).then(() => readStudent());
  }
  // sumPage();
});
// //! ============================== EDIT ==============================
// Сохраняем в переменные названия инпутов и кнопки
let editInpSurname = document.getElementById("editInpSurname");
let editInpName = document.getElementById("editInpName");
let editInpPhoneNum = document.getElementById("editInpPhoneNum");
let editInpWeekKpi = document.getElementById("editInpWeekKpi");
let editInpMonthKpi = document.getElementById("editInpMonthKpi");
let editBtnSave = document.getElementById("editBtnSave");
document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpSurname.value = data.studentSurname;
        editInpName.value = data.studentName;
        editInpPhoneNum.value = data.studentPhoneNum;
        editInpWeekKpi.value = data.studentWeekKpi;
        editInpMonthKpi.value = data.studentMonthKpi;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedStudent = {
    studentSurname: editInpSurname.value,
    studentName: editInpName.value,
    studentPhoneNum: editInpPhoneNum.value,
    studentWeekKpi: editInpWeekKpi.value,
    studentMonthKpi: editInpMonthKpi.value,
  };
  editStudent(editedStudent, editBtnSave.id);
});
function editStudent(objEditStudent, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditStudent),
  }).then(() => readStudent());
}
//!============= SEARCH  ===============

let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (event) => {
  searchValue = event.target.value;
  readStudent();
});
//!============= Pagination ============
//сохраняем в переменные кнопки  назад и вперед из index.html
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readStudent();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;

  readStudent();
});
//ф-я для нахождения кол-ва страниц
function sumPage() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 10);
    });
}
