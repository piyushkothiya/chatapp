const socket = io('http://165.22.218.148:3000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') { audio.play(); }
}

// Ask new user for his/her chatname and let the server know
let chatname = "";
do {
    chatname = prompt("Enter your chatname to join");
} while (chatname == '' || chatname == null);

socket.emit('new-user-joined', chatname);

// If a new user joins, receive his/her chatname from the server
socket.on('user-joined', chatname => {
    append(`${chatname} joined the chat`, 'center')
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.chatname}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', chatname => {
    append(`${chatname} left the chat`, 'center')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message == '') {
        alert("Please Enter text into Chatbox");
    }
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
})