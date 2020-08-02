const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
// Load validators
const validatePostInput = require("../../validation/post");

// @route 	GET api/posts/test
// @desc  	Tests posts route
// @access	Public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route 	POST api/posts
// @desc  	Create post
// @access	Private
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		});

		newPost.save().then(post => res.json(post));
	}
);

// @route 	GET api/posts
// @desc  	Get all posts
// @access	Public
router.get("/", (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err =>
			res.status(404).json({ noPostFound: "No post found", err })
		);
});

// @route 	GET api/posts/:id
// @desc  	Get posts by id
// @access	Public
router.get("/:id", (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err =>
			res
				.status(404)
				.json({ noPostFound: "No post found with provided id", err })
		);
});

// @route 	DELETE api/posts/:id
// @desc  	Delete post
// @access	Private
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.user.toString() !== req.user.id) {
						return res
							.status(401)
							.json({ notAuthorized: "User not authorized" });
					}

					post.remove().then(() => res.json({ succes: true }));
				})
				.catch(err =>
					res.status(404).json({
						noPostFound: "No post found with provided id",
						err
					})
				);
		});
	}
);

// @route 	POST api/posts/like/:id
// @desc  	Like post
// @access	Private
router.post(
	"/like/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(
							likes => likes.user.toString() === req.user.id
						).length > 0
					) {
						return res.status(400).json({
							alreadyLike: "User already like this post"
						});
					}

					post.likes.unshift({ user: req.user.id });
					post.save().then(post => res.json(post));
				})
				.catch(err =>
					res.status(404).json({
						noPostFound: "No post found with provided id",
						err
					})
				);
		});
	}
);

// @route 	POST api/posts/unlike/:id
// @desc  	Unlike
// @access	Private
router.post(
	"/unlike/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(
							likes => likes.user.toString() === req.user.id
						).length === 0
					) {
						return res.status(400).json({
							alreadyLike: "You have not like this post"
						});
					}

					const removeIndex = post.likes
						.map(item => item.user.toString())
						.indexOf(req.user.id);

					post.likes.splice(removeIndex, 1);
					post.save().then(post => res.json(post));
				})
				.catch(err =>
					res.status(404).json({
						noPostFound: "No post found with provided id",
						err
					})
				);
		});
	}
);

// @route 	POST api/posts/comment/:id
// @desc  	Add comment to post
// @access	Private
router.post(
	"/comment/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then(post => {
				const { errors, isValid } = validatePostInput(req.body);

				if (!isValid) {
					return res.status(400).json(errors);
				}

				const newComment = {
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
					user: req.user.id
				};

				post.comments.unshift(newComment);
				post.save().then(post => res.json(post));
			})
			.catch(err =>
				res.status(404).json({
					noPostFound: "No post found",
					err
				})
			);
	}
);

// @route 	DELETE api/posts/comment/:id/:cmt_id
// @desc  	Delete comment from post
// @access	Private
router.delete(
	"/comment/:id/:cmt_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then(post => {
				if (
					post.comments.filter(
						comment => comment._id.toString() === req.params.cmt_id
					).length === 0
				) {
					return res
						.status(404)
						.json({ commentNotExists: "Comment does not exist" });
				}

				const removeIndex = post.comments
					.map(item => item._id.toString())
					.indexOf(req.params.cmt_id);

				post.comments.splice(removeIndex, 1);
				post.save().then(post => res.json(post));
			})
			.catch(err =>
				res.status(404).json({
					noPostFound: "No post found",
					err
				})
			);
	}
);

module.exports = router;
