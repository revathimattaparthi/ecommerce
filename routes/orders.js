
/*
 * GET order listing.
 */
 const dateTime = require('date-time');

var productsData = {};
exports.list = function(req, res){
    
    console.log("all the orders")

        req.getConnection(function(err,connection){
           
            var query = connection.query('SELECT o.TotalPrice,o.BasePrice,o.OrderDate,o.Quantity,OrderId as OrderId,o.OrderStatus,u.Name as user,p.Name as product,c.Name as category FROM `order`as o LEFT JOIN user as u on o.UserId=u.UserId LEFT JOIN product as p on o.ProductId=p.ProductId LEFT JOIN category as c on p.CategoryId=c.CategoryId',function(err,rows)
            {
                
                if(err)
                    console.log("Error Selecting : %s ",err );
         
                res.render('orders',{page_title:"orders - Node.js",data:rows});
                    
               
             });
             
             //console.log(query.sql);
        });
  
};

// add new Order

exports.add = function(req, res){
        req.getConnection(function(err,connection){
             
           var query = connection.query('SELECT ProductId,Name,Price,Quantity FROM product WHERE Status = "active"',function(err,rows)
               {
          
                if(err) {
                    console.log("Error Selecting : %s ",err ); 
                } else {
                        productsData = rows;
                        console.log(productsData);
                }  
                 
            var query1 = connection.query('SELECT UserId,Name FROM user',function(err,userrows)
                {
                  if(err)
                      console.log("Error Selecting : %s ",err );

                      res.render('add_orders',{page_title:"Add orders - Node.js",productsData:rows, userData : userrows});
                 });     
              });
        });
         //console.log(query.sql);
 }; 




/*Save the orders
*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));

    var obasePrice = {};
    req.getConnection(function (err, connection) {

            for(i = 0; i < productsData.length; i++ ) {

                if(productsData[i].ProductId == parseInt(input.ProductId)){

                     obasePrice = {
                        productorderId : parseInt(productsData[i].ProductId),
                         BasePrice      : productsData[i].Price,
                         pquantity      : productsData[i].Quantity
                       };
                       break;
                }
              }  

              var TotalPrice = parseInt(obasePrice.BasePrice) * parseInt(input.Quantity);

              var status;
              if(parseInt(input.Quantity) > obasePrice.pquantity)
              {
                status = "pending";
              } else {

                      status = "completed";

                      req.getConnection(function (err, connection) {

                          var actualQuantity = {
                              Quantity : obasePrice.pquantity - parseInt(input.Quantity)
                          }

                          var query = connection.query("UPDATE  product set ?  WHERE ProductId = ? ",[actualQuantity, obasePrice.productorderId], function(err, rows)
                              {
                                if(err)
                                    console.log("Error Selecting : %s ",err ); 
                                });
                              console.log("updating data into product table successfully");
                            });
            }
              
              var  data = {
                    ProductId    : parseInt(input.ProductId),
                    Quantity     : parseInt(input.Quantity),
                    BasePrice    : obasePrice.BasePrice,
                    TotalPrice   : parseInt(TotalPrice),
                    OrderStatus  : status,
                    UserId       : input.UserId,
                    OrderDate    : dateTime(new Date(), {local: true})
        
                };
              // var  data = {
              //       ProductId    : 40,
              //       Quantity     : 10,
              //       BasePrice    : 12,
              //       TotalPrice   : 120,
              //       OrderStatus  : 'pending',
              //       UserId       : 2,
              //       UpdatedOn    : "",
              //       OrderDate   : ""
              //   };
       
          console.log(data);

        
        
        var query = connection.query("INSERT INTO `order` set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          else
            res.redirect('/orders');
            console.log("Inserted data into Order table successfully");
        });
    
    });
};


// delete order

exports.delete_order = function(req,res){


    console.log('delete')
          
     var OrderId = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM `order`  WHERE OrderId = ? ",[OrderId], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/orders');
             console.log("deleted successfully OrderId:" + OrderId);
             
        });
        
     });
};


