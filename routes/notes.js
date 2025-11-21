import { Router } from 'express';
const router = Router();
import fetchuser from '../middleware/fetchuser.js';
import { body, validationResult } from 'express-validator';

const validate = validations => {
  return async (req, res, next) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      await validation.run(req);
    }
    next();
  };
};
router.get('/fetchnote',fetchuser,async (req,res)=>{
    try {
        const note  = await find({user:req.user.id});
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
    
})

router.post('/addnote',fetchuser,validate([
  body('title', 'Title cannot be less than 3 characters').isLength({ 'min': 3 }),
  body('description', 'description cannot be less than 5 characters').isLength({ 'min': 5 }),
]),async (req,res)=>{
    try {
        const {title,description,tags} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const note = new note({
            title,description,tags,user: req.user.id
        })
        const savednote = await note.save()
        res.json(savednote)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
})

router.put('/updatenote/:id',fetchuser,async (req,res)=>{
  try {
    const {title,description,tags} = req.body;
    const newNote = {};
    if(title){newNote.title = title;}
    if(description){newNote.description = description;}
    if(tags){newNote.tags = tags;}
    let note = await findById(req.params.id);
    if(!note){
      return res.status(404).send('Not Found');
    }
    if(note.user.toString() !== req.user.id){
      return res.status(401).send('Not Allowed');
    }
    note = await findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
    res.json(note);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
})

router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
  try {
    let note = await findById(req.params.id);
    if(!note){
        return res.status(404).send('Not Found');
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send('Not Allowed');
    }
    
    await findByIdAndDelete(req.params.id);
    res.send("Note deleted");
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
  
})

export default router;