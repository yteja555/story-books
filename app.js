const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const checkEnvironment = require("./config/checkEnvironment");
const passportInitialize = require("./config/passport");
const { Mongoose } = require("mongoose");
// Load config
dotenv.config({ path: "./config/config.env" });

// check environment variables
checkEnvironment();

// connecting to mongo
connectDB();

// initializing passport statergy
passportInitialize(passport);

const app = express();

//  body parse middlware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// logging using morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// express session middleware
app.use(
  session({
    secret: "Secret_key",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

// setting port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});
