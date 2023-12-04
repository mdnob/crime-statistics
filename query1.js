document.addEventListener("DOMContentLoaded",  function () {
  var checkboxContainer = document.getElementById("checkbox");

  for (var year = 2010; year <= 2023; year++) {
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

fetch('http://localhost:3000/query?type=1')
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
  document.addEventListener("change", function (event) {
    if (event.target.type === "checkbox" && event.target.id.startsWith("year")) {
      // Uncheck all other checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        if (checkbox.id !== event.target.id) {
          checkbox.checked = false;
        }
      });
  
      // Trigger the button click to update the chart
      document.getElementById("updateButton").click();
    }
  });

  // Button event listener
  document.getElementById("updateButton").addEventListener("click", function() {
    // Get the selected years from checked checkboxes
    const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));

    // Filter data based on selected years
    const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

    var xValues = [filteredData.map(entry => entry[1]),filteredData.map(entry => entry[2]),
    filteredData.map(entry => entry[3]),filteredData.map(entry => entry[4]),
    filteredData.map(entry => entry[5])];

    var yValues = [filteredData.map(entry => entry[6]),filteredData.map(entry => entry[7]),
    filteredData.map(entry => entry[8]),filteredData.map(entry => entry[9]),
    filteredData.map(entry => entry[10])].flat();

    // If myChart is not defined, create a new chart instance
    if (!myChart) {
      const ctx = document.getElementById('myChart').getContext('2d');

      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [
            {
              label: 'Normal Distribution',
              data: yValues,
              backgroundColor: 'blue',
              borderColor: 'blue',
              borderWidth: 1
            },
          
          ]
        },
        options: {
          maintainAspectRatio: true,
          scales: {
            x: {
              title: {
                display:true,
                text: 'Age'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Probability Distribution'
              }
            }

          }
        }
      });
    } else {
      // Update the chart data and labels
      myChart.data.labels = [filteredData.map(entry => entry[1]),filteredData.map(entry => entry[2]),
      filteredData.map(entry => entry[3]),filteredData.map(entry => entry[4]),
      filteredData.map(entry => entry[5])];

      myChart.data.datasets[0].data = [filteredData.map(entry => entry[6]),filteredData.map(entry => entry[7]),
      filteredData.map(entry => entry[8]),filteredData.map(entry => entry[9]),
      filteredData.map(entry => entry[10])].flat();  
      // Update the chart
      myChart.update();
    }
  });
}

