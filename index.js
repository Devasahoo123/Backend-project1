const express = require("express");
const users = require("./Data.json");
const fs = require("fs");
const { error } = require("console");
const app=express();
const PORT = 3000;


//middleware -plugin
app.use(express.urlencoded({ extended: true })); //parse incoming requests with url-encoded payloads    

// other middel wares
// app.use( (req, res, next)=> {
//     console.log(`${req.method} request received to ${req.url}`);
//     next();      //pass control to the next middle ware function
// });

app.use( (req, res, next)=> {
    // console.log('hello middel were 2');
    fs.appendFile("log.txt",
    `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}`,
    (err,data)=>{
        next();
    })
    
});

// this is for all ssr device
app.get("/users",(req,res)=>{
    const html =`
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>`;
        res.send(html);
});

// thois is for other devices REST API
app.get('/api/users',(req,res)=>{
    return res.json(users);
});



app
.get("/api/users/:id",(req,res)=>{
    //geting data id from jason file
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id===id);
    return res.json(user);
})
.patch((req,res)=>{
    // edit user with id

    return res.json({});
})
.delete((req,res)=>{
    // delete user with id
    return res.json({})
});

// post rout
app.post("/api/user",async (req, res) => {
    const body = req.body;
    console.log(body);
    users.push({id:users.length+1,...body});
    fs.writeFile('./Data.json',JSON.stringify(users),(err,data)=>{
        return res.json({message: "successfully done"});
    });
});

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
