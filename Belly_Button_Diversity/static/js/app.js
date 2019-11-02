function buildMetadata(sample) {
	
	// @TODO: Complete the following function that builds the metadata panel
	const selDataset = document.getElementById('selDataset').value;
	const url = `/metadata/${selDataset}`;
	// Use `d3.json` to fetch the metadata for a sample
	d3.json(url).then((response) => {
		// Use d3 to select the panel with id of `#sample-metadata`
		const sample_input = d3.select("#sample-metadata").text();
		console.log(url);
		// Use `.html("") to clear any existing metadata
		d3.select("#sample-metadata").html("");
		console.log(response);
		// Use `Object.entries` to add each key and value pair to the panel
		// Hint: Inside the loop, you will need to use d3 to append new
		// tags for each key-value in the metadata.
		Object.entries(response).forEach(([key, value]) => {
		// console.log(`${key}: ${value}`);
		d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);		
		});
	});
}
	
function buildCharts(sample) {
		
		// @TODO: Use `d3.json` to fetch the sample data for the plots
		const selDataset = document.getElementById('selDataset').value;
		const url = `/samples/${selDataset}`;
		d3.json(url).then((response) => {
			console.log(response);
			const sample_data = response;
			
			// Build a Pie Chart
			const pie_trace = {
				labels: sample_data.otu_ids.slice(0,10),
				values: sample_data.sample_values.slice(0,10),
				type: 'pie',
				hovertemplate: sample_data.otu_labels.slice(0,10)
				};
			console.log(sample_data.otu_labels.slice(0,10));
			const pie_data = [pie_trace];
			Plotly.newPlot("pie", pie_data);

			// Build a Bubble Chart using the sample data
			const bubble_trace = {
				x: sample_data.otu_ids,
				y: sample_data.sample_values,
				mode: 'markers',
				marker: {
					size: sample_data.sample_values,
					color: sample_data.otu_ids
				},
				hovertemplate: sample_data.otu_labels
			  };
			const layout = {
				showlegend: false,
				height: 600,
				width: 1500,
				xaxis: {
					title: 'OTU ID'}
			};
			const bubble_data = [bubble_trace];
			Plotly.newPlot('bubble', bubble_data, layout);
			});
}
	
function init() {
	// Grab a reference to the dropdown select element
	var selector = d3.select("#selDataset");
		
	// Use the list of sample names to populate the select options
	d3.json("/names").then((sampleNames) => {
		sampleNames.forEach((sample) => {
			selector
			.append("option")
			.text(sample)
			.property("value", sample);
		});
			
		// Use the first sample from the list to build the initial plots
		const firstSample = sampleNames[0];
		buildCharts(firstSample);
		buildMetadata(firstSample);
	});
}
	
function optionChanged(newSample) {
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	buildMetadata(newSample);
}
	
// Initialize the dashboard
init();