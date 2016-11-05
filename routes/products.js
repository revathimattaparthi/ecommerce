
/*
 * GET products listing.
 */
const dateTime = require('date-time');

exports.list = function(req, res){
    
    console.log("all the products")

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT p.*, c.Name as CategoryName FROM product as p left join category as c on p.CategoryId = c.CategoryId',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('products',{page_title:"products - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

// add new product

exports.add = function(req, res){

    // var CategoryId = req.params.id;
    
    req.getConnection(function(err,connection){
       
        
        var query = connection.query('SELECT CategoryId,Name FROM category WHERE Status = "active" ',function(err,rows)
        // ,[active]
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
           res.render('add_products',{page_title:"Add products - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
  
};

exports.edit = function(req, res){
    
    var ProductId = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM product WHERE ProductId = ?',[ProductId],function(err,rows)
        {
            
            if(err) {
                console.log("Error Selecting : %s ",err );
             } else {
              var query1 = connection.query('SELECT CategoryId,Name FROM category WHERE Status = "active" ',function(err,catrows)
        // ,[active]
        {
            
            if(err){
                console.log("Error Selecting : %s ",err );
            } else {
           res.render('edit_products',{page_title:"Edit products - Node.js",data:rows, data1:catrows});
                
           }
         });

             }
     
           
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the products
*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    // console.log(req.files.file.name);
    
    req.getConnection(function (err, connection) {
          var data;
          if(input.Status == 'active'){

             data = {
             CategoryId  : input.CategoryId,  
            Name        : input.Name,
            Description : input.Description,
            Price       : input.Price,
            Quantity    : input.Quantity,
            Image       : input.Image,
            Status      : input.Status
        
        };
      } else {

             data = {
            CategoryId  : input.CategoryId, 
            Name        : input.Name,
            Description : input.Description,
            Price       : input.Price,
            Quantity    : input.Quantity,
            Image       : input.Image,
            
      };
    }

    console.log('data')
        
        var query = connection.query("INSERT INTO product set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/products');
          
        });
        
       // console.log(query.sql); get raw query
    
    // });
});
}
// save after editing products

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var ProductId = req.params.id;
    
    req.getConnection(function (err, connection) {
        
       var data;
          if(input.Status == 'active' && input.Image != ''){

             data = {
            CategoryId  : input.CategoryId, 
            Name    : input.Name,
            Description : input.Description,
            Price   : input.Price,
            Quantity   : input.Quantity,
            Image : input.Image,
            Status : 'active',
            UpdatedOn   : dateTime(new Date(), {local: true})
        
          };
        } else if(input.Image != ' '){

             data = {
            CategoryId  : input.CategoryId, 
            Name    : input.Name,
            Description : input.Description,
            Price   : input.Price,
            Quantity   : input.Quantity,
            Image : input.Image,
            Status : 'Inactive',
            UpdatedOn   : dateTime(new Date(), {local: true})
      };
    } else if(input.Status == 'active' && input.Image == ''){
             data = {
            CategoryId  : input.CategoryId, 
            Name    : input.Name,
            Description : input.Description,
            Price   : input.Price,
            Quantity   : input.Quantity,
            Status : 'active',
            UpdatedOn   : dateTime(new Date(), {local: true})
        
          };
    } else {
            data = {
            CategoryId  : input.CategoryId, 
            Name    : input.Name,
            Description : input.Description,
            Price   : input.Price,
            Quantity   : input.Quantity,
            Status : 'Inactive',
            UpdatedOn   : dateTime(new Date(), {local: true})
        
          };
    }
        console.log(data);
        connection.query("UPDATE product set ? WHERE ProductId = ? ",[data,ProductId], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         console.log(rows);

          res.redirect('/products');
          
        });
    
    });
};

// delete product

exports.delete_product = function(req,res){


    console.log('delete')
          
     var ProductId = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM product  WHERE ProductId = ? ",[ProductId], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/products');
             
        });
        
     });
};

