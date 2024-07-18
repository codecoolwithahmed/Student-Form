// Global variable to store class-wise serial and roll numbers
var classSerialNumbers = {
  'Class 1': 1,
  'Class 2': 1,
  'Class 3': 1,
  'Class 4': 1,
  'Class 5': 1
};

var classRollNumbers = {
  'Class 1': 1,
  'Class 2': 1,
  'Class 3': 1,
  'Class 4': 1,
  'Class 5': 1
};

// Load student data from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
  loadStudents();
});

// Form submit event listener
document.getElementById('studentForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  var name = document.getElementById('name').value;
  var course = document.getElementById('course').value;
  var email = document.getElementById('email').value;
  var className = document.getElementById('class').value;

  // Generate serial number and roll number for the class
  var serialNumber = generateClassSerialNumber(className);
  var rollNumber = generateClassRollNumber(className);

  // Create student object
  var student = {
    name: name,
    roll: rollNumber,
    course: course,
    email: email,
    class: className,
    serialNumber: serialNumber
  };

  // Save student data to localStorage
  saveStudent(student);

  // Clear form fields
  document.getElementById('name').value = '';
  document.getElementById('course').value = '';
  document.getElementById('email').value = '';
  document.getElementById('class').value = 'Class 1';
});

// Function to generate serial number for a specific class
function generateClassSerialNumber(className) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var serialNumber = classSerialNumbers[className] || 1;

  // Check if the serial number is already used in the class
  var usedSerialNumbers = students.filter(student => student.class === className).map(student => parseInt(student.serialNumber));

  while (usedSerialNumbers.includes(serialNumber)) {
    serialNumber++; // Increment until a unique serial number is found
  }

  classSerialNumbers[className] = serialNumber + 1; // Increment for the next student
  return pad(serialNumber, 2); // Pad with leading zeros for two digits
}

// Function to generate roll number for a specific class
function generateClassRollNumber(className) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var rollNumber = classRollNumbers[className] || 1;

  // Check if the roll number is already used in the class
  var usedRollNumbers = students.filter(student => student.class === className).map(student => parseInt(student.roll));

  while (usedRollNumbers.includes(rollNumber)) {
    rollNumber++; // Increment until a unique roll number is found
  }

  classRollNumbers[className] = rollNumber + 1; // Increment for the next student
  return pad(rollNumber, 5); // Pad with leading zeros for five digits
}

// Function to save student data to localStorage
function saveStudent(student) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
  loadStudents(); // Reload student list
}

// Function to load and display student list from localStorage
function loadStudents() {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var classFilter = document.getElementById('classFilter').value;
  var studentList = document.getElementById('studentList');
  studentList.innerHTML = ''; // Clear existing list

  students.forEach(function (student, index) {
    if (classFilter === 'All' || student.class === classFilter) {
      var listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Serial Number:</strong> ${student.serialNumber}<br>
        <strong>Name:</strong> <span class="student-name">${student.name}</span><br>
        <strong>Roll Number:</strong> <span class="student-roll">${student.roll}</span><br>
        <strong>Course:</strong> <span class="student-course">${student.course}</span><br>
        <strong>Email:</strong> <span class="student-email">${student.email}</span><br>
        <strong>Class:</strong> <span class="student-class">${student.class}</span><br>
        <button class="edit-btn" onclick="editStudent(${index}, this)">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
      `;
      studentList.appendChild(listItem);
    }
  });
}

// Function to pad numbers with leading zeros (for serial and roll numbers)
function pad(number, length) {
  return (Array(length).join('0') + number).slice(-length);
}

// Function to filter students by class
function filterStudents() {
  loadStudents();
}

// Function to edit student data
function editStudent(index, btn) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var student = students[index];
  if (student) {
    // Replace student details with input fields for editing
    var listItem = btn.parentNode;
    listItem.innerHTML = `
      <strong>Serial Number:</strong> ${student.serialNumber}<br>
      <label>Name: <input type="text" class="edit-input" value="${student.name}" id="edit-name-${index}"></label><br>
      <label>Course: <input type="text" class="edit-input" value="${student.course}" id="edit-course-${index}"></label><br>
      <label>Email: <input type="email" class="edit-input" value="${student.email}" id="edit-email-${index}"></label><br>
      <label>Class: 
        <select id="edit-class-${index}" class="edit-input">
          <option value="Class 1" ${student.class === 'Class 1' ? 'selected' : ''}>Class 1</option>
          <option value="Class 2" ${student.class === 'Class 2' ? 'selected' : ''}>Class 2</option>
          <option value="Class 3" ${student.class === 'Class 3' ? 'selected' : ''}>Class 3</option>
          <option value="Class 4" ${student.class === 'Class 4' ? 'selected' : ''}>Class 4</option>
          <option value="Class 5" ${student.class === 'Class 5' ? 'selected' : ''}>Class 5</option>
        </select>
      </label><br>
      <button class="save-btn" onclick="saveEdit(${index})">Save</button>
      <button class="cancel-btn" onclick="loadStudents()">Cancel</button>
    `;
  }
}

// Function to save edited student data
function saveEdit(index) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var editedStudent = {
    name: document.getElementById(`edit-name-${index}`).value,
    roll: students[index].roll, // Keep the existing roll number
    course: document.getElementById(`edit-course-${index}`).value,
    email: document.getElementById(`edit-email-${index}`).value,
    class: document.getElementById(`edit-class-${index}`).value,
    serialNumber: students[index].serialNumber
  };

  students[index] = editedStudent;
  localStorage.setItem('students', JSON.stringify(students));
  loadStudents(); // Reload student list
}

// Function to delete student data
function deleteStudent(index) {
  var students = JSON.parse(localStorage.getItem('students')) || [];
  var student = students[index];
  var studentClass = student.class;

  // Decrement the serial number and roll number for the class
  classSerialNumbers[studentClass]--;
  classRollNumbers[studentClass]--;

  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  loadStudents(); // Reload student list
}
