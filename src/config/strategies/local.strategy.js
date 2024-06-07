import passport from "passport";
import { Strategy } from "passport-local";
import { MongoClient } from 'mongodb';
import debug from 'debug';

debug('app:localStrategy');

export function localStrategy(){
    passport.use(
        new Strategy(
          {
            usernameField: 'username',
            passwordField: 'password',
          },
          (username, password, done) => {
            const url = 'mongodb+srv://dbUser:kPW7xHlqXGGtI567@globomantics.ghexm7u.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics';
            const dbName = 'globomantics';
            (async function validateUser() {
              let client;
              try {
                client = await MongoClient.connect(url);
                debug('Connected to the mongo DB');
    
                const db = client.db(dbName);
    
                const user = await db.collection('users').findOne({ username });
    
                if (user && user.password === password) {
                  done(null, user);
                } else {
                  done(null, false);
                }
              } catch (error) {
                done(error, false);
              }
              client.close();
            })();
          }
        )
      );
    };