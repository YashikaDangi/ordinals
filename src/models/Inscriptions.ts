import mongoose, { Schema, Document } from "mongoose";

interface IComment {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IInscription extends Document {
  inscription_number: number;
  inscription_id: string;
  sha: string;
  location: string;
  output: string;
  timestamp: Date;
  parent: string | null;
  genesis_height: number;
  flagged: boolean;
  banned: boolean;
  content_type: string;
  rarity: string;
  sat_name: string;
  tags: string[];
  output_value: number;
  address: string;
  version: number;
  token: boolean;
  created_at: Date;
  updated_at: Date;
  sat: number;
  collection_item_name: string;
  collection_item_number: number;
  official_collection: mongoose.Types.ObjectId;
  listed: boolean;
  listed_at: Date;
  listed_maker_fee_bp: number;
  listed_price: number;
  listed_seller_receive_address: string;
  signed_psbt: string;
  tap_internal_key: string;
  unsigned_psbt: string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  savedBy: mongoose.Types.ObjectId[];
}

const CommentSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model is already defined to avoid OverwriteModelError
const InscriptionSchema: Schema = new Schema(
  {
    inscription_number: { type: Number, required: true },
    inscription_id: { type: String, required: true },
    sha: { type: String, required: true },
    location: { type: String, required: true },
    output: { type: String, required: true },
    timestamp: { type: Date, required: true },
    parent: { type: String, default: null },
    genesis_height: { type: Number, required: true },
    flagged: { type: Boolean, required: true },
    banned: { type: Boolean, required: true },
    content_type: { type: String, required: true },
    rarity: { type: String, required: true },
    sat_name: { type: String, required: true },
    tags: { type: [String], required: true },
    output_value: { type: Number, required: true },
    address: { type: String, required: true },
    version: { type: Number, required: true },
    token: { type: Boolean, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    sat: { type: Number, required: true },
    collection_item_name: { type: String, required: true },
    collection_item_number: { type: Number, required: true },
    official_collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    listed: { type: Boolean, required: false },
    listed_at: { type: Date, required: false },
    listed_maker_fee_bp: { type: Number, required: false },
    listed_price: { type: Number, required: false },
    listed_seller_receive_address: { type: String, required: false },
    signed_psbt: { type: String, default: "" },
    tap_internal_key: { type: String, default: "" },
    unsigned_psbt: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: false, // Fields created_at and updated_at are handled manually
    collection: "inscriptions", // Explicitly specify the collection name
  }
);

// Adding index on inscription_number for better search performance
InscriptionSchema.index({ inscription_number: 1 }); // 1 for ascending order

const Inscription =
  mongoose.models.Inscription ||
  mongoose.model<IInscription>("Inscription", InscriptionSchema);

export default Inscription;
