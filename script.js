const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;

const API_KEY = "your-openai-api-key";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatli = document.createElement("li");
  chatli.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p> </p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatli.innerHTML = chatContent;
  chatli.querySelector("p").textContent = message;
  return chatli;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "<your-openai-api-endpoint>";

  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": `${API_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // Send POST request to API, get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((err) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops, something went wrong! Try again later.";

      console.log(err);
    })
    .finally(() => {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    });
};
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  //append user message to chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    // display Thinking message while waiting for the response
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keyup", (e) => {
  // if Enter key is pressed without shift key
  //and the window width is greater than 800
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
sendChatBtn.addEventListener("click", handleChat);
