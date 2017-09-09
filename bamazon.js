//Bamazon Homework
//Due Sep 9 2017

/*
So the basic idea here is I'm creating a node interface through inquirer that will allow a user to select and
"purchase" items from stock that is managed on a mySQL database. The first step is to fetch product info from the db
and store it in a local variable. After that, log the products to console will be the next step. Then, the inquirer
interface, and finally, updating of product qty on hand.
*/

//require npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

//Global variables
var products = [];

//init mySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: "root",

    password: "Fall2015*",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;

    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        products = res;

        console.log("Welcome to Bamazon, my friend!");

        interface();


    });


});


function interface(){
    console.table("Here are the contents of my humble shop:", products);

    inquirer.prompt([
        {
            name: "item_choose",
            type: "input",
            message: "Which item would you like to purchase? (Enter product id Number)"
        },
        {
            name: "qty_choose",
            type: "input",
            message: "How many would you like?"
        }
    ]).then(function (res, err) {
        if (err) throw err;

        var index = res.item_choose-1;
        var qty = res.qty_choose;

        console.log("You said you wanted " + qty + " units of " + products[index].product_name);

        if(qty<=products[index].qty){
            var price = qty*products[index].price;

            inquirer.prompt([
                {
                    name: "confirm",
                    type: "confirm",
                    message: "This will cost $" + price + "-- Is this ok?"
                }
            ]).then(function(res, err){
                if(err) throw err;

                if(res.confirm===true){
                    products[index].qty = products[index].qty-qty;
                    var remaining = products[index].qty - qty;
                    var id = index+1;
                    connection.query("UPDATE products\n" +
                        "SET qty = " + remaining + "\n" +
                        "WHERE id = "+ id +";");
                }


                interface();


            })
        }
        else{
            console.log("I'm sorry, we don't have enough to fill your order!");

            interface();
        }
    })
}