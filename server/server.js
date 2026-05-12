import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

startServer();