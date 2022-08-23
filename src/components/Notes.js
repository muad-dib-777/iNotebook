import React, { useContext, useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from '../context/notes/noteContext'
import { AddNote } from './AddNote'
import { NoteItem } from './NoteItem'

export const Notes = (props) => {

  let navigate = useNavigate()

  const context = useContext(noteContext)
  const {notes, getAllNotes, addNote, editNote} = context
  const [note, setNote] = useState({"id":"","etitle": "", "edescription":""})
  const ref = useRef(null)
  const refClose = useRef(null)
  
  useEffect(() => {
    
    let token = localStorage.getItem('token')
    if(token)
    {
      getAllNotes()
      console.log(token)
    }
    else
    {
      navigate("/login")
    }

  }, [])

  const updateNote = (currentNote) => {

    ref.current.click()
    
    setNote({id: currentNote._id, etitle:currentNote.title, edescription: currentNote.description})
    

    

    
    
  }

  const handleChange = (e) => {

    setNote({...note, [e.target.name]: e.target.value})

  }

  const handleClick = (e) => {

    /* console.log(note) */
    editNote(note.id, note.etitle, note.edescription)
    refClose.current.click()
    props.showAlert("Note edited successfully", "success")
   

  }

   
  

  return (

    <>
          
      <button type="button" ref = {ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      
      <div className="modal fade" id="exampleModal"  tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Update the note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                  <form>
                  <div className="mb-3">
                    <label htmlFor="etitle" className="form-label">Title</label>
                    <input type="text" className="form-control" id="etitle" value = {note.etitle} name = "etitle" aria-describedby="emailHelp" onChange={handleChange} />

                  </div>
                  <div className="mb-3">
                    <label htmlFor="edescription" className="form-label">Description</label>
                    <input type="text" name = "edescription" className="form-control" value = {note.edescription} id="edescription" onChange={handleChange}/>
                  </div>
                  
                  
                </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref = {refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled = {note.etitle.length === 0 || note.edescription.length === 0}  className="btn btn-primary" onClick = {handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>


    <AddNote showAlert = {props.showAlert} />



    
    <div className="row my-3">
        
        <h2>Your notes</h2>
        <div className = "container mx-2">
            {notes.length === 0 && "No notes to display"}
        </div>
        {notes.map((note)=> {

          return <NoteItem key = {note._id} updateNote = {updateNote} note = {note} showAlert = {props.showAlert} />
        })}
    </div>
    </>
    
  )
}
