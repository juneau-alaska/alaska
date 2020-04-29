const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Poll = require("../model/pollModel");
const auth = require('../middleware/auth');

/**
* @method - POST
* @description - Create Poll and Choices
* @param - /poll /choices
*/
router.post(
 "/",
 async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({
       errors: errors.array()
     });
   }

   // TODO: CREATE CHOICES AND STORE IDS



   const {
     username,
     email
   } = req.body;

   try {
     let user = await User.findOne({
       email
     });
     if (user) {
       return res.status(400).json({
         msg: "User Already Exists"
       });
     }

     user = await User.findOne({
       username
     });
     if (user) {
       return res.status(400).json({
         msg: "User Already Exists"
       });
     }

     user = new User({
       username,
       email
     });

     await user.save();

     const payload = {
       user: {
         id: user.id
       }
     };

     res.status(200).json({
       id: user.id
     });
   } catch (err) {
     console.log(err.message);
     res.status(500).send("Error in Saving");
   }
 }
);

module.exports = router;