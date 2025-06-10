let societes = [];

const selectedOrg = {
    societe: 'INDÉFINI',
};

fetchSocietes();

function searchSociete() {

    const searchedSociete = document.getElementById('searchedSociete');
    const suggestedSociete = document.getElementById('suggestedSociete');
    const selectedSociete = document.getElementById('selectedSociete');

    const searchedSocieteValue = searchedSociete.value.toLowerCase().trim();

    let selectedSocieteValue = '';
    suggestedSociete.innerHTML = '';

    if (searchedSocieteValue.length === 0) {
        suggestedSociete.style.display = 'none';
        return;
    }

    // Filter items that contain the search string anywhere in the word
    const filteredItems = societes.filter(item =>
        item?.toLowerCase().includes(searchedSocieteValue)
    ).sort((a, b) => {
        // Sort items that start with the search string first
        const aStartsWith = a.toLowerCase().startsWith(searchedSocieteValue);
        const bStartsWith = b.toLowerCase().startsWith(searchedSocieteValue);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
    });

    if (filteredItems.length > 0) {
        suggestedSociete.style.display = 'block';
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            div.className = 'suggestion-item';
            div.onclick = function () {
                searchedSociete.value = item;
                selectedSocieteValue = item;
                selectedSociete.textContent = `Sélectionnée : ${selectedSocieteValue.toUpperCase()}`;
                suggestedSociete.style.display = 'none';
                selectedOrg.societe = selectedSocieteValue.toUpperCase();
                console.log(selectedOrg.societe);
            };
            suggestedSociete.appendChild(div);
        });
    } else {
        suggestedSociete.style.display = 'none';
    }
}

// Hide suggestions when clicking outside
function suggestSociete(e) {
    const searchedSociete = document.getElementById('searchedSociete');
    const suggestedSociete = document.getElementById('suggestedSociete');

    if (!searchedSociete.contains(e.target) && !suggestedSociete.contains(e.target)) {
        suggestedSociete.style.display = 'none';
    }
}

async function fetchSocietes() {
    try {
        const response = await fetch('/api/getSociete');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const choices = await response.json();
        choices.forEach(choice => {
            societes.push(choice.societe);
        });
        // console.log(societes)
    } catch (error) {
        console.error('Error fetching choices:', error);
    }
}

document.querySelector('#searchedSociete').addEventListener('input', searchSociete);
document.querySelector('#suggestedSociete').addEventListener('click', suggestSociete);


// Function to retrieve student data based on CIN
function recuperez() {
    const cin = document.getElementById("cin").value;
    fetch(`/api/student?cin=${cin}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("student").value = data.prenom + ' ' + data.nom || '';
            document.getElementById("titre").value = data.titre || '';
            document.getElementById("ref").value = data.ref || '';
        })
        .catch(error => {
            console.error(error);
        });
};


// Attach event listener to the file input
document.getElementById('file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    document.getElementById('fileName').textContent = file?.name || 'Aucun fichier sélectionné !';

    const cin = document.getElementById("cin").value;

    // Create FormData to send file
    const formData = new FormData();
    const rapport = new File([file], `${cin}.pdf`, { type: file.type, lastModified: file.lastModified });
    formData.append('file', rapport);

    // Upload the file
    fetch('/', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.msg);
        })
        .catch(error => {
            console.error(error.msg);
        });
});


// Handle form submission
document.getElementById("uploadForm").addEventListener("submit", function () {

    const cin = document.getElementById("cin").value;
    const titre = document.getElementById("titre").value;
    const ref = document.getElementById("ref").value;
    const org = document.getElementById("searchedSociete").value;

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
});
