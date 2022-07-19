// HT to Jeremia Kimelman for the historical data file
// https://observablehq.com/d/cfc7caf8f50d44dd
d3.csv("https://raw.githubusercontent.com/mitchthorson/lede-2022-dataviz/main/03-d3-animation/completed-animated-chart/countries.csv")
	.then(data => {
  
		const height = 500
		const width = 900
		const margin = 45

		const populationMin = d3.min(data, d => +d.population)
		const populationMax = d3.max(data, d => +d.population)

		const incomeExtent = d3.extent(data, d => +d.income_per_person)
		const years = d3.extent(data, d => +d.year)

		const regionColors = {
			africa: "deepskyblue",
			asia: "tomato",
			americas: "limegreen",
			europe: "gold",
		}

		const yScale = d3.scaleLinear()
			.domain([0, 100])
			.range([height - (2 * margin), 0])

		const xScale = d3.scaleLog()
			.domain(incomeExtent)
			.range([0, width - (2 * margin)])

		const rScale = d3.scaleSqrt()
			.domain([populationMin, populationMax])
			.range([2, 40])

		let year = years[0]

		const svg = d3.select('#chart')
			.append("svg")
			.attr("height", height)
			.attr("width", width)

		const yearlyData = data.filter(function(d) {
			return +d.year === year
		})

		svg.append('g')
			.attr('transform', `translate(${margin} ${margin})`)
			.selectAll('circle')
			.data(yearlyData, d => d.country)
			.join('circle')
			.attr('cy', d => yScale(+d.life_expectancy) )
			.attr('cx', d => xScale(+d.income_per_person) )
			.attr('r', d => rScale(+d.population) )
			.attr('fill', d => regionColors[d.region])
			.attr('opacity', .8)

		const format = d3.format('.2s')

		const xAxis = d3.axisBottom().scale(xScale).ticks(5, format)
		const yAxis = d3.axisLeft().scale(yScale)

		svg.append('g')
			.attr('transform', `translate(0 ${height - margin})`)
			.attr("class", "x-axis")
			.call(xAxis)

		svg.append('g')
			.attr('transform', `translate(${margin / 2} ${margin})`)
			.attr("class", "y-axis")
			.call(yAxis)

		svg.append('text')
			.attr('id', 'year')
			.attr('dy', height * .8)
			.attr('dx', 20)
			.attr('font-size', '100px')
			.attr('opacity', .3)
			.text(year)

		setInterval(function() {
			if (year === years[1]) {
				return
			} else {
				year = year + 1
			}

			const yearlyData = data.filter(function(d) {
				return +d.year === year
			})

			d3.select('#year').text(year)

			svg.selectAll('circle')
				.data(yearlyData, d => d.country)
				.transition(100)
				.attr('cy', d => yScale(+d.life_expectancy) )
				.attr('cx', d => xScale(+d.income_per_person) )
				.attr('r', d => rScale(+d.population) )

		}, 200)
})

