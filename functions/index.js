const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const app = express()
admin.initializeApp()

app.get('/messages', (req, res)=> {
    admin.firestore().collection('messages')
    .get()
    .then(data => {
        let msgs = []
        data.forEach(doc => {
            msgs.push(doc.data())
        })
        return res.json(msgs)
    })
    .catch(err => console.error(err))
})

exports.api = functions.https.onRequest(app)


exports.createMsg = functions.https.onRequest((req,res)=> {
    if(req.method !== 'POST'){
        return res.status(400).json({error: `Method not allowed`})
    }
    const newMsg = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    }
    admin.firestore()
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