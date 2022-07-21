// Since we are using the JavaScript build system that comes with the Svelte template
// we can load in our JS libraries by using import, kinda like Python
// remember, this will only work if you have a system setup for it though

import * as d3 from "d3" // load d3
import Scatterplot from './Scatterplot.svelte' // load in our Svelte component

// load our csv data
d3.csv("data/countries_2021.csv")
	.then(function(data) {
		// create a new instance of our Scatterplot component and pass it the information it needs
		new Scatterplot({
			// target is where in our HTML the component should be inserted	
			target: document.getElementById("chart"),
			// props specifies what properties we want to define for our component
			// in this case, we can provide the data we loaded as the countries property 
			// which is exported by the component
			props: {
				countries: data
			}	
		})
	})
