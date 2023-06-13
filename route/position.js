const express=require("express");
const route=express.Router();
const mysql=require("mysql");
const b=require("bcrypt");

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"voting"
})


route.use(express.json());

 

//add position
route.post("/addPosition",(req,res)=>{
    const title=req.body.title;   
    const query="INSERT INTO `position` (`id`,`title`) VALUES (NULL,?)";
    db.query(query,[title],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send({message:"well done"})
        }})
})
//add position
route.put("/update/:id",(req,res)=>{
    const id=req.params.id;
    const title=req.body.title;   
    const query="UPDATE `position` SET `title` = ? WHERE `position`.`id` = ?";
    db.query(query,[title,id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send({message:response.message})
        }})
})

route.get("/all",(req,res)=>{
    const query="select * from position";
    db.query(query,(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})

route.post("/delete/:id",(req,res)=>{
    const id=req.params.id;
    const query="delete from position where id=?";
    db.query(query,[id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send({response:response,message:"well deleted"});
        }
    })
})
module.exports=route;

