
/*
 * GET Category listing.
 */
const dateTime = require('date-time');

exports.list = function(req, res){
    
    console.log("all the categories")

    req.getConnection(function(err,connection){
       
          var query = connection.query('SELECT * FROM category',function(err,rows)
            {
            
                if(err)
                    console.log("Error Selecting : %s ",err );
         
                res.render('category',{page_title:"categories - Node.js",data:rows})
                  
            });
         
         //console.log(query.sql);
    });
  
};

// add new category

exports.add = function(req, res){

  res.render('add_category',{page_title:"Add categories - Node.js"});
};

exports.edit = function(req, res){
    
      var CategoryId = req.params.id;
    
      req.getConnection(function(err,connection){
       
          var query = connection.query('SELECT * FROM category WHERE CategoryId = ?',[CategoryId],function(err,rows)
              {
            
                  if(err)
                      console.log("Error Selecting : %s ",err );
           
                  res.render('edit_category',{page_title:"Edit Categories - Node.js",data:rows});
              });
         
         //console.log(query.sql);
      }); 
};

/*Save the category
*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {

      var data;
              if(input.Status == 'active'){

                    data = {
                            Name        : input.Name,
                            Description : input.Description,
                            Status      : input.Status
                    };
             } else {
        
                    data = {
                            Name        : input.Name,
                            Description : input.Description
                    };
    }
        
        var query = connection.query("INSERT INTO category set ? ",data, function(err, rows)
            {
          
                  if (err)
                      console.log("Error inserting : %s ",err );
                 
                  res.redirect('/categories');
                  
            });
        
       // console.log(query.sql); get raw query
    
        });
};

// save after editing category

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var CategoryId = req.params.id;
    
    req.getConnection(function (err, connection) {
      var data;
            if(input.Status == 'active'){

                  data = {
                          Name        : input.Name,
                          Description : input.Description,
                          UpdatedOn   : dateTime(new Date(), {local: true}),
                          Status      : 'active'
                 };
           } else {
        
                 data = {
                          Name        : input.Name,
                          Description : input.Description,
                          UpdatedOn   : dateTime(new Date(), {local: true}),
                          Status      : 'Inactive'
                 };
    }
        
        connection.query("UPDATE category set ? WHERE CategoryId = ? ",[data,CategoryId], function(err, rows)
          {
  
              if (err)
                  console.log("Error Updating : %s ",err );
             
              res.redirect('/categories');
              
            });
    
      });
};

// delete category

exports.delete_category = function(req,res){
  console.log('delete')
          
     var CategoryId = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM category  WHERE CategoryId = ? ",[CategoryId], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/categories');
             console.log("deleted successfully");      
        });
        
     });
};


