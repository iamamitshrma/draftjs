import React, { useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  SelectionState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  'REDCOLOR': {
    color: 'red',
  },
  'UNDERLINE': {
    'text-decoration': "underline"
  },
  'BOLD': {
    'font-weight': "bold"
  }
};

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const myKeyBindingFn = (e) => {
    if (e.keyCode === 9) {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const currentBlock = contentState.getBlockForKey(selection.getStartKey());
      const blockType = currentBlock.getType();
      const text = currentBlock.getText();
      
      if (text.startsWith("# ")) {
        let updatedText1 = String(text).replace("# ", "");
        const selection = SelectionState.createEmpty(currentBlock.getKey()).merge({
          anchorOffset: 0,
          focusOffset: 2,
        });
        const newContentState = Modifier.removeRange(contentState, selection, 'backward');
        const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
        setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
        return "handled";
      } else if (text.startsWith("* ")) {
        const selectionState = SelectionState.createEmpty(
          currentBlock.getKey()
        ).merge({
          anchorOffset: 0,
          focusOffset: text.length,
        });
        const nextContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState,
          "BOLD"
        );
        setEditorState(EditorState.push(editorState, nextContentState));
        return "handled";
      } else if (text.startsWith("** ")) {
        const selectionState = SelectionState.createEmpty(
          currentBlock.getKey()
        ).merge({
          anchorOffset: 0,
          focusOffset: text.length,
        });
        const nextContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState,
          "REDCOLOR"
        );
        setEditorState(EditorState.push(editorState, nextContentState));
        return "handled";
      } else if (text.startsWith("*** ")) {
        const selectionState = SelectionState.createEmpty(
          currentBlock.getKey()
        ).merge({
          anchorOffset: 0,
          focusOffset: text.length,
        });
        const nextContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState,
          "UNDERLINE"
        );
        setEditorState(EditorState.push(editorState, nextContentState));
        return "handled";
      }
    }
    return getDefaultKeyBinding(e);
  };

  const onChange = (editorState) => {
    setEditorState(editorState);
  };

  const saveHandler = () => {
    var contentRaw = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem('draftRaw', JSON.stringify(contentRaw));
  }


  useEffect(() => {
    const storeRaw = localStorage.getItem('draftRaw');
    if (storeRaw) {
      const rawContentFromStore = convertFromRaw(JSON.parse(storeRaw));
      setEditorState(EditorState.createWithContent(rawContentFromStore));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [])

  return (
    <div>
      <div className="top-container">
        <span style={{width: "20%"}}>Note: Only work in single line and change with tab key</span>
        <h3 className="heading">Demo Editor by Amit Sharma</h3>
        <button  style={{width: "10%"}} onClick={saveHandler} className="btn">Save</button>
      </div>
      <Editor
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={onChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={myKeyBindingFn}
      />
    </div>
  );
};

export default MyEditor;
