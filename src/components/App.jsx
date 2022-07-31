import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note"
import CreateArea from "./CreateArea";


function App(){

    const [notes, setNotes] = useState([]);

    const [isLoading, setIsLoading] = useState(true)

    const API_KEY = "https://keeper-app-68b32-default-rtdb.firebaseio.com/notes"

    useEffect( ()=>{
        async function getNotes(){
            try {
                const response = await axios.get(API_KEY + '.json')
                setIsLoading(false)
                const notes = []
                for(const key in response.data){
                    const note = {
                        id: key,
                        title: response.data[key].title,
                        content: response.data[key].content
                    }
                    notes.push(note)
                }
                setNotes(notes)
                
            } catch (error) {
                console.log(error)
            }
        }
        getNotes()
    }, [notes])


    async function handleClick(note){
        await axios.post(API_KEY + '.json', note)
    }

    async function deleteNote(id){
        await axios.delete(API_KEY + `/${id}.json`)
        setNotes(prevValue => {
            return prevValue.filter( (note) =>{
                return note.id !== id;
            } );
        });
    }

    return ( 
    <div>
        <Header />

        <CreateArea Add={handleClick} />
        <hr/>

        {!isLoading &&
            notes.map((note, index) => {
            return (<Note 
                key = {note.id}
                id = {note.id}
                title={note.title} 
                content= {note.content}
                Delete = {deleteNote}
            />)
       
            }
        )}
        
        {isLoading && <h4>Loading...</h4>}
        
        <Footer />
    </div>
    );
}

export default App