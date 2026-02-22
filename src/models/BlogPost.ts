import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: { fr: string; ar: string; en: string };
  slug: string;
  excerpt: { fr: string; ar: string; en: string };
  content: { fr: string; ar: string; en: string };
  coverImage: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  readingTime: number;
  isPublished: boolean;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    content: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    coverImage: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    readingTime: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    metaTitle: { type: String },
    metaDescription: { type: String },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index(
  { "title.fr": "text", "title.ar": "text", "title.en": "text",
    "excerpt.fr": "text", tags: "text" },
  { name: "blog_text_search" }
);

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
