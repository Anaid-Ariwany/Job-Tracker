/* select button */
const addButton = document.querySelector('.addButton');

/* display modal when button is clicked */
const modal = document.querySelector('#jobModal');

addButton.addEventListener('click', () => {
    // Show the modal        
    new bootstrap.Modal(modal).show();
}); 
