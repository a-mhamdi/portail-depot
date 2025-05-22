// import { send } from "process";

document.getElementById("uploadForm").addEventListener("submit", function () {
    const cin = document.getElementById("cin").value;
    const titre = document.getElementById("titre").value;
    const ref = document.getElementById("ref").value;
    const org = document.getElementById("org").value;

    // Send the data to the server
    fetch(`/api/submit/${cin}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titre: titre,
            ref: ref,
            org: org
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    const file = document.getElementById('fileUpload').files[0];

    if (file) {
        // Check if it's a PDF
        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file only');
            this.value = ''; // Clear the input
            return;
        }

        // Create FormData to send file
        const formData = new FormData();
        const rapport = new File([file], cin + ".pdf", { type: file.type, lastModified: file.lastModified });
        formData.append('pdf', rapport);

        // Upload the file
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Upload successful:', data);
                alert('PDF uploaded successfully!');
            })
            .catch(error => {
                console.error('Upload failed:', error);
                alert('Upload failed');
            });
    }


});



