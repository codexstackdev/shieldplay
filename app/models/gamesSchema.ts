import mongoose from "mongoose";
import "./userSchema";

const gameSchema = new mongoose.Schema(
  {
    gamename: { type: String, required: true },
    version: { type: String, required: true },
    status: {
      type: String,
      default: "onreview",
      enum: ["tested", "untested", "outdated", "onreview"],
    },
    link: { type: String, required: true },
    features: [{ type: String }],
    gameimage: { type: String, required: true },
    imageId: { type: String, required: true },
    creator: { type: String, required: true },
    uploader : {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    comments: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          message: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const gameModel = mongoose.models.games || mongoose.model("games", gameSchema);

export default gameModel;
