import chalk from 'chalk';
import express from 'express';
import debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sessionsRouter } from './src/router/sessionsRouter.js';
import { adminRouter } from './src/router/adminRouter.js';
import { authRouter } from './src/router/authRouter.js';
import { passportConfig } from './src/config/passport.js';

const PORT = process.env.PORT || 3000;
const appDebug = debug('app');
const app = express();



const __filename = fileURLToPath(import.meta.url);
const directoryName = dirname(__filename);

app.use(morgan('tiny'));
app.use(express.static(path.join(directoryName, '/public/')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret:'globomantics'}));

passportConfig(app);

app.set('views','./src/views');
app.set('view engine','ejs');


app.use('/sessions',sessionsRouter);
app.use('/admin',adminRouter);
app.use('/auth',authRouter);

app.get('/',(req, res)=>{
    res.render('index',{title:'Welcome to the page',data:['a','b','c']});
});
app.get('/signin', (req, res) => {
    res.render('signin');
});
app.get('/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.send('Logged out');
    });
});

app.listen(PORT,()=>{
    appDebug(`listening on port ${chalk.green(PORT)} `);
});