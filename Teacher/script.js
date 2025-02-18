document.addEventListener("DOMContentLoaded", function() {
    let presentRadios = document.querySelectorAll(".present");
    let absentRadios = document.querySelectorAll(".absent");
    let presentCount = document.getElementById("presentCount");
    let absentCount = document.getElementById("absentCount");

    function updateCount() {
        let totalPresent = document.querySelectorAll(".present:checked").length;
        let totalAbsent = document.querySelectorAll(".absent:checked").length;
        presentCount.textContent = totalPresent;
        absentCount.textContent = totalAbsent;
    }

    presentRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            let row = this.closest("tr");
            row.style.backgroundColor = "#c3f7c3"; // Green for Present
            updateCount();
        });
    });

    absentRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            let row = this.closest("tr");
            row.style.backgroundColor = "#f7c3c3"; // Red for Absent
            updateCount();
        });
    });
});
