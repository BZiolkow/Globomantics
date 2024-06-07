import express from 'express';
import debug from 'debug';
import { MongoClient,ObjectId } from 'mongodb';
import sessions from '../data/sessions.json'assert { type: 'json' };
import { speakerService } from '../services/speakerService.js';

export const sessionsRouter = express.Router();


sessionsRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('signin');
  }
});

sessionsRouter.route('/')
    .get((req,res)=>{
        const url = 'mongodb+srv://dbUser:kPW7xHlqXGGtI567@globomantics.ghexm7u.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics';
        const dbName = 'globomantics';

    (async function mongo(){
        let client;
        try{
            client = await MongoClient.connect(url);
            debug('Connected to the mongo DB');

            const db = client.db(dbName);
            
            const sessions = await db.collection('sessions').find().toArray();
            const username = req.user ? req.user.username : 'Guest';

            res.render ('sessions',{sessions,username});

        } catch (error){
            debug(error.stack);
        }
        client.close();
    }());
});

sessionsRouter.route('/:id').get((req, res) => {
    const id = req.params.id;
    const url = 'mongodb+srv://dbUser:kPW7xHlqXGGtI567@globomantics.ghexm7u.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics';

    const dbName = 'globomantics';
  
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the mongo DB');
  
        const db = client.db(dbName);
  
        const session = await db
          .collection('sessions')
          .findOne({ _id: new ObjectId(id) });
  
        const speaker = await speakerService.getSpeakerById(
          session.speakers[0].id
        );
  
        session.speaker = speaker;
        res.render('session', {
          session,
        });
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    })();
  });