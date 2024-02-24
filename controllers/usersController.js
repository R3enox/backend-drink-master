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
    html: `123`,
    text: `123`,
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
