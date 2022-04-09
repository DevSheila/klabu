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
    //--------------------LEADS-----------------------------------
        // use the connection
        connection.query("SELECT * FROM leads",(err,leads)=>{
       

            if(!err){
                // use the connection
                connection.query("SELECT * FROM paths",(err,paths)=>{
                  

                    if(!err){
                        connection.query("SELECT * FROM events  WHERE status ='past'",(err,events)=>{
                  

                            if(!err){
                                connection.query("SELECT * FROM events WHERE status= 'upcoming' ",(err,upcomingEvents)=>{
                  

                                    if(!err){

                                        connection.query("SELECT description FROM about",(err,aboutDesc)=>{
                                            let description="";

                                            if(!err){

                                                aboutDesc.forEach(desc => {
                                                    description=desc;
                                                  });
                                                  console.log(description);
                                                res.render('main/home',{leads,paths,upcomingEvents,events,description});
                                                
                        
                                            }else{
                                                console.log(err);
                                            }
                        
                                        });
                
                                      
                
                                    }else{
                                        console.log(err);
                                    }
                
                                });
        
                            }else{
                                console.log(err);
                            }
        
                        });


                    }else{
                        console.log(err);
                    }

                });
          
               

            }else{
                console.log(err);
            }

        });




    });


    // //--------------------PATHS-----------------------------------
    // // Connect to db
    // pool.getConnection((err,connection)=>{
    //     if(err) throw err; //not connected
    //     console.log('Connected as ID : '+connection.threadId);

    //     // use the connection
    //     connection.query("SELECT * FROM paths",(err,paths)=>{
    //         // when done with the connectio,release it
    //         connection.release();

    //         if(!err){
    //             res.render('main/home',{leads},{paths});
    //             console.log('The data from user table :\n',rows);

    //         }else{
    //             console.log(err);
    //         }

    //     });
    // });
   
    
}



