const express=require('express');
const users=require('./MOCK_DATA.json')
const app=express();
const fs=require('fs');
app.get('/api/users',(req,res)=>{
    res.json(users);
})
// app.get('/users',(req,res)=>{
//     const html = `
//     <ul>
//         ${users.map((user) => `<li>${user.first_name}</li>`)}
//     </ul>
// `;
// })
// app.get('/api/users/:id',(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find(user=>user.id===id);
//     return res.json(user);

// });
// app.post('/api/users',(req,res)=>{
//     return res.json({status:"pending"});
// })
// app.patch('/api/user',(req,res)=>{
//     return res.json({status:"pending"})
// })

app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    return res.end("Hello from middlw ware 1");
    next();
})
app.use((req,res,next)=>{
    return res.end("Hello from middle ware 2");

});
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    })
    .patch((req, res) => {
        res.send('Update user');
    })
    .delete((req, res) => {
        res.send('Delete user');
    })
    .post((req,res)=>{
        const body=req.body;
        users.push(body);
        console.log(body);
        res.send({status:"pending"});
    });
mongoose.connect("mongodb://127.0.0.1:27017/youtubeapp1")
.then(()=>console.log("Mongodb connected"))
.catch((err)=>console.log("Mongodb error",err));
const userscehma=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobtitle:{
        type:String,
    },
    gender:{
        type:String,
    }
})
const user=mongoose.model("user",userscehma);
const port=8000;
app.listen(port,()=>{
    console.log("Server started");
})
