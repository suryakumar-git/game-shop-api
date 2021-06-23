var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop-api');

var Product = require('./product');
var WishList = require('./wishlist');
const { response } = require('express');
const wishlist = require('./wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.post('/product', function(req,res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;

    product.save(function(err, savedProduct) {
        if(err) {
            res.status(500).send({error: 'Product could not be saved'});
        } else {
            res.send(savedProduct);
        }
    })
});

app.get('/product', function(req,res) {
    Product.find({},function(err, products) {
        if(err) {
            res.status(500).send({error: 'Could not fetch products!'});
        } else {
            //res.setHeader('name:Access-Control-Allow-Origin', 'value:http://localhost:3000');
            //res.header("Access-Control-Allow-Origin:http://localhost:3000");
            res.header("Access-Control-Allow-Origin", "*");
            res.send(products);
        }
    })
});

/* app.put('/product/:productid', function(req,res) {
    var product = new Product({"_id":req.params.productid});
    product.price = req.body.price;

    product.updateOne(function(err, modifiedproduct) {
        if (err) {
            res.status(500).send({error: 'Could not modify products!'});
        } else {
            res.send(modifiedproduct);
        }
    });
}); */

app.post('/wishlist', function(req,res) {
    var wishList = new WishList();
    wishList.title = req.body.title;
    //wishList.price = req.body.price;

    wishList.save(function(err, newWishList) {
        if(err) {
            res.status(500).send({error: 'WishLIst could not be saved'});
        } else {
            res.send(newWishList);
        }
    })
});

app.get('/wishlist', function(req,res) {
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists) {
        if(err) {
            res.status(500).send({error: 'Could not fetch Wishlist!'});
        } else {
            res.send(wishLists);
        }
    })
});

app.put('/wishlist/product/add', function(req,res) {
    Product.findOne({_id: req.body.productId}, function(err, product) {
        if(err) {
            res.status(500).send({error: 'Could not add item to Wishlist!'});
        } else {
            wishlist.updateOne({_id: req.body.wishListId}, {$addToSet: {products: product._id}},function(err, wishList) {
                if(err) {
                    res.status(500).send({error: 'Could not add item to Wishlist!'});
                } else {
                    res.send(wishList);
                }
            });   
        }
    });
});

app.listen(3004, function(){
    console.log("Swag shop API running successfully");
});