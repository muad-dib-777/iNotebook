import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {

    let host = "http://localhost:5000"
    const notesInitial = []
    
      const [notes, setNotes] = useState(notesInitial)


      //Add a note

      const addNote = async (title, description) => {

        let url = `${host}/api/notes/addnote`

        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.

          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title,description}) 
        });

        const json =await  response.json();
        

        setNotes(notes.concat(json))

      }


      
      //Get all notes
      const getAllNotes = async () => {

        let url = `${host}/api/notes/fetchallnotes`
        let token = localStorage.getItem('token')
        console.log(token)

        const response = await fetch(url, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.

          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
           },
        });

        

        const json = await response.json();
        console.log(json)
        
        setNotes(json)

        

        

      }


      //Edit a note

      const editNote = async (id, title, description) => {

        
        let url = `${host}/api/notes/updatenote/${id}`
       

        const response = await fetch(url, {
          method: 'PUT', // *GET, POST, PUT, DELETE, etc.

          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title,description}) 
        });

       /*  const json = await response.json(); */
        

        let newNotes = JSON.parse(JSON.stringify(notes))

        for(let i = 0; i < newNotes.length; i++)
        {

          if(newNotes[i]._id === id)
          {
            newNotes[i].title = title;
            newNotes[i].description = description;
            break;
          }
        }

        setNotes(newNotes)
      }









      //Delete a note

      const deleteNote = async (id) => {

        let url = `${host}/api/notes/deletenote/${id}`

        const response = await fetch(url, {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.

          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
          },
          
        });

        
        const newNotes = notes.filter((note) => note._id !== id)
        
        setNotes(newNotes)

        

      }

    return (

        <NoteContext.Provider value = {{notes, setNotes, addNote, editNote, deleteNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState