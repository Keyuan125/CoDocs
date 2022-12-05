import React, { useEffect, useRef, useCallback} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"


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
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        
        // Reset the page to make sure it is empty before rendering
        wrapper.innerHTML = ''
        const editor = document.createElement("div")
        wrapper.append(editor)
        new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}})
    }, [])
  return (
    <div className="container" ref={wrapperRef}></div>
  )
}
