document.getElementById("marksForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents page reload

    let name = document.getElementById("name").value;
    let classValue = document.getElementById("class").value;
    let examType = document.getElementById("examType").value;
    let englishMarks = parseInt(document.getElementById("englishMarks").value);
    let mathMarks = parseInt(document.getElementById("mathMarks").value);
    let scienceMarks = parseInt(document.getElementById("scienceMarks").value);

    if (englishMarks > 100 || mathMarks > 100 || scienceMarks > 100) {
        alert("Marks should not exceed 100.");
        return;
    }

    alert(`Student: ${name}\nClass: ${classValue}\nExam Type: ${examType}\nEnglish: ${englishMarks}\nMath: ${mathMarks}\nScience: ${scienceMarks}\n\nMarks submitted successfully!`);
});
