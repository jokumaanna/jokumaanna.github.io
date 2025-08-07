// 愛情顧問聊天機器人類別
class LoveAdvisorChatBot {
    constructor() {
        // ⚠️ 重要：請替換為您的 n8n webhook URL
        this.webhookUrl = 'https://joannayayaya.app.n8n.cloud/webhook/love-chat';
        
        // 初始化 session ID
        this.sessionId = this.getOrCreateSessionId();
        
        // 創建聊天機器人 UI
        this.createChatBotUI();
        
        // DOM 元素
        this.chatbotToggle = document.getElementById('loveAdvisorToggle');
        this.chatbotPanel = document.getElementById('loveAdvisorPanel');
        this.chatbotClose = document.getElementById('loveAdvisorClose');
        this.messagesContainer = document.getElementById('loveMessages');
        this.messageInput = document.getElementById('loveMessageInput');
        this.sendButton = document.getElementById('loveSendButton');
        this.typingIndicator = document.getElementById('loveTypingIndicator');
        this.notificationBadge = document.getElementById('loveNotificationBadge');
        
        // 綁定事件
        this.bindEvents();
        
        // 載入對話歷史
        this.loadChatHistory();
        
        console.log('愛情顧問聊天機器人初始化完成，Session ID:', this.sessionId);
    }
    
    createChatBotUI() {
        // 創建浪漫的 CSS 樣式
        const style = document.createElement('style');
        style.textContent = `
            .love-advisor-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }

            .love-advisor-toggle {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
                transition: all 0.3s ease;
                color: white;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: heartbeat 2s infinite;
            }

            @keyframes heartbeat {
                0%, 50%, 100% { transform: scale(1); }
                25%, 75% { transform: scale(1.05); }
            }

            .love-advisor-toggle:hover {
                transform: scale(1.15);
                box-shadow: 0 10px 30px rgba(255, 107, 157, 0.6);
                animation-play-state: paused;
            }

            .love-advisor-panel {
                position: absolute;
                bottom: 90px;
                right: 0;
                width: 380px;
                height: 550px;
                background: linear-gradient(135deg, #ffeef8 0%, #fff0f3 100%);
                border-radius: 20px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 2px solid rgba(255, 107, 157, 0.2);
                backdrop-filter: blur(10px);
            }

            .love-advisor-panel.active {
                display: flex;
                animation: romanticSlideUp 0.4s ease-out;
            }

            @keyframes romanticSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .love-advisor-header {
                background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: hidden;
            }

            .love-advisor-header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="20" fill="rgba(255,255,255,0.1)">💖</text></svg>') repeat;
                animation: floatingHearts 20s linear infinite;
            }

            @keyframes floatingHearts {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-50px, -50px); }
            }

            .love-advisor-title {
                font-size: 18px;
                font-weight: bold;
                z-index: 1;
                position: relative;
            }

            .love-advisor-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1;
                position: relative;
            }

            .love-advisor-close:hover {
                background: rgba(255,255,255,0.2);
                transform: rotate(90deg);
            }

            .love-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                background: linear-gradient(135deg, #ffeef8 0%, #fff0f3 100%);
            }

            .love-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 20px;
                line-height: 1.5;
                word-wrap: break-word;
                font-size: 14px;
                animation: loveMessageSlide 0.5s ease-out;
                position: relative;
            }

            @keyframes loveMessageSlide {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .love-message.user {
                background: linear-gradient(135deg, #ff6b9d, #c44569);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 6px;
                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
            }

            .love-message.advisor {
                background: white;
                color: #2d3436;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(255, 107, 157, 0.2);
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .love-message.system {
                background: linear-gradient(135deg, #fd79a8, #fdcb6e);
                color: white;
                align-self: center;
                font-size: 13px;
                max-width: 90%;
                text-align: center;
                box-shadow: 0 2px 10px rgba(253, 121, 168, 0.3);
            }

            .love-message.error-message {
                background: linear-gradient(135deg, #e17055, #d63031);
                color: white;
                align-self: center;
                font-size: 13px;
                max-width: 90%;
                text-align: center;
            }

            .love-typing-indicator {
                display: none;
                align-self: flex-start;
                padding: 12px 16px;
                background: white;
                border-radius: 20px;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(255, 107, 157, 0.2);
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .love-typing-dots {
                display: flex;
                gap: 5px;
            }

            .love-typing-dot {
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #ff6b9d, #c44569);
                border-radius: 50%;
                animation: loveTyping 1.6s infinite;
            }

            .love-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .love-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes loveTyping {
                0%, 60%, 100% {
                    transform: scale(1);
                    opacity: 0.6;
                }
                30% {
                    transform: scale(1.3);
                    opacity: 1;
                }
            }

            .love-input-container {
                padding: 20px;
                border-top: 1px solid rgba(255, 107, 157, 0.2);
                display: flex;
                gap: 10px;
                background: white;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }

            .love-input-field {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid rgba(255, 107, 157, 0.3);
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: all 0.3s ease;
                background: rgba(255, 238, 248, 0.5);
            }

            .love-input-field:focus {
                border-color: #ff6b9d;
                background: white;
                box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
            }

            .love-input-field::placeholder {
                color: rgba(255, 107, 157, 0.6);
            }

            .love-send-button {
                padding: 12px 18px;
                background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 80px;
                justify-content: center;
            }

            .love-send-button:hover:not(:disabled) {
                transform: scale(1.05);
                box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
            }

            .love-send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .love-notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #e84393, #d63031);
                color: white;
                border-radius: 50%;
                font-size: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                animation: lovePulse 2s infinite;
                font-weight: bold;
                border: 2px solid white;
            }

            @keyframes lovePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            /* 響應式設計 */
            @media (max-width: 768px) {
                .love-advisor-panel {
                    width: 350px;
                    height: 500px;
                    bottom: 80px;
                }
            }

            @media (max-width: 480px) {
                .love-advisor-widget {
                    bottom: 15px;
                    right: 15px;
                }
                
                .love-advisor-toggle {
                    width: 60px;
                    height: 60px;
                    font-size: 24px;
                }
                
                .love-advisor-panel {
                    width: calc(100vw - 30px);
                    height: 75vh;
                    bottom: 85px;
                    right: -15px;
                }
            }

            .love-messages::-webkit-scrollbar {
                width: 6px;
            }

            .love-messages::-webkit-scrollbar-track {
                background: rgba(255, 107, 157, 0.1);
                border-radius: 3px;
            }

            .love-messages::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #ff6b9d, #c44569);
                border-radius: 3px;
            }

            .love-messages::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #e84393, #a29bfe);
            }
        `;
        document.head.appendChild(style);
        
        // 創建愛情顧問聊天機器人 HTML
        const chatbotHTML = `
            <div class="love-advisor-widget" id="loveAdvisorWidget">
                <button class="love-advisor-toggle" id="loveAdvisorToggle">
                    💕
                    <div class="love-notification-badge" id="loveNotificationBadge">💌</div>
                </button>
                
                <div class="love-advisor-panel" id="loveAdvisorPanel">
                    <div class="love-advisor-header">
                        <div class="love-advisor-title">💖 愛情顧問小紅娘</div>
                        <button class="love-advisor-close" id="loveAdvisorClose">
                            ✕
                        </button>
                    </div>
                    
                    <div class="love-messages" id="loveMessages">
                        <div class="love-message system">
                            💕 歡迎來到愛情顧問！我是你的專屬小紅娘，無論是戀愛困擾、感情問題，還是想要脫單秘訣，我都能幫你解答！讓我們一起找到你的真愛吧～ 💕
                        </div>
                    </div>
                    
                    <div class="love-typing-indicator" id="loveTypingIndicator">
                        <div class="love-typing-dots">
                            <div class="love-typing-dot"></div>
                            <div class="love-typing-dot"></div>
                            <div class="love-typing-dot"></div>
                        </div>
                    </div>
                    
                    <div class="love-input-container">
                        <input 
                            type="text" 
                            class="love-input-field" 
                            id="loveMessageInput" 
                            placeholder="告訴我你的愛情煩惱吧... 💭"
                            maxlength="500"
                        >
                        <button class="love-send-button" id="loveSendButton" disabled>
                            發送 💌
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // 插入到 body 末尾
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('love_advisor_session_id');
        if (!sessionId) {
            sessionId = 'love_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('love_advisor_session_id', sessionId);
        }
        return sessionId;
    }
    
    bindEvents() {
        // 聊天機器人開關
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        this.chatbotClose.addEventListener('click', () => {
            this.closeChatbot();
        });
        
        // 發送按鈕點擊事件
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 輸入框按鍵事件
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 輸入框輸入事件
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = this.messageInput.value.trim() === '';
        });
        
        // 點擊外部關閉聊天機器人
        document.addEventListener('click', (e) => {
            if (!this.chatbotToggle.contains(e.target) && 
                !this.chatbotPanel.contains(e.target) && 
                this.chatbotPanel.classList.contains('active')) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        if (this.chatbotPanel.classList.contains('active')) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.chatbotPanel.classList.add('active');
        this.messageInput.focus();
        this.hideNotification();
        this.scrollToBottom();
    }
    
    closeChatbot() {
        this.chatbotPanel.classList.remove('active');
    }
    
    showNotification() {
        this.notificationBadge.style.display = 'flex';
    }
    
    hideNotification() {
        this.notificationBadge.style.display = 'none';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // 顯示用戶訊息
        this.addMessage(message, 'user');
        
        // 清空輸入框並禁用發送按鈕
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // 顯示打字指示器
        this.showTypingIndicator();
        
        try {
            // 發送請求到 n8n webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString(),
                    type: 'love_advice' // 標記這是愛情建議請求
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.message) {
                this.addMessage(data.message, 'advisor');
                
                // 儲存對話到本地
                this.saveChatToLocal(message, data.message);
                
                // 如果聊天機器人已關閉，顯示通知
                if (!this.chatbotPanel.classList.contains('active')) {
                    this.showNotification();
                }
            } else {
                throw new Error('回應格式錯誤');
            }
            
        } catch (error) {
            console.error('發送訊息時發生錯誤:', error);
            this.addMessage('💔 抱歉親愛的，小紅娘暫時有點忙，請稍後再來找我聊聊愛情話題吧！', 'error-message');
        } finally {
            // 隱藏打字指示器
            this.hideTypingIndicator();
        }
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `love-message ${type}`;
        messageDiv.textContent = content;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    saveChatToLocal(userMessage, advisorMessage) {
        const chatHistory = JSON.parse(localStorage.getItem('love_advisor_history') || '[]');
        
        chatHistory.push({
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userMessage: userMessage,
            advisorMessage: advisorMessage
        });
        
        // 限制歷史記錄數量（最多保存 100 條愛情對話）
        if (chatHistory.length > 100) {
            chatHistory.splice(0, chatHistory.length - 100);
        }
        
        localStorage.setItem('love_advisor_history', JSON.stringify(chatHistory));
    }
    
    loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem('love_advisor_history') || '[]');
        const currentSessionHistory = chatHistory.filter(chat => chat.sessionId === this.sessionId);
        
        // 只載入最近的 10 條愛情對話
        const recentHistory = currentSessionHistory.slice(-10);
        
        recentHistory.forEach(chat => {
            this.addMessage(chat.userMessage, 'user');
            this.addMessage(chat.advisorMessage, 'advisor');
        });
        
        if (recentHistory.length === 0) {
            // 如果沒有歷史記錄，顯示溫馨歡迎訊息
            setTimeout(() => {
                const welcomeMessages = [
                    '💕 嗨～我是你的專屬愛情顧問！有什麼感情問題想要跟我聊聊嗎？',
                    '💖 不管是暗戀、告白、分手還是挽回，我都能給你最貼心的建議！',
                    '🌹 還是想要學習一些約會技巧和戀愛心理學呢？快告訴我吧！'
                ];
                
                welcomeMessages.forEach((msg, index) => {
                    setTimeout(() => {
                        this.addMessage(msg, 'advisor');
                    }, (index + 1) * 1500);
                });
            }, 1000);
        }
    }
    
    // 清除愛情對話歷史的方法（可以在控制台調用）
    clearHistory() {
        localStorage.removeItem('love_advisor_history');
        localStorage.removeItem('love_advisor_session_id');
        location.reload();
    }
    
    // 獲得愛情建議（額外功能）
    getLoveAdvice(situation) {
        const adviceBank = {
            '暗戀': [
                '💕 暗戀是美好的開始！試著多了解對方的興趣，找共同話題自然接近',
                '🌹 勇敢一點，適時表達關心，但不要太過激進，細水長流最動人',
                '💖 提升自己的魅力，讓自己變得更有趣，吸引力是相互的'
            ],
            '告白': [
                '💌 選擇一個舒適的環境，真誠地表達你的感受',
                '🎁 準備一個小驚喜，但重點是你的真心話',
                '💕 不管結果如何，勇敢表達都是值得驕傲的事'
            ],
            '約會': [
                '🍽️ 第一次約會選擇輕鬆的環境，比如咖啡廳或公園',
                '👗 穿得得體但要舒適，展現真實的自己',
                '💬 多聽對方說話，展現你的關心和興趣'
            ]
        };
        
        // 這裡可以根據情況返回相應建議
        return adviceBank[situation] || ['💖 每個愛情故事都是獨特的，告訴我更多細節，我能給你更準確的建議！'];
    }
}

// 初始化愛情顧問聊天機器人
document.addEventListener('DOMContentLoaded', function() {
    // 等待一秒確保頁面完全載入
    setTimeout(() => {
        window.loveAdvisorChatBot = new LoveAdvisorChatBot();
        
        // 在控制台提供清除歷史的方法
        window.clearLoveHistory = () => {
            if (confirm('💔 確定要清除所有愛情對話歷史嗎？那些美好的回憶就會消失了哦～')) {
                window.loveAdvisorChatBot.clearHistory();
            }
        };
        
        console.log('💕 愛情顧問聊天機器人載入完成！');
        console.log('💌 如需清除愛情對話歷史，請在控制台執行：clearLoveHistory()');
        console.log('🌹 準備好接受最貼心的愛情建議了嗎？');
    }, 1000);
});