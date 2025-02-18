document.getElementById("teacherForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    let name = document.getElementById("name").value;
    let dob = document.getElementById("dob").value;
    let bloodgroup = document.getElementById("bloodgroup").value;
    let education = document.getElementById("education").value;
    let experience = document.getElementById("experience").value;
    let domain = document.getElementById("domain").value;
    let address = document.getElementById("address").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;

    if (name === "" || dob === "" || bloodgroup === "" || education === "" || experience === "" || domain === "" || address === "" || mobile === "" || email === "") {
        alert("Please fill out all fields.");
        return;
    }

    // Validate Mobile Number
    if (!/^\d{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Validate Email
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    alert("Form submitted successfully!");
    document.getElementById("teacherForm").reset(); // Reset form after submission
});
