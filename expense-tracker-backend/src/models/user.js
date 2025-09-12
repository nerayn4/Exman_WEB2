import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { 
  type: String, 
  required: true, 
  unique: true, 
  match: [/\S+@\S+\.\S+/, 'Email invalide']
}
,
    password: { type: String, required: true },
    darkMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
