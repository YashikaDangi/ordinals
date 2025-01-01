import mongoose, { Schema, model, models } from "mongoose";

const SavedItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "Inscription", required: true },
  savedAt: { type: Date, default: Date.now },
});

const SavedItem = models.SavedItem || model("SavedItem", SavedItemSchema);

export default SavedItem;
