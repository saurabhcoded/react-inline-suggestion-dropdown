import React, { useState, useEffect } from 'react';
import { getAbsoluteCharacterCoordinates } from './charcord.js';
const initialSuggStats={
  constants:false,
  functions:false
}
const initialSuggData={
    constants: [
      {"id": "constant-sum-two-cells-1", "name": "Total Sales", "syntax": "=SUM(A2:A10, C2:C10)"},
      {"id": "constant-average-values-2", "name": "Average Scores", "syntax": "=AVERAGE(B1:B5, D1:D5)"},
      {"id": "constant-count-entries-3", "name": "Number of Records", "syntax": "=COUNT(E1:E20, F1:F20)"},
      {"id": "constant-maximum-values-4", "name": "Max Temperature", "syntax": "=MAX(G1:G15, H1:H15)"},
      {"id": "constant-minimum-values-5", "name": "Min Temperature", "syntax": "=MIN(I1:I8, J1:J8)"},
      {"id": "constant-if-condition-6", "name": "Pass/Fail Status", "syntax": "=IF(K1:K3, L1:L3, M1:M3)"},
      {"id": "constant-vlookup-7", "name": "Lookup Result", "syntax": "=VLOOKUP(N1:N10, O1:P10, 2, FALSE)"},
      {"id": "constant-hlookup-8", "name": "Horizontal Lookup", "syntax": "=HLOOKUP(Q1:Q8, R1:R8, 3, FALSE)"}
    ],
    functions:[
      {"id": "function-index-match-9", "name": "Data Lookup", "syntax": "=INDEX(S1:S5, MATCH(T1, U1:U5, 0))"},
      {"id": "function-sum-multiple-ranges-10", "name": "Total Revenue", "syntax": "=SUM(V1:V15, W1:W15)"},
      {"id": "function-average-multiple-ranges-11", "name": "Average Prices", "syntax": "=AVERAGE(X1:X5, Y1:Y5)"},
      {"id": "function-count-large-dataset-12", "name": "Total Records", "syntax": "=COUNT(Z1:Z20, AA1:AA20)"},
      {"id": "function-maximum-sales-13", "name": "Max Sales", "syntax": "=MAX(AB1:AB15, AC1:AC15)"},
      {"id": "function-minimum-expenses-14", "name": "Min Expenses", "syntax": "=MIN(AD1:AD8, AE1:AE8)"},
      {"id": "function-if-complex-condition-15", "name": "Complex Decision", "syntax": "=IF(AF1:AF3, AG1:AG3, AH1:AH3)"},
      {"id": "function-vlookup-large-dataset-16", "name": "Lookup Result", "syntax": "=VLOOKUP(AI1:AI10, AJ1:AK10, 2, FALSE)"},
      {"id": "function-hlookup-large-dataset-17", "name": "Horizontal Lookup", "syntax": "=HLOOKUP(AL1:AL8, AM1:AM8, 3, FALSE)"},
      {"id": "function-index-match-complex-18", "name": "Advanced Lookup", "syntax": "=INDEX(AN1:AN5, MATCH(AO1, AP1:AP5, 0))"},
      {"id": "function-sum-multiple-ranges-19", "name": "Total Profit", "syntax": "=SUM(AQ1:AQ15, AR1:AR15)"},
      {"id": "function-average-multiple-ranges-20", "name": "Average Costs", "syntax": "=AVERAGE(AS1:AS5, AT1:AT5)"}
    ]
}
const TextSuggestionDropdown = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [currentWord, setCurrentWord] = useState('');

  const suggestionData = [
    '=SUM(A2:A10)',
    '=SUM(A2:A10, C2:C10)',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
  ];
  const textareaRef = React.createRef();

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    // Extract the current word based on the cursor position
    const caretPosition = textareaRef.current.selectionEnd;
    const startOfWord = inputValue.lastIndexOf(' ', caretPosition - 1) + 1;
    const endOfWord = inputValue.indexOf(' ', casetShowSuggestions
      endOfWord === -1 ? undefined : endOfWord
    );
    setCurrentWord(currentWord);
    // Filter suggestions based on the current word
    if (currentWord.length) {
      const filteredSuggestions = suggestionData.filter((suggestion) =>
        suggestion.toLowerCase().includes(currentWord.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Replace the current word with the selected suggestion
    const newInputValue = value.replace(
      new RegExp(currentWord + '$'),
      suggestion
    );
    setValue(newInputValue);
    setShowSuggestions(false);
  };

  const handleKeyDown = (event) => {
    const textarea = textareaRef.current;
    const cursorPosition = getAbsoluteCharacterCoordinates(
      textarea,
      textarea.selectionEnd
    );
    setCursorPosition(cursorPosition);
    if (event.ctrlKey && event.key === 'f') {
      setShowSuggestions(true);
      event.preventDefault(); // Prevent the default find behavior in browsers
    } else if (event.key === 'Escape' && showSuggestions) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [showSuggestions]);

  return (
    <div className="suggestion-container" style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type here..."
      />
      {suggestions.length}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="suggestion-list"
          style={{
            position: 'absolute',
            top: cursorPosition.top - 30, // Adjust the vertical position as needed
            left: cursorPosition.left - 50,
            zIndex: 9999,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextSuggestionDropdown;
