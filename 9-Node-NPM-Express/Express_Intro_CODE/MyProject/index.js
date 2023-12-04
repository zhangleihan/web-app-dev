const express = require('express')
const app = express()
//app.listen(3000)
// app.use((req, res) => {
//     console.log("WE GOT A NEW REQUEST!!")
//     console.dir(req)
//     res.send('<h1>This is my webpage!</h1>')
//     //res.send({name:'zhang'})
// })
app.get('/', (req, res) => {
    res.send('Welcome to the home page!')
})

app.get('/r/:subpage', (req, res) => {
	//console.dir(req)
    const { subpage } = req.params;
    res.send(`<h1>Browsing the ${subpage} subpage</h1>`)
})

app.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        res.send('NOTHING FOUND IF NOTHING SEARCHED!')
    } else {
        res.send(`<h1>Search results for: ${q}</h1>`)
    }
})

app.post('/cats', (req, res) => {
    //res.send('POST REQUEST TO /cats!!!! THIS IS DIFFERENT THAN A GET REQUEST!')
    res.send({name:"cat"})
})

// app.get('*', (req, res) => {
//     res.send(`I don't know that path!`)
// })

app.listen(8080, () => {
    console.log("LISTENING ON PORT 8080")
})
