const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

//ROUTE 1 - Get all notes GET /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req,res) => {

    try {

        const notes = await Notes.find({user: req.user.id})
        
        res.json(notes)
        
    } catch (error) {

        console.error(error.message)
        res.status(500).send("Internal server error occurred")
        
    }
    
})

//ROUTE 2 - Add a note POST /api/notes/addnote - Login required
router.post('/addnote', fetchuser, async (req,res) => {

    try {

        const {title, description} = req.body

        let note = await Notes.create({
            title, description, user: req.user.id
        })

        const savedNote = await note.save()
        res.json(savedNote)
        
    } catch (error) {
        
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }

    
})

//Route 3 - Update note PUT /api/notes/updatenote - login required

router.put('/updatenote/:id', fetchuser, async (req,res) => {

    try {

        const {title, description} = req.body
        let newNote = {}

        if(title){

            newNote.title = title
        }
        if(description){

            newNote.description = description
        }

        let note = await Notes.findById(req.params.id)

        if(!note){

            return res.status(404).send("Not found")
        }

        if(note.user.toString() !== req.user.id){

            return res.status(401).send("Action not allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json(note)

        
    } catch (error) {
        
        
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }
})


//Route 4 - Delete note DELETE /api/notes/deletenote - login required


router.delete('/deletenote/:id', fetchuser, async (req,res) => {

    try {
 

        let note = await Notes.findById(req.params.id)

        if(!note){

            return res.status(404).send("Not found")
        }

        if(note.user.toString() !== req.user.id){

            return res.status(401).send("Action not allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json("Success, note has been deleted")

        
    } catch (error) {
        
        
        console.error(error.message)
        res.status(500).send("Internal server error occurred")
    }

    
})

module.exports = router