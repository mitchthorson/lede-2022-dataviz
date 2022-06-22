// load the data from CSV
d3.csv("https://gist.githubusercontent.com/mitchthorson/59443afda6aa6e11dd5d26d7041c0113/raw/0e65fa1d991c2c57a1b4c6bf8ac6470e55d18653/oscars.csv")
	.then((data) => {

	// get a list of years
	const options = data.filter((movie) => movie["Winner"] == 1).map((movie) => movie.Year)

	// d3 selects our element with year id
	d3.select("#year")
		// go and select our future "option" with the class "opt"
		.selectAll("option.opt")
		// bind our data to that selection
		.data(options)
		// join to our selection
		.join("option")
		// give that option a class
		.attr("class","opt")
		// set the value as d which in this case is the year
		.attr("value",(d) => d)
		// set the text as d which in this case in the year
		.text((d) => d);

  
	// Select that button
	d3.select("button")
		// give it an on click event
		.on("click", () => {
	// Select movie sentence
	d3.selectAll(".movie-sentence, .nominee-sentence")
		// Remove the class hide
		.classed("hide", false)

	// Get the year value
	const year = d3.select("#year").node().value

	// Filter the data for year and winner 
	const filtered = data.filter((d) => d.Year == year && d.Winner == 1)

	// Select the element with the class movie
	d3.select(".movie")
		//And set the text as the name of the first element
		.text(filtered[0].Name)
    
	// How do I get the nominees!!!!????
	const nominees = data.filter((d) => d.Year == year && d.Winner == "")
    
	d3.select(".nominee-list")
		.selectAll("p.nominee")
		.data(nominees)
		// .enter()
		// .append('p')
		.join("p")
		.attr("class","nominee")
		.text(nomineeMovie => nomineeMovie.Name)
	})
}) 
