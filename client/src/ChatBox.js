import React, { useState } from "react";
import axios from "axios";
import MutualFunds from './components/MutualFunds';
import AccountSummary from './components/AccountSummary'
import Deposits from './components/Deposits'
import DepositForm from './components/DepositForm'

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { from: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        const res = await axios.post("http://localhost:5000/api/chat", { message: input });

        setMessages([...newMessages, { from: "bot", text: res.data.reply }]);


    };

    return (
        <div className="flex flex-col">
            <div className="h-80 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50 mb-4">
                {messages.map((msg, i) => (
                    <React.Fragment>

                        {msg.text === 'account_summary' ? (<AccountSummary />) :
                            msg.text === 'FD_or_RD' ? (<Deposits />) :
                                msg.text === 'FD_or_RD_invest' ? (<DepositForm />) :

                                    msg.text === 'show_mutual' ? (<MutualFunds />) : (

                                        <div key={i} className={`mb-3 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`px-4 py-2 rounded-xl max-w-xs shadow-sm ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    )}
                    </React.Fragment>
                ))}

            </div>

            <div className="flex">
                <input
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask me something..."
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
            <button
                onClick={() => setMessages([])}
                className="text-sm text-red-500 mt-2 hover:underline self-end"
            >
                Clear Chat
            </button>
        </div>
    );
}

export default ChatBox;
