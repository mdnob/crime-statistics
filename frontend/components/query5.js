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
  
  
  
  fetch('http://localhost:3000/query?type=5.1')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderChart(data, 'myChart');
    })
    .catch(error => {
      console.error(error);
  });

  fetch('http://localhost:3000/query?type=5.2')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderChart(data, 'myChart2');
    })
    .catch(error => {
      console.error(error);
  });

  fetch('http://localhost:3000/query?type=5.3')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderChart(data, 'myChart3');
    })
    .catch(error => {
      console.error(error);
  });

  fetch('http://localhost:3000/query?type=5.4')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderChart(data, 'myChart4');
    })
    .catch(error => {
      console.error(error);
  });

  document.addEventListener("DOMContentLoaded", function () {
    // Get references to loading indicator and chart container
    const loadingIndicator = document.getElementById('loading-indicator');
  
    // Show loading indicator
    loadingIndicator.style.display = 'block';
  
    fetch('http://localhost:3000/query?type=5.5')
    .then(response => response.json())
    .then(data => {
      loadingIndicator.style.display = 'none';
      console.log(data);
      // Call renderChart with data (initial render will happen when the "Update" button is pressed)
      renderChart(data,'myChart5');
    })
    .catch(error => {
      loadingIndicator.style.display = 'none';
      console.error(error);
    });
  
  });

  // index.js
  let myChart;
  let myChart2;
  let myChart3;
  let myChart4;
  let myChart5;
  
  
  function renderChart(data,chartId) {
    console.log('Data in renderChart:', data); // Log the data received by renderChart
    const ctx = document.getElementById(chartId).getContext('2d');
  
    
    document.addEventListener("change", function(event) {
      if (event.target.type === "checkbox" && event.target.id.startsWith("year")) {
        if (event.target.type === "checkbox" && event.target.id.startsWith("year")) {
          // Uncheck all other checkboxes
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox.id !== event.target.id) {
              checkbox.checked = false;
            }
          });
        }
      }
    });
  
    // Button event listener
    document.getElementById("updateButton").addEventListener("click", function() {
      // Get the selected years from checked checkboxes
      const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
  
      // Filter data based on selected years
      const filteredData = data.filter(entry => selectedYears.includes(entry[0]));
  
      // If myChart is not defined, create a new chart instance for Christmas/Halloween, etc.
      // Create a new chart instance based on the chartId
    if (chartId === 'myChart') {

     
    
      // Button event listener
      document.getElementById("updateButton").addEventListener("click", function() {
        // Get the selected years from checked checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
    
        // Filter data based on selected years
        const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

        var xValues = [filteredData.map(entry => entry[1]),
        filteredData.map(entry => entry[3]),
        filteredData.map(entry => entry[5]),
        filteredData.map(entry => entry[7]),
        filteredData.map(entry => entry[9]),
        filteredData.map(entry => entry[11]),
        filteredData.map(entry => entry[13]),
        filteredData.map(entry => entry[15]),
        filteredData.map(entry => entry[17]),
        filteredData.map(entry => entry[19])];

        var yValues = [filteredData.map(entry => entry[2]),
        filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
        filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
        filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
        filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
        filteredData.map(entry => entry[20])].flat();
    
        // If myChart is not defined, create a new chart instance
        if (!myChart) {
          const ctx = document.getElementById('myChart').getContext('2d');
    
          myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xValues,
              datasets: [
                
                {
                  label: 'Christmas',
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
                    text: 'Top 10 Areas'
                  }
                },
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
          myChart.data.labels = [filteredData.map(entry => entry[1]),
          filteredData.map(entry => entry[3]),
          filteredData.map(entry => entry[5]),
          filteredData.map(entry => entry[7]),
          filteredData.map(entry => entry[9]),
          filteredData.map(entry => entry[11]),
          filteredData.map(entry => entry[13]),
          filteredData.map(entry => entry[15]),
          filteredData.map(entry => entry[17]),
          filteredData.map(entry => entry[19])];
        
          myChart.data.datasets[0].data = [filteredData.map(entry => entry[2]),
          filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
          filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
          filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
          filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
          filteredData.map(entry => entry[20])].flat();

          // Update the chart
          myChart.update();
        }
      });
      
    } else if (chartId === 'myChart2') {

      
     
    
      // Button event listener
      document.getElementById("updateButton").addEventListener("click", function() {
        // Get the selected years from checked checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
    
        // Filter data based on selected years
        const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

        var xValues = [filteredData.map(entry => entry[1]),
        filteredData.map(entry => entry[3]),
        filteredData.map(entry => entry[5]),
        filteredData.map(entry => entry[7]),
        filteredData.map(entry => entry[9]),
        filteredData.map(entry => entry[11]),
        filteredData.map(entry => entry[13]),
        filteredData.map(entry => entry[15]),
        filteredData.map(entry => entry[17]),
        filteredData.map(entry => entry[19])];

        var yValues = [filteredData.map(entry => entry[2]),
        filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
        filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
        filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
        filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
        filteredData.map(entry => entry[20])].flat();
    
        // If myChart is not defined, create a new chart instance
        if (!myChart2) {
          const ctx = document.getElementById('myChart2').getContext('2d');
    
          myChart2 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xValues,
              datasets: [
                
                {
                  label: 'New Years',
                  data: yValues,
                  backgroundColor: 'red',
                  borderColor: 'red',
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
                    text: 'Top 10 Areas'
                  }
                },
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
          myChart2.data.labels = [filteredData.map(entry => entry[1]),
          filteredData.map(entry => entry[3]),
          filteredData.map(entry => entry[5]),
          filteredData.map(entry => entry[7]),
          filteredData.map(entry => entry[9]),
          filteredData.map(entry => entry[11]),
          filteredData.map(entry => entry[13]),
          filteredData.map(entry => entry[15]),
          filteredData.map(entry => entry[17]),
          filteredData.map(entry => entry[19])];
        
          myChart2.data.datasets[0].data = [filteredData.map(entry => entry[2]),
          filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
          filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
          filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
          filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
          filteredData.map(entry => entry[20])].flat();

          // Update the chart
          myChart2.update();
        }
      });

    } else if (chartId == 'myChart3') {

    
    
      // Button event listener
      document.getElementById("updateButton").addEventListener("click", function() {
        // Get the selected years from checked checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
    
        // Filter data based on selected years
        const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

        var xValues = [filteredData.map(entry => entry[1]),
        filteredData.map(entry => entry[3]),
        filteredData.map(entry => entry[5]),
        filteredData.map(entry => entry[7]),
        filteredData.map(entry => entry[9]),
        filteredData.map(entry => entry[11]),
        filteredData.map(entry => entry[13]),
        filteredData.map(entry => entry[15]),
        filteredData.map(entry => entry[17]),
        filteredData.map(entry => entry[19])];

        var yValues = [filteredData.map(entry => entry[2]),
        filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
        filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
        filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
        filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
        filteredData.map(entry => entry[20])].flat();
    
        // If myChart is not defined, create a new chart instance
        if (!myChart3) {
          const ctx = document.getElementById('myChart3').getContext('2d');
    
          myChart3 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xValues,
              datasets: [
                
                {
                  label: 'ThanksGiving',
                  data: yValues,
                  backgroundColor: 'green',
                  borderColor: 'green',
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
                    text: 'Top 10 Areas'
                  }
                },
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
          myChart3.data.labels = [filteredData.map(entry => entry[1]),
          filteredData.map(entry => entry[3]),
          filteredData.map(entry => entry[5]),
          filteredData.map(entry => entry[7]),
          filteredData.map(entry => entry[9]),
          filteredData.map(entry => entry[11]),
          filteredData.map(entry => entry[13]),
          filteredData.map(entry => entry[15]),
          filteredData.map(entry => entry[17]),
          filteredData.map(entry => entry[19])];
        
          myChart3.data.datasets[0].data = [filteredData.map(entry => entry[2]),
          filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
          filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
          filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
          filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
          filteredData.map(entry => entry[20])].flat();

          // Update the chart
          myChart3.update();
        }
      });
      
    } else if (chartId === 'myChart4') {
      
    
      // Button event listener
      document.getElementById("updateButton").addEventListener("click", function() {
        // Get the selected years from checked checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
    
        // Filter data based on selected years
        const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

        var xValues = [filteredData.map(entry => entry[1]),
        filteredData.map(entry => entry[3]),
        filteredData.map(entry => entry[5]),
        filteredData.map(entry => entry[7]),
        filteredData.map(entry => entry[9]),
        filteredData.map(entry => entry[11]),
        filteredData.map(entry => entry[13]),
        filteredData.map(entry => entry[15]),
        filteredData.map(entry => entry[17]),
        filteredData.map(entry => entry[19])];

        var yValues = [filteredData.map(entry => entry[2]),
        filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
        filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
        filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
        filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
        filteredData.map(entry => entry[20])].flat();
    
        // If myChart is not defined, create a new chart instance
        if (!myChart4) {
          const ctx = document.getElementById('myChart4').getContext('2d');
    
          myChart4 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xValues,
              datasets: [
                
                {
                  label: '4thOfJuly',
                  data: yValues,
                  backgroundColor: 'purple',
                  borderColor: 'purple',
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
                    text: 'Top 10 Areas'
                  }
                },
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
          myChart4.data.labels = [filteredData.map(entry => entry[1]),
          filteredData.map(entry => entry[3]),
          filteredData.map(entry => entry[5]),
          filteredData.map(entry => entry[7]),
          filteredData.map(entry => entry[9]),
          filteredData.map(entry => entry[11]),
          filteredData.map(entry => entry[13]),
          filteredData.map(entry => entry[15]),
          filteredData.map(entry => entry[17]),
          filteredData.map(entry => entry[19])];
        
          myChart4.data.datasets[0].data = [filteredData.map(entry => entry[2]),
          filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
          filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
          filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
          filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
          filteredData.map(entry => entry[20])].flat();

          // Update the chart
          myChart4.update();
        }
      });
    } else if (chartId === 'myChart5') {
     
    
      // Button event listener
      document.getElementById("updateButton").addEventListener("click", function() {
        // Get the selected years from checked checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
    
        // Filter data based on selected years
        const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

        var xValues = [filteredData.map(entry => entry[1]),
        filteredData.map(entry => entry[3]),
        filteredData.map(entry => entry[5]),
        filteredData.map(entry => entry[7]),
        filteredData.map(entry => entry[9]),
        filteredData.map(entry => entry[11]),
        filteredData.map(entry => entry[13]),
        filteredData.map(entry => entry[15]),
        filteredData.map(entry => entry[17]),
        filteredData.map(entry => entry[19])];

        var yValues = [filteredData.map(entry => entry[2]),
        filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
        filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
        filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
        filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
        filteredData.map(entry => entry[20])].flat();
    
        // If myChart is not defined, create a new chart instance
        if (!myChart5) {
          const ctx = document.getElementById('myChart5').getContext('2d');
    
          myChart5 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xValues,
              datasets: [
                
                {
                  label: 'Halloween',
                  data: yValues,
                  backgroundColor: 'orange',
                  borderColor: 'orange',
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
                    text: 'Top 10 Areas'
                  }
                },
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
          myChart5.data.labels = [filteredData.map(entry => entry[1]),
          filteredData.map(entry => entry[3]),
          filteredData.map(entry => entry[5]),
          filteredData.map(entry => entry[7]),
          filteredData.map(entry => entry[9]),
          filteredData.map(entry => entry[11]),
          filteredData.map(entry => entry[13]),
          filteredData.map(entry => entry[15]),
          filteredData.map(entry => entry[17]),
          filteredData.map(entry => entry[19])];
        
          myChart5.data.datasets[0].data = [filteredData.map(entry => entry[2]),
          filteredData.map(entry => entry[4]),filteredData.map(entry => entry[6]),
          filteredData.map(entry => entry[8]),filteredData.map(entry => entry[10]),
          filteredData.map(entry => entry[12]),filteredData.map(entry => entry[14]),
          filteredData.map(entry => entry[16]),filteredData.map(entry => entry[18]),
          filteredData.map(entry => entry[20])].flat();

          // Update the chart
          myChart5.update();
        }
      });
    }
     
  
});}
  
  