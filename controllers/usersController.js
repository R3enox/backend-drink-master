const cloudinary = require("cloudinary").v2;
const { User } = require("../models/user.js");
const path = require("path");
const { ctrlWrapper, HttpError } = require("../helpers/index.js");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail.js");

const updateUser = async (req, res) => {
  const { body, file, user } = req;
  // if (!file) {
  //   return res.status(400).json({ message: "Please upload a file" });
  // }

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

  if (email !== userEmail) throw HttpError(400);

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

module.exports = {
  updateUser: ctrlWrapper(updateUser),
  getCurrent: ctrlWrapper(getCurrent),
  subscribe: ctrlWrapper(subscribe),
};
