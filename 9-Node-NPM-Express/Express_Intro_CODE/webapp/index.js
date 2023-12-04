const express = require("express")
const app = express()

app.get('/',(req,res)=>{
    res.send("Welcome to my website!")
})

app.get('/r/:subpage', (req, res) => {
	//console.dir(req)
    //const { subpage } = req.params;
    const subpage = req.params.subpage
    res.send(`<h1>Browsing the ${subpage} subpage</h1>`)
})

app.post('/search', (req,res)=>{
    // const {q}=req.query
    const q = req.query.q
    if (q == null){
        console.log('null search')
    }else{
        res.send(`You are searching ${q}`)
    }
})

app.listen("8080", ()=>{
    console.log("Listening on port 8080...")
})
