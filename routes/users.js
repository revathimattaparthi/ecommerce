
/*
 * GET users listing.
 */

exports.list = function(req, res){
    
    console.log("all the users")

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM user',function(err,rows)
            {
            
                if(err)
                    console.log("Error Selecting : %s ",err );
         
                res.render('users',{page_title:"products - Node.js",data:rows});     
               
             });
         
         //console.log(query.sql);
    });
  
};

// add new users

exports.add = function(req, res){
  res.render('add_users',{page_title:"Add users - Node.js"});
};

exports.edit = function(req, res){
    
    var UserId = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM user WHERE UserId = ?',[UserId],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_users',{page_title:"Edit users - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the users
*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
  
            Name        : input.Name,
            Email       : input.Email,
            Mobile      : input.Mobile,
            City        : input.City,
            State       : input.State, 
            Country     : input.Country,
            Zipcode     : input.Zipcode
        };
        
        var query = connection.query("INSERT INTO user set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/users');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

// save after editing users

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var UserId = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
             Name       : input.Name,
             Email      : input.Email ,
             Mobile     : input. Mobile ,
             City       : input.City,
             State      : input.State,
             Country    : input. Country,
             Zipcode    : input. Zipcode,
            
            
        
        
        };
        
        connection.query("UPDATE user set ? WHERE UserId = ? ",[data,UserId], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/users');
          
        });
    
    });
};

// delete users

exports.delete_user = function(req,res){


    console.log('delete')
          
     var UserId = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM user  WHERE UserId = ? ",[UserId], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/users');
             
        });
        
     });
};


