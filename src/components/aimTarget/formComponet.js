import React, { useState } from 'react';
import io from 'socket.io-client';
import '../../styles/formData.css';
const FormComponent = () => {
    const [formData, setFormData] = useState({
        id: 0,
        type: '',
        number: '',
        comment: ''
    });
    const [response, setResponse] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'id' ? parseInt(value) : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send form data to API using POST method
        fetch('http://localhost:3001/api/aimtarget/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Handle success response from API
            console.log('Response from API:', data);
            setResponse(data.message); // Update response state with message from API
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
            setResponse('Error occurred while sending data to API');
        });

        // Establish WebSocket connection
        const socket = io('http://localhost:3001');
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
        socket.on('response', (data) => {
            console.log('Received response via WebSocket:', data);
            // Handle response received via WebSocket
            setResponse(data); // Update response state with message from WebSocket
        });
        return () => {
            console.log('Unregistering Events...');
            socket.off('connect');
            socket.off('response');
          };
    };

    return (
        <div className="container">
            <h1>ROKE radioHead Signal</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="id">ID:</label>
                    <input type="number" id="id" name="id" value={formData.id} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="number">Number:</label>
                    <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment:</label>
                    <input type="text" id="comment" name="comment" value={formData.comment} onChange={handleChange} required />
                </div>
                <button type="submit">SEND</button>
            </form>
            {response.data && <div className="response">{response.data.map((dataItem) => (
        <div key={dataItem.id}>
          <p>ID: {dataItem.id}</p>
          <p>Type: {dataItem.type}</p>
          <p>Number: {dataItem.number}</p>
          <p>Comment: {dataItem.comment}</p>
          <br></br>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <div>
      
    </div>
        </div>
      ))}</div>}
            
        </div>
    );
};

export default FormComponent;
