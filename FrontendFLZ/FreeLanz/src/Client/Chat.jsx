import React, { useState, useEffect, useRef } from 'react';
import API from '../api';

export default function ChatApp({ onChangePage, currentPage }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [activeRequestId, setActiveRequestId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [showStatusDropup, setShowStatusDropup] = useState(false);
    const [counterPrice, setCounterPrice] = useState('');
    const [loading, setLoading] = useState(true);

    const chatContentRef = useRef(null);

    // FIX: Memuat Font Awesome secara dinamis agar ikon tidak jadi kotak-kotak
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);

        const userStr = localStorage.getItem("user");
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // Fetch requests list
    const fetchRequests = async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const endpoint = user.role === 'CLIENT' ? '/request/client' : '/request/freelancer';
            const response = await API.get(endpoint);
            setRequests(response.data);

            // Auto select active request if stored in localStorage or select first
            const activeId = localStorage.getItem('active_request_id');
            if (activeId) {
                setActiveRequestId(parseInt(activeId));
                localStorage.removeItem('active_request_id');
            } else if (response.data.length > 0 && !activeRequestId) {
                setActiveRequestId(response.data[0].id);
            }
        } catch (err) {
            console.error("Gagal memuat requests: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchRequests();
        }
    }, [currentUser]);

    const activeRequest = requests.find(r => r.id === activeRequestId);
    const otherParticipant = activeRequest
        ? (currentUser?.role === 'CLIENT' ? activeRequest.freelancer : activeRequest.client)
        : null;

    // Fetch messages for selected request
    const fetchMessages = async () => {
        if (!activeRequestId) return;
        try {
            const response = await API.get(`/chat/${activeRequestId}`);
            setMessages(response.data);
        } catch (err) {
            console.error("Gagal memuat chat messages: ", err);
        }
    };

    useEffect(() => {
        if (activeRequestId) {
            fetchMessages();
            // Polling untuk real-time chat updates setiap 3 detik
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [activeRequestId]);

    // Auto complete project for demo/presentation purposes
    useEffect(() => {
        if (activeRequest && activeRequest.status === 'IN_PROGRESS') {
            const timer = setTimeout(() => {
                updateProjectStatus('COMPLETED');
            }, 6000); // Wait 6 seconds, then transition to COMPLETED
            return () => clearTimeout(timer);
        }
    }, [activeRequestId, activeRequest?.status]);

    // Auto scroll ke bawah saat ada pesan baru
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (messageInput.trim() !== "" && activeRequestId) {
            try {
                const response = await API.post('/chat', {
                    message: messageInput,
                    requestId: activeRequestId
                });
                setMessages(prev => [...prev, response.data.chat]);
                setMessageInput('');
                fetchRequests(); // Refresh preview text in sidebar
            } catch (err) {
                alert("Gagal mengirim pesan: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const changeToDeclineForm = () => {
        updateProjectStatus('REJECTED');
    };

    const acceptDeal = () => {
        updateProjectStatus('ACCEPTED');
    };

    const startProjectNow = () => {
        updateProjectStatus('IN_PROGRESS');
    };

    const toggleStatusMenu = () => {
        if (!activeRequest) return;
        const status = activeRequest.status;
        if (status === 'IN_PROGRESS' || status === 'COMPLETED' || status === 'ACCEPTED') {
            setShowStatusDropup(!showStatusDropup);
        } else {
            alert("Selesaikan negosiasi harga (Accept deal) terlebih dahulu sebelum mengelola status project.");
        }
    };

    const updateProjectStatus = async (newStatus) => {
        if (!activeRequestId) return;
        try {
            await API.patch(`/request/${activeRequestId}/status`, {
                status: newStatus
            });
            setShowStatusDropup(false);
            fetchRequests(); // Refresh requests list
        } catch (err) {
            alert("Gagal mengupdate status: " + (err.response?.data?.message || err.message));
        }
    };

    const submitCounterOffer = async () => {
        const price = counterPrice.trim();
        if (price !== "" && !isNaN(price)) {
            try {
                await API.post('/chat', {
                    message: `I have proposed a new counter price adjustments of $${price} USD.`,
                    requestId: activeRequestId
                });
                setCounterPrice('');
                fetchMessages();
            } catch (err) {
                alert("Gagal mengirim counter offer: " + err.message);
            }
        } else {
            alert("Please enter a valid price number.");
        }
    };

    const getSidebarPreview = (req) => {
        switch (req.status) {
            case 'ACCEPTED': return "Deal Agreed";
            case 'REJECTED': return "Offer Declined";
            case 'IN_PROGRESS': return "Project Started";
            case 'COMPLETED': return "Project Completed";
            default: return req.description || "Project Discussion";
        }
    };

    return (
        <div className="freelanz-app-container">
            {/* ISOLASI CSS TOTAL MENGGUNAKAN SCOPE '.freelanz-app-container' */}
            <style>{`
                .freelanz-app-container {
                    background-color: #000066 !important;
                    color: white !important;
                    height: 100vh !important;
                    width: 100vw !important;
                    display: flex !important;
                    flex-direction: column !important;
                    overflow: hidden !important;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    z-index: 999999 !important;
                }
                .freelanz-app-container * { 
                    box-sizing: border-box !important; 
                    margin: 0 !important; 
                    padding: 0 !important; 
                }
                .freelanz-app-container header { 
                    width: 100% !important; 
                    background-color: #000066 !important; 
                    height: 70px !important;
                }
                .freelanz-app-container .navbar { 
                    display: flex !important; 
                    justify-content: space-between !important; 
                    align-items: center !important; 
                    padding: 15px 5% !important; 
                    height: 100% !important;
                }
                .freelanz-app-container .logo { 
                    color: #ccff00 !important; 
                    font-size: 26px !important; 
                    font-weight: 900 !important; 
                    font-style: italic !important; 
                    letter-spacing: -1px !important; 
                    cursor: pointer !important;
                }
                .freelanz-app-container .nav-links { 
                    display: flex !important; 
                    list-style: none !important; 
                    gap: 25px !important; 
                }
                .freelanz-app-container .nav-links a { 
                    text-decoration: none !important; 
                    color: white !important; 
                    font-size: 13px !important; 
                    font-weight: bold !important; 
                    transition: 0.3s !important; 
                }
                .freelanz-app-container .nav-links a.active { color: #ccff00 !important; }
                .freelanz-app-container .user-profile { 
                    display: flex !important; 
                    align-items: center !important; 
                    gap: 12px !important; 
                    font-size: 13px !important; 
                    font-weight: 600 !important; 
                    cursor: pointer !important; 
                }
                .freelanz-app-container .user-icon { 
                    width: 35px !important; 
                    height: 35px !important; 
                    background-color: #e0e0e0 !important; 
                    border-radius: 50% !important; 
                    border: none !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    justify-content: center !important; 
                    color: #333 !important; 
                    font-size: 18px !important; 
                }
                .freelanz-app-container .chat-container { 
                    display: flex !important; 
                    flex: 1 !important; 
                    overflow: hidden !important; 
                    background-color: #fff !important; 
                    height: calc(100vh - 70px) !important; 
                }
                .freelanz-app-container .sidebar { 
                    width: 320px !important; 
                    background-color: #ffffff !important; 
                    display: flex !important; 
                    flex-direction: column !important; 
                    border-right: 2px solid #e0e4ec !important; 
                    color: #333 !important; 
                    height: 100% !important;
                }
                .freelanz-app-container .sidebar-header { padding: 20px 20px 10px 20px !important; }
                .freelanz-app-container .sidebar-header h2 { 
                    font-size: 22px !important; 
                    font-weight: bold !important; 
                    color: #333 !important; 
                    text-align: left !important;
                }
                .freelanz-app-container .sidebar-search { padding: 0 20px 15px 20px !important; position: relative !important; }
                .freelanz-app-container .sidebar-search input { 
                    width: 100% !important; 
                    padding: 10px 15px 10px 35px !important; 
                    border-radius: 10px !important; 
                    border: 1px solid #e0e0e0 !important; 
                    background-color: #f9fbfd !important; 
                    font-size: 13px !important; 
                    outline: none !important; 
                    color: #333 !important; 
                }
                .freelanz-app-container .sidebar-search i { 
                    position: absolute !important; 
                    left: 32px !important; 
                    top: 12px !important; 
                    color: #aaa !important; 
                    font-size: 14px !important; 
                }
                .freelanz-app-container .chat-list { flex: 1 !important; overflow-y: auto !important; padding: 0 10px !important; }
                .freelanz-app-container .chat-item { 
                    padding: 15px !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    gap: 12px !important; 
                    cursor: pointer !important; 
                    transition: 0.3s !important; 
                    border-radius: 15px !important; 
                    margin-bottom: 5px !important; 
                    background: transparent !important;
                }
                .freelanz-app-container .chat-item:hover { background-color: #f0f4f8 !important; }
                .freelanz-app-container .chat-item.active { background-color: #edf2f7 !important; }
                .freelanz-app-container .avatar-container { position: relative !important; width: 45px !important; height: 45px !important;}
                .freelanz-app-container .chat-avatar { width: 45px !important; height: 45px !important; border-radius: 50% !important; background: #e0e0e0 !important; }
                .freelanz-app-container .chat-avatar-mock { 
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23000066"/><circle cx="50" cy="40" r="25" fill="%23ccff00"/><rect x="10" y="75" width="80" height="30" rx="10" fill="%2300008b"/></svg>') !important; 
                    background-size: cover !important; 
                }
                .freelanz-app-container .status-dot { 
                    width: 14px !important; 
                    height: 14px !important; 
                    background: #33cc33 !important; 
                    border-radius: 50% !important; 
                    position: absolute !important; 
                    bottom: 0px !important; 
                    right: 0px !important; 
                    border: 2px solid #fff !important; 
                    display: block !important;
                }
                .freelanz-app-container .chat-info { flex: 1 !important; overflow: hidden !important; text-align: left !important;}
                .freelanz-app-container .chat-info .name-row { 
                    display: flex !important; 
                    justify-content: space-between !important; 
                    margin-bottom: 4px !important; 
                    align-items: center !important;
                }
                .freelanz-app-container .chat-info .name { font-weight: bold !important; font-size: 14px !important; color: #000 !important; }
                .freelanz-app-container .chat-info .time { font-size: 11px !important; color: #777 !important; }
                .freelanz-app-container .chat-info .preview { font-size: 12px !important; color: #666 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
                .freelanz-app-container .chat-main { 
                    flex: 1 !important; 
                    display: flex !important; 
                    flex-direction: column !important; 
                    background-color: #f4f6f8 !important; 
                    position: relative !important; 
                    height: 100% !important;
                }
                .freelanz-app-container .chat-header { 
                    padding: 15px 30px !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    justify-content: space-between !important; 
                    background-color: #f4f6f8 !important; 
                    border-bottom: 1px solid #e0e4ec !important; 
                    color: #000 !important; 
                    height: 70px !important;
                }
                .freelanz-app-container .current-user { display: flex !important; align-items: center !important; gap: 12px !important; }
                .freelanz-app-container .current-user .name { font-weight: bold !important; font-size: 18px !important; color: #000 !important; }
                .freelanz-app-container .current-user .status { 
                    font-size: 12px !important; 
                    color: #666 !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    gap: 6px !important; 
                    margin-top: 2px !important; 
                }
                .freelanz-app-container .current-user .status span { width: 10px !important; height: 10px !important; border-radius: 50% !important; display: inline-block !important; }
                .freelanz-app-container .header-actions { display: flex !important; gap: 25px !important; color: #555 !important; cursor: pointer !important; font-size: 18px !important; }
                .freelanz-app-container .header-actions i:hover { color: #000 !important; }
                .freelanz-app-container .chat-content { 
                    flex: 1 !important; 
                    padding: 25px 60px !important; 
                    overflow-y: auto !important; 
                    display: flex !important; 
                    flex-direction: column !important; 
                    gap: 20px !important; 
                    height: calc(100% - 160px) !important;
                }
                .freelanz-app-container .banner { 
                    background: #000066 !important; 
                    padding: 12px 35px !important; 
                    border-radius: 25px !important; 
                    align-self: center !important; 
                    font-size: 13px !important; 
                    font-weight: 600 !important; 
                    color: white !important; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; 
                    width: fit-content !important;
                }
                .freelanz-app-container .proposal-card { 
                    background: white !important; 
                    color: black !important; 
                    width: 360px !important; 
                    border-radius: 16px !important; 
                    overflow: hidden !important; 
                    text-align: center !important; 
                    margin: 10px auto !important; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; 
                    border: 1px solid #e8ecef !important; 
                }
                .freelanz-app-container .proposal-header { padding: 15px !important; font-size: 11px !important; font-weight: bold !important; color: #888 !important; border-bottom: 1px solid #f0f2f5 !important; letter-spacing: 0.8px !important; text-transform: uppercase !important; }
                .freelanz-app-container .proposal-body { padding: 25px 20px !important; }
                .freelanz-app-container .proposal-body .label { font-size: 11px !important; font-weight: bold !important; color: #999 !important; letter-spacing: 0.5px !important; }
                .freelanz-app-container .price-container { display: flex !important; align-items: center !important; justify-content: center !important; gap: 5px !important; margin: 8px 0 !important; }
                .freelanz-app-container .price-sign { font-size: 34px !important; font-weight: 800 !important; color: #000 !important; }
                .freelanz-app-container .price { font-size: 34px !important; font-weight: 800 !important; color: #000 !important; }
                .freelanz-app-container .price-input { font-size: 24px !important; font-weight: bold !important; border: none !important; border-bottom: 2px solid #ccc !important; width: 140px !important; text-align: left !important; outline: none !important; padding: 2px !important; color: #000 !important;}
                .freelanz-app-container .currency { font-size: 11px !important; font-weight: bold !important; color: #aaa !important; }
                .freelanz-app-container .proposal-footer { display: flex !important; padding: 0 20px 20px 20px !important; gap: 15px !important; }
                .freelanz-app-container .proposal-footer button { flex: 1 !important; padding: 12px !important; border: none !important; font-weight: bold !important; cursor: pointer !important; border-radius: 8px !important; font-size: 13px !important; transition: 0.2s !important; }
                .freelanz-app-container .btn-decline { background: #000066 !important; color: white !important; }
                .freelanz-app-container .btn-accept { background: #ccff00 !important; color: black !important; font-weight: 800 !important; }
                .freelanz-app-container .btn-submit-counter { background: #ccff00 !important; color: black !important; width: 100% !important; font-weight: 800 !important; }
                .freelanz-app-container .status-dropdown-container { position: relative !important; display: inline-block !important; }
                
                .freelanz-app-container .status-dropup-menu { 
                    display: none; 
                    position: absolute !important; 
                    bottom: 45px !important; 
                    left: 0 !important; 
                    background: #000033 !important; 
                    border: 1px solid rgba(255, 255, 255, 0.2) !important; 
                    border-radius: 8px !important; 
                    padding: 8px !important; 
                    box-shadow: 0 -4px 15px rgba(0,0,0,0.5) !important; 
                    z-index: 9999999 !important; 
                    flex-direction: column !important; 
                    gap: 8px !important; 
                    width: 140px !important; 
                }
                .freelanz-app-container .status-dropup-menu.show { display: flex !important; }
                .freelanz-app-container .btn-status-toggle { padding: 6px 12px !important; border-radius: 20px !important; font-size: 11px !important; font-weight: bold !important; border: none !important; cursor: pointer !important; text-align: center !important; width: 100% !important; }
                .freelanz-app-container .status-in-review { background: #ffcc00 !important; color: black !important; }
                .freelanz-app-container .status-completed { background: #33cc33 !important; color: white !important; }
                
                .freelanz-app-container .review-card { background: white !important; color: black !important; width: 360px !important; border-radius: 12px !important; overflow: hidden !important; margin: 10px auto !important; box-shadow: 0 4px 15px rgba(0,0,0,0.08) !important; }
                .freelanz-app-container .review-header { padding: 12px 20px !important; font-size: 11px !important; font-weight: bold !important; color: #666 !important; border-bottom: 1px solid #eee !important; text-transform: uppercase !important; }
                .freelanz-app-container .review-body { padding: 25px 20px !important; text-align: center !important; }
                .freelanz-app-container .review-body h4 { font-size: 15px !important; font-weight: 700 !important; margin-bottom: 5px !important; }
                .freelanz-app-container .review-body p { font-size: 12px !important; color: #666 !important; }
                .freelanz-app-container .review-footer { display: flex !important; padding: 0 20px 20px 20px !important; gap: 10px !important; }
                .freelanz-app-container .review-footer button { flex: 1 !important; padding: 10px !important; border: none !important; font-weight: bold !important; cursor: pointer !important; border-radius: 6px !important; font-size: 13px !important; }
                
                .freelanz-app-container .bubble { max-width: 65% !important; padding: 18px 22px !important; border-radius: 18px !important; font-size: 14px !important; line-height: 1.6 !important; position: relative !important; text-align: left !important;}
                .freelanz-app-container .bubble.left { background: linear-gradient(135deg, #0e0e66, #000044) !important; color: white !important; align-self: flex-start !important; border-bottom-left-radius: 4px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
                .freelanz-app-container .bubble.right { background: #e2e8f0 !important; color: black !important; align-self: flex-end !important; border-bottom-right-radius: 4px !important; }
                .freelanz-app-container .bubble .time { display: block !important; text-align: right !important; font-size: 11px !important; color: rgba(255,255,255,0.6) !important; margin-top: 10px !important; }
                .freelanz-app-container .bubble.right .time { color: #666 !important; }
                
                .freelanz-app-container .chat-input-area { 
                    padding: 15px 30px 25px 30px !important; 
                    background-color: #f4f6f8 !important; 
                    height: 90px !important;
                }
                .freelanz-app-container .input-wrapper { 
                    background: #000044 !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    padding: 8px 10px 8px 20px !important; 
                    border-radius: 30px !important; 
                    gap: 15px !important; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; 
                    height: 50px !important;
                }
                .freelanz-app-container .input-wrapper input { 
                    background: none !important; 
                    border: none !important; 
                    outline: none !important; 
                    color: white !important; 
                    flex: 1 !important; 
                    font-size: 14px !important; 
                }
                .freelanz-app-container .input-wrapper input::placeholder { color: #8892b0 !important; }
                .freelanz-app-container .input-actions { display: flex !important; gap: 18px !important; color: white !important; align-items: center !important; }
                .freelanz-app-container .input-actions i { cursor: pointer !important; font-size: 20px !important; opacity: 0.8 !important; }
                .freelanz-app-container .input-actions i:hover { opacity: 1 !important; }
                
                .freelanz-app-container .send-btn-container { 
                    background-color: #ccff00 !important; 
                    border-radius: 50% !important; 
                    display: flex !important; 
                    align-items: center !important; 
                    justify-content: center !important; 
                    cursor: pointer !important; 
                    transition: 0.2s !important; 
                    height: 36px !important; 
                    width: 36px !important;
                }
                .freelanz-app-container .send-btn-container:hover { background-color: #b3ff00 !important; }
                .freelanz-app-container .send-btn { 
                    color: #000044 !important; 
                    font-size: 14px !important; 
                    opacity: 1 !important; 
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .freelanz-app-container .deal-status-card { background: white !important; color: black !important; width: 360px !important; padding: 25px !important; border-radius: 12px !important; text-align: center !important; margin: 10px auto !important; box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important; }
                .freelanz-app-container .success-icon { background: #ccff00 !important; width: 40px !important; height: 40px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 auto 15px !important; color: black !important; font-size: 18px !important; }
                .freelanz-app-container .deal-status-card h3 { font-size: 16px !important; font-weight: 800 !important; margin-bottom: 8px !important; }
                .freelanz-app-container .deal-status-card p { font-size: 12px !important; color: #666 !important; margin-bottom: 15px !important; }
                .freelanz-app-container .btn-start-project { background: #000066 !important; color: white !important; width: 100% !important; padding: 10px !important; border-radius: 6px !important; border: none !important; font-weight: bold !important; cursor: pointer !important; }
            `}</style>

            {/* --- NAVBAR --- */}
            <header>
                <nav className="navbar">
                    <div className="logo" onClick={() => onChangePage?.('landing')}>FreeLanZ</div>
                    <ul className="nav-links">
                        <li>
                            <a
                                href="#explore"
                                className={currentPage === 'explore' ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); onChangePage?.('explore'); }}
                            >EXPLORE</a>
                        </li>
                        <li>
                            <a
                                href="#chat"
                                className={currentPage === 'chat' ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); onChangePage?.('chat'); }}
                            >CHAT</a>
                        </li>
                        <li>
                            <a
                                href="#project"
                                className={currentPage === 'project' ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); onChangePage?.('project'); }}
                            >PROJECT</a>
                        </li>
                    </ul>
                    <div className="user-profile" onClick={() => onChangePage?.('profile')} style={{ cursor: 'pointer' }}>
                        <span>{currentUser ? currentUser.name.toUpperCase() : "LINATA SATORO"}</span>
                        <div className="user-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {currentUser && currentUser.avatarUrl ? (
                            <img 
                              src={currentUser.avatarUrl.startsWith('http') ? currentUser.avatarUrl : `http://localhost:5000${currentUser.avatarUrl}`} 
                              alt="avatar" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                    </div>
                </nav>
            </header>

            <div className="chat-container">
                {/* --- SIDEBAR MESSAGES --- */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>Messages</h2>
                    </div>
                    <div className="sidebar-search">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="What are you looking for?" />
                    </div>
                    <div className="chat-list">
                        {loading ? (
                            <div style={{ textAlign: "center", color: "#777", marginTop: "20px", fontSize: "13px" }}>
                                Memuat pesan...
                            </div>
                        ) : requests.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#777", marginTop: "20px", fontSize: "13px" }}>
                                Belum ada obrolan project.
                            </div>
                        ) : (
                            requests.map((req) => {
                                const other = currentUser?.role === 'CLIENT' ? req.freelancer : req.client;
                                if (!other) return null;
                                return (
                                    <div
                                        key={req.id}
                                        className={`chat-item ${activeRequestId === req.id ? 'active' : ''} online`}
                                        onClick={() => setActiveRequestId(req.id)}
                                    >
                                        <div className="avatar-container">
                                            <div className="chat-avatar chat-avatar-mock" style={{ backgroundImage: other.avatarUrl ? `url(${other.avatarUrl})` : undefined, backgroundSize: 'cover' }}></div>
                                            <div className="status-dot"></div>
                                        </div>
                                        <div className="chat-info">
                                            <div className="name-row">
                                                <span className="name">{other.name}</span>
                                                <span className="time">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="preview">{getSidebarPreview(req)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* --- CHAT AREA --- */}
                {!activeRequest ? (
                    <main className="chat-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#777" }}>
                            Silakan pilih obrolan dari daftar pesan
                        </div>
                    </main>
                ) : (
                    <main className="chat-main">
                        <header className="chat-header">
                            <div className="current-user">
                                <div className="chat-avatar chat-avatar-mock" style={{ width: '40px', height: '40px', backgroundImage: otherParticipant?.avatarUrl ? `url(${otherParticipant.avatarUrl})` : undefined, backgroundSize: 'cover' }}></div>
                                <div>
                                    <div className="name">{otherParticipant?.name}</div>
                                    <div className="status">
                                        <span style={{ background: '#33cc33' }}></span>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <div className="header-actions">
                                <i className="fas fa-search"></i>
                                <i className="fas fa-ellipsis-v"></i>
                            </div>
                        </header>

                        <div className="chat-content" ref={chatContentRef}>
                            <div className="banner">{activeRequest.title}</div>

                            {/* Obrolan Berkas Proposal / Status Transaksi */}
                            <div id="transaction-area">
                                {activeRequest.status === 'PENDING' && (
                                    <div className="proposal-card">
                                        <div className="proposal-header">PRICE PROPOSAL</div>
                                        <div className="proposal-body">
                                            <div className="label">OFFER</div>
                                            <div className="price-container">
                                                <span className="price-sign">$</span>
                                                <span className="price">{activeRequest.budget}</span>
                                            </div>
                                            <div className="currency">USD</div>
                                        </div>
                                        <div className="proposal-footer">
                                            <button className="btn-decline" onClick={changeToDeclineForm}>Decline</button>
                                            <button className="btn-accept" onClick={acceptDeal}>Accept</button>
                                        </div>
                                    </div>
                                )}

                                {activeRequest.status === 'REJECTED' && (
                                    <div className="deal-status-card" style={{ border: '1px solid #ef4444', background: '#fee2e2', color: 'black' }}>
                                        <div className="success-icon" style={{ background: '#ef4444', color: 'white' }}><i className="fas fa-times"></i></div>
                                        <h3>Offer Declined</h3>
                                        <p>Permintaan project ini telah ditolak.</p>
                                    </div>
                                )}

                                {activeRequest.status === 'ACCEPTED' && (
                                    <div className="deal-status-card">
                                        <div className="success-icon"><i className="fas fa-check"></i></div>
                                        <h3>The Price has been agreed.</h3>
                                        <p>You can now officially start the project and track milestones.</p>
                                        <button className="btn-start-project" onClick={startProjectNow}>Start Project</button>
                                    </div>
                                )}

                                {activeRequest.status === 'IN_PROGRESS' && (
                                    <div className="deal-status-card" style={{ border: '1px solid #eab308', background: '#fef9c3', color: 'black' }}>
                                        <div className="success-icon" style={{ background: '#eab308', color: 'white' }}><i className="fas fa-spinner fa-spin"></i></div>
                                        <h3>Project in Progress</h3>
                                        <p>Freelancer sedang mengerjakan project Anda.</p>
                                        <button 
                                            className="btn-start-project" 
                                            style={{ background: '#eab308', color: 'white', marginTop: '10px' }} 
                                            onClick={() => updateProjectStatus('COMPLETED')}
                                        >
                                            Simulate Project Completed
                                        </button>
                                    </div>
                                )}

                                {activeRequest.status === 'COMPLETED' && (
                                    <div className="deal-status-card">
                                        <div className="success-icon" style={{ background: '#33cc33', color: 'white' }}><i className="fas fa-trophy"></i></div>
                                        <h3>Project Completed!</h3>
                                        <p>The core deliverables have been fully accepted and processed successfully.</p>
                                    </div>
                                )}
                            </div>

                            {/* Render Chat Messages */}
                            {messages.map((msg, index) => {
                                const type = msg.senderId === currentUser?.id ? 'right' : 'left';
                                const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div key={msg.id || index} className={`bubble ${type}`}>
                                        {msg.message} <span className="time">{time}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* --- INPUT AREA --- */}
                        <div className="chat-input-area">
                            <div className="input-wrapper">
                                <div className="status-dropdown-container">
                                    <i
                                        className="fas fa-plus"
                                        style={{ color: '#ccff00', cursor: 'pointer' }}
                                        onClick={toggleStatusMenu}
                                    ></i>
                                    <div className={`status-dropup-menu ${showStatusDropup ? 'show' : ''}`}>
                                        <button className="btn-status-toggle status-in-review" onClick={() => updateProjectStatus('IN_PROGRESS')}>In Progress</button>
                                        <button className="btn-status-toggle status-completed" onClick={() => updateProjectStatus('COMPLETED')}>Completed</button>
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <div className="input-actions">
                                    <i className="far fa-smile"></i>
                                    <div className="send-btn-container" onClick={sendMessage}>
                                        <i className="fas fa-paper-plane send-btn"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}