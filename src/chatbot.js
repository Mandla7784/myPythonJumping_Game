const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

chatbotToggleButton.addEventListener('click', () => {
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'flex';
    } else {
        chatbotContainer.style.display = 'none';
    }
});

sendButton.addEventListener('click', async () => {
    const message = userInput.value;
    if (message.trim() === '') return;

    appendMessage('user', message);
    userInput.value = '';

    try {
        const response = await fetch('/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        appendMessage('bot', data.reply);
    } catch (error) {
        console.error('Error with chatbot:', error);
        appendMessage('bot', 'Sorry, I am having trouble connecting.');
    }
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${message}`;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
