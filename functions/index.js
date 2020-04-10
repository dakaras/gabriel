const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const app = express()
admin.initializeApp()

app.get('/messages', (req, res)=> {
    admin.firestore().collection('messages')
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


app.post(`/message`,(req,res) => {
    if(req.method !== 'POST'){
        return res.status(400).json({error: `Method not allowed`})
    }
    const newMsg = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt:  new Date().toISOString()
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