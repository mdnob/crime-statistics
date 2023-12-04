let myChart;
let data;

document.addEventListener("DOMContentLoaded", function () {
  const checkboxContainer = document.getElementById("checkbox");

  for (let year = 2010; year <= 2022; year++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "year" + year;

    const label = document.createElement("label");
    label.htmlFor = "year" + year;
    label.className = "checkbox-label";
    label.appendChild(document.createTextNode(year));

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
  }

  const crimeTypes = ["Unemployment", "Theft", "Assault", "Kidnapping", "Homicide", "Robbery", "Burglary"];
  const checkboxCrime = document.getElementById("checkboxCrime");

  for (let i = 0; i < crimeTypes.length; i++) {
    const crimeType = crimeTypes[i];

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = crimeType;

    const label = document.createElement("label");
    label.htmlFor = crimeType;
    label.className = "checkbox-label";
    label.appendChild(document.createTextNode(crimeType));

    checkboxCrime.appendChild(checkbox);
    checkboxCrime.appendChild(label);
  }
});



document.addEventListener("DOMContentLoaded", function () {
  // Get references to loading indicator and chart container
  const loadingIndicator = document.getElementById('loading-indicator');

  // Show loading indicator
  loadingIndicator.style.display = 'block';

  fetch('http://localhost:3000/query?type=2')
  .then(response => response.json())
  .then(fetchedData => {
    loadingIndicator.style.display = 'none';
    console.log(fetchedData);
    data = fetchedData;
    renderChart();
  })
  .catch(error => {
    loadingIndicator.style.display = 'none';
    console.error(error);
  });

});

function renderChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      maintainAspectRatio: true
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.type === "checkbox") {
      if (event.target.id.startsWith("year")) {
        updateChart();
      } else {
        updateCrimeChart();
      }
    }
  });
}

function updateChart() {
  const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"][id^="year"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
  const selectedCrimeTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .filter(checkbox => !checkbox.id.startsWith("year"))
    .map(checkbox => checkbox.id);

  const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

  if (!myChart) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: selectedYears,
        datasets: getCrimeTypeDatasets(selectedCrimeTypes, filteredData)
      },
      options: {
        maintainAspectRatio: true
      }
    });
  } else {
    myChart.data.labels = selectedYears;
    myChart.data.datasets = myChart.data.datasets.filter(dataset => selectedCrimeTypes.includes(dataset.label));
    updateCrimeTypeDatasets(selectedCrimeTypes, filteredData);
    myChart.update();
  }
}

function updateCrimeChart() {
  const selectedYears = Array.from(document.querySelectorAll('input[type="checkbox"][id^="year"]:checked')).map(checkbox => checkbox.id.replace("year", ""));
  const selectedCrimeTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .filter(checkbox => !checkbox.id.startsWith("year"))
    .map(checkbox => checkbox.id);

  const filteredData = data.filter(entry => selectedYears.includes(entry[0]));

  if (!myChart) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: selectedYears,
        datasets: getCrimeTypeDatasets(selectedCrimeTypes, filteredData)
      },
      options: {
        maintainAspectRatio: true
      }
    });
  } else {
    myChart.data.labels = selectedYears;
    updateCrimeTypeDatasets(selectedCrimeTypes, filteredData);
    myChart.update();
  }
}

function getCrimeTypeDatasets(selectedCrimeTypes, filteredData) {
  return selectedCrimeTypes.map((crimeType, index) => {
    const color = getColorByIndex(index);

    return {
      label: crimeType,
      data: filteredData.map(entry => entry[crimeTypeToIndexMap[crimeType]]),
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
      fill: false
    };
  });
}

const crimeTypeToIndexMap = {
  'Unemployment': 1,
  'Theft': 2,
  'Assault': 3,
  'Kidnapping': 4,
  'Homicide': 5,
  'Robbery': 6,
  'Burglary': 7
};

function getColorByIndex(index) {
  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'yellow', 'brown', 'cyan'];
  return colors[index % colors.length];
}

function updateCrimeTypeDatasets(selectedCrimeTypes, filteredData) {
  const existingDatasets = myChart.data.datasets;

  selectedCrimeTypes.forEach((crimeType, index) => {
    const dataIndex = crimeTypeToIndexMap[crimeType];
    const existingDataset = existingDatasets.find(dataset => dataset.label === crimeType);

    if (existingDataset) {
      existingDataset.data = filteredData.map(entry => entry[dataIndex]);
    } else {
      const color = getColorByIndex(index);
      const newDataset = {
        label: crimeType,
        data: filteredData.map(entry => entry[dataIndex]),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        fill: false
      };
      existingDatasets.push(newDataset);
    }
  });

  existingDatasets.forEach((dataset, index) => {
    if (!selectedCrimeTypes.includes(dataset.label)) {
      existingDatasets.splice(index, 1);
    }
  });
}
