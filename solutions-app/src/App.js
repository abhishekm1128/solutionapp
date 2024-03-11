import React, { useState } from "react";
import "./App.css";
import * as Unicons from "@iconscout/react-unicons";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [solutionsData, setSolutionsData] = useState(null);
  const [predictionsData, setPredictionsData] = useState(null);
  const [utterance, setUtterance] = useState("");
  const [error, setError] = useState(null);

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      setSolutionsData(null);
      setPredictionsData(null);
      callAPI();
    }
  };

  const callAPI = () => {
    // API endpoint URL
    const url = "https://api.example.com/endpoint";

    // Data to be sent in the POST request
    const data = { utterance: inputValue };

    // Options for the fetch POST request
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    };

    //MOCK Data
    let mock = {
      solution: ["Call", "Chat", "Appointment", "Website", "Youtube"],
      prediction: [
        {
          confidence: 0.6,
          label: "battery-replace"
        },
        {
          confidence: 0.2,
          label: "screen-replace"
        },
        {
          confidence: 0.3,
          label: "abc-replace"
        }
      ]
    };

    // Making the POST request
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("API Response:", data);
        // setSolutionsData(data.solution)
        // setPredictionsData(data.prediction)
        setError(null);
      })
      .catch(error => {
        console.error("There was a problem with your fetch operation:", error);
        setError(error.message);
      });

    setSolutionsData(mock.solution);
    setPredictionsData(mock.prediction);
    setUtterance(inputValue);

    // Clear the input after calling API
    setInputValue("");
  };

  const icon = item => {
    switch (item) {
      case "Call":
        return <Unicons.UilPhone size="60" color="dodgerblue" />;
      case "Chat":
        return <Unicons.UilChat size="60" color="dodgerblue" />;
      case "Appointment":
        return <Unicons.UilCalender size="60" color="dodgerblue" />;
      case "Youtube":
        return <Unicons.UilYoutube size="60" color="dodgerblue" />;
      case "Website":
        return <Unicons.UilGlobe size="60" color="dodgerblue" />;
      default:
        return null;
    }
  };

  const renderSolutions =
    solutionsData && solutionsData.length > 0
      ? solutionsData.map(item => (
          <div className="solution">
            <div className="icon">{icon(item)}</div>
            <div className="solution-text">{item}</div>
          </div>
        ))
      : solutionsData && solutionsData.length === 0
      ? "No solutions found"
      : null;

  const renderPredictions =
    predictionsData && predictionsData.length > 0
      ? predictionsData.map(item => (
          <div className="prediction">
            <div className="prediction-label">
              {item.label} - {item.confidence * 100}%
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${item.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        ))
      : predictionsData && predictionsData.length === 0
      ? "Threshold not met"
      : null;

  return (
    <div className="app">
      <div className="left-panel">
        <div className="search-box">
          <input
            type="text"
            className="input-box"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter an Utterance"
          />
        </div>
        <div className="solution-header">
          {utterance ? `Solutions for utterance: ${utterance}` : null}
        </div>
        <div className="solutions">{renderSolutions}</div>
        {error ? <div className="error">{error}</div> : null}
      </div>
      <div className="right-panel">
        <div className="prediction-header">Predictions:</div>
        <div className="predictions">{renderPredictions}</div>
      </div>
    </div>
  );
};

export default App;
