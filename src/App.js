import React, { useState } from 'react';
import {clear} from "@testing-library/user-event/dist/clear";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const surpriseOptions = [
    'What are the must-visit attractions in Marrakech?',
    'What are the best places to try authentic Moroccan cuisine?',
    'What\'s the best way to navigate the souks (markets) in Marrakech?'
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
     setChatHistory(oldChatHistory => [...oldChatHistory,{
        role: "user",
       parts : value

     },
       {
         role: "model",
         parts : data


       }


     ])
    setValue("")
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };
 const clear = () => {
  setValue("")
   setError("")
   setChatHistory([])


  }
  return (
      <div className="app">
        <section className="search-section">
          <p>What do you want to know?
            <button className="surprise" onClick={surprise} disabled={!chatHistory}> Surprise me</button>
          </p>
          <div className="input-container">
            <input
                value={value}
                placeholder="Marrakech best restaurants...?"
                onChange={(e) => setValue(e.target.value)}
            />
            {!error && <button onClick={getResponse}>Ask me</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="search-result">
            {chatHistory.map((chatItem, _index) => <div key={_index}>|
              <p className="answer">{chatItem.role}:{chatItem.parts}</p>
            </div>)}
          </div>
        </section>
      </div>
  );
};

export default App;


