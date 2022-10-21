import './style.css'

// select elements from dom
const noteInput = document.getElementById('note-input')
const addNoteButton = document.getElementById('add-note-button')
const notesDisplay = document.getElementById('notes-display')

//global variables
let currentNote = ''
let notes = []

// getter functions
const getNotesFromStorage = () => {
    const storage = localStorage.getItem('notes')
    if (storage) {
        notes = JSON.parse(storage)
        notes.forEach(note => {
            const element = addPTag({ id: note.id, innerText: note.text, prepend: true }, notesDisplay)
            element.innerHTML = !note.checked ? note.text : note.text.strike()
        })
    }
}

const getNoteConfig = () => {
    return {
        id: Date.now(),
        innerText: currentNote,
        text: currentNote,
        prepend: true,
        checked: false
    }
}

// setter functions
const setLocationStorage = (key, value) => {
    localStorage.setItem(key, value)
}

const setCurrentNote = (value) => {
    currentNote = value
    noteInput.value = value
}

// methods
const addPTag = (config, target) => {
    const pTag = document.createElement('p')
    pTag.innerText = config.innerText
    pTag.id = config.id
    pTag.addEventListener('click', checkNote)
    pTag.addEventListener('dblclick', removeNote)

    config.prepend ? target.prepend(pTag) : target.appendChild(pTag)
    return pTag
}

const addNote = () => {
    if (currentNote) {
        const noteConfig = getNoteConfig()
        addPTag(noteConfig, notesDisplay)
        notes.push(noteConfig)
        setLocationStorage('notes', JSON.stringify(notes))
        setCurrentNote('')
    }
    noteInput.focus()
}

// event function
const removeNote = (event) => {
    const element = event.target
    notesDisplay.removeChild(element)
    notes = notes.filter(note => note.id !== Number(element.id))
    setLocationStorage('notes', JSON.stringify(notes))
}

const checkNote = (event) => {
    const element = event.target
    notes.forEach(note => {
        if (note.id === Number(element.id)) {
            document.getElementById(note.id).innerHTML = note.checked ? note.text : note.text.strike()
            note.checked = !note.checked
        }
    })
    setLocationStorage('notes', JSON.stringify(notes))
}

// set event listeners
addNoteButton.addEventListener('click', addNote)
noteInput.addEventListener('change', addNote)
noteInput.addEventListener('input', (event) => { setCurrentNote(event.target.value) })

// main
getNotesFromStorage()
noteInput.focus()