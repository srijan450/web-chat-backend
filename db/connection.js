import { connect } from "mongoose";

connect("mongodb://127.0.0.1:27017/chat-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((e) => {
    console.log(e);
    console.error("Cannot connect to database!");
  });


  