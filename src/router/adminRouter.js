import express from 'express';
import debug from 'debug';
import { MongoClient } from 'mongodb';
import sessions from '../data/sessions.json'assert { type: 'json' };

const appDebug = debug('app:adminRouter');
export const adminRouter = express.Router();

adminRouter.route('/').get((req,res)=>{
    const url = 'mongodb+srv://dbUser:kPW7xHlqXGGtI567@globomantics.ghexm7u.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics';
    const dbName = 'globomantics';

    (async function mongo(){
        let client;
        try{
            client = await MongoClient.connect(url);
            debug('Connected to the mongo DB');

            const db = client.db(dbName);
            
            const response = await db.collection('sessions').insertMany(sessions);
            res.json (response);

        } catch (error){
            debug(error.stack);
        }
        client.close();
    }())
});
