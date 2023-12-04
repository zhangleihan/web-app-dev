const express = require("express")

const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the home page!</h1><p>This is my first web app</p>')
})

app.get('/r/:subpage', (req, res) => {
    // const { subpage } = req.params;
    const subpage = req.params.subpage;
    res.send(`<h1>Browsing the ${subpage} subpage</h1>`)
})

app.get('/r/:subpage/:subsubpage', (req, res) => {
    // const { subpage } = req.params;
    const subpage = req.params.subpage;
    const subsubpage = req.params.subsubpage;
    res.send(`<h1>Browsing the ${subsubpage} subsubpage of ${subpage}</h1>`)
})

app.get('/cats', (req, res) => {
    res.send('MEOW!!')
})

app.get('/dogs', (req, res) => {
    res.send('WOOF!')
})
//localhost:8080/search?q=dog&n=coco

https://www.baidu.com/s?wd=dog&rsv_spt=1&rsv_iqid=0xd3618396003c8478&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=tb&rsv_sug3=3&rsv_sug1=3&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&inputT=955&rsv_sug4=956
app.post('/search', (req, res) => {
    // const { q } = req.query;
    const q = req.query.q;
    const n = req.query.n;
    if (!q) {
        res.send('NOTHING FOUND IF NOTHING SEARCHED!')
    } else {
        res.send(`<h1>Search results for: ${q} named ${n}</h1>`)
    }
})

app.get('*', (req, res) => {
    res.send(`I don't know that path!`)
})

app.listen(8080,() => {
    console.log("LISTENING ON PORT 8080")
})