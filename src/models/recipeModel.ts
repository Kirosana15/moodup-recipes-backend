import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.index({ title: "text" });

export interface IRecipe extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  createdAt: Date;
}

export default mongoose.model("Recipe", recipeSchema);
