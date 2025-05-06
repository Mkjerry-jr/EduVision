function showPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goBack() {
  window.location.replace("http://localhost:3000");
}


// Example: dynamically populate counters
document.getElementById('schoolsCount').innerText = 42;
document.getElementById('studentsCount').innerText = 1500;
document.getElementById('teachersCount').innerText = 80;
document.getElementById('projectsCount').innerText = 12;  