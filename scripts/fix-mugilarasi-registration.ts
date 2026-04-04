import mongoose from "mongoose";

const TARGET = {
  studentName: "Mugilarasi L",
  studentEmail: "logaj1972@gmail.com",
  mobileNumber: "7200927010"
};

const PATCH = {
  studentName: "Mugilarasi L",
  studentEmail: "logaj1972@gmail.com",
  mobileNumber: "7200927010",
  college: "Paavai Engineering College",
  course: "CSE (AIML)",
  year: "2nd",
  transactionId: "645904690820",
  paymentId: "645904690820",
  paymentUpiId: "logaj1972@oksbi"
};

const WORKSHOP_TITLE = "WORKSHOP AI TOOLS & WEB DEVELOPMENT";

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Export it before running this script.");
  }

  await mongoose.connect(uri);

  const registrations = mongoose.connection.collection("registrations");
  const events = mongoose.connection.collection("events");

  const matches = await registrations
    .find(TARGET, {
      projection: {
        _id: 1,
        studentName: 1,
        studentEmail: 1,
        mobileNumber: 1,
        eventTitle: 1,
        eventId: 1,
        transactionId: 1,
        paymentId: 1,
        paymentUpiId: 1,
        college: 1,
        course: 1,
        year: 1
      }
    })
    .toArray();

  if (matches.length === 0) {
    throw new Error("No matching Mugilarasi registration found with the provided identifiers.");
  }

  if (matches.length > 1) {
    throw new Error(
      `Found ${matches.length} matching registrations. Aborting to avoid touching multiple rows.`
    );
  }

  const targetDoc = matches[0];

  const workshopEvent = await events.findOne(
    { title: WORKSHOP_TITLE },
    { projection: { _id: 1, title: 1 } }
  );

  if (!workshopEvent?._id) {
    throw new Error(`Workshop event '${WORKSHOP_TITLE}' not found.`);
  }

  const updateResult = await registrations.updateOne(
    { _id: targetDoc._id },
    {
      $set: {
        ...PATCH,
        eventTitle: WORKSHOP_TITLE,
        eventId: workshopEvent._id
      }
    }
  );

  if (updateResult.matchedCount !== 1 || updateResult.modifiedCount !== 1) {
    throw new Error(
      `Expected to modify 1 document. matched=${updateResult.matchedCount}, modified=${updateResult.modifiedCount}`
    );
  }

  const updated = await registrations.findOne(
    { _id: targetDoc._id },
    {
      projection: {
        _id: 1,
        studentName: 1,
        studentEmail: 1,
        mobileNumber: 1,
        college: 1,
        course: 1,
        year: 1,
        transactionId: 1,
        paymentId: 1,
        paymentUpiId: 1,
        eventTitle: 1,
        eventId: 1
      }
    }
  );

  console.log("Updated exactly one registration:");
  console.log(JSON.stringify(updated, null, 2));
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
