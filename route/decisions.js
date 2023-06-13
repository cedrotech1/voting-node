const express=require("express");
const route=express.Router();
const mysql=require("mysql");
const b=require("bcrypt");
const session = require("express-session");

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"voting"
})
route.use(express.json());


route.get("/",(req,res)=>{
    const query="select * from decisions";
    db.query(query,(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})


module.exports=route;

