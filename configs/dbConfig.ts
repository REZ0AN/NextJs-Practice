import mongoose from "mongoose";

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "rez-dev",
    });
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("[SUCCESS] Mongoose connected to DB");
    });
    connection.on("error", (err) => {
        console.error("[ERROR]Mongoose connection error:", err);
      
        // retry connection after a delay
        setTimeout(() => {
            connectToDB();
        }, 5000);
    });
    connection.on("disconnected", () => {
      console.log("[WARN] Mongoose disconnected from DB");
    });
  } catch (error) {
    console.error("[ERROR] Issues were found while connecting to MongoDB:", error);
    throw error;
  }
}