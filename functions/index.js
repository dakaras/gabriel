const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});

exports.getMessages = functions.https.onRequest((req, res)=> {
    admin.firestore().collection('messages')
    .get()
    .then(data => {
        let msgs = []
        data.forEach(doc =>{
            msgs.push(doc.data())
        })
        return res.json(msgs)
    })
    .catch(err => console.error(err))
})

exports.createMsg = functions.https.onRequest((req,res)=> {
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
        res.status(500).json({error: `something went wrong`})
        console.error(err)
    })
})