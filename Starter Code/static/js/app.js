// URL and json request saved as a global variable
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
let request = d3.json(url);

// Build the metadata panel
function buildMetadata(sample) {
  request.then((data) => {
    
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    // Casting the metadata id to a String because it is stored in the JSON as an integer; Source: https://brainstation.io/learn/javascript/casting
    let targetMetadata = metadata.filter(x => String(x.id) === sample)[0];

    // Select the panel with id of `#sample-metadata`
    let dashboard = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    dashboard.html("");

    // Append dashboard with each key-value in the filtered metadata.
    for (let key in targetMetadata){

      // Append new elements to the selected element
      dashboard.append("h6").text(`${key}: ${targetMetadata[key]}`);
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  request.then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let targetSample = samples.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = targetSample.otu_ids;
    let otu_labels = targetSample.otu_labels;
    let sample_values = targetSample.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    // Render the Bubble Chart
    let traces1 = [trace1];

    let layout1 = {
      title: `Bacteria Cultures per Sample for Subject ${targetSample.id}`,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };

    Plotly.newPlot('bubble', traces1, layout1);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(x => `OTU ${x}`);

    // Build a Bar Chart to get top 10 Bacteria cultures
    let trace2 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        color: "#a5117b"
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };

    // Render the Bar Chart
    let traces2 = [trace2];

    let layout2 = {
      title: `Top 10 Bacteria Cultures Found for Subject ${targetSample.id}`,
      xaxis: {
        title: 'Number of Bacteria'
      }
  };

  Plotly.newPlot('bar', traces2, layout2);

  });
}

// Function to run on page load
function init() {
  request.then((data) => {

    // Get the names field
    let names = data.names;

    // Select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    for (let i=0; i < names.length; i++){

      // Get each individual name (for clarity)
      let name = names[i];

      // append the option list to dynamically build the dropdown list
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {

  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
