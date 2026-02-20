// Function to toggle dropdown visibility
function toggleDropdown(dropdownTriggerId, dropdownListId) {
    const dropdownTrigger = document.getElementById(dropdownTriggerId);
    const dropdownList = document.getElementById(dropdownListId);
    if (dropdownTrigger && dropdownList) {
        dropdownTrigger.addEventListener('click', () => {
            dropdownList.classList.toggle('show');
        });
        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!dropdownTrigger.contains(event.target) && !dropdownList.contains(event.target)) {
                dropdownList.classList.remove('show');
            }
        });
    }
}

// Populate Country Dropdown (can be fetched from backend later)
function populateCountryDropdown() {
    const countryList = document.getElementById('country-list');
    if (countryList) {
        const countries = ['India', 'South Korea', 'United States', 'United Kingdom']; // Dummy data for now
        countries.forEach(country => {
            const div = document.createElement('div');
            div.textContent = country;
            div.addEventListener('click', () => {
                document.getElementById('country-input').value = country;
                countryList.classList.remove('show');
            });
            countryList.appendChild(div);
        });
    }
}

// Populate Star Rating Dropdown
function populateStarRatingDropdown() {
    const starRatingList = document.getElementById('star-rating-list');
    if (starRatingList) {
        const ratings = ['1 Star or More', '2 Star or More', '3 Star or More', '4 Star or More', '5 Star or More'];
        ratings.forEach(rating => {
            const div = document.createElement('div');
            div.textContent = rating;
            div.addEventListener('click', () => {
                document.getElementById('star-rating-input').value = rating;
                starRatingList.classList.remove('show');
            });
            starRatingList.appendChild(div);
        });
    }
    // Set a default value
    document.getElementById('star-rating-input').value = '4 Star or More';
}

// Populate Budget Dropdown (example)
function populateBudgetDropdown() {
    const budgetList = document.getElementById('budget-list');
    if (budgetList) {
        const budgets = ['100', '200', '500', '1000']; // Example max budgets
        budgets.forEach(budget => {
            const div = document.createElement('div');
            div.textContent = `Up to $${budget}`;
            div.addEventListener('click', () => {
                document.getElementById('budget-input').value = `Up to $${budget}`;
                budgetList.classList.remove('show');
            });
            budgetList.appendChild(div);
        });
    }
}


// Function to collect form data
function getFormData() {
    const cityHotel = document.querySelector('.city-hotel-input input').value;
    const checkInDate = document.querySelector('.check-in').value;
    const checkOutDate = document.querySelector('.check-out').value;
    const roomsGuestsInput = document.querySelector('.rooms-guests-input input').value; // e.g., "1 Room (2 Adult, 0 Child)"
    const country = document.getElementById('country-input').value;
    const starRatingText = document.getElementById('star-rating-input').value; // e.g., "4 Star or More"
    const budgetText = document.getElementById('budget-input').value; // e.g., "Up to $500"

    // Parse rooms and guests
    const numRoomsMatch = roomsGuestsInput.match(/(\d+) Room/);
    const numAdultsMatch = roomsGuestsInput.match(/(\d+) Adult/);
    const numChildrenMatch = roomsGuestsInput.match(/(\d+) Child/);

    const numRooms = numRoomsMatch ? parseInt(numRoomsMatch[1]) : 1;
    const numAdults = numAdultsMatch ? parseInt(numAdultsMatch[1]) : 2;
    const numChildren = numChildrenMatch ? parseInt(numChildrenMatch[1]) : 0;

    // Parse star rating
    const starRatingMinMatch = starRatingText.match(/(\d+) Star/);
    const starRatingMin = starRatingMinMatch ? parseInt(starRatingMinMatch[1]) : null;

    // Parse budget
    const budgetMaxMatch = budgetText.match(/\$(\d+)/);
    const budgetMax = budgetMaxMatch ? parseInt(budgetMaxMatch[1]) : null;

    return {
        cityHotel,
        checkInDate,
        checkOutDate,
        numRooms,
        numAdults,
        numChildren,
        nationality: country === 'Choose from List' ? '' : country, // Send empty string if default
        starRatingMin,
        budgetMax
    };
}

// Function to display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found for your search criteria.</p>';
        return;
    }

    const hotelsMap = new Map();
    results.forEach(item => {
        if (!hotelsMap.has(item.hotel_id)) {
            hotelsMap.set(item.hotel_id, {
                hotel_id: item.hotel_id,
                hotel_name: item.hotel_name,
                city: item.city,
                country: item.country,
                address: item.address,
                star_rating: item.star_rating,
                rooms: []
            });
        }
        hotelsMap.get(item.hotel_id).rooms.push({
            room_type_id: item.room_type_id,
            room_description: item.room_description,
            max_adults: item.max_adults,
            max_children: item.max_children,
            date: item.date,
            price_per_night: item.price_per_night,
            available_rooms: item.available_rooms
        });
    });

    hotelsMap.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.classList.add('hotel-card');
        hotelCard.innerHTML = `
            <h3>${hotel.hotel_name} <span class="star-rating">${'⭐'.repeat(hotel.star_rating)}</span></h3>
            <p>${hotel.address}, ${hotel.city}, ${hotel.country}</p>
            <div class="room-types-container">
                <h4>Available Rooms:</h4>
                ${hotel.rooms.map(room => `
                    <div class="room-item">
                        <strong>${room.room_description}</strong> (${room.max_adults} Adults, ${room.max_children} Children)
                        <br>
                        Date: ${new Date(room.date).toLocaleDateString()}, Price: $${room.price_per_per_night} (Available: ${room.available_rooms})
                    </div>
                `).join('')}
            </div>
        `;
        resultsContainer.appendChild(hotelCard);
    });
}


// Event listener for the Search button
document.querySelector('.search-button').addEventListener('click', async () => {
    const formData = getFormData();
    console.log('Search initiated with data:', formData);

    try {
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const results = await response.json();
        console.log('Search results:', results);
        displayResults(results);

    } catch (error) {
        console.error('Error during search:', error);
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<p style="color: red;">Error performing search. Please try again later.</p>';
    }
});


// Initialize dropdowns on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    toggleDropdown('country-dropdown-trigger', 'country-list');
    populateCountryDropdown();

    toggleDropdown('star-rating-dropdown-trigger', 'star-rating-list');
    populateStarRatingDropdown();

    toggleDropdown('budget-dropdown-trigger', 'budget-list');
    populateBudgetDropdown();

    // Rooms & Guests Dropdown (More complex, placeholder for now)
    const roomsGuestsInput = document.querySelector('.rooms-guests-input input');
    if (roomsGuestsInput) {
        roomsGuestsInput.addEventListener('click', (event) => {
            // In a real app, this would open a modal/dropdown for selecting rooms/adults/children
            alert('Room & Guest selection not yet implemented. Defaulting to 1 Room (2 Adult, 0 Child)');
            event.preventDefault();
        });
    }
});