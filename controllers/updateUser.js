const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

const { User } = require("../models/user.js");
const path = require("path");
const { ctrlWrapper } = require("../helpers/index.js");

const updateUser = async (req, res) => {
  const{body, file, user} = req
  // if (!file) {
  //   return res.status(400).json({ message: "Please upload a file" });
  // }

if(file) {
const uniqueFilename = uuidv4();
const extension = path.extname(file.originalname);
const fileName = `${uniqueFilename}${extension}`;

const result = await cloudinary.uploader.upload(file.path, {
  public_id: `avatars/${fileName}`,
  folder: "avatars",
  use_filename: true,
  unique_filename: false,
  overwrite: true,

});
 const avatarUrl = result.secure_url;
body.avatarUrl= avatarUrl
}
else{
  body.avatarUrl = body.avatar
}

  const { _id } = user;
  console.log(_id);

  

 

  const updatedUser = await User.findByIdAndUpdate(_id, { $set:body }, { new: true });

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "Avatar uploaded successfully",
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    },
  });
};

module.exports = {
  updateUser: ctrlWrapper(updateUser),
};
