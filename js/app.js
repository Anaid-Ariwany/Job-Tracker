/*##### select add button #####*/
const addButton = document.querySelector('.addButton');

/* display modal when button is clicked */
const modal = document.querySelector('#jobModal');

addButton.addEventListener('click', () => {
    // Show the modal        
    new bootstrap.Modal(modal).show();
});


/*##### select the job list cards container #####*/
const jobListContainer = document.querySelector('.jobListContainer');

/* select add job form elements */
const jobForm = document.querySelector('#jobForm');
const companyInput = document.querySelector('#companyName');
const positionInput = document.querySelector('#position');
const dateInput = document.querySelector('#date');
/* const selectedLocation = document.querySelector('input[name="location"]:checked');
const selectedStatus = document.querySelector('input[name="status"]:checked'); */
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

    // Call the function to add a new job card
    addJobCard(companyName, position, dateApplied, location, status, notes);

    //reset form after submission
    jobForm.reset();
});


/* create job card function */
function addJobCard(companyName, position, dateApplied, location, status, notes) {
    // Create a new card element
    const jobCard = document.createElement('div');
    jobCard.classList.add('card', 'mb-3');
    jobCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${companyName} - ${position}</h5>
            <p class="card-text"><strong>Date Applied:</strong> ${dateApplied}</p>
            <p class="card-text"><strong>Location:</strong> ${location}</p>
            <p class="card-text"><strong>Status:</strong> ${status}</p>
            <p class="card-text"><strong>Notes:</strong> ${notes}</p>
        </div>

        <div class="card-footer d-flex justify-content-end">
            <button class="btn btn-sm btn-outline-secondary me-2 edit-button">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-button">Delete</button>
        </div>
    `;

    // Append the new card to the job list section
    jobListContainer.appendChild(jobCard);
}

/* delete job card function when delete button is clicked, confirm delete first using confirm modal*/
const deleteModal = document.querySelector('#deleteModal');
const confirmDeleteButton = document.querySelector('#confirmDelete');

jobListContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const jobCard = e.target.closest('.card');

        // Show the delete confirmation modal
        new bootstrap.Modal(deleteModal).show();

        // Handle the confirmation button click
        confirmDeleteButton.addEventListener('click', () => {
            jobCard.remove();

            //close modal after deletion
            new bootstrap.Modal(deleteModal).hide();
        });
    }
});



