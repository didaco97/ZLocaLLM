document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const statusMessage = document.getElementById('status-message');
    
    // Generation settings elements
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    const topPSlider = document.getElementById('top-p');
    const topPValue = document.getElementById('top-p-value');
    const maxLengthSlider = document.getElementById('max-length');
    const maxLengthValue = document.getElementById('max-length-value');
    
    // Update displayed values when sliders change
    temperatureSlider.addEventListener('input', () => {
        temperatureValue.textContent = temperatureSlider.value;
    });
    
    topPSlider.addEventListener('input', () => {
        topPValue.textContent = topPSlider.value;
    });
    
    maxLengthSlider.addEventListener('input', () => {
        maxLengthValue.textContent = maxLengthSlider.value;
    });
    
    // Send message when button is clicked
    sendButton.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed (but allow Shift+Enter for new lines)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Function to send message and get response
    function sendMessage() {
        const message = userInput.value.trim();
        
        // Don't send empty messages
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        
        // Clear input field
        userInput.value = '';
        
        // Show loading status
        setStatus('Generating response...', true);
        
        // Disable send button while processing
        sendButton.disabled = true;
        
        // Get current generation settings
        const settings = {
            prompt: message,
            temperature: parseFloat(temperatureSlider.value),
            top_p: parseFloat(topPSlider.value),
            max_length: parseInt(maxLengthSlider.value)
        };
        
        // Send request to backend
        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                setStatus('Error: ' + data.error);
                addMessageToChat('bot', 'Sorry, an error occurred while generating a response.');
            } else {
                setStatus('Ready');
                addMessageToChat('bot', data.response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setStatus('Error: ' + error.message);
            addMessageToChat('bot', 'Sorry, an error occurred while communicating with the server.');
        })
        .finally(() => {
            // Re-enable send button
            sendButton.disabled = false;
        });
    }
    
    // Function to add a message to the chat history
    function addMessageToChat(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        // Process markdown-like formatting for bot messages
        if (sender === 'bot') {
            // Simple markdown processing (could be enhanced with a proper markdown library)
            text = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')  // Code blocks
                .replace(/`([^`]+)`/g, '<code>$1</code>')          // Inline code
                .replace(/\n/g, '<br>');                           // Line breaks
        } else {
            // For user messages, just handle line breaks
            text = text.replace(/\n/g, '<br>');
        }
        
        messageElement.innerHTML = text;
        chatHistory.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // Function to update status message
    function setStatus(message, isLoading = false) {
        if (isLoading) {
            statusMessage.innerHTML = '<span class="loading"></span>' + message;
        } else {
            statusMessage.textContent = message;
        }
    }
    
    // Add a welcome message
    addMessageToChat('bot', 'Hello! I am WizardLM-7B-Uncensored. How can I assist you today?');
}); 