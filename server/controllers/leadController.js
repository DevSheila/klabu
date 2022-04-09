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
        connection.query("SELECT * FROM leads",(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('leads/listLead',{rows});

            }else{
                console.log(err);
            }

        });

    });
}


// find lead by name

exports.find =(req,res)=>{

    // Connect to db
    pool.getConnection((err,connection)=>{
        if(err) throw err; //not connected
        console.log('Connected as ID : '+connection.threadId);

        let searchTerm=req.body.search
        // use the connection
        connection.query("SELECT * FROM leads WHERE name LIKE ?",['%'+searchTerm+'%'],(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('leads/listLead',{rows});

            }else{
                console.log(err);
            }

        });

    });
}
exports.form=(req,res)=>{
    res.render('leads/addLead');
}

// Add New Lead
exports.create=(req,res)=>{
    const {name,path,description,image,year}=req.body;

    if(name === ""|| path === ""|| description === ""||year === ""){
        message = "Please fill in all fields";
        res.render('leads/addLead',{alert:message ,alertClass:"alert-danger"});

    }if(!req.files || Object.keys(req.files).length === 0){
        message = "No files were selected";
        res.render('leads/addLead',{alert:message ,alertClass:"alert-danger"});
        
    }else{
        const d = new Date();
        let time = d.getTime();

        var file = req.files.image;
        var img_name=time +'_'+file.name;

        if(file.mimetype == "image/jpeg"|| file.mimetype == "image/jpg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                             
            file.mv('public/images/uploads/'+img_name, function(err) {
                           
                if (err){
                  return res.status(500).send(err);

                }else{
                    // Connect to db
                    pool.getConnection((err,connection)=>{
                        if(err) throw err; //not connected
                        console.log('Connected as ID : '+connection.threadId);
                
                        // use the connection
                        connection.query("INSERT INTO leads SET name=?,path=?, description=?,image=?,year=?",[name,path,description,img_name,year],(err,rows)=>{
                            // when done with the connection,release it
                            connection.release();
                
                            if(!err){
                                message="Lead added successfully.";

                                res.render('leads/addLead',{alert:message ,alertClass:"alert-success"});
                               
                
                            }else{
                                console.log(err);
                            }
                
                        });
                
                    });
                }

                   
            });
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('leads/addLead',{alert:message ,alertClass:"alert-danger"});

        }
    }


}


exports.edit=(req,res)=>{
    // Connect to db
    pool.getConnection((err,connection)=>{
     if(err) throw err; //not connected
     console.log('Connected as ID : '+connection.threadId);
 
     // use the connection
     connection.query("SELECT * FROM leads WHERE id=?",[req.params.id],(err,rows)=>{
         // when done with the connectio,release it
         connection.release();
 
         if(!err){
             res.render('leads/editLead',{rows});
 
         }else{
             console.log(err);
         }
 
     });
 
     });
 
 }

 exports.update=(req,res)=>{

    var id= req.params.id;
    const {name,path,description,image,year}=req.body;

    if(name === ""|| path === ""|| description === ""||year === ""){
       
        // Connect to db
        pool.getConnection((err,connection)=>{
            if(err) throw err; //not connected

            // use the connection
            connection.query("SELECT * FROM leads WHERE id=?",[req.params.id],(err,rows)=>{
                // when done with the connectio,release it
                connection.release();

                if(!err){
                    message = "Please fill in all fields";
                    res.render('leads/editLead',{rows,alert:message ,alertClass:"alert-danger"});

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
                    connection.query("SELECT * FROM leads WHERE id=?",[req.params.id],(err,rows)=>{
                        // when done with the connectio,release it
                        connection.release();
        
                        if(!err){
                            message = "No files were selected";
                            res.render('leads/editLead',{rows,alert:message ,alertClass:"alert-danger"});
        
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

        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/jpg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                             
            file.mv('public/images/uploads/'+img_name, function(err) {
                           
                if (err){
                  return res.status(500).send(err);

                }else{
                    // Connect to db
                    pool.getConnection((err,connection)=>{
                    if(err) throw err; //not connected
                    console.log('Connected as ID : '+connection.threadId);
                
                    // use the connection
                    connection.query("UPDATE  leads SET name=?, path=?,description=?,image=?,year=? WHERE id=?",[name,path,description,img_name,year,req.params.id],(err,rows)=>{
                    
                        // when done with the connectio,release it
                        connection.release();
                
                        if(!err){
                            pool.getConnection((err,connection)=>{
                                if(err) throw err; //not connected
                                console.log('Connected as ID : '+connection.threadId);
                            
                                // use the connection
                                connection.query("SELECT * FROM leads ",[req.params.id],(err,rows)=>{
                                    // when done with the connectio,release it
                                    connection.release();
                            
                                    if(!err){
                                        res.render('Leads/listLead',{rows});
                            
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
          res.render('leads/editLead',{alert:message ,alertClass:"alert-danger"});

        }
    }



 }
//  exports.update=(req,res)=>{
 
//      const {name,path,description,image,year}=req.body;
 
//      // Connect to db
//      pool.getConnection((err,connection)=>{
//       if(err) throw err; //not connected
//       console.log('Connected as ID : '+connection.threadId);
  
//       // use the connection
//       connection.query("UPDATE  leads SET name=?, path=?,description=?,image=?,year=? WHERE id=?",[name,path,description,image,year,req.params.id],(err,rows)=>{
//           // when done with the connectio,release it
//           connection.release();
  
//           if(!err){
//              pool.getConnection((err,connection)=>{
//                  if(err) throw err; //not connected
//                  console.log('Connected as ID : '+connection.threadId);
             
//                  // use the connection
//                  connection.query("SELECT * FROM leads WHERE id=?",[req.params.id],(err,rows)=>{
//                      // when done with the connectio,release it
//                      connection.release();
             
//                      if(!err){

//                          res.render('leads/listLead',{alert:"Lead updated successfully.",rows});
             
//                      }else{
//                          console.log(err);
//                      }
             
//                  });
             
//                  });
  
//           }else{
//               console.log(err);
//           }
  
//       });
  
//       });
  
//   }

  exports.delete=(req,res)=>{

  
    // Connect to db
    pool.getConnection((err,connection)=>{
     if(err) throw err; //not connected
     console.log('Connected as ID : '+connection.threadId);
 
     // use the connection
     connection.query("DELETE FROM leads WHERE id=?",[req.params.id],(err,rows)=>{
         // when done with the connectio,release it
         connection.release();
 
         if(!err){
            res.redirect('/leads');
           
 
         }else{
             console.log(err);
         }
 
     });
 
     });
 
 }
 

