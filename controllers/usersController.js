const cloudinary = require("cloudinary").v2;
const { User } = require("../models/user.js");
const path = require("path");
const { ctrlWrapper, HttpError } = require("../helpers/index.js");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail.js");
const { Drink } = require("../models/drink.js");
const BgMotivModalKeys = require("../constants/achievements/classNameKeys.js");

const updateUser = async (req, res) => {
  const { body, file, user } = req;

  if (file) {
    const uniqueFilename = nanoid();
    const extension = path.extname(file.originalname);
    const fileName = `${uniqueFilename}${extension}`;

    const result = await cloudinary.uploader.upload(file.path, {
      public_id: `${fileName}`,
      folder: "avatars",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    await cloudinary.uploader.destroy(file.filename);

    const avatarURL = result.secure_url;
    user.avatarURL = avatarURL;
  } else {
    user.avatarURL = user.avatar;
  }

  const { _id } = user;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $set: { name: body.name, avatarURL: user.avatarURL } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "Avatar uploaded successfully",
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
    },
  });
};

const subscribe = async (req, res) => {
  const { email } = req.body;
  const { _id: id, email: userEmail, subscribe } = req.user;

  if (email !== userEmail) throw HttpError(403, "You can use just own Email");

  if (subscribe) throw HttpError(400, "Subscribe has already been passed");

  const subscribeEmail = {
    to: email,
    from: "nikr3enox@gmail.com",
    subject: "Verify your email",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Email Title</title>
</head>
<body style="font-family: Arial, sans-serif;">

    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <h1 style="color: #333;">Hello!</h1>
        <p style="color: #555; line-height: 1.6;">This is your HTML email for distribution. You can add any text or content to this block.</p>

        <p style="color: #555; line-height: 1.6;">Example link: <a href="https://r3enox.github.io/frontend-drink-master/home" style="color: #007BFF; text-decoration: underline;">Visit our website</a></p>

        <p style="color: #555; line-height: 1.6;">Example image: <img src="https://cdn.trinixy.ru/pics5/20180809/beautiful_cats_25.jpg" alt="Cat" style="max-width: 100%; height: auto;"></p>

        <p style="color: #555; line-height: 1.6;">If you have any questions, feel free to ask!</p>

        <p style="color: #555; line-height: 1.6;">Best regards,<br>Developer Team</p>
    </div>

</body>
</html>
`,
    text: `Your Email Title

        Hello!
        This is your HTML email for distribution. You can add any text or content to this block.

        Example link: Visit our website

        Example image: 

        If you have any questions, feel free to ask!

        Best regards, Developer Team
    


`,
  };

  await sendEmail(subscribeEmail);
  await User.findByIdAndUpdate(id, { subscribe: true });
  res.json({ message: "Subscribe email sent" });
};

const getCurrent = async (req, res) => {
  const { _id, name, email, avatarURL, dateOfBirth } = req.user;
  res.json({
    user: {
      id: _id,
      name,
      email,
      dateOfBirth,
      avatarURL,
    },
  });
};

const checkAddToFavoritesAchievements = async (req, res) => {
  const { user } = req;

  // first favorite add
  if (!user.achievements.addedToFavoriteFirst) {
    user.achievements.addedToFavoriteFirst = true;
    await user.save();

    return res.json({
      message: "Wow! You have added the first recipe to your favorites!",
      classNamesKey: BgMotivModalKeys.THIRD,
    });
  }

  // tenth favorite add
  if (!user.achievements.addedToFavoriteTenth) {
    const favoritesQty = await Drink.countDocuments({ favorite: user._id });

    if (favoritesQty === 10) {
      user.achievements.addedToFavoriteTenth = true;
      await user.save();

      return res.json({
        message: "Wow! You have added 10 recipes to your favorites!",
        classNamesKey: BgMotivModalKeys.SECOND,
      });
    }
  }

  res.send(null);
};

const checkCreateOwnAchievements = async (req, res) => {
  const { user } = req;

  // first create own
  if (!user.achievements.createdOwnFirst) {
    user.achievements.createdOwnFirst = true;
    await user.save();

    return res.json({
      message: "Wow! You have created the first own recipe!",
      classNamesKey: BgMotivModalKeys.THIRD,
    });
  }

  // tenth create own
  if (!user.achievements.createdOwnTenth) {
    const ownsQty = await Drink.countDocuments({ owner: user._id });

    if (ownsQty === 10) {
      user.achievements.createdOwnTenth = true;
      await user.save();

      return res.json({
        message: "Wow! You have created 10 own recipes!",
        classNamesKey: BgMotivModalKeys.SECOND,
      });
    }
  }

  res.send(null);
};

module.exports = {
  updateUser: ctrlWrapper(updateUser),
  getCurrent: ctrlWrapper(getCurrent),
  subscribe: ctrlWrapper(subscribe),
  checkAddToFavoritesAchievements: ctrlWrapper(checkAddToFavoritesAchievements),
  checkCreateOwnAchievements: ctrlWrapper(checkCreateOwnAchievements),
};
