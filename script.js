let doctorResults = [];

$(document).ready(function () {
    $('#searchBtn').click(function () {
        const location = $('#location').val();
        const country = $('#country').val();
        if (location) {
            findDoctors(location, country);
        } else {
            alert('Please enter a city or place.');
        }
    });

    $('#sortBtn').click(function () {
        if (doctorResults.length > 0) {
            // Sort by rating in descending order
            doctorResults.sort((a, b) => {
                return (b.rating || 0) - (a.rating || 0);
            });
            console.log('Sorted Results:', doctorResults); // Log sorted results
            displayResults(doctorResults);
        } else {
            alert('No results to sort.');
        }
    });
});

function findDoctors(location, country) {
    const geocoder = new google.maps.Geocoder();
    const address = country ? `${location}, ${country}` : location;

    geocoder.geocode({ address: address }, function (results, status) {
        if (status === 'OK' && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            const placesService = new google.maps.places.PlacesService(document.createElement('div'));
            placesService.nearbySearch(
                {
                    location: { lat, lng },
                    radius: '5000', // 5 km radius
                    type: ['doctor'],
                },
                (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        doctorResults = results.map(place => ({
                            name: place.name,
                            rating: place.rating || 0,
                            place_id: place.place_id
                        })); // Store results with necessary properties
                        console.log('Fetched Results:', doctorResults); // Log fetched results
                        displayResults(doctorResults);
                    } else {
                        alert('No doctors found in this area or an error occurred.');
                    }
                }
            );
        } else {
            alert('Location not found.');
        }
    });
}

function displayResults(results) {
    $('#results').empty();
    $('#results').append('<button id="sortBtn" class="gap">Sort by Rating</button>'); // Re-add sort button

    results.forEach(place => {
        const reviewsLink = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
        
        $('#results').append(`
            <div class="result-item">
                <h3>${place.name}</h3>
                <p>Rating: ${place.rating}</p>
                <a href="${reviewsLink}" target="_blank">View Reviews</a>
            </div>
        `);
    });
}
