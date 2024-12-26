const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const {logger}= require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;

app.use(logger)
app.use(cors())

// cross Origin Resource Sharing
const whitelist = ['http://www.yoursites.com','http://127.0.0.1:5500','http://localhost:3500']
const corsOptions = {
    origin: (origin, callback)=>{
        if(whitelist.indexOf(origin) !==-1 || !origin){
            callback(null, true)
        } 
        else{
            callback(new Error('Not allowed CORS'));
        }
      }, 
      optionsSuccessStatus: 200
}
app.use(cors(corsOptions))



//builtin middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/',express.static(path.join(__dirname,'./public')))
app.use('/subdir',express.static(path.join(__dirname,'./public')))

app.use('/' ,require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))

// app.get('^/$|index(.html)?',(req,res)=>{
//     res.sendFile(path.join(__dirname,'views','index.html'))
// })

// app.get('/new-page(.html)?',(req,res)=>{
//     res.sendFile(path.join(__dirname,'views','new-page.html'))
// })

// app.get('/old-page(.html)?',(req,res)=>{
//     res.redirect(301,'new-page.html')

// })

// app.get('/hello(.html)?',(req,res,next)=>{
//     console.log('hello.html page load panna try pannom')
//     next()
// },(req, res)=>{
//     res.send('Hi hello makkale')
// })

// const one = (req, res, next)=>{
//     console.log('one')
//     next()
// }
// const two = (req, res, next)=>{
//     console.log('two')
//     next()
// }
// const three = (req, res, next)=>{
//     console.log('three')
//     res.send('Finished!')
// }

// app.get('/chain(.html)?',[one,two,three])

// app.get('/*',(req,res)=>{
//     res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    
// })


app.all('*',(req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({"error":"404 Not Found"})
    }else {
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));


