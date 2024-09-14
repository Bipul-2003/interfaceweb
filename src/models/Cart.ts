import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartType extends Document {
  user: Types.ObjectId;
  products: {
    session: Types.ObjectId;
    enrollment: Types.ObjectId;
  }[];
}

const CartSchema: Schema<CartType> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [{
      session: {
        type: Schema.Types.ObjectId,
        ref: "Session",
        required: true,
      },
      enrollment: {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
        required: true,
      },
    }],
  },
  { timestamps: true }
);

const CartModel =
  (mongoose.models.Cart as mongoose.Model<CartType>) ||
  mongoose.model<CartType>("Cart", CartSchema);

export default CartModel;
