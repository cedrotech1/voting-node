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
route.post("/",(req,res)=>{

    const studentid=req.body.studentid;
    const condidateid=req.body.condidateid;  
   
    if(studentid!=condidateid)
    {
        const que1="select * from student where id=?";
        db.query(que1,[studentid],(err,response)=>{
            if(response.length==1)
            {
                const que1="select * from condidate where s_id=?";
                    db.query(que1,[condidateid],(err,response)=>{
                        if(response.length==1)
                        {
                            const query="select * from votes where st_id=? and c_id=?";
                            db.query(query,[studentid,condidateid],(err,response)=>{
                                if(err){console.log(err)}
                                else{
                                    if(response.length==1){
                                        res.send({message:"you can not vote one condidate more than once"});
                                    }else{
 
                                        const q="SELECT title FROM student,condidate,position WHERE student.id=condidate.s_id and position.id=condidate.pid and condidate.s_id=?";
                                        // const query="select * from student";
                                        db.query(q,[condidateid],(err,response)=>{
                                            if(err) {
                                                res.send({error:err})
                                            }
                                            else{
                                                // res.send(response[0].title)



                                                const query="SELECT title FROM student,condidate,position,votes WHERE student.id=condidate.s_id and position.id=condidate.pid and votes.c_id=condidate.s_id and title=? and votes.st_id=?";
                                                db.query(query,[response[0].title,studentid],(err,response)=>{
                                                    if(err){console.log(err)}
                                                    else{
                                                        if(response.length==1){
                                                            res.send({message:"you can not vote one than once at one position"});
                                                        }else{
                                                            //res.send({message:"you can vote now"});

                                                               const query="INSERT INTO `votes` (`id`, `st_id`, `c_id`, `count`) VALUES (NULL,?,?,'1')";
                                                                db.query(query,[studentid,condidateid],(err,response)=>{
                                                                 if(err) {
                                                                     res.send({error:err})
                                                                 }
                                                                 else{
                                                                    res.send({response:response,message:"voted successfull"});
                                                                 }}) 
                                                        }
                                                    }


                                                })
                                                   
                                            }
                                        })



                        
                                      
                                     
                        
                                    }
                                }
                            })


                        }else{
                            res.send({message:"that condidate does not exist brother/sister"}); 
                        }
                        
                    })


            }else{
                res.send({message:"you are not student you can't vote  bro"});  
            }
        })
  

}else{
    res.send({message:"you can't vote your self bro"}); 
}

})




//resultes condidates
route.get("/resultes",(req,res)=>{
    const query="SELECT student.id,fname,lname,title,count(count) as total_votes FROM student,condidate,position,votes WHERE student.id=condidate.s_id and position.id=condidate.pid and votes.c_id=condidate.s_id GROUP by s_id ORDER by title DESC";
    db.query(query,(err,response)=>{
        if(err) {
            res.send({error:err})
        }    
        else{
            res.send(response)
        }
    })
})

//resultes condidates
route.get("/resultes/:id",(req,res)=>{
    const id=req.params.id;
    const query="SELECT student.id,fname,lname,title,count(count) as total_votes FROM student,condidate,position,votes WHERE student.id=condidate.s_id and position.id=condidate.pid and votes.c_id=condidate.s_id and position.id=? GROUP by s_id ORDER by title DESC";
    db.query(query,[id],(err,response)=>{
        if(err) {
            res.send({error:err})
        }    
        else{
            res.send(response)
        }
    })
})

module.exports=route;

