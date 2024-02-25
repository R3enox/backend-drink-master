const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const { GOOGLE_CLIEND_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const { User } = require("../models/user");

const googleParams = {
  clientID: GOOGLE_CLIEND_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/auth/google/callback`,
  passReqToCallback: true,
};

const goooglecallback = async (
  req,
  accessToken,
  refreshTokenm,
  profile,
  done
) => {
  try {
    const { email, displayName } = profile;
    const user = await User.findOne({ email });
    if (user) done(null, user);
    const password = await bcrypt.hash(nanoid(), 10);
    console.log(profile);
    const newUser = await User.create({
      email,
      password,
      name: displayName,
      dateOfBirth: "01/01/2005",
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, goooglecallback);

passport.use("google", googleStrategy);

module.exports = passport;
