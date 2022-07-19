// HT to Jeremia Kimelman for the historical data file
// https://observablehq.com/d/cfc7caf8f50d44dd

// First off, let's load up our data, and then create our entire chart inside the .then() function
d3.csv("countries.csv").then(data => {
  
	// Setting some variables that we are going to use over and over
	// first the height of our chart
	const height = 400
	// then the width of our chart
	const width = 800
	// then the amount of space we want to leave inside the chart so we can see all of the labels
	const margin = 40

	// use d3.min to find the smallest population value in the entire dataset
	const populationMin = d3.min(data, d => +d.population) // +d.population converts the population value from a string to a number
	// use d3.max to find the largest population value in the entire dataset
	const populationMax = d3.max(data, d => +d.population)

	// instead of using d3.min and d3.max seperately, we can use d3.extent to find both with a single function
	// here we use it to find the smallest and largest income values in the dataset
	const incomeExtent = d3.extent(data, d => +d.income_per_person)
	const years = d3.extent(data, d => +d.year)

	// this is a simple object that defines color values for each region in the dataset
	// we are using an object with key/value pairs so it is easy to "look up" the value we want later
	const regionColors = {
		africa: "deepskyblue",
		asia: "tomato",
		americas: "limegreen",
		europe: "gold",
	}

	// setting up the y scale with a linear scale
	// here we are using hard-coded values for the domain because 
	// these values are intuitive for the type of data we are working with, in this case average life expectancy.
	// we could have used d3.extent, but this gives us easier control of the visual output of the chart
	const yScale = d3.scaleLinear()
		.domain([0, 100])
		// we are using the margin variable and the height variable to limit the output of the scale
		// so that it fits inside the area we want to use on the screen
		.range([height - (2 * margin), 0])

	// now we are using the d3.scaleLog() function to create our x scale
	// we could use a linear scale here, but in this case, a logarithmic one makes for easier comparison between countries
	const xScale = d3.scaleLog()
		.domain(incomeExtent)
		// once again we are using that margin variable WITH the width variable to define the range/output of the scale
		.range([0, width - (2 * margin)])

	// now a scale for the radius of the circles
	// REMEMBER! always use a square root scale when you are encoding values as the AREA of a shape
	const rScale = d3.scaleSqrt()
		.domain([populationMin, populationMax])
		.range([2, 40])

	// we want to start our chart at the first year in the data set
	// using the extent and looking at the first item is an easy way to find that
	let year = years[0]

	// now we are creating the SVG and defining some attributes with the variables we set up above
	const svg = d3.select('#chart')
		.append("svg") // append a new SVG element
		.attr("height", height) // set the height of the SVG
		.attr("width", width) // and set the width of the SVG

	// now we need to get just the data for the current year that we want to show
	// what function do we use when we want to get a subset of an array?
	// filter()!
	// so let's filter to the rows that have their column value equal to our staring year
	const yearlyData = data.filter(function(d) {
		// remember when we defined the year extent, we converted year from a string to a number
		// so we will need to make sure we are using a number here too.
		return +d.year === year
	})

	// now that we have all of our scales and our inital data
	// it's time to add the circles to the svg
	// note that instead of adding the circles to the svg directly, we are adding a <g> first
	// and we are using the transform property on the <g> element to move it according to the margin value we set
	svg.append('g')
		.attr('transform', `translate(${margin} ${margin})`) // make sure our chart stays inside the margins!
		.selectAll('circle') // Now we can create the circle selection
		.data(yearlyData, d => d.country) // Bind the data for the current year that we filtered before, we are also using the country column as a "key" to make sure the binding is consistent
		.join('circle') // Now let's create those circles from the data Note: could use .enter().append('circle') instead
		.attr('cy', d => yScale(+d.life_expectancy) ) // use the yScale to set the cy attribute of the <circle> based on the life_expectancy column for each row
		.attr('cx', d => xScale(+d.income_per_person) ) // use the xScale to set the cx attribute of the <circle> based on the income_per_person column for each row
		.attr('r', d => rScale(+d.population) ) // use the rScale to set the r attribute of the <circle> based on the population column for each row
		.attr('fill', d => regionColors[d.region]) // use the regionColors variable we created to lookup the correct color value based on the region column for each row
		.attr('opacity', .8) // setting the opacity to .8 for ALL circles

	// this function will help us convert the format of the labels to be more human-readable
	// to do this, we are using the helpful d3.format() function https://github.com/d3/d3-format
	const format = d3.format('.2s')

	// now we are using the d3-axis tools to render axes for our chart
	// first off let's define the xAcis based on the xScale
	// axisBottom() means the labels go on the bottom!
	const xAxis = d3.axisBottom().scale(xScale).ticks(5, format)
	// now the same for the yAxis, based on the yScale
	// axisLeft() means the labels are on the left!
	const yAxis = d3.axisLeft().scale(yScale)

	// in order to render the axes, we create an empty <g> to hold each one, and then use the .call() function to render them
	// we are also using the height, width and margin variables to keep these inside of the area we want to use
	svg.append('g').attr('transform', `translate(0 ${height - margin})`).call(xAxis)
	svg.append('g').attr('transform', `translate(${margin / 2} ${margin})`).call(yAxis)

	// here we append a new <text> element to the svg which we will use to display the current year
	svg.append('text')
		.attr('id', 'year') // give the <text> element an id so we can find it again later
		.attr('dy', height * .8) // use the dy attribute to position the text vertically
		.attr('dx', 20) // use the dx attribute to position the text horizontally
		.attr('font-size', '100px') // set the font-size attribute of the <text> element
		.attr('opacity', .3) // set the opacity of the <text> element
		.text(year) // and set the text of the <text> element to the current year

	// here is where we create our animation loop.
	// setInterval will run the function we provide it every x milliseconds
	// we define the length of the milliseconds in the 2nd argument
	// so it looks like setInterval(functionToRun, millisecondsBetweenRuns)
	setInterval(function() {
		// if the year variable is equal to the most recent year, then do nothing
		if (year === years[1]) {
			return
		} else {
			// otherwise, increment the year by 1 and keep going
			year = year + 1
		}

		// refilter the data based on the new year value. This is the same as when we did it before
		// maybe we could turn this into a re-usable function if we wanted to, since we wrote it twice!
		const yearlyData = data.filter(function(d) {
			return +d.year === year
		})

		// we also want to update the text element with the new year
		// this is why we gave it an id before, so we could look it up easily again!
		d3.select('#year').text(year)

		// and now we just want to re-select the circles, bind the new data to them, and update the attributes!
		svg.selectAll('circle')
			.data(yearlyData, d => d.country)
			.transition(100)
			.attr('cy', d => yScale(+d.life_expectancy) )
			.attr('cx', d => xScale(+d.income_per_person) )
			.attr('r', d => rScale(+d.population) )

	}, 200) // run this function every 200 milliseconds
})

