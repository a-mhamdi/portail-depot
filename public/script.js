function submitData() {
    const cin = document.getElementById("cin").value;
    const titre = document.getElementById("titre").value;
    const ref = document.getElementById("ref").value;
    const org = document.getElementById("org").value;
    if (cin == "" || ref == "" || org == "") {
        alert("Please fill in all fields.");
    }

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
};