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
        connection.query("SELECT * FROM about",(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('about/listAbout',{rows});
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
        connection.query("SELECT * FROM about WHERE name LIKE ?",['%'+searchTerm+'%'],(err,rows)=>{
            // when done with the connectio,release it
            connection.release();

            if(!err){
                res.render('about/listAbout',{rows});
                console.log('The data from user table :\n',rows);

            }else{
                console.log(err);
            }

        });

    });
}

// Add New About
exports.create=(req,res)=>{
        const {description}=req.body;

        if( description === ""){
            message = "Please fill in all fields";
            res.render('about/addAbout',{alert:message ,alertClass:"alert-danger"});

        }else{
         pool.getConnection((err,connection)=>{
                            if(err) throw err; //not connected
                            console.log('Connected as ID : '+connection.threadId);
                    
                            // use the connection
                            connection.query("INSERT INTO about SET description=?",[description],(err,rows)=>{
                                // when done with the connection,release it
                                connection.release();
                    
                                if(!err){
                                    res.render('about/addAbout',{alert:"About added successfully." ,alertClass:"alert-success"});
                                   
                    
                                }else{
                                    console.log(err);
                                }
                    
                            });
                    
                        });
                
          
        }


}

exports.form=(req,res)=>{
    res.render('about/addAbout');
}

exports.edit=(req,res)=>{
   // Connect to db
   pool.getConnection((err,connection)=>{
    if(err) throw err; //not connected
    console.log('Connected as ID : '+connection.threadId);

    // use the connection
    connection.query("SELECT * FROM about WHERE id=?",[req.params.id],(err,rows)=>{
        // when done with the connectio,release it
        connection.release();

        if(!err){
            res.render('about/editAbout',{rows});
            console.log('The data from user table :\n',rows);

        }else{
            console.log(err);
        }

    });

    });

}
exports.update=(req,res)=>{

    var id= req.params.id;
    const {description,image}=req.body;
    

    if(description === ""){
       
        // Connect to db
        pool.getConnection((err,connection)=>{
            if(err) throw err; //not connected
            console.log('Connected as ID : '+connection.threadId);

            // use the connection
            connection.query("SELECT * FROM about WHERE id=?",[req.params.id],(err,rows)=>{
                // when done with the connectio,release it
                connection.release();

                if(!err){
                    message = "Please fill in all fields";
                    res.render('about/editAbout',{rows,alert:message ,alertClass:"alert-danger"});

                }else{
                    console.log(err);
                }

            });
        });

    }else{
            // Connect to db
                    pool.getConnection((err,connection)=>{
                    if(err) throw err; //not connected
                    console.log('Connected as ID : '+connection.threadId);
                
                    // use the connection
                    connection.query("UPDATE  about SET description=?WHERE id=?",[description,req.params.id],(err,rows)=>{
                        // when done with the connectio,release it
                        connection.release();
                
                        if(!err){
                            pool.getConnection((err,connection)=>{
                                if(err) throw err; //not connected
                                console.log('Connected as ID : '+connection.threadId);
                            
                                // use the connection
                                connection.query("SELECT * FROM about ",[req.params.id],(err,rows)=>{
                                    // when done with the connectio,release it
                                    connection.release();
                            
                                    if(!err){
                                        res.render('about/listAbout',{rows});
                            
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
    



 }

 exports.delete=(req,res)=>{

  
    // Connect to db
    pool.getConnection((err,connection)=>{
     if(err) throw err; //not connected
     console.log('Connected as ID : '+connection.threadId);
 
     // use the connection
     connection.query("DELETE FROM about WHERE id=?",[req.params.id],(err,rows)=>{
         // when done with the connectio,release it
         connection.release();
 
         if(!err){
            res.redirect('/about');
           
 
         }else{
             console.log(err);
         }
 
     });
 
     });
 
 }