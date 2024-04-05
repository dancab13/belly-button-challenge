const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log('Data Promise: ', dataPromise);

function charts(test) {
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    
    let dataArray = Object.values(data);
    console.log('All data as an array:', dataArray);

    let sample = Object.values(data.samples);
    console.log('Just the samples data as an array:', sample);

    let otus = ''
    let labels = ''
    let sampleValues = ''
    console.log(sample[0].id)
    for (let i = 0; i < sample.length; i++) {
      if (sample[i].id == test) {
        // Extract values from each row
        otus = sample[i].otu_ids
        labels = sample[i].otu_labels
        sampleValues = sample[i].sample_values;
      };
    };
  
    // Check to see if you pulled the data correctly
    console.log('OTUs:', otus);
    console.log('Labels:', labels);
    console.log('Sample values:', sampleValues);

    // Initializes the page with a default bar graph

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

    // Initiatlize a default bubble graph
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

function dataCard(test) {
  d3.json(url).then(function(data) {
  
  let metaValues = Object.values(data.metadata);
  console.log('metaValues:', metaValues);
  let metaRow = metaValues[0]
  console.log('metaRow:', metaRow);
  metaKeys = Object.keys(metaRow)
  console.log('metaKeys:', metaKeys);
  
  card = []
  for (let i = 0; i < metaValues.length; i++) {
    if (metaValues[i].id == test) {
      card = metaValues[i]
    };};
  console.log('card:', card);

  d3.select("#sample-metadata.card-body").html('');
  
  // Xpert Learning Assistant helped me with this
  Object.keys(card).forEach(function (key) {
    return d3.select("#sample-metadata.card-body")
    .append("p")
    .text(`${key}: ${card[key]}`);
  });
  

  // d3.select("#sample-metadata.card-body").append('p').text(display());
})};

function optionChanged(change) {
  charts(change);
  dataCard(change);
};

function init() {
  d3.json(url).then(function(data) {

    let sample = Object.values(data.samples);
    console.log('Just the samples data as an array:', sample);

    // Populate the dropdown menu
    for (let i = 0; i < sample.length; i++) {
    d3.select('#selDataset').append('option').text(sample[i].id).property('value', sample[i].id);};

    // Call optionChanged() when a change takes place to the DOM
    // d3.selectAll("#selDataset").on("change", optionChanged);

    let initial = sample[0].id
    charts(initial)
    dataCard(initial)
});
};

init()

