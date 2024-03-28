const app = require("./server");
const config = require("config");
const dbConnect = require("./db/connect");
dbConnect();
app.listen(process.env.PORT || config.get("port"), () => {
  console.log(`Server started on port ${config.get("port")}`);
});
