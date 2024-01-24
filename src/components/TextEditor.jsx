import React, { useState, useEffect, useCallback } from 'react';
import { Editor, EditorState, Modifier, convertFromRaw, convertToRaw, RichUtils, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Button from './Button';
import Title from './Title';

//for the red color
const styleMap = {
    'RED': {
        color: 'red',
    },
};

const TextEditor = () => {

    const [editorState, setEditorState] = useState(() => {
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            const contentState = convertFromRaw(JSON.parse(savedContent));
            return EditorState.createWithContent(contentState);
        }
        return EditorState.createEmpty();
    });

    const onChange = useCallback((newEditorState) => {
        setEditorState(newEditorState);
    }, []);

    const handleKeyCommand = useCallback((command) => {
        let newState;

        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const block = content.getBlockForKey(selection.getStartKey());
        const blockText = block.getText();
        //for header
        if (blockText.startsWith('#') && command === 'toggle-heading') {
            const blockSelection = selection.merge({
                anchorOffset: 0,
                focusOffset: 1,
            });
            const newContent = Modifier.removeRange(content, blockSelection, 'forward');
            newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleBlockType(newState, 'header-one');
            //for bold
        } else if (blockText.startsWith('*') && command === 'toggle-bold') {
            const blockSelection = selection.merge({
                anchorOffset: 0,
                focusOffset: 1,
            });
            const newContent = Modifier.removeRange(content, blockSelection, 'forward');
            newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleInlineStyle(newState, 'BOLD');
            //for red color 
        } else if (blockText.startsWith('**') && command === 'color-red') {
            const blockSelection = selection.merge({
                anchorOffset: 0,
                focusOffset: 2,
            });
            const newContent = Modifier.removeRange(content, blockSelection, 'forward');
            newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleInlineStyle(newState, 'RED');
            //for underline
        } else if (blockText.startsWith('***') && command === 'underline') {
            const blockSelection = selection.merge({
                anchorOffset: 0,
                focusOffset: 3,
            });
            const newContent = Modifier.removeRange(content, blockSelection, 'forward');
            newState = EditorState.push(editorState, newContent, 'remove-range');
            newState = RichUtils.toggleInlineStyle(newState, 'UNDERLINE');
        }

        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';

    }, [editorState, onChange]);

    //commands
    const keyBindingFn = (e) => {
        if (e.key === ' ') {
            const selection = editorState.getSelection();
            const currentContent = editorState.getCurrentContent();
            const startKey = selection.getStartKey();
            const startOffset = selection.getStartOffset();
            const block = currentContent.getBlockForKey(startKey);
            const text = block.getText();

            if (startOffset === 1 && text.startsWith('#')) {
                return 'toggle-heading';
            }
            if (startOffset === 1 && text.startsWith('*')) {
                return 'toggle-bold';
            }
            if (startOffset === 2 && text.startsWith('**')) {
                return 'color-red';
            }
            if (startOffset === 3 && text.startsWith('***')) {
                return 'underline';
            }
        }

        return getDefaultKeyBinding(e);
    };

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const serializedContent = JSON.stringify(convertToRaw(contentState));
        localStorage.setItem('editorContent', serializedContent);
    }, [editorState]);

    return (
        <div className='container'>
            <div className='btn-div'>
                <Title />
                <Button editorState={editorState} />
            </div>
            <div className='editor'>
                <Editor
                    placeholder='Type Something.....'
                    customStyleMap={styleMap}
                    editorState={editorState}
                    onChange={onChange}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={keyBindingFn}
                />
            </div>
        </div>
    );
};

export default TextEditor;
