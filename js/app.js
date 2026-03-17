/* select button to listen for click events */
const addJobButton = document.querySelector('.addJob');

addJobButton.addEventListener('click', () => {
    const jobModal = new bootstrap.Modal(document.getElementById('jobModal'));
    jobModal.show();
});