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

route.put("/changepassword",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    b.hash(password,10,(err,hash)=>{
        if(err) console.log("err") 

        else{

            const que="select * from admin where password=?";
            db.query(que,[hash],(err,response)=>{
                if(err) {
                    res.send({error:err})
                }
                else{
                    // res.send(response)

                    const query="update  `admin` set password=?";
                    db.query(query,[hash],(err,response)=>{
                        if(err) {
                            res.send({error:err})
                        }
                        else{ 
                            res.send({message:"well updated"})
                            }
                         })
                    }
                }) 
        }
        })
    })
// login

route.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
      const query="select * from admin where username=?";
    db.query(query,[username],(err,response)=>{
        if(err) { res.send({error:err}) }
         else{
            if(response.length==1)
            {
                b.compare(password,response[0].password,(err,result)=>{
                        if(err) { res.send({error:err})  }
                        else{
                                if(result)
                                {
                                    req.session.admin=response;
                                    // console.log(req.session.admin);
                                    res.send({message:"well match",user:response}) 
                                }else{
                                    res.send({message:"password missmatch"})
                                }
                            
                            }            
  
                    }) 
            }
            else{
                res.send({message:"user not exist"})
            }
        }
    })  
 })

 
route.post("/add",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    b.hash(password,10,(err,hash)=>{    
    const query="INSERT INTO `admin` (`id`, `username`, `password`) VALUES (NULL, ?, ?)";
    db.query(query,[username,hash],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }})
      
    })
    
    console.log("hello");
})
// add position


route.put("/change",(req,res)=>{
    // const username=req.body.username;
    const newpassword=req.body.newpassword;
    const currentpassword=req.body.currentpassword;
    const confirmedpassword=req.body.confirmedpassword;


    if(newpassword===confirmedpassword)
    {

        const query="select * from admin where id='1'";
        db.query(query,(err,response)=>{
            if(err) { res.send({error:err}) }
             else{
                if(response.length==1)
                {
                    b.compare(currentpassword,response[0].password,(err,result)=>{
                            if(err) {
                                res.send({error:err})
                            }
                            else{
                                if(result)
                                {

                                    b.hash(newpassword,10,(err,hash)=>{    
                                        const query="UPDATE `admin` SET `password` = ? WHERE `admin`.`id` = 1";
                                        db.query(query,[hash],(err,response)=>{
                                            if(err) {
                                                res.send({error:err})
                                            }
                                            else{
                                                res.send({message:"well updated"})
                                            }
                                        })
                                        })
                                    // res.send({message:"well match"}) 
                                }else{
                                    res.send({message:"password missmatch"})
                                }
                               
                            }
                        }) 
                }
                else{
                    res.send({message:"user not exist"})
                }
            }
        }) 
        // res.send({message:"well matched"})
    }
    else{
        res.send({message:"new password missmatch with comfirmed"}) 
    }
})
        
 


route.get("/all",(req,res)=>{
    const query="select * from admin";
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

