function showPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goBack() {
  window.location.replace("http://localhost:3000");
}


// Initialize data arrays from rendered EJS elements
document.addEventListener('DOMContentLoaded', function() {
  // Get all students and teachers from the DOM
  initializeAssignment();
});

let students = [];
let teachers = [];
let shuffledStudents = [];

function initializeAssignment() {
  // Extract student data from DOM
  const studentElements = document.querySelectorAll('#membersColumn ul li');
  students = Array.from(studentElements).map(el => {
    // Extract student ID from the small tag
    const idText = el.querySelector('small').textContent;
    const id = idText.replace('ID: ', '').trim();
    
    // Get student name (the text node after the br tag)
    const fullName = el.textContent.replace(idText, '').trim();
    
    return { 
      id: id, 
      name: fullName, 
      assigned: false,
      element: el  // Store reference to DOM element
    };
  });
  
  // Extract teacher data from DOM
  const teacherElements = document.querySelectorAll('.column:nth-child(2) ul li');
  teachers = Array.from(teacherElements).map(el => {
    // Extract teacher ID from the small tag
    const idText = el.querySelector('small').textContent;
    const id = idText.replace('ID: ', '').trim();
    
    // Get teacher name (first part of content)
    const nameText = el.childNodes[0].textContent.trim();
    
    return { 
      id: id, 
      name: nameText, 
      team: [],
      element: el  // Store reference to DOM element
    };
  });
  
  // Initialize shuffled students array
  shuffledStudents = [...students];
  
  // Apply proper CSS classes initially
  applyInitialStyles();
}

function applyInitialStyles() {
  // Make sure all students and teachers have correct base CSS classes
  students.forEach(student => {
    student.element.className = 'user unassigned';
  });
  
  teachers.forEach(teacher => {
    teacher.element.className = 'user unassigned';
  });
}

function updateUI() {
  // Update student elements
  students.forEach(student => {
    const className = student.assigned ? 'user assigned' : 'user unassigned';
    student.element.className = className;
  });
  
  // Update teacher elements
  teachers.forEach(teacher => {
    const hasStudents = teacher.team.length > 0;
    const className = hasStudents ? 'user assigned' : 'user unassigned';
    teacher.element.className = className;
    
    // Remove any existing student assignments display
    const existingAssignments = teacher.element.querySelector('.assigned-students');
    if (existingAssignments) {
      teacher.element.removeChild(existingAssignments);
    }
    
    // Add student assignments if this teacher has any
    if (hasStudents) {
      // Create new element to display assigned students
      const assignmentDisplay = document.createElement('div');
      assignmentDisplay.className = 'assigned-students';
      assignmentDisplay.style.marginTop = '5px';
      assignmentDisplay.style.fontSize = '0.9rem';
      assignmentDisplay.style.color = '#2c3e50';
      
      // Add assigned students list
      const studentsList = teacher.team.map(s => s.name).join(', ');
      assignmentDisplay.textContent = `Assigned: ${studentsList}`;
      
      teacher.element.appendChild(assignmentDisplay);
    }
  });
}

function shuffle() {
  // Reset assignments
  teachers.forEach(teacher => teacher.team = []);
  students.forEach(student => student.assigned = false);
  
  // Shuffle students
  shuffledStudents = [...students];
  for (let i = shuffledStudents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
  }
  
  // Update UI to show unassigned state
  updateUI();
}

function assign() {
  // Reset previous assignments
  teachers.forEach(teacher => teacher.team = []);
  students.forEach(student => student.assigned = false);
  
  // Calculate how many students each teacher should get
  const totalStudents = shuffledStudents.length;
  const totalTeachers = teachers.length;
  
  // Generate random indices to select which teachers get students
  let teacherIndices = Array.from({ length: totalTeachers }, (_, i) => i);
  
  // Shuffle the indices to randomly select teachers
  for (let i = teacherIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teacherIndices[i], teacherIndices[j]] = [teacherIndices[j], teacherIndices[i]];
  }
  
  // Calculate how many teachers need assignments (use all if possible)
  const activeTeacherCount = Math.min(totalTeachers, totalStudents);
  
  if (activeTeacherCount === 0) {
    updateUI();
    return;
  }
  
  // Take only the needed number of teachers
  let selectedTeacherIndices = teacherIndices.slice(0, activeTeacherCount);
  
  // Calculate students per teacher and any remainder
  const studentsPerTeacher = Math.floor(totalStudents / activeTeacherCount);
  const remainingStudents = totalStudents % activeTeacherCount;
  
  let assignedCount = 0;
  
  // Distribute students evenly to randomly selected teachers
  for (let i = 0; i < activeTeacherCount; i++) {
    // Calculate how many students this teacher gets
    const studentsForThisTeacher = i < remainingStudents ? 
                                  studentsPerTeacher + 1 : 
                                  studentsPerTeacher;
    
    if (studentsForThisTeacher > 0) {
      // Get the index of the randomly selected teacher
      const teacherIndex = selectedTeacherIndices[i];
      
      // Assign students to this teacher
      const assignedStudents = shuffledStudents.slice(assignedCount, assignedCount + studentsForThisTeacher);
      teachers[teacherIndex].team = assignedStudents;
      
      // Mark assigned students
      assignedStudents.forEach(student => {
        // Find the original student object and mark it as assigned
        const originalStudent = students.find(s => s.id === student.id);
        if (originalStudent) {
          originalStudent.assigned = true;
        }
      });
      
      assignedCount += studentsForThisTeacher;
    }
  }
  
  // Update UI
  updateUI();
}
