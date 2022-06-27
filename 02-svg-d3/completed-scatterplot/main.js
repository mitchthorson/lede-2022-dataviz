// Today we are going to make a gapminder style income/life expectancy chart using D3
// inspired by https://www.gapminder.org/tools/#$chart-type=bubbles&url=v1

// read in the data for 2019
d3.csv("./GapminderData.csv").then(function (countries) {

	// now that we have the data, we can start setting up the chart
	// height and width will control the size of the chart
	const height = 400;
	const width = 800;

	// margin value to adjust positining of elements so they do not bleed off of the SVG
	const margin = 30;

	// colors for each continent represented in the dataset
	// these color values be accessed by looking them up like regionColors["africa"]
	const regionColors = {
		africa: "deepskyblue",
		asia: "tomato",
		americas: "limegreen",
		europe: "gold",
	};


	// setting up some scales scales to translate the raw values in the dataset into somoething more useful for charting
	// the y scale is based on life expectancy
	const yScale = d3
		.scaleLinear() // This is a linear scale. So we use d3's scaleLinear.
		.domain([0, 100]) // INPUT. This tells the scale that the input values from the dataset will be between 0 and 100
		.range([height - margin * 2, 0]); // OUTPUT. This tells the scale that a value of 0 in the data should be transformed to the `height` value on the y scale, and a value of 100 in the data should output 0 on the yScale. We are also adjusting for the margin value.

	// in order to properly define the input domain for the radius scale, we need to find out what the minumum and maximum of the population column in the datset are
	const maxPop = d3.max(countries, (d) => +d.population_total); // the + in front of d.population_total tells javacript to convert this to a number, in case it was read in as a string by d3.csv
	const minPop = d3.min(countries, (d) => +d.population_total);

	// the area of a circle is π*(r^2)
	// area = π * (r^2)
	// (area / π) = r^2
	// square root(area/π) = r
	// since we want to encode the population as the area of the circle, not the radius, we need to use a square root scale
	// Read more here: https://eagereyes.org/blog/2008/linear-vs-quadratic-change
	const radiusScale = d3
		.scaleSqrt()
		.domain([minPop, maxPop]) // Input values, the minumum and maximum population values we identified above
		.range([2, 40]); // Output values: what we will apply as values to our svg elements

	// now we need to get the min and max of the income column in our dataset
	const maxIncome = d3.max(countries, (d) => +d.income_per_person_gdppercapita_ppp_inflation_adjusted);
	const minIncome = d3.min(countries, (d) => +d.income_per_person_gdppercapita_ppp_inflation_adjusted);

	// d3 has another function that allows us to get the min AND the max at the same time
	// this function is called "extent", and it returns the min max as an array that looks like:
	// [min, max]
	const minMax = d3.extent(countries, (d) => +d.income_per_person_gdppercapita_ppp_inflation_adjusted);

	// the xScale takes the income values in our dataset
	const xScale = d3
		.scaleLog()
		.domain([250, maxIncome]) // Input values
		.range([0, width - margin * 2]); // Output values, passed to SVG attributes

	// now that all of the our scales are defined, it's time to create our svg
	const svg = d3
		.select("#chart") // select the div with the id of "chart"
		.append("svg") // append a new SVG element
		.attr("height", height) // set the height of the SVG
		.attr("width", width); // and set the width of the SVG

	// now we can add the circles to the svg, one for each row in the dataset
	svg
		.append("g") // create an area inside the svg that respects the margins
		.attr("transform", "translate(" + margin + ", " + margin + ")") // adjust for margins
		.selectAll("circle") // first we "select" the circles that don't yet exist
		.data(countries) // then, we bind the data to the circles selection
		.enter() // now we use the "enter" selection to select any missing circles, which right now is ALL of the circles
		.append("circle") // let's FINALLY add the circle element
		
		.attr("cy", (d) => yScale(+d.life_expectancy_years)) // Set the cy of the circle  to yScale of our life_expectancy_years. yScale(+d.life_expectancy_years) transforms the number in the data to one that fits into our output range
		.attr("cx", (d) => xScale(+d.income_per_person_gdppercapita_ppp_inflation_adjusted)) // we do the same thing to the cx value with the xScale and income
		.attr("r", (d) => radiusScale(+d.population_total)) // give the circle a radius using our radius scale
		.attr("fill", (d) => regionColors[d.region]) // next we can add a fill by looking up the region of each row in the color object we defined above
		.attr("stroke", "black") // this will give a stroke to our circle
		.attr("fill-opacity", 0.75); // this sets the opacity of the circle

	// this function will format any number we pass to it. If we call format(40000) we will get 40k.
	// 42200 will give us 42.2k and so on.
	const numberFormat = d3.format(".2s");

	// here we can create an axis based on the xScale 
	// axisBottom means that the numbers go on the bottom of the axis.
	// the .ticks() function takes 2 arguments, 
	// the first is the number of ticks we want to show on our chart
	// the sexond paremeter is a function that formats the ticks how we want
	const xAxis = d3.axisBottom(xScale) 
		.ticks(9, numberFormat)

	// now let's add some axes to the chart so it is easier for any readers to understand what we are charting
	// append a "g" element, which is just a generic group
	svg
		.append("g")
		.attr("class", "axis-x") // give the g element a class that identifies its purpose
		.attr("transform", "translate(" + margin + "," + (height - margin) + ")") // sets the position of our <g> by using the margin constant we defined
		.call(xAxis); // call the axis function with the current selection

	// now the same thing for the y axis
	svg
		.append("g")
		.attr("class", "axis-y")
		.attr("transform", "translate(" + margin + ", " + margin + ")")
		.call(d3.axisLeft(yScale)); // axisLeft says the numbers go on the left of the axis
});
