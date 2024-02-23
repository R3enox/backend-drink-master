const cloudinary = require("cloudinary").v2;
const { User } = require("../models/user");
const path = require("path");
const { ctrlWrapper } = require("../helpers/index.js");
const { nanoid } = require("nanoid");

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

module.exports = {
  updateUser: ctrlWrapper(updateUser),
};

// const cloudinary = require("cloudinary").v2;
// const { User } = require("../models/user");
// const path = require("path");
// const { ctrlWrapper } = require("../helpers/index.js");
// const { nanoid } = require("nanoid");

// const updateUser = async (req, res) => {
//   const { body, file, user } = req;
//   // if (!file) {
//   //   return res.status(400).json({ message: "Please upload a file" });
//   // }
// console.log(file);
//   if (file) {
//     const uniqueFilename = nanoid();
//     const extension = path.extname(file.originalname);
//     const fileName = `${uniqueFilename}${extension}`;

//     const result = await cloudinary.uploader.upload(file.path, {
//       public_id: `${fileName}`,
//       folder: "avatars",
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//     });
//     await cloudinary.uploader.destroy(file.fileName);
//     const avatarURL = result.secure_url;
//     body.avatarURL = avatarURL;
//   } else {
//     body.avatarURL = body.avatar;
//   }

//    const { _id } = user;
//    console.log(user);

//   // const _id = '65d0a9d2b388d1f4a059f220'

//   const updatedUser = await User.findByIdAndUpdate(
//     _id,
//     { $set: body },
//     { new: true }
//   );
//   console.log(updateUser);

//   if (!updatedUser) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.json({
//     message: "Avatar uploaded successfully",
//     user: {
//       name: updatedUser.name,
//       email: updatedUser.email,
//       avatar: updatedUser.avatar,
//     },
//   });
// };

// module.exports = {
//   updateUser: ctrlWrapper(updateUser),
// };

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
};
