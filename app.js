const express=require("express")
const bodyp=require("body-parser")
const { urlencoded } = require("body-parser")
const d=require(__dirname+"/date.js")
const mongoose=require("mongoose")
const { day } = require("./date")
const app=express()
const lodash=require("lodash")


// var lists=["Eat Food","Drink Water","Sleep Well"]
// let workLists=[]

mongoose.connect("mongodb+srv://varunub:Varun155@cluster0.hxspoea.mongodb.net/todolistDB")

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Check the data Entry"]
    }
})
const listSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Check the data entry"]
    },
    newlists:[itemSchema]

})
const Item=mongoose.model("Item",itemSchema)
const Work=mongoose.model("Work",itemSchema)
const customlist=mongoose.model("list",listSchema)

const default0=new Item({
    name:"Welcome to your todolist!"
})
const default1=new Item({
    name:"Hit the + buttton to add a new item"
})
const default2=new Item({
    name:"<-- Hit this to delete an item"
})
const defaultList=[default0,default1,default2]

function insertDefault(){
    Item.insertMany([default0,default1,default2],function(err){
        if(err){
            console.log(err)
        }
        else{
            // console.log("Successfully saved default item to the DB..")
        }
    }) 
}

app.use(bodyp.urlencoded({
    extended:true
}))
app.use(express.static("public"))
app.set("view engine","ejs")



app.get("/",(req,res)=>{
    const day=d.date()
    // console.log(req.body)
    Item.find({},function(err,items){
        if(err){
            console.log(err)
        }
        else{
            if(items.length==0){
                insertDefault()
                res.redirect("/")
            }else{
                res.render("list",{currentday:day,newItem:items})
            }
            
        }
    }) 
})

app.post("/",(req,res)=>{
    var item=req.body.todo1
    const listTitle=req.body.button
    // console.log(listTitle)

    if(req.body.button===d.date()){
        if(item){
            const newItem=new Item({
                name:item
            })
            newItem.save();
        }
        res.redirect("/")
        
    }
    else{
        if(item){
            const workItem= new Item({
                name:item
            })
            customlist.findOne({name:listTitle},function(err,foundlist){
                if(err){
                    console.log(err)
                }else{
                    foundlist.newlists.push(workItem)
                    foundlist.save()
                    res.redirect("/"+listTitle)
                }
                
            })
            // customlist.updateOne({name:listTitle},{$push:{newlists:workItem}},function(err){
            //     if(!err){
            //         console.log("Successfully Updated")
            //         res.redirect("/"+listTitle)
            //     }
            //     else{
            //         console.log(err)
            //     }
            // })
        }
        
    }  
})

app.post("/delete",(req,res)=>{
    const listTitle=req.body.title
    const id=req.body.item
    if(listTitle===d.date()){
        Item.deleteOne({_id:id},function(err){
            if(!err){
                // console.log("deleted item With id "+id)
                res.redirect("/")
            }
        })
    }else{
        customlist.updateOne({name:listTitle},{$pull:{newlists:{_id:id}}},function(err){
            if(!err){
                // console.log("Successfully Updated")
                res.redirect("/"+listTitle)
            }
            else{
                console.log(err)
            }
        })
    }
    

})
// app.get("/work",(req,res)=>{
//     Work.find({},function(err,wi){
//         if(err){
//             console.log(err)
//         }else{
//             res.render("list",{currentday:"Work",newItem:wi})
//         }
//     })
// })

app.get("/about",(req,res)=>{
    res.render("about")
})


app.get("/:para_name",(req,res)=>{
    var customlistname=lodash.capitalize(req.params.para_name) 
    customlist.findOne({name:customlistname},(err,items)=>{
        if(!err){
            if(!items){
                const newlist=new customlist({
                    name:customlistname, 
                    newlists:defaultList
                })
                newlist.save()
                res.redirect("/"+customlistname)
            }
            else{
                if(items.newlists.length===0){
                    customlist.updateOne({name:customlistname},{$set:{newlists:defaultList}},function(err){
                        if(!err){
                            // console.log("successfully added default lists")
                        }
                    })
                    res.redirect("/"+customlistname)
                }else{
                    res.render("list",{currentday:items.name,newItem:items.newlists})
                }
                
            }
        }
    })
    
    
})



app.listen(3000,function(){
    console.log("Server started at port 3000")
})