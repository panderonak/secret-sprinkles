import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnection = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log(`Connection to the database already exists.`);
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(`Database: ${db}`);

    connection.isConnected = db.connections[0].readyState;
    console.log(`DB Connections: ${db.connections}`);
    console.log(`\n MONGODB CONNECTED SUCCESSFULLY!`);
  } catch (error) {
    console.log(`MONGODB CONNECTION ERROR:, ${error}`);
    process.exit(1);
  }
};

export default dbConnection;
