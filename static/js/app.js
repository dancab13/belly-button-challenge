const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log('Data Promise: ', dataPromise);

function charts(test) {
  // Fetch the JSON data
  d3.json(url).then(function(data) {

    // Get data
    let dataArray = Object.values(data);
    console.log('All data as an array:', dataArray);

    // Get relevant data for building charts
    let sample = Object.values(data.samples);
    console.log('Just the samples data as an array:', sample);

    // Initiatlize variables
    let otus = ''
    let labels = ''
    let sampleValues = ''
    
    // Confirm if sample[0].id will return the id number so you can
    // use that in a conditional to check if the id matches the id
    // you will eventually choose in the dropdown
    console.log(sample[0].id)

    // Create a for loop to run through the Samples data
    // and, if the id in the Samples row matches the id 
    // from the eventual dropdown, make the variable equal
    // to the specified value from the Samples row
    for (let i = 0; i < sample.length; i++) {
      if (sample[i].id == test) {
        // Extract values from each row
        otus = sample[i].otu_ids
        labels = sample[i].otu_labels
        sampleValues = sample[i].sample_values;
      };
    };
  
    // Check to see if you pulled the data correctly. 
    // If it doesn't work, it could be that there's
    // no "test" id to check against (yet)
    console.log('OTUs:', otus);
    console.log('Labels:', labels);
    console.log('Sample values:', sampleValues);

    // Build the bar graph using the above variables
    let traceBar = {
      x: sampleValues.slice(0, 10).reverse(),
      y: otus.slice(0, 10).reverse().map(function (x) {
        return `OTU ${x}`;
      }),
      text: labels.slice(0, 10).reverse(),
      type: 'bar',  
      orientation: 'h'
    };
    let dataBarInit = [traceBar];
    // Apply a title to the layout
    let layoutBar = {
      title: 'Top 10 Operational Taxonomic Units (OTUs)',
      margin: {
        l: 100,
        r: 100,
        t: 50,
        b: 50}
      };
    Plotly.newPlot("bar", dataBarInit, layoutBar);

    // Build the bubble chart using the above variables
    let traceBubble = {
      x: otus,
      y: sampleValues,
      text: labels,
      mode: 'markers',
      marker: {
        color: otus,
        size: sampleValues,
        colorscale: 'Viridis'}
      };
    let dataBubble = [traceBubble];
    let layoutBubble = {
      title: 'All OTUs and Their Values',
      showlegend: false,
      xaxis: {
        title: 'OTU ID'},
      yaxis: {
        title: 'Sample Values'},
      height: 600,
      width: 1200};
    Plotly.newPlot('bubble', dataBubble, layoutBubble);
  });
};

// Create a similar function as above to create
// and populate the metadata card
function dataCard(test) {

  // Get the JSON data
  d3.json(url).then(function(data) {
  
  // Put the data in variables and check they work.
  // If they don't work, that could be because there's
  // no "test" id (yet)
  let metaValues = Object.values(data.metadata);
  console.log('metaValues:', metaValues);
  let metaRow = metaValues[0]
  console.log('metaRow:', metaRow);
  metaKeys = Object.keys(metaRow)
  console.log('metaKeys:', metaKeys);
  
  // Initiatlize a variable to hold the text that
  // will go in the metadata card
  card = []

  // Loop through the metadata to pull the row (or object)
  // where the id matches the id from the eventual dropdown
  for (let i = 0; i < metaValues.length; i++) {
    if (metaValues[i].id == test) {
      card = metaValues[i]
    };};
  console.log('card:', card);
  
  // Use D3 to select the HTML div id of the card
  // and remove any existing text
  d3.select("#sample-metadata.card-body").html('');
  
  // Xpert Learning Assistant helped me with this.
  // Pull the key from each item/row/index of the card variable 
  // (which is an object with key: value pairs) and use D3
  // to add text with the key: value data to the empty HTML card. 
  Object.keys(card).forEach(function (key) {
    return d3.select("#sample-metadata.card-body")
    .append("p")
    .text(`${key}: ${card[key]}`);
  });
})};

// Create a function for the optionChanged function from
// the HTML file. This function takes the input from the
// eventual dropdown (which will be an id) and runs it
// through the functions above (i.e., making "test" equal
// the id).
function optionChanged(change) {
  charts(change);
  dataCard(change);
};

// Create a function that will initiatlize the whole page
// and the run the functions above
function init() {

  // Like above, get the data
  d3.json(url).then(function(data) {

    // Get the Samples data to get the ids to build the dropdown
    let sample = Object.values(data.samples);
    console.log('Samples', sample);

    // Populate the dropdown menu by looping through
    // the Samples data and pulling the ids then
    // using D3 to create new option classes under
    // the selDataset id
    for (let i = 0; i < sample.length; i++) {
    d3.select('#selDataset')
      .append('option')
      .text(sample[i].id)
      .property('value', sample[i].id);
    };

    // Initiatlize default charts and the metadata card
    // so the page is populated when it opens
    let initial = sample[0].id
    charts(initial)
    dataCard(initial)
});
};

// Run the init function to make everything work
init()

