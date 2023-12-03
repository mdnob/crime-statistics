document.addEventListener("DOMContentLoaded", function () {
  var checkboxContainer = document.getElementById("checkbox");

  for (var year = 2010; year <= 2022; year++) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "year" + year;

      var label = document.createElement("label");
      label.htmlFor = "year" + year;
      label.className = "checkbox-label";
      label.appendChild(document.createTextNode(year));
      
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);
  }
});

// index.js
let myChart; // Declare myChart as a global variable

fetch('http://localhost:3000/query?type=4')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Call renderChart with data (initial render will happen when the "Update" button is pressed)
    renderChart(data);
  })
  .catch(error => {
    console.error(error);
});

function renderChart(data) {
  console.log('Data in renderChart:', data); // Log the data received by renderChart

  // Checkbox event listener
  document.addEventListener("change", function(event) {
    if (event.target.type === "checkbox" && event.target.id.startsWith("year")) {
      // Do nothing here, the chart will be updated when the "Update" button is pressed
    }
  });

  // Button event listener
  document.getElementById("updateButton").addEventListener("click", function() {
    // Get the selected years from checked checkboxes
    const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));

    // Filter data based on selected years
    const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

    // If myChart is not defined, create a new chart instance
    if (!myChart) {
      const ctx = document.getElementById('myChart').getContext('2d');

      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: selectedYears,
          datasets: [
            {
              label: 'Total Crime',
              data: filteredData.map(entry => entry[1]),
              backgroundColor: 'blue',
              borderColor: 'blue',
              borderWidth: 1
            },
            {
              label: 'Theft',
              data: filteredData.map(entry => entry[2]),
              backgroundColor: 'black',
              borderColor: 'black',
              borderWidth: 1
            },
            {
              label: 'Assault',
              data: filteredData.map(entry => entry[3]),
              backgroundColor: 'red',
              borderColor: 'red',
              borderWidth: 1
            },
            {
              label: 'Kidnapping',
              data: filteredData.map(entry => entry[4]),
              backgroundColor: 'green',
              borderColor: 'green',
              borderWidth: 1
            },
            {
              label: 'Homicide',
              data: filteredData.map(entry => entry[5]),
              backgroundColor: 'yellow',
              borderColor: 'yellow',
              borderWidth: 1
            },
            {
              label: 'Robbery',
              data: filteredData.map(entry => entry[6]),
              backgroundColor: 'purple',
              borderColor: 'purple',
              borderWidth: 1
            },
            {
              label: 'Burglary',
              data: filteredData.map(entry => entry[7]),
              backgroundColor: 'orange',
              borderColor: 'orange',
              borderWidth: 1
            },
          ]
        },
        options: {
          maintainAspectRatio: true
        }
      });
    } else {
      // Update the chart data and labels
      myChart.data.labels = selectedYears;
      myChart.data.datasets[0].data = filteredData.map(entry => entry[1]);
      myChart.data.datasets[1].data = filteredData.map(entry => entry[2]);
      myChart.data.datasets[2].data = filteredData.map(entry => entry[3]);
      myChart.data.datasets[3].data = filteredData.map(entry => entry[4]);
      myChart.data.datasets[4].data = filteredData.map(entry => entry[5]);
      myChart.data.datasets[5].data = filteredData.map(entry => entry[6]);
      myChart.data.datasets[6].data = filteredData.map(entry => entry[7]);


      // Update the chart
      myChart.update();
    }
  });
}

