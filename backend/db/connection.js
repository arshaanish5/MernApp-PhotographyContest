const mongoose =require('mongoose')
mongoose.connect(process.env.mongodb_url).then(()=>{
	console.log("MongoDB connected successfully")
}).catch(()=>{
	console.log("MongoDB connection failed")
})