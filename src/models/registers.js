const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    gender: {
        type:String,
        required:true
    },
    mobilenumber: {
        type:Number,
        required:true,
        unique:true
    },
    age: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    }
})

ownerSchema.pre("save", async function(next) {

    if(this.isModified("password")) {
      console.log(`the current password is ${this.password}`);
      this.password = await bcrypt.hash(this.password, 10);
      console.log(`the current password is ${this.password}`);

      this.confirmpassword = undefined;
    }
  next();
})
// now we ned to create a collections

const Register = new mongoose.model("Register", ownerSchema);

module.exports = Register;