const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const Routes = require("./routes/Routes");
const mongoose = require("mongoose");
require("dotenv").config({
  path: "./.env",
});

const app = express();

const { PORT, MONGO_PATH, MONGO_USER, MONGO_PASSWORD } = process.env;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;

app.use(compression());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());

app.use("/api/user", Routes);

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
    useNEWUrlParser: true,
    useUnifiedTopology: true,
  },
};
mongoose
  .connect(uri, clientOptions)
  .then(() =>
    app.listen(PORT, () => {
      console.log("listening to port: ", PORT);
    }),
  )
  .catch((err) => console.log(err));

// app.listen(4000, () => {
//   console.log("Listening...");
// });
