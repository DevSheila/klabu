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
        connection.query("SELECT * FROM paths",(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('paths/listPath',{rows});
                console.log('The data from user table :\n',rows);

            }else{
                console.log(err);
            }

        });

    });
}

// find department by name

exports.find =(req,res)=>{

    // Connect to db
    pool.getConnection((err,connection)=>{
        if(err) throw err; //not connected
        console.log('Connected as ID : '+connection.threadId);

        let searchTerm=req.body.search
        // use the connection
        connection.query("SELECT * FROM paths WHERE name LIKE ?",['%'+searchTerm+'%'],(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('paths/listPath',{rows});
                console.log('The data from user table :\n',rows);

            }else{
                console.log(err);
            }

        });

    });
}

// Add New Path
exports.create=(req,res)=>{
        const {pathName,description,image}=req.body;

        if(pathName === "" || description === ""){
            message = "Please fill in all fields";
            res.render('paths/addPath',{alert:message ,alertClass:"alert-danger"});

        }if(!req.files || Object.keys(req.files).length === 0){
            message = "No files were selected";
            res.render('paths/addPath',{alert:message ,alertClass:"alert-danger"});
            
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
                            connection.query("INSERT INTO paths SET name=?, description=?,image=?",[pathName,description,img_name],(err,rows)=>{
                                // when done with the connection,release it
                                connection.release();
                    
                                if(!err){
                                    res.render('paths/addPath',{alert:"Path added successfully." ,alertClass:"alert-success"});
                                   
                    
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

exports.form=(req,res)=>{
    res.render('paths/addPath');
}

exports.edit=(req,res)=>{
   // Connect to db
   pool.getConnection((err,connection)=>{
    if(err) throw err; //not connected
    console.log('Connected as ID : '+connection.threadId);

    // use the connection
    connection.query("SELECT * FROM paths WHERE id=?",[req.params.id],(err,rows)=>{
        // when done with the connectio,release it
        connection.release();

        if(!err){
            res.render('paths/editPath',{rows});
            console.log('The data from user table :\n',rows);

        }else{
            console.log(err);
        }

    });

    });

}
exports.update=(req,res)=>{

    var id= req.params.id;
    const {pathName,description,image}=req.body;
    

    if(pathName === "" || description === ""){
       
        // Connect to db
        pool.getConnection((err,connection)=>{
            if(err) throw err; //not connected
            console.log('Connected as ID : '+connection.threadId);

            // use the connection
            connection.query("SELECT * FROM paths WHERE id=?",[req.params.id],(err,rows)=>{
                // when done with the connectio,release it
                connection.release();

                if(!err){
                    message = "Please fill in all fields";
                    res.render('paths/editPath',{rows,alert:message ,alertClass:"alert-danger"});

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
                    connection.query("SELECT * FROM paths WHERE id=?",[req.params.id],(err,rows)=>{
                        // when done with the connectio,release it
                        connection.release();
        
                        if(!err){
                            message = "No files were selected";
                            res.render('paths/editPath',{rows,alert:message ,alertClass:"alert-danger"});
        
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
                    connection.query("UPDATE  paths SET name=?, description=?,image=?  WHERE id=?",[pathName,description,img_name,req.params.id],(err,rows)=>{
                        // when done with the connectio,release it
                        connection.release();
                
                        if(!err){
                            pool.getConnection((err,connection)=>{
                                if(err) throw err; //not connected
                                console.log('Connected as ID : '+connection.threadId);
                            
                                // use the connection
                                connection.query("SELECT * FROM paths ",[req.params.id],(err,rows)=>{
                                    // when done with the connectio,release it
                                    connection.release();
                            
                                    if(!err){
                                        res.render('paths/listPath',{rows});
                            
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
     connection.query("DELETE FROM paths WHERE id=?",[req.params.id],(err,rows)=>{
         // when done with the connectio,release it
         connection.release();
 
         if(!err){
            res.redirect('/paths');
           
 
         }else{
             console.log(err);
         }
 
     });
 
     });
 
 }