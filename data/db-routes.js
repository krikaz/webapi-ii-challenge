const express = require('express');
const Posts = require('./db');
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
		const post = await Posts.findById(req.params.id);

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
			const comments = await Posts.findPostComments(id);
			res.status(200).json(comments);
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

route.delete('/:id', async (req, res) => {
	try {
		const count = await Posts.remove(req.params.id);
		if (count > 0) {
			res.status(200).json({ message: 'The post has been deleted' });
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		}
	} catch (error) {
		res.status(500).json({ error: 'The post could not be removed' });
	}
});

route.post('/', async (req, res) => {
	try {
		if (!req.body.title || !req.body.contents) {
			res.status(400).json({
				errorMessage: 'Please provide title and contents for the post.',
			});
		} else {
			const post = await Posts.insert(req.body);
			res.status(201).json(post);
		}
	} catch (error) {
		res.status(500).json({
			error: 'There was an error while saving the post to the database',
		});
	}
});

route.post('/:id/comments', async (req, res) => {
	try {
		const post = Posts.findById(req.params.id);
		if (post) {
			const commentInfo = { ...req.body, post_id: req.params.id };
			if (commentInfo.text) {
				const comment = await Posts.insertComment(commentInfo);
				res.status(201).json(comment);
			} else {
				res
					.status(400)
					.json({ errorMessage: 'Please provide text for the comment.' });
			}
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		}
	} catch (error) {
		res.status(500).json({
			error: 'There was an error while saving the comment to the database',
		});
	}
});

route.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const post = await Posts.findById(id);
		if (post) {
			if (!req.body.title || !req.body.contents) {
				res.status(400).json({
					errorMessage: 'Please provide title and contents for the post.',
				});
			} else {
				const postUpdated = await Posts.update(id, req.body);
				res.status(200).json(postUpdated);
			}
		} else {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: 'The post information could not be modified.' });
	}
});

module.exports = route;
