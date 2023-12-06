let map;
let markers = [];
let AdvancedMarkerElement;

// convert month number to three letter
function getAbbreviatedMonthName(monthNumber) {
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const validMonthNumber = Math.max(1, Math.min(12, monthNumber));

    return months[validMonthNumber - 1];
}

// Add an event listener for the update button
document.getElementById("updateButton").addEventListener("click", updateCrimeData);

async function updateCrimeData() {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = "block";

    const selectedDate = document.getElementById("crimeDate").value;

    // selected date into year, month, day
    const dateParts = selectedDate.split("-");
    const year = parseInt(dateParts[0], 10); 
    const monthNumber = parseInt(dateParts[1], 10); 
    const month = getAbbreviatedMonthName(monthNumber); 
    const day = parseInt(dateParts[2], 10);

    // URL with selected date
    const apiUrl = `http://localhost:3000/query?type=map&year=${year}&month=${month}&day=${day}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';
            console.log(data);

            // Filter out positions with undefined latitude or longitude
            const validPositions = data.filter(position => position[0] !== undefined && position[1] !== undefined);

            clearMarkers();

            // Create markers for each valid position
            validPositions.forEach(position => {
                const marker = new AdvancedMarkerElement({
                    map: map,
                    position: { lat: position[0], lng: position[1] },
                    title: `Marker ${markers.length + 1}`,
                });

                // Stores the markers
                markers.push(marker);
            });
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            console.error(error);
        });
}

async function handleFetchedData(data) {

    clearMarkers();

    const positions = data.map(item => ({ lat: item.lat, lng: item.lng }));

    positions.forEach((position, index) => {
        if (
            typeof position === 'object' &&
            position.lat !== undefined &&
            typeof position.lat === 'number' &&
            !isNaN(position.lat) &&
            position.lng !== undefined &&
            typeof position.lng === 'number' &&
            !isNaN(position.lng)
        ) {
            const marker = new AdvancedMarkerElement({
                map: map,
                position: new google.maps.LatLng(position.lat, position.lng),
                title: `Marker ${index + 1}`,
            });
            markers.push(marker);
        } else {
            console.warn(`Skipping invalid position at index ${index}:`, position);
        }
    });
}

async function initMap() {
    // The location of LA
    const originalPosition = { lat: 34.0522, lng: -118.2437 };

    const { Map } = await google.maps.importLibrary("maps");
    ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));

    map = new Map(document.getElementById("map"), {
        zoom: 10,
        center: originalPosition,
        mapId: "MAP_ID",
    });
}

function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// Call the initMap function to set up the map
initMap();
