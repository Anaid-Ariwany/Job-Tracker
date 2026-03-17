let jobs = []; // Initialize an empty array to store job data




/* ##### displaying add job modal */

/* select add button */
const addButton = document.querySelector('.addButton');

/* display modal when button is clicked */
const modal = document.querySelector('#jobModal');

addButton.addEventListener('click', () => {
    // Show the modal        
    new bootstrap.Modal(modal).show();
});



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
    e.preventDefault(); //stop page reloading on form submission

    //get form values
    const companyName = companyInput.value;
    const position = positionInput.value;
    const dateApplied = dateInput.value;

    const selectedLocation = document.querySelector('input[name="location"]:checked');
    const selectedStatus = document.querySelector('input[name="status"]:checked');

    const location = selectedLocation ? selectedLocation.value : '';
    const status = selectedStatus ? selectedStatus.value : '';

    const notes = notesInput.value;

    //create job object and push to jobs array
    const job = {
        company: companyName,
        position: position,
        dateApplied: dateApplied,
        location: location,
        status: status,
        notes: notes
    };

    jobs.push(job);
    saveToStorage(); //save to localStorage after adding new job
    renderJobs(); //render job cards after adding new job

    //reset form after submission
    jobForm.reset();
});

/* 
// Call the function to add a new job card
    addJobCard(companyName, position, dateApplied, location, status, notes);

    //reset form after submission
    jobForm.reset();


const jobCard = e.target.closest('.card');

*/

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
            <div class="card-body">
            <h5 class="card-title">${job.company} - ${job.position}</h5>
            <p class="card-text"><strong>Date Applied:</strong> ${job.dateApplied}</p>
            <p class="card-text"><strong>Location:</strong> ${job.location}</p>
            <p class="card-text"><strong>Status:</strong> ${job.status}</p>
            <p class="card-text"><strong>Notes:</strong> ${job.notes}</p>
        </div>

        <div class="card-footer d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-secondary me-2 edit-button">Edit</button>
            <button data-index="${index}" class="btn btn-sm btn-outline-danger delete-button">Delete</button>
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
        const index = e.target.dataset.index; //get index of job to be deleted

        // Show the delete confirmation modal
        new bootstrap.Modal(deleteModal).show();

        // Handle the confirmation button click
        confirmDeleteButton.addEventListener('click', () => {
            jobs.splice(index, 1);
            saveToStorage();
            renderJobs();

            //close modal after deletion
            new bootstrap.Modal(deleteModal).hide();
        });
    }
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



