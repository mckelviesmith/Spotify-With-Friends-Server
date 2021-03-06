import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import 'dotenv/config';
import usersController from './controllers/users.js';
import postsController from './controllers/posts.js';
import commentsController from './controllers/comments.js';
import songsController from './controllers/songs.js';

const username = process.env.MONGO_USER;
const password = process.env.MONGO_PW;
const uri = `mongodb+srv://${username}:${password}@cluster0.jb1wc.mongodb.net/webdev-project?retryWrites=true&w=majority`;
mongoose.connect(uri);

// Use middleware
const app = express();
app.use(cors({
    preflightContinue: true,
    credentials: true,
    origin: [
        'http://localhost:3000',
        'http://api.spotify.com',
        'https://spotify-with-friends.netlify.app',
        'http://spotify-with-friends.herokuapp.com'
    ]
}));
app.use(express.json());

// session middleware
const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {SameSite: 'None', secure: true},
    resave: true,
    saveUninitialized: true,
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

// Add endpoints for various APIs
usersController(app);
postsController(app);
commentsController(app);
songsController(app);

app.listen(process.env.PORT || 4000);