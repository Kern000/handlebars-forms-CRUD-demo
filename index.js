const express = require("express");
const hbs = require("hbs");


// to understand:
// const helpers = require("handlebars-helpers")({
//     "handlebars": hbs.handlebars
// })

// console.log("before handlebars hbs.handlebars", hbs.handlebars)

const helpers = require("handlebars-helpers")({
    "handlebars": hbs.handlebars
})

// console.log("after handlebars hbs.handlebars", hbs.handlebars);

// what handlebars-helpers has just did when you pass in the optional {handlebars:hbs.handlebars} as an Object (important, not an array)
// https://www.npmjs.com/package/handlebars-helpers?activeTab=code
// what this does is tell handlebars-helpers to target the HBS directory, and it will loop thru all the stored helper methods in the lib
// and add it to the helpers of your current hbs.handlebars

hbs.handlebars.registerHelper("ifEquals", function(arg1, arg2, options){
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})
// This register #ifEquals
// options.fn(this) is looking at the content between the {{#ifEquals}}
// options.fn(this) look at the content between {{}} and {{}}
// aka {{}} itemHere {{}}
// options.inverse(this) is looking at the content within {{else}} block


const app = express();

// step 3 - express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());
app.use(express.urlencoded(
    {
        extended: false
    }
))

app.set("view engine", "hbs")

let productData = [
    {
        id: Math.floor(Math.random()* 10009),
        title: "Oppenheimer",
        duration: 200,
        format: ["imax", "digital", "analog"],
        studio: "Hollywood"
    },
    {
        id: Math.floor(Math.random()* 10009),
        title: "Finding Nemo",
        duration: 150,
        format: ["digital", "analog"],
        studio: "Hollywood"
    },
    {
        id: Math.floor(Math.random()* 10009),
        title: "Kungfu Hustle",
        duration: 120,
        format: ["digital", "analog", "chinese-subs"],
        studio: "Hollywood"
    },
    {
        id: Math.floor(Math.random()* 10009),
        title: "007 James Bond",
        duration: 140,
        format: ["digital", "chinese-subs"],
        studio: "Hollywood"
    }
]

// step 1
app.get("/", function(req, res){
        res.render("index", {
            "products": productData
        })
    }
)

// step 2
app.get("/create-new", function(req,res){
    res.render("create-new");
})

// step 4
app.post("/create-new", function(req,res){

    const title = req.body.title;
    const duration = req.body.duration;
    const studio = req.body.studio;

    let format;
    if (Array.isArray(req.body.format)){
        format = req.body.format;
    } else if (req.body.format){
        format = [req.body.format];
    }

    const newProduct = {
        id : Math.floor(Math.random() * 10009),
        title : title,
        duration : duration,
        format : format,
        studio : studio
    }

    productData.push(newProduct);

    res.redirect("/");
})

app.get("/delete-product/:id", function(req,res){
    const idToDelete = req.params.id;
    const indexToDelete = productData.findIndex((product)=> product.id == idToDelete);
    const productToDelete = productData[indexToDelete];

    res.render("delete",{
        productToDelete: productToDelete        
    });
})

app.post("/delete-product/:id", function(req,res){

    const idToDelete = req.params.id;
    const indexToDelete = productData.findIndex((product)=> product.id == idToDelete);
    productData.splice(indexToDelete, 1);
    res.redirect("/");
})

app.get("/edit-product/:id", function(req,res){
    const idToEdit = req.params.id;
    const indexToEdit = productData.findIndex((product)=> product.id == idToEdit);
    const itemToEdit = productData[indexToEdit];

    console.log(itemToEdit)
    res.render("edit-product",{
        itemToEdit: itemToEdit
    })
})

app.post("/edit-product/:id", function(req,res){

    console.log("route hit")

    const idToEdit = req.params.id;

    const title = req.body.title;
    const duration = req.body.duration;

    let format = [];
    if (Array.isArray(req.body.format)){
        format = req.body.format;
    } else if (req.body.format){
        format = [req.body.format];
    }

    const studio = req.body.studio;

    let replacementProduct = {
        id : parseInt(idToEdit),
        title : title,
        duration : duration,
        format : format,
        studio : studio
    }

    const indexToEdit = productData.findIndex((product)=>product.id == idToEdit);
    const left = productData.slice(0, indexToEdit);
    const right = productData.slice(indexToEdit+1);
    const modifiedProductData = [...left, replacementProduct, ...right];

    productData = modifiedProductData;
    res.redirect("/");
})


app.listen(3000, ()=>{
    console.log("listening at port 3000");
})
