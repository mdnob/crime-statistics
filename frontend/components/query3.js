document.addEventListener("DOMContentLoaded", function () {
    var checkboxContainer = document.getElementById("checkbox");

    for (var year = 2011; year <= 2022; year++) {
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

    // Fetch data for the first chart
    fetch('http://localhost:3000/query?type=3')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Call renderChart with data to render the first chart immediately
            renderChart(data, 'myChart');
        })
        .catch(error => {
            console.error(error);
        });

    
});

document.addEventListener("DOMContentLoaded", function () {
  // Get references to loading indicator and chart container
  const loadingIndicator = document.getElementById('loading-indicator');

  // Show loading indicator
  loadingIndicator.style.display = 'block';

  fetch('http://localhost:3000/query?type=3.1')
  .then(response => response.json())
  .then(data => {
    loadingIndicator.style.display = 'none';
    console.log(data);
    // Call renderChart with data (initial render will happen when the "Update" button is pressed)
    renderChart(data,'myChart2');
  })
  .catch(error => {
    loadingIndicator.style.display = 'none';
    console.error(error);
  });

});

// index.js
let myChart; // Declare myChart as a global variable for the first chart
let myChart2; // Declare myChart2 as a global variable for the second chart

function renderChart(data, chartId) {
    console.log('Data in renderChart:', data); // Log the data received by renderChart


    // Determine the chart context based on the chartId
    const ctx = document.getElementById(chartId).getContext('2d');

    // Create a new chart instance based on the chartId
    if (chartId === 'myChart') {
        var xValues = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020",
        "2021", "2022"];

        var yValues = [data[0], data[1]].flat();

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [
                    {
                        label: 'Inflation Rate',
                        data: yValues,
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                maintainAspectRatio: true
            }
        });
    } else if (chartId === 'myChart2') {
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
            if (!myChart2) {
              const ctx = document.getElementById('myChart2').getContext('2d');
        
              myChart2 = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: selectedYears,
                  datasets: [
                    {
                      label: 'Theft',
                      data: filteredData.map(entry => entry[1]),
                      backgroundColor: 'blue',
                      borderColor: 'blue',
                      borderWidth: 1
                    },
                    {
                      label: 'Assault',
                      data: filteredData.map(entry => entry[2]),
                      backgroundColor: 'black',
                      borderColor: 'black',
                      borderWidth: 1
                    },
                    {
                      label: 'Kidnapping',
                      data: filteredData.map(entry => entry[3]),
                      backgroundColor: 'red',
                      borderColor: 'red',
                      borderWidth: 1
                    },
                    {
                      label: 'Homicide',
                      data: filteredData.map(entry => entry[4]),
                      backgroundColor: 'green',
                      borderColor: 'green',
                      borderWidth: 1
                    },
                    {
                      label: 'Robbery',
                      data: filteredData.map(entry => entry[5]),
                      backgroundColor: 'yellow',
                      borderColor: 'yellow',
                      borderWidth: 1
                    },
                    {
                      label: 'Burglary',
                      data: filteredData.map(entry => entry[6]),
                      backgroundColor: 'purple',
                      borderColor: 'purple',
                      borderWidth: 1
                    },
                  ]
                },
                options: {
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'Crime Instances'
                      }
                    }
        
                  }
                }
              });
            } else {
              // Update the chart data and labels
              myChart2.data.labels = selectedYears;
              myChart2.data.datasets[0].data = filteredData.map(entry => entry[1]);
              myChart2.data.datasets[1].data = filteredData.map(entry => entry[2]);
              myChart2.data.datasets[2].data = filteredData.map(entry => entry[3]);
              myChart2.data.datasets[3].data = filteredData.map(entry => entry[4]);
              myChart2.data.datasets[4].data = filteredData.map(entry => entry[5]);
              myChart2.data.datasets[5].data = filteredData.map(entry => entry[6]);

              // Update the chart
              myChart2.update();
            }
          });
    }
}
