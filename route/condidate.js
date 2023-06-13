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

//register as condidate
route.post("/register",(req,res)=>{
    

    const studentid=req.body.studentid;
    const positionid=req.body.positionid;  
    const manifesto=req.body.manifesto;  
   
    if(positionid==""){
        res.send({message:"pleas choose... position !"});
    }
    else{

  

    const query="select * from condidate where s_id=?";
    db.query(query,[studentid],(err,response)=>{
        if(err){console.log(err)}
        else{
            if(response.length==1){
                res.send({message:"you can not register as condidate more than once"});
            }
            
            else{

            const query="INSERT INTO `condidate` (`id`, `s_id`, `pid`, `status`) VALUES (NULL,?,?,'disactivated')";
             db.query(query,[studentid,positionid],(err,response)=>{
                 if(err) {
                     res.send({error:err})
                 }
                 else{
                    //   res.send({message:"yes"})
                    const query="UPDATE `student` SET `manifesto` = ? WHERE `student`.`id` = ?";
                    db.query(query,[manifesto,studentid],(err,response)=>{
                        if(err) {
                            res.send({message:err})
                        }
                        else{
                            res.send({message:"well done ! you are now condidate"})
                        }})
                 }}) 
             

            }
        }
    })
}

})




//all condidates
route.get("/all",(req,res)=>{
    const query="SELECT student.id,fname,lname,title,status FROM student,condidate,position WHERE student.id=condidate.s_id and position.id=condidate.pid";
    db.query(query,(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})
//all condidates

//position condidates
route.get("/:positionid",(req,res)=>{
    const positionid=req.params.positionid;
    const query="SELECT student.id,fname,lname,title,status FROM student,condidate,position WHERE student.id=condidate.s_id and position.id=condidate.pid and status='activated' and position.id=?";
    db.query(query,[positionid],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})
//one condidate
route.get("/one/:id",(req,res)=>{
    const id=req.params.id;
    const query="SELECT student.id,fname,lname,department,address,title,status,manifesto,phone,username FROM student,condidate,position WHERE student.id=condidate.s_id and position.id=condidate.pid and student.id=?";
    // const query="select * from student";
    db.query(query,[id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }
        else{
            res.send(response)
        }
    })
})
//delete one condidate
route.delete("/delete/:id",(req,res)=>{
            const id=req.params.id;
            const query="delete from condidate where s_id=?";
            db.query(query,[id],(err,response)=>{
                
            if(err) {
                res.send({error:err})
            }
            else
                {
                    res.send({response:response,message:"condidate deleted"});
                }
    })
})

//add position
route.post("/activate/:id",(req,res)=>{
    const id=req.params.id;
    // const title=req.body.title;  
    
    const que1="select * from condidate where s_id=?";
                    db.query(que1,[id],(err,response)=>{
                        if(response.length==1)
                        {
                            const query="UPDATE `condidate` SET `status` = 'activated' WHERE `condidate`.`s_id` = ?";
                            db.query(query,[id],(err,response)=>{
                                if(err) {
                                    res.send({error:err})
                                }
                                else{
                                    res.send({message:"well disactivated"})
                                }})
                        
                        }else{
                            res.send({message:"condidate does not exist"})
                        }
                    })
})

route.post("/disactivate/:id",(req,res)=>{
    const id=req.params.id;
    // const title=req.body.title;  
    
    const que1="select * from condidate where s_id=?";
                    db.query(que1,[id],(err,response)=>{
                        if(response.length==1)
                        {
                            const query="UPDATE `condidate` SET `status` = 'disactivate' WHERE `condidate`.`s_id` = ?";
                            db.query(query,[id],(err,response)=>{
                                if(err) {
                                    res.send({error:err})
                                }
                                else{
                                    res.send({message:"well disactivated"})
                                }})
                        
                        }else{
                            res.send({message:"condidate does not exist"})
                        }
                    })
})




module.exports=route;

