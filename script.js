document.addEventListener('DOMContentLoaded', () => {
    const nationalityInput = document.getElementById('nationality-input');
    const nationalityDropdownTrigger = document.getElementById('nationality-dropdown-trigger');
    const nationalityList = document.getElementById('nationality-list');

    const starRatingInput = document.getElementById('star-rating-input');
    const starRatingDropdownTrigger = document.getElementById('star-rating-dropdown-trigger');
    const starRatingList = document.getElementById('star-rating-list');

    const budgetInput = document.getElementById('budget-input');
    const budgetDropdownTrigger = document.getElementById('budget-dropdown-trigger');
    const budgetList = document.getElementById('budget-list');

    const nationalities = [
        "Indian", "Chinese", "Japanese", "Korean", "Pakistani",
        "Bangladeshi", "Sri Lankan", "Nepali", "Bhutanese", "Afghan",
        "Indonesian", "Malaysian", "Singaporean", "Thai", "Vietnamese",
        "Filipino", "Saudi", "Emirati", "Qatari", "Kuwaiti",
        "Omani", "Israeli", "Turkish", "American", "Canadian",
        "Mexican", "Cuban", "Jamaican", "Brazilian", "Argentine",
        "Argentinian", "Chilean", "Colombian", "Peruvian", "Venezuelan"
    ];

    const starRatings = [
        "3 Stars", "4 Stars", "5 Stars", "6 Stars", "7 Stars"
    ];

    const budgetOptions = [
        "1k-5k", "5k-10k", "10k-20k", ">20k"
    ];

    // Populate the nationality dropdown list
    nationalities.forEach(nationality => {
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-list-item');
        listItem.textContent = nationality;
        listItem.addEventListener('click', () => {
            nationalityInput.value = nationality;
            nationalityList.classList.remove('show');
        });
        nationalityList.appendChild(listItem);
    });

    // Populate the star rating dropdown list
    starRatings.forEach(rating => {
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-list-item');
        listItem.textContent = rating;
        listItem.addEventListener('click', () => {
            starRatingInput.value = rating;
            starRatingList.classList.remove('show');
        });
        starRatingList.appendChild(listItem);
    });

    // Populate the budget dropdown list
    budgetOptions.forEach(budget => {
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-list-item');
        listItem.textContent = budget;
        listItem.addEventListener('click', () => {
            budgetInput.value = budget;
            budgetList.classList.remove('show');
        });
        budgetList.appendChild(listItem);
    });

    // Function to close all dropdowns
    function closeAllDropdowns() {
        nationalityList.classList.remove('show');
        starRatingList.classList.remove('show');
        budgetList.classList.remove('show');
    }

    // Toggle nationality dropdown visibility
    nationalityDropdownTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        closeAllDropdowns(); // Close others first
        nationalityList.classList.toggle('show');
    });

    // Toggle star rating dropdown visibility
    starRatingDropdownTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        closeAllDropdowns(); // Close others first
        starRatingList.classList.toggle('show');
    });

    // Toggle budget dropdown visibility
    budgetDropdownTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        closeAllDropdowns(); // Close others first
        budgetList.classList.toggle('show');
    });

    // Hide dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown-trigger') && !event.target.closest('.dropdown-list')) {
            closeAllDropdowns();
        }
    });

    // Make inputs non-editable to force selection from list, or add search functionality
    nationalityInput.readOnly = true;
    starRatingInput.readOnly = true;
    budgetInput.readOnly = true;
});
