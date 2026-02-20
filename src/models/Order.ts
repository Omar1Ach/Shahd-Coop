import mongoose, { Schema, Document, Model } from "mongoose";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
  sku: string;
}

export interface IStatusEvent {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  coupon?: mongoose.Types.ObjectId;
  couponCode?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: OrderStatus;
  statusHistory: IStatusEvent[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    variantName: { type: String },
    sku: { type: String, required: true },
  },
  { _id: false }
);

const StatusEventSchema = new Schema<IStatusEvent>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "MA" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    couponCode: { type: String },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    statusHistory: { type: [StatusEventSchema], default: [] },
    paymentMethod: { type: String, enum: ["stripe", "cod"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    stripePaymentIntentId: { type: String },
    stripeChargeId: { type: String },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    notes: { type: String },
    refundedAt: { type: Date },
    refundReason: { type: String },
  },
  { timestamps: true }
);

// Indexes
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
OrderSchema.index({ createdAt: -1 });

// Auto-generate order number
OrderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const count = await (this.constructor as Model<IOrder>).countDocuments();
  this.orderNumber = `SC-${String(count + 1).padStart(6, "0")}`;
  next();
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
