class ChatManager {
    constructor() {
        this.chatContainer = document.querySelector(".chat-container");
        this.chatInput = document.querySelector("#chat-input");
        this.sendButton = document.querySelector("#send-btn");
        this.themeButton = document.querySelector("#theme-btn");
        this.deleteButton = document.querySelector("#delete-btn");
        this.initialInputHeight = this.chatInput.scrollHeight;

        // Load chat history and theme from local storage
        this.loadDataFromLocalstorage();

        // Event listeners
        this.sendButton.addEventListener("click", () => this.handleOutgoingChat());
        this.deleteButton.addEventListener("click", () => this.handleDeleteChats());
        this.themeButton.addEventListener("click", () => this.toggleTheme());
        this.chatInput.addEventListener("input", () => this.adjustInputHeight());
        this.chatInput.addEventListener("keydown", (e) => this.handleInputKeydown(e));
    }
    
    loadDataFromLocalstorage() {
        // Load saved chats and theme from local storage and apply/add on the page
        const themeColor = localStorage.getItem("themeColor");
        document.body.classList.toggle("light-mode", themeColor === "light_mode");
        this.themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

        const defaultText = `<div class="default-text">
                                <h1>JUST SIMPLIFIED KNOWLEDGE</h1>
                                <p>Start a conversation and explore the power of mini AI Chatbot.<br>Your chat history will be displayed here.</p>
                            </div>`;

        this.chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
        this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);
    }

    createChatElement(content, className) {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = content;
        return chatDiv;
    }

    async getChatResponse(incomingChatDiv) {
        const userText = this.chatInput.value.trim();

        if (!userText) return;

        try {
            const response = await fetch("http://localhost:8000/generate/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_input: userText })
            });

            const responseData = await response.json();

            if (response.ok) {
                const pElement = document.createElement("p");
                pElement.textContent = responseData.output.trim();

                incomingChatDiv.querySelector(".typing-animation").remove();
                incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
                localStorage.setItem("all-chats", this.chatContainer.innerHTML);
                this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);
            } else {
                throw new Error("Failed to fetch response.");
            }
        } catch (error) {
            const pElement = document.createElement("p");
            pElement.classList.add("error");
            pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";

            incomingChatDiv.querySelector(".typing-animation").remove();
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
            localStorage.setItem("all-chats", this.chatContainer.innerHTML);
            this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);
        }
    }

    showTypingAnimation() {
        const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="images/chatbot.jpg" alt="chatbot-img">
                            <div class="typing-animation">
                                <div class="typing-dot" style="--delay: 0.2s"></div>
                                <div class="typing-dot" style="--delay: 0.3s"></div>
                                <div class="typing-dot" style="--delay: 0.4s"></div>
                            </div>
                        </div>
                        <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                    </div>`;

        const incomingChatDiv = this.createChatElement(html, "incoming");
        this.chatContainer.appendChild(incomingChatDiv);
        this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);
        this.getChatResponse(incomingChatDiv);
    }

    handleOutgoingChat() {
        const userText = this.chatInput.value.trim();
        if (!userText) return;

        this.chatInput.value = "";
        this.chatInput.style.height = `${this.initialInputHeight}px`;

        const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="images/user.jpg" alt="user-img">
                            <p>${userText}</p>
                        </div>
                    </div>`;

        const outgoingChatDiv = this.createChatElement(html, "outgoing");
        this.chatContainer.querySelector(".default-text")?.remove();
        this.chatContainer.appendChild(outgoingChatDiv);
        this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);
        setTimeout(() => this.showTypingAnimation(), 500);
    }

    handleDeleteChats() {
        if (confirm("Are you sure you want to delete all the chats?")) {
            localStorage.removeItem("all-chats");
            this.loadDataFromLocalstorage();
        }
    }

    toggleTheme() {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("themeColor", this.themeButton.innerText);
        this.themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    }

    adjustInputHeight() {
        this.chatInput.style.height = `${this.initialInputHeight}px`;
        this.chatInput.style.height = `${this.chatInput.scrollHeight}px`;
    }

    handleInputKeydown(e) {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            this.handleOutgoingChat();
        }
    }
}
async function sendChatMessage(message) {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  
    if (response.ok) {
      // Get chatbot response from JSON response
      const chatbotResponse = await response.json();
  
      // Display chatbot response on the frontend
      // ...
    } else {
      // Handle error
    }
  }
// Get the chat container element
const chatContainer = document.querySelector(".chat-container");

// Add an event listener to the "Send" button to send a message to the backend
document.querySelector("#send-btn").addEventListener("click", async () => {
  // Get the message from the textarea
  const message = document.querySelector("#chat-input").value;

  // Send the message to the backend
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  // If the response is successful, display the chatbot response on the frontend
  if (response.ok) {
    // Get the chatbot response from the JSON response
    const chatbotResponse = await response.json();

    // Display the chatbot response in the chat container
    chatContainer.innerHTML += `<div class="chat-message chatbot-message">${chatbotResponse}</div>`;
  } else {
    // Handle error
  }
});
function sendMessage() {
  // Get the user input
  var userInput = document.getElementById('user-input').value;

  // Call the Python function
  var response = generate_response(userInput);

  // Display the response
  document.getElementById('response-container').innerHTML = response;
}


// Initialize the ChatManager
const chatManager = new ChatManager();
