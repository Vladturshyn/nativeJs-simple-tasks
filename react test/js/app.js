const DEFAULT_COLOR = 'yellow';

const Note = React.createClass({
    handleDelete(){
        this.props.onDelete(this.props.id);
    },
    render() {
        const { text,
                color,
                onDelete,
                    } = this.props;
        return (
            <div className="note">
            <span className="note__delete-icon" onClick={this.handleDelete}> × </span>
                { text }
            </div>
        );
    }
});
const NoteEditor = React.createClass({
    getInitialState(){
        return{
            text: ''
        }
    },

   handleTextChange(evt){
       this.setState({
           text: evt.target.value
       })
   },

    handleNoteAdd(){
            const newNote = {
                text: this.state.text,
                id: Date.now(),
                color: DEFAULT_COLOR
            }
        this.props.onNoteAdd(newNote);
        this.resetState();
    },
    resetState(){
        this.setState({
            text: ''
        });
    },

    render(){
        return (
            <div className="editor">
                <textarea
                    placeholder="Enter your note..."
                    row={5}
                    value={this.state.text}
                    onChange={this.handleTextChange}
                    className="editor__textarea"
                />
                <button onClick={this.handleNoteAdd}
                        className="editor__button"
                        disabled={!this.state.text}
                        > ADD </button>
            </div>
        );
    }
});
const NoteGrid = React.createClass({
    componentDidMount(){
        this.msnry = new Masonry(this.grid,{
            columnWidth: 240,
            gutter: 10,
            isFitWidth: true
        });
    },
    componentDidUpdate(prevProps) {
        if(prevProps.notes !== this.props.notes){
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render(){
        const { notes,
                onNoteDelete } = this.props;
        return(
            <div className="grid" ref={c => this.grid = c}>
                    {
                        notes.map(note =>
                                <Note 
                                    key={note.id}
                                    id={note.id}
                                    text={note.text}
                                    color={notes.color}
                                    onDelete={() => onNoteDelete(note.id)}
                                />
                        )
                    }
            </div>
        );
    }
});

const NoteApp = React.createClass({
    getInitialState(){
        return {
            notes : []
        };
    },
    componentDidMount(){
        const savedNotes = JSON.parse(localStorage.getItem('notes'));

        this.setState({
                notes: savedNotes
        })
    },
    componentDidUpdate(prevProps, prevState){
        if(prevState.notes !== this.state.notes){
        this.saveToLocalStorage(); 
        }
    },
    handleNoteAdd(newNote){
        this.setState({
            notes: [newNote, ...this.state.notes]
        });
    },
    handleNoteDelete(noteId){
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    },
    saveToLocalStorage(){
        const notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
        
    },

    render(){
        return(
            <div className="app">
                <h2 className="app__header">Note App</h2>

                <NoteEditor onNoteAdd={this.handleNoteAdd}/>
                <NoteGrid 
                    notes={this.state.notes}
                    onNoteDelete={this.handleNoteDelete}
                 />
            </div>
        );
    }
});

ReactDOM.render(
    <NoteApp />,
    document.getElementById('root')
);