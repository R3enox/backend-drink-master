const mongoose = require("mongoose");
const app = require("./app");
const { job } = require("./config/cron");

const { DB_HOST, PORT = 3000 } = process.env;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      return console.log("Database connection successful");
    });
    job.start();
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
