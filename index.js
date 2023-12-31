const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//import routes
const paymentAuth = require("./routes/payment");

require("dotenv").config();

//middlewares
// app.use(
//   cors({ origin: ["http://192.168.29.210:3000,https://payments.grovyo.com"] })
// );

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", paymentAuth);

//connect to DB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DATABASE).then(() => {
      console.log("DB is connected");
    });
  } catch (err) {
    console.log(err);
  }
};
connectDB();

//connect to App
const PORT = 7300;

const connectApp = () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
connectApp();

let vpa = [];

//sockets
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("started", (data) => {
    if (!data || !data.vpa || !data.amount) {
      console.log("Invalid data. Missing vpa or amount.");
      return;
    }
    let check = data?.vpa?.split("@")[0];
    const existingVPA = vpa.some((item) => item?.vpa === check);

    if (existingVPA) {
      console.log("VPA already present", vpa);
    } else {
      let d = {
        amount: data.amount,
        vpa: check,
        socketid: socket.id,
      };

      vpa.push(d);
    }
  });

  socket.on("recieved", (data) => {
    let a = data?.vpa;
    const b = a.split("@");

    const newvpa = vpa.some(
      (v) =>
        (v?.vpa === b[0] + b[1] ||
          v?.vpa === a ||
          v?.vpa === b ||
          v?.vpa?.split("@")[0] + v?.vpa?.split("@")[1] === a ||
          v?.vpa?.split("@")[0] === a?.split("a")[0] ||
          v?.vpa?.split("@")[0] === a ||
          v?.vpa === a?.split("@")[0] ||
          a?.includes(v?.vpa) ||
          v?.vpa?.split("@")[0] === b[0]) &&
        parseInt(v?.amount) === parseInt(data?.amount?.split(".")[0])
    );

    const matchedVPA = vpa.find(
      (v) =>
        (v?.vpa === b[0] + b[1] ||
          v?.vpa === a ||
          v?.vpa === b ||
          v?.vpa?.split("@")[0] + v?.vpa?.split("@")[1] === a ||
          v?.vpa?.split("@")[0] === a?.split("a")[0] ||
          v?.vpa?.split("@")[0] === a ||
          v?.vpa === a?.split("@")[0] ||
          a?.includes(v?.vpa) ||
          v?.vpa?.split("@")[0] === b[0]) &&
        parseInt(v?.amount) === parseInt(data?.amount?.split(".")[0])
    );

    if (newvpa && matchedVPA) {
      io.to(matchedVPA?.socketid).emit("data", newvpa);
      const updatedVPA = vpa.filter(
        (v) => v?.socketid !== matchedVPA?.socketid
      );

      vpa = updatedVPA;
    }
  });
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

http.listen(4300, function () {
  console.log("sockets on 4300");
});
