import React, { useState, useEffect } from 'react';
import { getAbsoluteCharacterCoordinates } from './charcord.js';

function getKeyByValue(obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}

const searchKey="syntax";
function convertArrToKeyPair(data,defaultValue,keyDeep){
  return Object.keys(data).reduce((obj, key) => {
    obj[key]=keyDeep ? data[key][keyDeep] : defaultValue;
    return obj;
}, {});
}
const TextSuggestionDropdown = ({SuggData}) => {
  const initialSuggStats=convertArrToKeyPair(SuggData,false);
  const initialSuggData=convertArrToKeyPair(SuggData,null,'data');
  const shortCutKeySetup=convertArrToKeyPair(SuggData,null,'shortCutKey');
  const [showSuggestions, setShowSuggestions] = useState(initialSuggStats);
  const [suggData,setSuggData]=useState(initialSuggData);
  const [value, setValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [suggestions, setSuggestions] = useState([]);
  const [currentWord, setCurrentWord] = useState('');

  const textareaRef = React.createRef();
  const [crDetails,setCrDetails]=useState('');
  const handleChange = (event) => {
    // Setting Cursor Position
    const textarea = textareaRef.current;
    const cursorPosition = getAbsoluteCharacterCoordinates(
      textarea,
      textarea.selectionEnd
    );
    setCursorPosition(cursorPosition);
    // Searching And Setting Value
    const inputValue = event.target.value;
    setValue(inputValue);
    // Extract the current word based on the cursor position
    const replacedValue=inputValue.replaceAll("\n"," ");
    const caretPosition = textareaRef.current.selectionEnd;
    const startOfWord = replacedValue.lastIndexOf(' ', caretPosition - 1) + 1;
    const endOfWord = replacedValue.indexOf(' ', caretPosition);
    const currentWord = replacedValue.slice(startOfWord, endOfWord === -1 ? undefined : endOfWord);
    setCrDetails(JSON.stringify({replacedValue,currentWord,caretPosition,startOfWord,endOfWord}))
    setCurrentWord(currentWord);
    // Filter suggestions based on the current word
    const activSuggKey=getKeyByValue(showSuggestions,true); // Suggestion Key For Showing List
    if (currentWord.length && activSuggKey) {
      const filteredSuggestions = suggData[activSuggKey].filter((suggestion) =>
        suggestion[searchKey].toLowerCase().includes(currentWord.toLowerCase())
      );
      console.log('activSuggKey',activSuggKey,suggData[activSuggKey],filteredSuggestions);
      setSuggestions(filteredSuggestions);
    } else {
      setShowSuggestions(initialSuggStats);
      setSuggestions([]);
    }
  };
   function RegxEscape(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  const handleSuggestionClick = (suggestion) => {
    // Replace the current word with the selected suggestion
    const escapedWord=RegxEscape(currentWord);
    const newInputValue = value.replace(
      new RegExp(escapedWord + '$'),
      suggestion
    );
    setValue(newInputValue);
    setShowSuggestions(initialSuggStats);
  };

  const handleKeyDown = (event) => {
    const textarea = textareaRef.current;
    const cursorPosition = getAbsoluteCharacterCoordinates(
      textarea,
      textarea.selectionEnd
    );
    setCursorPosition(cursorPosition);
    if (event.ctrlKey && Object.values(shortCutKeySetup).includes(event.key)) {
      setShowSuggestions({...initialSuggStats ,[getKeyByValue(shortCutKeySetup,event.key)]:true});
      event.preventDefault(); // Prevent the default find behavior in browsers
    } else if (event.key === 'Escape' && showSuggestions) {
      setShowSuggestions(initialSuggStats);
    }
  };

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'Escape' && showSuggestions) {
        setShowSuggestions(initialSuggStats);
      }
    };
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [showSuggestions]);

  return (
    <div className="suggestion-container" style={{ position: 'relative' }}>
      <h4>Press CTRL+{shortCutKeySetup['functions']} to get Suggested Functions : {showSuggestions.functions ? 'true':'false'}</h4>
      <h4>Press CTRL+{shortCutKeySetup['operators']} to get Suggested Operators : {showSuggestions.operators ? 'true':'false'}</h4>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type here..."
      />
      Suggestion Length : {suggestions.length},{showSuggestions ? 'true':'false'},<br/> Details : {crDetails}
      {suggestions.length > 0 && (showSuggestions.operators || showSuggestions.functions) &&(
        <ul
          className="suggestion-list"
          style={{
            position: 'absolute',
            top: cursorPosition.top, // Adjust the vertical position as needed
            left: cursorPosition.left,
            zIndex: 200,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion[searchKey])}>
              {suggestion[searchKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextSuggestionDropdown;
