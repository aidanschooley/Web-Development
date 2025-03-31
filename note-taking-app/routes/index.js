var express = require('express');
const fs = require('fs');
var router = express.Router();


/* GET home page. */
// function readDataFromFile() {
//   try {
//     const rawData = fs.readFileSync('data.json', 'utf8');
//     return JSON.parse(rawData); // return Parsed JSON data
//   } catch (error) {
//     console.error('Error reading or parsing data.json:', error);
//     return []; // Return an empty array if there's an error
//   }
// }

router.get('/', function(req, res, next) {
  try {
    const rawData = fs.readFileSync('data.json', 'utf8'); // Read file content
    const noteData = JSON.parse(rawData); // Parse JSON data
    noteData.sort((a, b) => {
      return b.star - a.star; // Sort true values first
    });
    res.render('index', { title: "Home", data: noteData }); // Pass the data to view
  } catch (error) {
    console.error('Error reading or parsing data.json:', error);
    res.status(500).send('Error reading or parsing the JSON file');
  }
  // const noteData = [
  //   { title: 'Note 1', note: 'This is the first note', time: '2025-03-25' },
  //   { title: 'Note 2', note: 'This is the second note', time: '2025-03-26' }
  // ];
});


router.get('/addNote', function(req, res, next) {
  res.render('addNote', {title: 'Add Note'});
});

router.get('/updateNote/:id', function(req, res, next) {
  const noteId = parseInt(req.params.id);
  const fileData = fs.readFileSync('data.json', 'utf-8');
  const notes = JSON.parse(fileData);
  const note = notes.find(n => n.id === noteId);
  console.log("Rendering note:", note); 

  res.render('updateNote', { title: "Update Contact", note});
});

router.post('/search', (req, res)=>{
  const search = req.body.search;
  console.log(search)
  const fileData = fs.readFileSync('data.json', 'utf-8');
  const notes = JSON.parse(fileData);

   const newNote = notes.filter(item => 
    (item.title && item.title.toLowerCase().includes(search)) || 
    (item.note && item.note.toLowerCase().includes(search))
  );
  console.log(newNote);
  fs.writeFileSync("search.json", JSON.stringify(newNote, null, 2), 'utf-8');
  res.redirect('/search')
});

router.get('/search', (req, res)=>{
  try {
    const rawData = fs.readFileSync('search.json', 'utf8'); // Read file content
    const noteData = JSON.parse(rawData); // Parse JSON data
    noteData.sort((a, b) => {
      return b.star - a.star; // Sort true values first
    });
    res.render('index', { title: "Home", data: noteData }); // Pass the data to view
  } catch (error) {
    console.error('Error reading or parsing data.json:', error);
    res.status(500).send('Error reading or parsing the JSON file');
  }

});

router.post('/star/:id', (req, res)=>{
  const noteID = parseInt(req.params.id);
  try {
    // Read the existing data
    const fileData = fs.readFileSync('data.json', 'utf-8');
  
    // Parse the data
    const jsonData = JSON.parse(fileData);
  
    const noteIndex = jsonData.findIndex(n => n.id === noteID);
    
    //update info
    if(jsonData[noteIndex].star== true){
      jsonData[noteIndex].star = false;
    } else{
    jsonData[noteIndex].star = true;
    }
    // Write the data back to the file
    fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error appending to JSON file:', error);
  }

  res.redirect('/')
});

router.post('/addNote', (req, res) => {
//getting data from form
  const title = req.body.title;

  const note = req.body.note;
  const color= req.body.color;
  const star = req.body.star === "on";
  // const bigtime = Date();
  // console.log(bigtime);
  // const time= bigtime.substring(0,23)

  // time = time.getDate();
  // console.log(time)


  const newData = {id: Date.now(), title:title, note: note, color:color, star: star, createdtime: Date().substring(0,24), updatedtime:Date().substring(0,24)};
  console.log('Received data:', newData);
//writing data to Json file
try {
  // Read the existing data
  const fileData = fs.readFileSync('data.json', 'utf-8');

  // Parse the data
  const jsonData = JSON.parse(fileData);

  // Append new data
  jsonData.push(newData);

  // Stringify the data
  const updatedJsonData = JSON.stringify(jsonData, null, 2);

  // Write the data back to the file
  fs.writeFileSync('data.json', updatedJsonData, 'utf-8');
} catch (error) {
  console.error('Error appending to JSON file:', error);
}
res.redirect('/')
});

router.post('/deleteNote/:id', (req, res) => {
  const noteID = parseInt(req.params.id);

  try {
      // Read and parse existing data
      const fileData = fs.readFileSync("data.json", 'utf-8');
      let jsonData = JSON.parse(fileData);

      // Filter out the note that matches the given ID
      const newJsonData = jsonData.filter(n => n.id !== noteID);

      // Write updated data back to file
      fs.writeFileSync("data.json", JSON.stringify(newJsonData, null, 2), 'utf-8');

      // Redirect back to homepage
      return res.redirect('/');
  } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).send("Internal Server Error");
  }
});

router.post('/updateNote/:id', (req, res) => {
  const noteID = parseInt(req.params.id);
  //getting data from form
    const title = req.body.title;
    const note = req.body.note;
    const color = req.body.color;
    const updatedtime= Date().substring(0,24);

  //writing data to Json file
  try {
    // Read the existing data
    const fileData = fs.readFileSync('data.json', 'utf-8');
  
    // Parse the data
    const jsonData = JSON.parse(fileData);
  
    const noteIndex = jsonData.findIndex(n => n.id === noteID);
    
    //update info
    jsonData[noteIndex].title = title;
    jsonData[noteIndex].note = note;
    jsonData[noteIndex].color = color;
    jsonData[noteIndex].updatedtime = updatedtime
    // Write the data back to the file
    fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error appending to JSON file:', error);
  }

  res.redirect('/')
  });
module.exports = router;
