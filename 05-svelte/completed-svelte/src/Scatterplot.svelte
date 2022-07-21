<script>
// just like the web, a Svelte component has 3 main building blocks:
// - HTML
// - CSS
// - JavaScript
// A component often has the JS at the top, followed by the HTML, finally any CSS (allthough sometimes it goes JS -> CSS -> HTML)
// Here we start with our component's JavaScript inside some <script> tags

// Since we are using the JavaScript build system that comes with the Svelte template
// we can load in our JS libraries by using import, kinda like Python
// remember, this will only work if you have a system setup for it though
import * as d3 from "d3"

// export a variable called countries
// export means that this variable can be "passed down" to the component as a property
// we are passing down the data from our main.js file to populate this variable
export let countries

// height and width will control the size of the chart
const height = 400
const width = 800

// margin value to adjust positining of elements so they do not bleed off of the SVG
const margin = 30

// this is just for convenience so we don't have to keep typing width - margin * 2 and height - margin * 2
const innerWidth = width - margin * 2
const innerHeight = height - margin * 2

// colors for each continent represented in the dataset
// these color values be accessed by looking them up like regionColors["africa"]
const regionColors = {
	africa: "deepskyblue",
	asia: "tomato",
	americas: "limegreen",
	europe: "gold",
}

// setting up some scales scales to translate the raw values in the dataset into somoething more useful for charting
// the y scale is based on life expectancy
const yScale = d3
	.scaleLinear() // This is a linear scale. So we use d3's scaleLinear.
	.domain([0, 100]) // INPUT. This tells the scale that the input values from the dataset will be between 0 and 100
	.range([innerHeight, 0]) // OUTPUT. This tells the scale that a value of 0 in the data should be transformed to the `height` value on the y scale, and a value of 100 in the data should output 0 on the yScale. We are also adjusting for the margin value.

// in order to properly define the input domain for the radius scale, we need to find out what the minumum and maximum of the population column in the datset are
const maxPop = d3.max(countries, (d) => +d.population) // the + in front of d.population_total tells javacript to convert this to a number, in case it was read in as a string by d3.csv
const minPop = d3.min(countries, (d) => +d.population)

// the area of a circle is π*(r^2)
// area = π * (r^2)
// (area / π) = r^2
// square root(area/π) = r
// since we want to encode the population as the area of the circle, not the radius, we need to use a square root scale
// Read more here: https://eagereyes.org/blog/2008/linear-vs-quadratic-change
const radiusScale = d3
	.scaleSqrt()
	.domain([minPop, maxPop]) // Input values, the minumum and maximum population values we identified above
	.range([2, 40]) // Output values: what we will apply as values to our svg elements

// now we need to get the min and max of the income column in our dataset
const maxIncome = d3.max(countries, d => +d.income_per_person)

// the xScale takes the income values in our dataset
const xScale = d3
	.scaleLog()
	.base(2)
	.domain([250, 256000]) // Input values
	.range([0, innerWidth]) // Output values, passed to SVG attributes

// what points do we want to show on the xAxis?
const xTicks = [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000]

// to hold information about any tooltips
let tooltip = null

// in svelte $: means "this is a reactive statement"
// "reactive" means that it re-runs every time any of the variables mentioned change
// in this case, it will console.log(tooltip) every time the value of tooltip updates
// it may look strange, but this saves a lot of code we don't have to write
$: console.log(tooltip)

</script>

<div class="scatterplot">
	<h1>A <em>Svelte</em> scatterplot</h1>

	<!-- an svg to draw our chart in -->
	<svg width={width} height={height}>
		<!-- a <g> element that holds all of our chart components and moves everything inside the margins -->
		<g transform="translate({margin}, {margin})">
			<!-- a <g> element that holds our x axis -->
			<g class="x-axis" transform="translate(0, {innerHeight})" opacity=".75">
				<!-- the x axis line -->
				<line 
					x1={0} 
					x2={innerWidth} 
					y1={0} 
					y2={0} 
					stroke="#000"></line>
				<!-- #each means loop through the data we provide it, and create a copy of what is inside the loop for each item -->	
				{#each xTicks as tick, i }
					<!-- create a <g> that can hold our tick lines and labels, position it horizontaly with our xScale -->
					<g class="tick tick-{i}" transform="translate({xScale(tick)}, 0)">
						<!-- a <text> element for each tick label -->
						<!-- dy="1em" adjusts the y position of the text relative to its size -->
						<!-- text-anchor="middle" aligns the middle of the text to the x position we gave it -->
						<text y={0} x={0} dy="1em" text-anchor="middle">{tick}</text>
						<!-- a <line> element for tick -->
						<!-- y2={-innerHeight} means the line draws from the bottom to the top of the chart, creating a grid line -->
						<line y1={0} y2={-innerHeight} x1={0} x2={0} stroke="#000" opacity="0.25"></line>
					</g>
					<!-- /each closes the each loop -->	
				{/each}
			</g>

			<!-- a <g> element that holds our y axis -->
			<g class="y-axis" opacity=".75">
				<!-- the y axis line -->
				<line 
					x1={0} 
					x2={0} 
					y1={0} 
					y2={innerHeight} 
					stroke="#000"></line>
				<!-- another each loop through 10 ticks on our yScale -->
				{#each yScale.ticks(10) as tick}
					<!-- create a <g> that can hold our tick lines and labels, position it vertically with the yScale -->
					<g class="tick" transform="translate(0, {yScale(tick)})">
						<!-- a <text> element for each tick label -->
						<!-- text-anchor="middle" aligns the middle of the text to the x position we gave it -->
						<text y={0} x={0} text-anchor="end">{tick}</text>
						<!-- a <line> element for tick -->
						<!-- x2={innerWidth} means the line draws from the left to the right of the chart, creating a grid line -->
						<line y1={0} y2={0} x1={0} x2={innerWidth} stroke="#000" opacity=".25"></line>
					</g>
					<!-- /each closes the each loop -->	
				{/each}
			</g>

			<!-- create a <g> to hold our circles -->	
			<g class="circles">
				<!-- loop through each country in our data -->
				{#each countries as country}
					<!-- draw a circle for each country -->
					<!-- use our D3 scales to visually encode our data values -->
					<circle 
						cx={xScale(country.income_per_person)}
						cy={yScale(country.life_expectancy)}
						r={radiusScale(country.population)}
						fill={regionColors[country.region]}
						stroke="#000"
						opacity="0.75"
						on:mousemove={(e) => {
							tooltip = {
								country: country, 
								x: e.clientX,
								y: e.clientY
							}
						}}
						on:mouseleave={() => {
							tooltip = null
						}}
					></circle>
					<!-- /each closes the each loop -->	
				{/each}
			</g>
		</g>
	</svg>
	<!-- if the tooltip variable is not null, let's show a tooltip div -->
	{#if tooltip}
		<!-- positioning the tooltip with the x and y values set by the event -->
		<div class="tooltip" style={`top: ${tooltip.y + 10}px; left: ${tooltip.x}px`}>
			<!-- use values from the tooltip.country property set by the event -->
			<h3>Country: {tooltip.country.country}</h3>
			<p>Life expectancy: {tooltip.country.life_expectancy}</p>
			<p>Income: {tooltip.country.income_per_person}</p>
		</div>
	<!-- close if statement -->
	{/if}
</div>
<style>
.scatterplot {
	font-family: monospace;
}
.tooltip {
	width: 150px;
	padding: 10px;
	font-size: 10px;
	border: solid 1px #404040;
	position: absolute;
	background: #fff;
}
.tooltip p {
	margin: 2px 0;
}
.tooltip h3 {
	font-size: 11px;
	font-weight: bold;
	margin: 5px 0;
}
circle {
	cursor:	crosshair;
}
</style>
