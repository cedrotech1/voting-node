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

route.get("/logined",(req,res)=>{
    if(req.session.student)
    {
        const id=req.session.student[0].id;
        const query="select * from condidate where s_id=?";
        db.query(query,[id],(err,response1)=>{
            if(err){console.log(err)}
            else{
                if(response1.length==1){
                    
                    res.send({islogin:true,type:"condidate",userinfo:req.session.student})   
                }else{
                    res.send({islogin:true,type:"student",userinfo:req.session.student})  
                }
            }
           
            })

        res.send({islogin:true,user:req.session.student}) 
        // res.json({islogin:true}) 
    }else{
        res.json({islogin:false}) 
    }
})


route.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
      const query="select * from student where username=?";
    db.query(query,[username],(err,response)=>{
        if(err) {res.send(err.message) }
         else{
            if(response.length==1)
            {
                b.compare(password,response[0].password,(err,result)=>{
                        if(err) {res.send({error:err.message})}
                        else{
                                if(result)
                                {
                                    const id=response[0].id;
                                    const query="select * from condidate where s_id=?";
                                    db.query(query,[id],(err,response1)=>{
                                        if(err){console.log(err)}
                                        else{
                                            if(response1.length==1){
                                                 req.session.student=response;
                                                //  req.session.save();
                                                // console.log(req.session.admin);
                                                // const token=jwt.sign({id},"g",{expiresIn:'1d'})
                                                // // console.log(token);
                                                // res.cookie("token",token)

                                                console.log(req.session.student);
                                                res.send({user:"condidate",message:"well match",userinfo:response}) 
                                            }else{
                                                req.session.student=response;
                                                console.log(req.session.student);
                                                res.send({user:"student",message:"well match",userinfo:response}) 
                                            }
                                        }
                                       
                                        })


                                    // req.session.student=response;
                                    // // console.log(req.session.admin);
                                    // res.send({message:"well match",user:response}) 
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

 


//add student
route.post("/addStudent",(req,res)=>{

    const fname=req.body.fname;
    const lname=req.body.lname;  
    const address=req.body.address;  
    const department=req.body.department;
    const username=req.body.username;
    const phone=req.body.phone;
    const password=req.body.password;
    
    const query="select * from student where username=?";
    db.query(query,[username],(err,response)=>{
        if(err){console.log(err)}
        else{
            if(response.length==1){
                res.send({message:"user exist"});
            }else{

                b.hash(password,10,(err,hash)=>{
                    const query="INSERT INTO `student` (`id`, `fname`, `lname`, `address`, `department`, `username`, `password`, `phone`) VALUES (NULL,?,?,?,?,?,?,?)";
             db.query(query,[fname,lname,address,department,username,hash,phone],(err,response)=>{
                 if(err) {
                     res.send({error:err})
                 }
                 else{
                     res.send({message:"account successfull creeated"})
                 }}) 
             })

            }
        }
    })



})




//add position
route.post("/update/:id",(req,res)=>{
    const id=req.params.id;
   
    const fname=req.body.fname;
    const lname=req.body.lname;  
    const address=req.body.address;  
    const department=req.body.department;   
    const phone=req.body.phone;   
    const username=req.body.username;  
    // const picture=req.body.picture;  
    const query="UPDATE `student` SET `fname` = ?, `lname` = ?, `address` = ?, `department` = ?,`phone` = ?,`username` = ?  WHERE `student`.`id` = ?";
    db.query(query,[fname,lname,address,department,phone,username,id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send({message:"update sucessful"})
        }})

})
//all student
route.get("/all",(req,res)=>{
    const query="select * from student";
    db.query(query,(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})

//all student
route.post("/filter",(req,res)=>{
    const data=req.body.data;
    const query="select * from student where  username=?";
    db.query(query,[data],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})
//one student
route.get("/one/:id",(req,res)=>{
    const id=req.params.id;

    const query="select * from student where id=?";
    db.query(query,[id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})
//delete one student
route.post("/delete/:id",(req,res)=>{
    const id=req.params.id;
    const query="delete from student where id=?";
    db.query(query,[id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send({message:"well deleted"});
        }
    })
})

route.post("/change/:id",(req,res)=>{
    const id=req.params.id;
    const newpassword=req.body.newpassword;
    const currentpassword=req.body.currentpassword;
    const confirmedpassword=req.body.confirmedpassword;


    if(newpassword===confirmedpassword)
    {

        const query="select * from student where id=?";
        db.query(query,[id],(err,response)=>{
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
                                        const query="UPDATE `student` SET `password` = ? WHERE `student`.`id` = ?";
                                        db.query(query,[hash,id],(err,response)=>{
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

route.get("/signout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err)  res.send({error:err})
        else
        // req.logout();
        res.send({message:"logout done"})
        // res.redirect('/')
    })
})

module.exports=route;

