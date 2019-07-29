const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('couldn\'t connect to db');
    }

    const db = client.db(databaseName);
    db.collection('users').insertMany([{
        name: 'Shubham',
        age: 18
    }, {
        name: 'Piyush',
        age: 20
    }], (error, result) => {
        if(error) {
            return console.log('unable to inster record');
        }
        console.log(result.ops);
    });
});

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('unable to connect to database');
    }

    const db = client.db(databaseName)
    db.collection('tasks').insertMany([{
        description: "homework",
        completed: true
    }, {
        description: "project",
        completed: true
    }, {
        description: "lab work",
        completed: false
    }], (error, result) => {
        if(error) {
            console.log('unable to insert document');
        }

        console.log(result.ops);
    });
});

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to mongoDB');
    }

    const db = client.db(databaseName);
    db.collection('tasks').findOne({_id: new ObjectID("5d147a5654f8a32d574ffea4")}, (error, user) => {
        if(error) {
            console.log('error');
        }

        console.log(user);
    });

    db.collection('tasks').find({ completed: true }).toArray((error, tasks) => {
        if(error) {
            console.log(error);
        }

        console.log(tasks);
    });
});

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => { 
    if(error) {
        return console.log('unable to connect to mongoDB');
    }

    const db = client.db(databaseName);
    db.collection('tasks').updateMany({ 
        completed: false 
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
});

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        return console.log('unable to connect to mongoDB');
    }

    const db = client.db(databaseName);
    db.collection('users').deleteOne({
        name: 'Piyush'
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
});