import mongoose, { Schema, Document, Model } from "mongoose";

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  isActive: boolean;
  startsAt: Date;
  expiresAt?: Date;
  applicableProducts: mongoose.Types.ObjectId[];
  applicableCategories: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(v: number) {
          return (this as unknown as ICoupon).discountType !== "percentage" || v <= 100;
        },
        message: "Percentage discount cannot exceed 100",
      },
    },
    minOrderAmount: { type: Number, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
