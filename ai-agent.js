document.addEventListener('DOMContentLoaded', () => {
    // ── AI AGENT WIDGET HTML INJECTION ──
    const aiHTML = `
        <!-- ── AI AGENT WIDGET ── -->
        <div class="ai-agent" id="aiAgent">
            <button class="ai-toggle" id="aiToggle" aria-label="Toggle AI Chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="ai-sparkle">✨</span>
            </button>

            <div class="ai-chat-window" id="aiChatWindow">
                <div class="ai-chat-header">
                    <div class="ai-avatar">AI</div>
                    <div class="ai-title">
                        <h4>Indra's Assistant <span class="ai-sparkle">✨</span></h4>
                        <p>Online</p>
                    </div>
                    <button class="ai-close" id="aiClose" aria-label="Close Chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="ai-chat-body" id="aiChatBody">
                    <div class="ai-message bot">
                        <div class="msg-content">
                            Hi! I'm Indra's AI assistant. How can I help you today?
                        </div>
                    </div>
                </div>

                <div class="ai-chat-footer">
                    <input type="text" id="aiInput" placeholder="Ask me anything..." autocomplete="off" />
                    <button class="ai-send" id="aiSend" aria-label="Send Message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', aiHTML);

    // ── AI AGENT WIDGET LOGIC ──────
    const aiToggle = document.getElementById('aiToggle');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const aiClose = document.getElementById('aiClose');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    const aiChatBody = document.getElementById('aiChatBody');

    // Predefined AI responses based on keywords
    const aiResponses = [
        { keywords: ['hi', 'hello', 'hey', 'greetings'], response: "Hello there! How can I help you today?" },
        { keywords: ['project', 'work', 'work', 'portfolio'], response: "Indra has worked on several awesome projects, like an E-Commerce platform, Analytics Dashboard, and a Real-Time Chat App. Check out the Projects section!" },
        { keywords: ['skill', 'tech', 'stack', 'tool', 'language'], response: "Indra is proficient in HTML, CSS, JavaScript, React, Node.js, Python, MongoDB, and Figma. A true full-stack designer and developer!" },
        { keywords: ['contact', 'email', 'hire', 'freelance'], response: "You can easily contact Indra via the Contact form below, or send an email to indrakiranreddysatti@gmail.com." },
        { keywords: ['about', 'who'], response: "Indra is a creative developer based in India, blending elegant design with powerful functionality to build amazing experiences." }
    ];
    const defaultResponse = "That's interesting! I'm still learning, but if you have a specific question about Indra's skills or projects, feel free to ask. Or try contacting directly via the form!";

    if (aiToggle && aiChatWindow && aiClose && aiInput && aiSend && aiChatBody) {
        aiToggle.addEventListener('click', () => {
            aiChatWindow.classList.toggle('open');
        });

        aiClose.addEventListener('click', () => {
            aiChatWindow.classList.remove('open');
        });

        function appendMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${sender}`;
            const contentDiv = document.createElement('div');
            contentDiv.className = 'msg-content';
            contentDiv.textContent = text;
            msgDiv.appendChild(contentDiv);
            aiChatBody.appendChild(msgDiv);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }

        function showTypingIndicator() {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'ai-message bot typing-msg';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'msg-content';
            contentDiv.innerHTML = `
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        `;
            msgDiv.appendChild(contentDiv);
            aiChatBody.appendChild(msgDiv);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
            return msgDiv;
        }

        function getAIResponse(userText) {
            const lowerText = userText.toLowerCase();
            for (let item of aiResponses) {
                if (item.keywords.some(kw => lowerText.includes(kw))) {
                    return item.response;
                }
            }
            return defaultResponse;
        }

        function handleSendMessage() {
            const text = aiInput.value.trim();
            if (!text) return;

            // Append user message
            appendMessage(text, 'user');
            aiInput.value = '';

            // Show typing indicator
            const typingIndicator = showTypingIndicator();

            // Simulate delay before response
            setTimeout(() => {
                typingIndicator.remove();
                const response = getAIResponse(text);
                appendMessage(response, 'bot');
            }, 300);
        }

        aiSend.addEventListener('click', handleSendMessage);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });

        // Make sure clicking inside AI agent components doesn't trigger the custom cursor hover enlargement
        document.querySelectorAll('.ai-toggle, .ai-chat-window button, .ai-chat-window input').forEach(el => {
            el.addEventListener('mouseenter', e => {
                e.stopPropagation();
                const cursor = document.getElementById('cursor');
                const follower = document.getElementById('cursorFollower');
                if (cursor && follower) {
                    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                    follower.style.transform = 'translate(-50%,-50%) scale(1)';
                    follower.style.borderColor = 'rgba(124,92,252,0.4)';
                }
            });
        });
    }
});
