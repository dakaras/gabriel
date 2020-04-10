const functions = require('firebase-functions');
const admin = require('firebase-admin')
const app = require('express')()

admin.initializeApp()

const firebaseConfig = {
    apiKey: "AIzaSyAm1KJaXYGKk2tIFwSAGYoYD9jHxf3bcfs",
    authDomain: "gabriel-adfe2.firebaseapp.com",
    databaseURL: "https://gabriel-adfe2.firebaseio.com",
    projectId: "gabriel-adfe2",
    storageBucket: "gabriel-adfe2.appspot.com",
    messagingSenderId: "808985783099",
    appId: "1:808985783099:web:ccbde829b0de00592b251e",
    measurementId: "G-FGHQXHMDV4"
};


const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const db = admin.firestore()

//retrieve messages
app.get('/messages', (req, res)=> {
    db.collection('messages')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let msgs = []
        data.forEach(doc => {
            msgs.push({
                messageId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            })
        })
        return res.json(msgs)
    })
    .catch(err => console.error(err))
})

exports.api = functions.https.onRequest(app)

//create message
app.post(`/message`,(req,res) => {
    if(req.method !== 'POST'){
        return res.status(400).json({error: `Method not allowed`})
    }
    const newMsg = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt:  new Date().toISOString()
    }
    db
    .collection('messages')
    .add(newMsg)
    .then(doc => {
        return res.json({message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        res.status(500).json({error: `Something went wrong`})
        console.error(err)
    })
})

//signup route
app.post(`/signup`, (req, res)=> {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        Handle: req.body.Handle
    }
    //validate data
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({handle: `this handle is already taken`})
        } else{
            return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        return data.user.getIdToken()
    })
    .then(token => {
        return res.status(201).json({token})
    })
    .catch(err => {
        console.error(err)
        return res.stauts(500).json({error: err.code})
    })
})