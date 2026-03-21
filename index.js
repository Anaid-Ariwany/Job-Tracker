let jobs = []; // Initialize an empty array to store job data

let jobToDeleteIndex = null; // Variable to store the index of the job to be deleted

let jobToEditIndex = null; // Variable to store the index of the job to be edited


/* ##### displaying modal */

/* select button */
const addButton = document.querySelector('.addButton');
const helpButton = document.querySelector('.helpButton');

/* display modal when button is clicked */
const modal = document.querySelector('#jobModal');
const helpModal = document.querySelector('#helpModal');


addButton.addEventListener('click', () => {
    // Show the modal        
    new bootstrap.Modal(modal).show();
});

helpButton.addEventListener('click', () => {
    // Show the help modal
    new bootstrap.Modal(helpModal).show();
});

const modalTitle = document.querySelector('#jobModalLabel');



/*##### handling form and data submission #####*/

/* select the job list cards container */
const jobListContainer = document.querySelector('.jobListContainer');

/* select add job form elements */
const jobForm = document.querySelector('#jobForm');
const companyInput = document.querySelector('#companyName');
const positionInput = document.querySelector('#position');
const dateInput = document.querySelector('#date');
const notesInput = document.querySelector('#notes');

/* select the submission button */
const submitButton = document.querySelector('#submitButton');

/* handle form submission and data using the submit button */
submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const companyName = companyInput.value;
    const position = positionInput.value;
    const dateApplied = dateInput.value;

    const selectedLocation = document.querySelector('input[name="location"]:checked');
    const selectedStatus = document.querySelector('input[name="status"]:checked');

    const location = selectedLocation ? selectedLocation.value : '';
    const status = selectedStatus ? selectedStatus.value : '';

    const notes = notesInput.value;

    const job = {
        company: companyName,
        position: position,
        dateApplied: dateApplied,
        location: location,
        status: status,
        notes: notes
    };

    // DIFFERENCE HERE
    if (jobToEditIndex !== null) {
        // UPDATE existing job
        jobs[jobToEditIndex] = job;
        jobToEditIndex = null;
    } else {
        // ADD new job
        jobs.push(job);
    }

    saveToStorage();
    renderJobs();
    jobForm.reset();

    submitButton.textContent = 'Add Job';
    modalTitle.textContent = 'Add Job';

    // Close modal
    bootstrap.Modal.getInstance(modal).hide();
});



/* ##### creating, reading, and deleting job cards ##### */

/* create job card function */
function renderJobs() {
    // Clear the job list container
    jobListContainer.innerHTML = '';

    // Iterate through the jobs array and create cards for each job
    jobs.forEach((job, index) => {
        // Create a new card element
        const jobCard = document.createElement('div');
        jobCard.classList.add('card', 'mb-3');
        jobCard.innerHTML = `
            <div class="leftSideCard">
            
                <div>
                    <img src="assets/images/bagLogo.webp" alt="bag logo" class="bagLogo">
                </div>

                <div class="middleSideCard">
                    <h4 class="card-title inter-heading">${job.company}</h4>
                    <p class="card-text">${job.position}</p>
                    <figcaption class="blockquote-footer">${job.location} | <cite title="Source Title">${job.status}</cite>
                    </figcaption>
                </div>

                <div class="hiddenDetails">
                    <p class="card-text">${job.dateApplied}</p>
                    <p class="card-text">${job.notes}</p>
                </div>

            </div>  

            <div class="rightSideCard">
                <button data-index="${index}" class="edit-button">View More | Edit</button>
                <button data-index="${index}" class="delete-button">Delete</button>
            </div>
    `;

        // Append the new card to the job list section
        jobListContainer.appendChild(jobCard);
    }
    );
}

/* delete job card function when delete button is clicked, confirm delete first using confirm modal*/
const deleteModal = document.querySelector('#deleteModal');
const confirmDeleteButton = document.querySelector('#confirmDelete');

jobListContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {

        jobToDeleteIndex = e.target.dataset.index;

        // Show the delete confirmation modal
        new bootstrap.Modal(deleteModal).show();

    }
});

confirmDeleteButton.addEventListener('click', () => {
    if (jobToDeleteIndex !== null) {
        jobs.splice(jobToDeleteIndex, 1);
        saveToStorage();
        renderJobs();

        jobToDeleteIndex = null; // reset after delete
    }

    bootstrap.Modal.getInstance(deleteModal).hide();
});


/* editing jobs */
jobListContainer.addEventListener('click', (e) => {

    if (e.target.classList.contains('edit-button')) {
        const index = e.target.dataset.index;
        const job = jobs[index];

        jobToEditIndex = index;
        submitButton.textContent = 'Update Job';
        modalTitle.textContent = 'Update Job';

        // Fill form with existing data
        companyInput.value = job.company;
        positionInput.value = job.position;
        dateInput.value = job.dateApplied;
        notesInput.value = job.notes;

        // Set radio buttons (location)
        document.querySelectorAll('input[name="location"]').forEach(radio => {
            radio.checked = radio.value === job.location;
        });

        // Set radio buttons (status)
        document.querySelectorAll('input[name="status"]').forEach(radio => {
            radio.checked = radio.value === job.status;
        });

        // Open modal
        new bootstrap.Modal(modal).show();
    }
});


modal.addEventListener('hidden.bs.modal', () => {
    jobForm.reset();
    jobToEditIndex = null;
    submitButton.textContent = 'Add Job';
    modalTitle.textContent = 'Add Job';
});


/* save data to localStorage */
function saveToStorage() {
    localStorage.setItem('jobs', JSON.stringify(jobs));
}


/* load data from localStorage */
function loadData() {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
        jobs = JSON.parse(storedJobs);
    }
}

loadData();
renderJobs();


/*##### create functions that count the number of jobs in each status #####*/
function countJobsByStatus(status) {
    return jobs.filter(job => job.status === status).length;
}

/* create metric cards for each job status */
function createMetricCards() {
    const metricCardsContainer = document.querySelector('.metricCardsContainer');

    // Clear the container
    metricCardsContainer.innerHTML = '';

    // Create metric cards for each status
    const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
    statuses.forEach(status => {
        const count = countJobsByStatus(status);
        const card = document.createElement('div');
        card.classList.add('card', 'text-center', 'mb-3', 'metricCard');
        card.innerHTML = `
            <div class="card-body">
                <div class="metricTopDiv">
                    <div class="metricIcon"></div>
                    <h5 class="card-title">${status}</h5>
                </div>
                <h3 class="card-text">${count}</h3>
            </div>
        `;
        metricCardsContainer.appendChild(card);
    });
}

createMetricCards();


/* create filter functions */
/* filter by search term function */
function filterJobsBySearchTerm(searchTerm) {
    return jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/* handle filter button clicks */
const searchInput = document.querySelector('#searchInput');

/* handle search input */
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    const filteredJobs = filterJobsBySearchTerm(searchTerm);
    renderFilteredJobs(filteredJobs);
});

/* render filtered jobs */
function renderFilteredJobs(filteredJobs) {
    jobListContainer.innerHTML = '';
    filteredJobs.forEach((job, index) => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('card', 'mb-3');
        jobCard.innerHTML = `
            <div class="leftSideCard">
            
                <div>
                    <img src="assets/images/bagLogo.webp" alt="bag logo" class="bagLogo">
                </div>

                <div class="middleSideCard">
                    <h4 class="card-title inter-heading">${job.company}</h4>
                    <p class="card-text">${job.position}</p>
                    <figcaption class="blockquote-footer">${job.location} | <cite title="Source Title">${job.status}</cite>
                    </figcaption>
                </div>

                <div class="hiddenDetails">
                    <p class="card-text">${job.dateApplied}</p>
                    <p class="card-text">${job.notes}</p>
                </div>

            </div>  

            <div class="rightSideCard">
                <button data-index="${index}" class="edit-button">View More | Edit</button>
                <button data-index="${index}" class="delete-button">Delete</button>
            </div>
    `;
        jobListContainer.appendChild(jobCard);
    });
}

renderFilteredJobs(jobs);
