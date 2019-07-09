const express = require('express');
const Posts = require('./data/db');
const route = express.Router();

route.get('/', async (req, res) => {
	try {
		const posts = await Posts.find(req.query);
		res.status(200).json(posts);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'The posts information could not be retrieved.' });
	}
});

route.get('/:id', async (req, res) => {
	try {
		const post = await Hubs.findById(req.params.id);

		if (post) {
			res.status(200).json(post);
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: 'The post information could not be retrieved.' });
	}
});

route.get('/:id/comments', async (req, res) => {
	try {
		const { id } = req.params;
		const post = await Posts.findById(id);
		if (post) {
			const post = await Posts.findPostComments(id);
			res.status(200).json(post);
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: 'The comments information could not be retrieved.' });
	}
});
