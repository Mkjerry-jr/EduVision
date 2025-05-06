document.addEventListener('DOMContentLoaded', function () {
  // BMI Chart
  const bmiCtx = document.getElementById('bmiChart').getContext('2d');
  new Chart(bmiCtx, {
    type: 'pie',
    data: {
      labels: ['Underweight', 'Healthy', 'Overweight', 'Obese'],
      datasets: [{
        label: 'BMI Distribution',
        data: [3, 60, 20, 2], // Example values
        backgroundColor: [
          '#36A2EB', // Underweight
          '#4CAF50', // Healthy
          '#FFC107', // Overweight
          '#FF5722'  // Obese
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Blood Group Chart
  const bloodCtx = document.getElementById('bloodChart').getContext('2d');
  new Chart(bloodCtx, {
    type: 'pie',
    data: {
      labels: ['A+', 'B+', 'O+', 'AB+'],
      datasets: [{
        label: 'Blood Group Distribution',
        data: [25, 30, 35, 10], // Example values
        backgroundColor: [
          '#FF6384', // A+
          '#36A2EB', // B+
          '#FFCE56', // O+
          '#4BC0C0'  // AB+
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
});
