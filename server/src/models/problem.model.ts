import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      unique: true,
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Problem description is required"],
      minlength: [20, "Description must be at least 20 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    companies: {
      type: [String],
      default: [],
    },
    hint: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Difficulty level is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
    constraints: {
      type: [String],
      default: [],
    },
    followUps: {
      type: [String],
      default: [],
    },
    topics: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    like: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    discussions: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    totalSubmissions: {
      // will only consider Accepted, Wrong Answer, TLE
      type: Number,
      default: 0,
      min: 0,
    },
    totalAccepted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
