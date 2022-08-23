import React, {useContext, useState} from 'react'
import noteContext from '../context/notes/noteContext'

export const AddNote = (props) => {

    const context = useContext(noteContext)
    const {addNote} = context
    const [note, setNote] = useState({"title": "", "description":""})

    const handleClick = (e) =>{
        e.preventDefault()

        if(note.title.length === 0 || note.description.length === 0){
          props.showAlert("Title and description cannot be blank", "danger")
          return;
        }

        
       
        addNote(note.title, note.description)
        setNote({"title": "", "description":""})
        props.showAlert("Note added successfully", "success")

    }

    const handleChange = (e) =>{

        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
    < div className="container my-3">
    
        <h2>Add a note</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" value = {note.title} id="title" name = "title" aria-describedby="emailHelp"  onChange={handleChange} required />

            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input type="text" name = "description" value = {note.description} className="form-control" id="description" onChange={handleChange}/>
            </div>
  
            <button type="submit"  className="btn btn-primary" onClick={handleClick}>Add Note</button>
          </form>
        </div>
  )
}
