const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const prompt = require('prompt-sync')();
const list = require('cli-list-select');
const youtubedl = require('youtube-dl')

const getPageHTML = async (raw_query) => {
    const pageUrl = `https://www.youtube.com/results?search_query=${raw_query}`
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const pageHTML = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
    await browser.close();
    return pageHTML;
}

const borrowTheMp3 = async() => {
    const raw_query = prompt('what do you want to search?: ');
    const html = await getPageHTML(raw_query)
    const $ = cheerio.load(html)
    console.clear()
    const video_list = $('a.ytd-video-renderer[id="video-title"]')
    let titile_list  = []
    video_list.each((i , video) => {
        titile_list.push(video.attribs.title)
    })
    const user_selection = await list(titile_list , {singleCheck:true})
    const video_url = video_list[user_selection.index].attribs.href
    const video = youtubedl.exec(`http://www.youtube.com/${video_url}`, [`-o ${raw_query}.mp3`, '-x', '--audio-format', "mp3"], {} , (err , output) => {
        if (err) throw err
        console.log(output.join('\n'))
        process.exit()
    })
}
borrowTheMp3()