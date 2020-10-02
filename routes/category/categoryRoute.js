const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Category = require("../../model/categoryModel");
const auth = require('../../middleware/auth');

/**
* @method - GET
* @description - Get Category
* @param - /category
*/
router.get("/", auth, async (req, res) => {
  const name = req.body.name;
  try {
    let category = await Category.findOne({
      name: name
    });

    res.status(200).send(category);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching category");
  }
});

/**
* @method - POST
* @description - Create Category
* @param - /category
*/
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name
  } = req.body;

  try {
    let category = await Category.findOne({
      name
    });
    if (category) {
      return res.status(200).json(category);
    }

    category = new Category({
      name
    });
    await category.save();

    res.status(200).json(category);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

/**
 * @method - PUT
 * @description - Update Category Followers
 * @param - /category/followers
 */

router.put("/followers", auth, async (req, res) => {
  const body = req.body;
  const name = body.name;
  const userId = body.userId;
  const unfollow = body.unfollow;

  try {
    let category = await Category.findOne({
      name: name
    });

    var followers = category.followers;
  
    if (unfollow) {
      const index = followers.indexOf(userId);
      if (index > -1) {
        followers.splice(index, 1);
      }
      category.followers = followers;
    } else {
      followers.push(userId)
      category.followers = followers;
    }

    await category.save(function(err) {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        res.status(200).json({
          message: "Updated Category",
          category
        });
      }
    });
  } catch (e) {
    res.send({ message: "Error in updating category" });
  }
});


module.exports = router;