const express = require('express');
require('dotenv').config()
const app = express();
const neederModel = require("./needBase.js")
const helperModel = require("./helpBase.js")
const mongoose = require('mongoose')
const socket = require('socket.io')
const http = require('http');

const port = process.env.PORT || 8000
mongoose.connect(process.env.DATABASE_URI)
    .then(()=>{
        console.log("Database is connected")
        server.listen(port, (err)=>{
            if(err) console.error(err)
            else console.log("SERVER IS RUNNING")
        })
    })
    .catch((err)=>{console.log("DB Error", err)})


const server = http.createServer(app)

const io = socket(server, {
    cors:{
        origin : "*",
        methods:["GET", "POST"]
    }
})

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.set("view engine", "ejs")
app.use(express.static(__dirname+"/public"))

let activeHelper = {}

io.on("connection", (socket)=>{
    
    socket.emit("load-existing-helpers", Object.values(activeHelper))

    socket.on("send-helper-location", (data)=>{
        activeHelper[socket.id] = {id : socket.id, ...data}
        io.emit("recieve-location-helper", {id : socket.id, ...data})
    })
    socket.on("send-location-needer", (data)=>{
        io.emit("recieve-location-needer", {id : socket.id, ...data})
    })
    socket.on("disconnect", ()=>{
        if(activeHelper[socket.id]){
            delete activeHelper[socket.id];
        }
        io.emit("user-disconnected", socket.id)
    })
    console.log("connected")
})

app.get("/", (req, res)=>{
    res.render("home")
})

app.get("/signup", (req, res)=>{
    res.render("signup")
})

app.get("/cause", (req, res)=>{
    res.render("cause")
})

app.get("/mission", (req, res)=>{
    res.render("mission")
})

app.get("/contact", (req, res)=>{
    res.render("contact")
})

app.post("/help", async (req, res)=>{
    try{

        let {name, resName, phoneno, fType, amount} = req.body;
        
        const createdHelper = await helperModel.create({
            name : name,
            resName :  resName,
            phone : phoneno,
            foodType : fType,
            amount : amount
        })
        
        
        res.render("helpDashboard", {
            name : createdHelper.name,
            resName : createdHelper.resName,
            phone : createdHelper.phone,
            food : createdHelper.foodType,
            amount : createdHelper.amount
            
        })
    }catch(err){
        console.error("Error creating helper:", err);
        res.status(500).send("Something went wrong. Please try again.");
    }

})

app.post("/need", async (req, res)=>{
    try{

        let {name, orgName, phoneno, people} = req.body;
        
        const createNeeder = await neederModel.create({
            name : name,
            orgName : orgName,
            phone : phoneno,
            people : people
        })
        res.render("needDashboard", {
            name : createNeeder.name,
            orgName : createNeeder.orgName,
            phone : createNeeder.phone,
            people : createNeeder.people
        })
    }catch(err){
        console.error("Error creating helper:", err);
        res.status(500).send("Something went wrong. Please try again.");
    }

})


