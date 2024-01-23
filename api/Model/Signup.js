var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  adminStatus: {
    type: String,
    default: "pending",
  },
  teacherStatus: {
    type: Boolean,
    default: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "incomplete",
  },
  floorName: {
    type: String,
  },
  roomNumber: {
    type: Number,
  },
  conferenceNumber: {
    type: Number,
  },
  conferencePeriods: [
    {
      type: Number,
    },
  ],
  periodInfo: [
    {
      periodNumber: {
        type: Number,
      },
      studentNames: [
        {
          type: String,
        },
      ],
      periodGrade: {
        type: Number,
      },
    },
  ],
  accountType: {
    type: String,
    required: true,
  },
  shuffleStudents: [
    {
      names: [
        {
          studentName: { type: String },
          attendance: { type: String, default: "empty" },
        },
      ],
      periodNumber: { type: Number },
    },
  ],
  absentStatus: {
    type: Boolean,
  },
});

//! resets schema after set number of hours.

// !  ==== Pre saving bcrypt will change pw to hash form
authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
var Signup = new mongoose.model("Signup", authSchema);
module.exports = Signup;
