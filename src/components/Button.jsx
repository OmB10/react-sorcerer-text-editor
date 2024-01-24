import React from 'react'
import { convertToRaw } from 'draft-js';

const Button = ({ editorState }) => {
    const handleSave = () => {
        const contentState = editorState.getCurrentContent();
        const serializedContent = JSON.stringify(convertToRaw(contentState));
        localStorage.setItem('editorContent', serializedContent);
    };
    return (
        <div>
            <button className='btn' onClick={handleSave}>
                save
            </button>
        </div>
    )
}

export default Button