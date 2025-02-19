const mongoose=require("mongoose")
const userSchema = mongoose.Schema({
	username:String,
	email:String,
	password:String,
	role:String,
	earnings:Number,
	isBlocked: { type: Boolean, default: false }
})

const userModel =  mongoose.model("user",userSchema)
module.exports  = userModel