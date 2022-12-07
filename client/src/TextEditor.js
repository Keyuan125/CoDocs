import React, { useEffect, useRef, useCallback, useState} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from "react-router-dom"


const SAVE_INTERVAL_MS = 2000

// Add some text option to the quill toolbars (feel free to change any of this)
// Some option has default values with the theme "snow", so we can leave them empty
const TOOLBAR_OPTIONS = [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{font: []}],
    [{list: "ordered"}, { list: "bullet"}],
    ["bold", "italic", "underline"],
    [{color: []}, { background:[] }],
    [{ script: "sub"}, {script: "super"}],
    [{align: []}],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
     // rename id to documentId
    const { id: documentId } = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    
    useEffect(() => {
        // server url
        const s = io("http://localhost:3001")
        setSocket(s)

        return () => {
            s.disconnect()
        } 
    }, [])


    useEffect(() => {
        if (socket == null || quill == null) return
        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    }, [socket, quill]) 



    useEffect(() => {
        if (socket == null || quill == null) return

        // listen to event
        socket.once("load-document", document => {
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document', documentId)
    }, [socket, quill, documentId])


    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta, oldDelte, source) => {
            if (source !== 'user') return
            socket.emit("send-changes", delta)
        }
        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null) return
        
        const handler = delta => {
            quill.updateContents(delta)
        }
        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])


    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        
        // Reset the page to make sure it is empty before rendering
        wrapper.innerHTML = ''
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
        q.disable()
        q.setText("loading...")
        setQuill(q)
    }, [])
  return (
    <div className="container" ref={wrapperRef}></div>
  )
}
