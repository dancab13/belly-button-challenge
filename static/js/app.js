const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Promise Pending
const dataPromise = d3.json(url);
console.log('Data Promise: ', dataPromise);

function barChart(test) {
  // Fetch the JSON data
  d3.json(url).then(function(data) {
    
    let dataArray = Object.values(data);
    console.log('All data as an array:', dataArray);

    let sample = Object.values(data.samples);
    console.log('Just the samples data as an array:', sample);

    let number = sample[0].id;
    let subject = sample.filter(function (x) {
      return number == test;
    });
    console.log(subject)

    // Initiatlize variables
    let ids = []
    let otus = []
    let labels = []
    let sampleValues = []

  for (let i = 0; i < sample.length; i++) {
    // Extract values from each row as arrays (sliced when relevant)
    ids.push(sample[i]['id']);
    otus.push(sample[i]['otu_ids'].slice(0, 10).map(function (x) {
      return `OTU ${x}`;
      }));
    labels.push(sample[i]['otu_labels'].slice(0, 10))
    sampleValues.push(sample[i]['sample_values'].slice(0, 10));
  };
  
  // Check to see if you pulled the data correctly
  console.log('IDs:', ids);
  console.log('OTUs:', otus);
  console.log('Labels:', labels);
  console.log('Sample values:', sampleValues);

  // Initializes the page with a default bar graph
  let traceBar = {
    x: sampleValues[0].reverse(),
    y: otus[0].reverse(),
    text: labels[0].reverse(),
    type: 'bar',  
    orientation: 'h',
  };

  let dataBarInit = [traceBar];

  // Apply a title to the layout
  let layoutBar = {
    title: 'Top 10 Operational Taxonomic Units (OTUs)',
    margin: {
      l: 100,
      r: 300,
      t: 100,
      b: 100
    }
  }

  Plotly.newPlot("bar", dataBarInit, layoutBar);

  // Initiatlize a default bubble graph
  let traceBubble = {
    x: sample[0].otu_ids,
    y: sample[0].sample_values,
    text: sample[0].otu_labels,
    mode: 'markers',
    marker: {
      color: sample[0].otu_ids,
      size: sample[0].sample_values,
      colorscale: 'Viridis'
    }
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
    width: 1200
  };
  
  Plotly.newPlot('bubble', dataBubble, layoutBubble); */
});
};

barChart()