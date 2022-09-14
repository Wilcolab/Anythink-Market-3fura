//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);
require('../models/User');
require("../models/Item");
require("../models/Comment");

const crypto = require("crypto");

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

async function seedUser() {
  const username = crypto.randomUUID().split("-")[0];
  const pass = crypto.randomUUID().split("-")[1];
  const user = new User();
  user.username = `seed${username}`;
  user.email = `seed${username}@seed.com`;
  user.setPassword(pass);
  try {
    await user.save();
    return user._id;
  } catch (err) {
    console.error("error seeding user", err);
  }
}

async function seedItem(userId) {
  const uuid = crypto.randomUUID().split("-")[0];
  const item = new Item();
  item.slug = `itemSlug${uuid}`;
  item.title = "Dog";
  item.description = "Dog Description";
  item.image = "https://place.dog/300/200";
  item.tagList = ["seed", "test"];
  item.seller = userId;
  try {
    await item.save();
    return item._id;
  } catch (err) {
    console.error("error seeding item", err);
  }
}

async function seedComment(userId, item) {
  const comment = new Comment();
  comment.body = "Cute dog";
  comment.seller = userId;
  comment.item = item;

  await comment.save();
}

async function populate() {
  await User.deleteMany({});
  await Item.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const userId = await seedUser();
    const item = await seedItem(userId);
    await seedComment(userId, item);
  }
  console.log("seeded users,items & comments");
}

(async () => {
  await populate();
  process.exit();
})();