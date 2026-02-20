import mongoose, { Schema, Document, Model } from "mongoose";

export type PayoutStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED";

export interface IMemberPayout extends Document {
  member: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PayoutStatus;
  period: { from: Date; to: Date };
  ordersCount: number;
  totalSales: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  paymentMethod: string;
  paymentReference?: string;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberPayoutSchema = new Schema<IMemberPayout>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "MAD" },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID", "FAILED"],
      default: "PENDING",
    },
    period: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    ordersCount: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    commissionRate: { type: Number, required: true, min: 0, max: 100 },
    commissionAmount: { type: Number, required: true, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: "bank_transfer" },
    paymentReference: { type: String },
    processedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

MemberPayoutSchema.index({ member: 1, createdAt: -1 });
MemberPayoutSchema.index({ status: 1 });
MemberPayoutSchema.index({ "period.from": 1, "period.to": 1 });

const MemberPayout: Model<IMemberPayout> =
  mongoose.models.MemberPayout ||
  mongoose.model<IMemberPayout>("MemberPayout", MemberPayoutSchema);

export default MemberPayout;
