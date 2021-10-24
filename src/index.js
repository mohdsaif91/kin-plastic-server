const Mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  Mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
    .then(() => {
      console.log("connected", port);
    })
    .catch((err) => console.log(err));

  /* eslint-enable no-console */
});
