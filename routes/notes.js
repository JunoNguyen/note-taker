const notes = require('express').Router();

const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');   

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:title', (req, res) => {
    const noteId = req.params.title;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.title === noteId);
            return result.length > 0
                ? res.json(result)
                : res.json('No Note with that Title')
        });
});

notes.delete('/:title', (req, res) => {
    const noteId = req.params.title;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.title !== noteId);
       
        writeToFile('./db/db.json', result);
  
        res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added`);
    } else {
      res.error('Error in adding note');
    }
});

module.exports = notes;



