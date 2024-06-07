import express from 'express';
import debug from 'debug';
import { MongoClient, ObjectId } from 'mongodb';
import passport from 'passport';


export const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
  const { username, password } = req.body;
  const url = 'mongodb+srv://dbUser:kPW7xHlqXGGtI567@globomantics.ghexm7u.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics';
  const dbName = 'globomantics';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('users').insertOne(user);
      debug(results);
      req.login(results.ops[0], () => {
        res.redirect('/auth/profile');
      });
    } catch (error) {
      debug(error);
    }
    client.close();
  })();


});
authRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    })
  );
/*
authRouter
  .route('/signout')
  .get((req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
      res.send('Logged out');
    });
  });
*/
authRouter.route('/profile').get((req, res) => {
  res.json(req.user);
});