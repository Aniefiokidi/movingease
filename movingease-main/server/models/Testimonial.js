import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, required: true, trim: true, maxlength: 80 },
    quote: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
