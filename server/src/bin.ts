import cluster from "cluster";
import os from "os";
import app from "./index";
import { connectDB } from "./config";

const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} running`);
  console.log(`Starting ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart worker if it crashes
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  // Each worker connects to DB and runs server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} running on http://localhost:${PORT}`);
    });
  });
}
