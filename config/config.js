require("dotenv").config();
module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    COOKIE_SECRET: "COOKIE_SECRET",
    dialect: "postgres"
  }
};
