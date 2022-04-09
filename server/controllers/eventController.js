const mysql =require('mysql');

// Mysql
const pool =mysql.createPool({
    connectionLimit:10,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
});


exports.view =(req,res)=>{

    // Connect to db
    pool.getConnection((err,connection)=>{
        if(err) throw err; //not connected
        console.log('Connected as ID : '+connection.threadId);

        // use the connection
        connection.query("SELECT * FROM events",(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('events/listEvent',{rows});

            }else{
                console.log(err);
            }

        });

    });
}

// find event by name

exports.find =(req,res)=>{

    // Connect to db
    pool.getConnection((err,connection)=>{
        if(err) throw err; //not connected
        console.log('Connected as ID : '+connection.threadId);

        let searchTerm=req.body.search
        // use the connection
        connection.query("SELECT * FROM events WHERE name LIKE ?",['%'+searchTerm+'%'],(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('events/listEvent',{rows});

            }else{
                console.log(err);
            }

        });

    });
}

exports.form=(req,res)=>{
    res.render('events/addEvent');
}

// Add New Event
exports.create=(req,res)=>{
    const {title,date,image,status}=req.body;

    if(title === ""|| date === ""||status === ""){
        message = "Please fill in all fields";
        res.render('events/addEvent',{alert:message ,alertClass:"alert-danger"});

    }if(!req.files || Object.keys(req.files).length === 0){
        message = "No files were selected";
        res.render('events/addEvent',{alert:message ,alertClass:"alert-danger"});
        
    }else{
        const d = new Date();
        let time = d.getTime();

        var file = req.files.image;
        var img_name=time +'_'+file.name;

        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                             
            file.mv('public/images/uploads/'+img_name, function(err) {
                           
                if (err){
                  return res.status(500).send(err);

                }else{
                    // Connect to db
                    pool.getConnection((err,connection)=>{
                        if(err) throw err; //not connected
                        console.log('Connected as ID : '+connection.threadId);
                
                        // use the connection
                        connection.query("INSERT INTO events SET title=?,date=? ,image=?,status=?",[title,date,img_name,status],(err,rows)=>{
                            // when done with the connection,release it
                            connection.release();
                
                            if(!err){
                                message="Event added successfully.";

                                res.render('events/addEvent',{alert:message ,alertClass:"alert-success"});
                               
                
                            }else{
                                console.log(err);
                            }
                
                        });
                
                    });
                }

                   
            });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('events/addEvent',{alert:message ,alertClass:"alert-danger"});

        }
    }


}




exports.edit=(req,res)=>{
   // Connect to db
   pool.getConnection((err,connection)=>{
    if(err) throw err; //not connected
    console.log('Connected as ID : '+connection.threadId);

    // use the connection
    connection.query("SELECT * FROM events WHERE id=?",[req.params.id],(err,rows)=>{
        // when done with the connectio,release it
        connection.release();

        if(!err){
            res.render('events/editEvent',{rows});

        }else{
            console.log(err);
        }

    });

    });

}

 exports.update=(req,res)=>{

    var id= req.params.id;
    const {title,date,image,status}=req.body;

    if(title === ""|| date === ""||status === ""){
       
        // Connect to db
        pool.getConnection((err,connection)=>{
            if(err) throw err; //not connected
            console.log('Connected as ID : '+connection.threadId);

            // use the connection
            connection.query("SELECT * FROM events WHERE id=?",[req.params.id],(err,rows)=>{
                // when done with the connectio,release it
                connection.release();

                if(!err){
                    message = "Please fill in all fields";
                    res.render('events/editEvent',{rows,alert:message ,alertClass:"alert-danger"});

                }else{
                    console.log(err);
                }

            });
        });

    }
    if((!req.files)){
                // Connect to db
                pool.getConnection((err,connection)=>{
                    if(err) throw err; //not connected
                    console.log('Connected as ID : '+connection.threadId);
        
                    // use the connection
                    connection.query("SELECT * FROM events WHERE id=?",[req.params.id],(err,rows)=>{
                        // when done with the connectio,release it
                        connection.release();
        
                        if(!err){
                            message = "No files were selected";
                            res.render('events/editEvent',{rows,alert:message ,alertClass:"alert-danger"});
        
                        }else{
                            console.log(err);
                        }
        
                    });
                });      
    }
    else{
        const d = new Date();
        let time = d.getTime();

        var file = req.files.image;
        var img_name=time +'_'+file.name;

        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                             
            file.mv('public/images/uploads/'+img_name, function(err) {
                           
                if (err){
                  return res.status(500).send(err);

                }else{
                    // Connect to db
                    pool.getConnection((err,connection)=>{
                    if(err) throw err; //not connected
                    console.log('Connected as ID : '+connection.threadId);
                
                    // use the connection
                    connection.query("UPDATE  events SET title=?,date=? ,image=?,status=? WHERE id=?",[title,date,img_name,status,req.params.id],(err,rows)=>{
                    
                        // when done with the connectio,release it
                        connection.release();
                
                        if(!err){
                            pool.getConnection((err,connection)=>{
                                if(err) throw err; //not connected
                                console.log('Connected as ID : '+connection.threadId);
                            
                                // use the connection
                                connection.query("SELECT * FROM events ",[req.params.id],(err,rows)=>{
                                    // when done with the connectio,release it
                                    connection.release();
                            
                                    if(!err){
                                        res.render('events/listEvent',{rows});
                            
                                    }else{
                                        console.log(err);
                                    }
                            
                                });
                            
                                });
                
                        }else{
                            console.log(err);
                        }
                
                    });
                
                    });
 
                }

                   
            });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('paths/addPath',{alert:message ,alertClass:"alert-danger"});

        }
    }



 }



 exports.delete=(req,res)=>{

  
    // Connect to db
    pool.getConnection((err,connection)=>{
     if(err) throw err; //not connected
     console.log('Connected as ID : '+connection.threadId);
 
     // use the connection
     connection.query("DELETE FROM events WHERE id=?",[req.params.id],(err,rows)=>{
         // when done with the connectio,release it
         connection.release();
 
         if(!err){
            res.redirect('/events');
           
 
         }else{
             console.log(err);
         }
 
     });
 
     });
 
 }
