const express = require("express")
const axios = require("axios")
const {JSDOM} = require("jsdom")
const { linkSync } = require("fs")
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
})


const app =  express()
const port = 3000



const getSearchData = async () => {
	try { 
		readline.question("what would you like to search? " , raw_query => {
			const {data} = await axios.get(`https://www.youtube.com/results?search_query=${raw_query}`)
			const dom = new JSDOM(data)
			const {document} = dom.window
			let link_array = document.querySelectorAll("a.ytd-video-renderer#video-title")
			console.log(link_array)
			readline.close()
		})
	}
	catch (error) {
		throw error;
	}
}

app.listen(port)