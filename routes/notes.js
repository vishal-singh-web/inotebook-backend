import { Router } from 'express';
const router = Router();
import fetchuser from '../middleware/fetchuser.js';
import { body, validationResult } from 'express-validator';
import Notes from '../models/Notes.js'; // Import the Notes mongoose model

const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    next();
  };
};

// Fetch all notes for the logged-in user
router.get('/fetchnote', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id }); // Use Notes.find
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new note
router.post('/addnote', fetchuser, validate([
  body('title', 'Title cannot be less than 3 characters').isLength({ min: 3 }),
  body('description', 'Description cannot be less than 5 characters').isLength({ min: 5 }),
]), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({ // Use Notes, not new note
      title,
      description,
      tags,
      user: req.user.id
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tags) newNote.tags = tags;

    let note = await Notes.findById(req.params.id); // Use Notes.findById
    if (!note) {
      return res.status(404).send('Not Found');
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }); // Use Notes.findByIdAndUpdate
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id); // Use Notes.findById
    if (!note) {
      return res.status(404).send('Not Found');
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    await Notes.findByIdAndDelete(req.params.id); // Use Notes.findByIdAndDelete
    res.send("Note deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
