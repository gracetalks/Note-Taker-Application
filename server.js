const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
const PORT = process.env.PORT || 4000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});


app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    console.log('req.body', newNote);
    var newId = uniqid();
    newNote.id = newId;
    
    fs.readFile('./db/db.json', (error, dataRes) => {
        if (error) throw error;
        let dbFile = JSON.parse(dataRes);
        console.log('dbFile', dbFile);
        dbFile.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(dbFile), "UTF-8", error => {
            if (error) throw error;
            console.log('New Note has been saved');
        })
    })
    res.redirect("/notes");
});

app.delete('/api/notes/:id', (req, res) => {
    let dataBase = fs.readFileSync(path.join(__dirname, './db/db.json'));
    let dbFile = JSON.parse(dataBase);
    let chosen = req.params.id;

    for(let i = 0; i < dbFile.length; i++) {
        if(dbFile[i].id.toString() === chosen) {
            dbFile.splice(i, 1);
            break;
        }
    }

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(dbFile));
    res.sendStatus(200);
})


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});