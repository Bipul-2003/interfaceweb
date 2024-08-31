import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartType extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId[];
}

const CartSchema: Schema<CartType> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

  ],
},{ timestamps: true },);

const CartModel =
  (mongoose.models.Cart as mongoose.Model<CartType>) ||
  mongoose.model<CartType>("Cart", CartSchema);

export default CartModel;
