const checkEnvironment = () => {
  if (
    !process.env.MONGO_USER_NAME ||
    !process.env.MONGO_PASSWORD ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRETE
  ) {
    console.log("Environment variables not found please set that");
    process.exit(555);
  }
};

module.exports = checkEnvironment;
