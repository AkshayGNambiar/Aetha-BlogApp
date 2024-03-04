require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'Akshay';

app.use(bodyParser.json());

// MongoDB connection.You have to setup mongodb locally for the smooth runnung of the application
mongoose.connect('mongodb://localhost/blog_app', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
}));

const Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
}));

// Validation schema using Zod
const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    author: z.string().min(1),
});

// Route
//Registering Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});
//login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send('Invalid username or password');
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});
//Route logout.It will clear JWT cookie stored in client side

app.post('/api/auth/logout', (req, res) => {
    try {
        
        // Clear the JWT token stored on the client side cookie
        res.clearCookie('jwt');
        res.status(200).send('Logged out successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging out');
    }
});

// Middleware to authenticate requests.This Middleware compares the token stored at the client side.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Forbidden');
        }
        req.user = user;
        next();
    });
};

// Middleware for validating incoming requests.This is done using ZOD library.
const validatePost = (req, res, next) => {
    try {
        postSchema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).send('Validation error: ' + error.message);
    }
};

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching posts');
    }
});

app.post('/api/posts', authenticateToken, validatePost, async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const post = new Post({ title, content, author });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating post');
    }
});

app.get('/api/posts/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching post');
    }
});

app.put('/api/posts/:postId', authenticateToken, validatePost, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating post');
    }
});

app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.status(200).send('Post deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting post');
    }
});

// Start server at 3000 or port given at the env file.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
