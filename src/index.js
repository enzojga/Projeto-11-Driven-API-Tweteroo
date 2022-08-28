import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const user = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
    const { avatar,username } = req.body;
    console.log(req.headers);
    if (!username || !avatar) {
        return res.sendStatus(400);
    }
    user.push({
        username: username,
        avatar
    });
    res.status(201).send('OK');
});

app.post('/tweets', (req, res) => {
    const body = req.body;
    const { tweet } = body;
    const username = req.headers.user;
    if (!username || !tweet) {
        return res.sendStatus(400);
    }
    tweets.push({
        username,
        tweet
    });
    res.status(201).send('OK');
});
app.get('/tweets', (req, res) => {
    const page = Number(req.query.page);
    const calcPage = (page * 10);
    if(!page || !(page >= 1)){
        return res.status(400).send('Informe uma página válida');
    }
    console.log(calcPage,page);
    const lastTen = [];
    console.log(user);
    for (let i = calcPage - 1; i != calcPage - 11; i--) {
        console.log('entrei no array')
        if (tweets[i]) {
            const avatarPost = user.find(u => tweets[i].username === u.username);
            lastTen.push({
                ...tweets[i],
                avatar: avatarPost.avatar
            });
        }
    }
    console.log(lastTen)
    res.send(lastTen);
});
app.get('/tweets/:username', (req, res) => {
    const paramsName = req.params.username;
    if(paramsName){
        const avatarPost = user.find(u => paramsName === u.username);
        const postFilter = [];
        const userFilter = tweets.filter(u => u.username === paramsName);
        userFilter.forEach(u => postFilter.push({
            username: u.username,
            tweet: u.tweet,
            avatar:avatarPost.avatar
        }));
        return res.send(postFilter);
    }
});


app.listen(5000, () => console.log('ouvindo porta 5000'));
