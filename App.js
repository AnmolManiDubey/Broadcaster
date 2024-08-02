import React, { useState } from 'react';
import './App.css';

function App() {
  const [contactNumber, setContactNumber] = useState('');
  const [name, setName] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = function(e) {
        setCsvData(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      contactNumber,
      name,
      csvData,
      message
    };

    try {
      const response = await fetch('http://localhost:5000/send-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>WhatsApp Message Sender</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Contact Number:</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default App;
