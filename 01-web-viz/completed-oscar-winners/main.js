// load the data from CSV
d3.csv("./oscars.csv")
	.then((data) => {

	// get a list of years
	const options = data.filter((movie) => movie.winner == 1).map((movie) => movie.year)

	// d3 selects our element with id of "year"
	d3.select("#year")
		// go and select our future "option" elements with the class "opt"
		.selectAll("option.opt")
		// bind our data to that selection
		.data(options)
		// join to our selection
		// this is the same as .enter().append("option")
		.join("option")
		// give that option a class, so that it matches our original selection above: option.opt
		.attr("class","opt")
		// set the value as d which in this case is the year
		.attr("value",(d) => d)
		// set the text as d which in this case is the year
		.text((d) => d);

  
	// Select the button
	d3.select("button")
		// give it a click event listener
		.on("click", () => {
			// Select movie-sentence and nominee-sentence
			d3.selectAll(".movie-sentence, .nominee-sentence")
				// Remove the class hide
				.classed("hide", false)

			// Get the year value
			const year = d3.select("#year").node().value

			// Filter the data for year and winner 
			const filtered = data.filter((d) => d.year == year && d.winner == 1)

			// Select the element with the class movie
			d3.select(".movie")
				//And set the text as the name of the first element
				.text(filtered[0].name)
			
			// How do I get the nominees!!!!????
			const nominees = data.filter((d) => d.year == year && d.winner == "")
			
			d3.select(".nominee-list")
				.selectAll("p.nominee")
				.data(nominees)
				// .enter()
				// .append('p')
				.join("p")
				.attr("class","nominee")
				.text(nomineeMovie => nomineeMovie.name)
		})
}) 
