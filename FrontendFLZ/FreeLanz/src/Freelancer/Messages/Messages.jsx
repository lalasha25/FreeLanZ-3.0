import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';

export default function Messages({ onChangePage, currentPage }) {
  // --- 1. STATE MANAGEMENT ---
  // Inisialisasi profile default sesuai data asli HTML Anda
  const [userProfile, setUserProfile] = useState({
    name: 'Kim Veny',
    title: 'UI/UX Designer',
    profileImage: 'https://i.pravatar.cc/150?u=kim',
    bio: '',
    tags: []
  });

  const [activeClientId, setActiveClientId] = useState('lilisha');

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('freelancer_chats_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse freelancer_chats_v2:', e);
      }
    }
    return {
      lilisha: {
        id: 'lilisha',
        name: 'Lilisha Natasha',
        avatar: 'https://i.pinimg.com/736x/59/b4/8a/59b48ac4cadb1e0995da5bfdc48eb8ec.jpg',
        messages: [
          {
            id: 1,
            sender: 'system',
            type: 'system',
            variant: 'order-accepted',
            text: 'Order "ANNIVERSARY CELEBRATION VIDEO" has been accepted! Please send your price proposal to get started.',
            time: '12.39'
          }
        ],
        deal: {
          dealStatus: 'price_negotiation',
          proposalPrice: '',
          orderTitle: 'ANNIVERSARY CELEBRATION VIDEO',
          suggestedBudget: '$ 320.00'
        },
        unread: 0,
        lastMsg: "Order accepted: ANNIVERSARY CELEBRATION VIDEO",
        time: "Just now"
      },
      budi: {
        id: 'budi',
        name: 'Budi Pratomo',
        avatar: 'https://i.pinimg.com/736x/06/4a/90/064a909845cf46a82de608565d410b57.jpg',
        messages: [
          {
            id: 1,
            sender: 'budi',
            text: "Hi Veny, is the programming prototype ready? We need to present it to stakeholders next week.",
            time: '10.00',
            type: 'text'
          },
          {
            id: 2,
            sender: 'veny',
            text: "Hi Budi! Yes, I'm working on the responsiveness. I'll share the preview shortly.",
            time: '10:15',
            type: 'text'
          }
        ],
        deal: {
          dealStatus: 'project_started',
          proposalPrice: '250.00'
        },
        unread: 0,
        lastMsg: "Hi Veny, is the programming...",
        time: "1h ago"
      },
      alex: {
        id: 'alex',
        name: 'Alex Doe',
        avatar: 'https://i.pinimg.com/736x/e8/1e/fa/e81efa839696aa8ee965dfcb38275e8f.jpg',
        messages: [
          {
            id: 1,
            sender: 'alex',
            text: "Hey Veny, the branding mockups look solid. Do we have the high-res exports?",
            time: 'Yesterday',
            type: 'text'
          },
          {
            id: 2,
            sender: 'veny',
            text: "Yes, Alex! I've prepared all PNG and SVG files. I will send them over.",
            time: 'Yesterday',
            type: 'text'
          }
        ],
        deal: {
          dealStatus: 'completed_success',
          proposalPrice: '75.00'
        },
        unread: 0,
        lastMsg: "Hey Veny, the branding mockups...",
        time: "Yesterday"
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('freelancer_chats_v2', JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats[activeClientId] || chats.lilisha;
  const chatMessages = activeChat.messages;
  const currentDeal = activeChat.deal;

  const setChatMessages = (updater) => {
    setChats(prev => {
      const currentMessages = prev[activeClientId].messages;
      const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;

      const lastItem = newMessages[newMessages.length - 1];
      let newLastMsg = prev[activeClientId].lastMsg;
      if (lastItem) {
        if (lastItem.type === 'file') {
          newLastMsg = `📁 ${lastItem.fileName}`;
        } else if (lastItem.type === 'client-review') {
          newLastMsg = "📋 Waiting for draft approval";
        } else if (lastItem.type === 'system') {
          newLastMsg = lastItem.text;
        } else {
          newLastMsg = lastItem.text;
        }
      }

      return {
        ...prev,
        [activeClientId]: {
          ...prev[activeClientId],
          messages: newMessages,
          lastMsg: newLastMsg
        }
      };
    });
  };

  const setCurrentDeal = (updater) => {
    setChats(prev => {
      const currentDealObj = prev[activeClientId].deal;
      const newDeal = typeof updater === 'function' ? updater(currentDealObj) : updater;
      return {
        ...prev,
        [activeClientId]: {
          ...prev[activeClientId],
          deal: newDeal
        }
      };
    });
  };

  const [inputValue, setInputValue] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isAwaitingReview, setIsAwaitingReview] = useState(false);
  const [showStartProjectPopup, setShowStartProjectPopup] = useState(false);

  // REFS untuk manipulasi DOM (Auto-scroll & click outside)
  const chatContainerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const btnAttachmentRef = useRef(null);

  // --- 2. LIFECYCLE EFFECTS (MENGGANTIKAN LOGIKA SCRIPT ASLI) ---

  // Memuat FontAwesome secara dinamis agar ikon tidak kosong
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  // Setara dengan Logika LOAD DATA DARI LOCALSTORAGE (DOMContentLoaded - baris 486)
  useEffect(() => {
    const loadProfile = () => {
      const loggedInUser = localStorage.getItem('user');
      const savedData = localStorage.getItem('userProfile');
      
      let data = null;
      if (loggedInUser) {
        try {
          data = JSON.parse(loggedInUser);
        } catch (e) {
          console.error(e);
        }
      }
      if (!data && savedData) {
        try {
          data = JSON.parse(savedData);
        } catch (e) {
          console.error(e);
        }
      }

      if (data) {
        const imgUrl = data.avatarUrl || data.profileImage || data.image || data.avatar || 'https://i.pravatar.cc/150?u=kim';
        setUserProfile({
          name: data.name || 'Kim Veny',
          title: data.title || data.role || 'UI/UX Designer',
          profileImage: imgUrl.startsWith('http') || imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`,
          bio: data.bio || '',
          tags: data.tags || []
        });
      }
    };

    loadProfile();

    const handleStorage = (e) => {
      if (!e.key || e.key === 'userProfile' || e.key === 'user') loadProfile();
    };
    window.addEventListener('storage', handleStorage);

    // Clear any stale global deal status on mount to prevent overriding specific client states
    localStorage.removeItem('shared_deal_status');

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Open a specific client chat when arriving from the Order page
  useEffect(() => {
    const pendingChat = localStorage.getItem('open_chat_client');
    if (pendingChat) {
      try {
        const { clientId, orderTitle, budget } = JSON.parse(pendingChat);
        if (clientId) {
          setActiveClientId(clientId);
          // Clear any stale global deal status
          localStorage.removeItem('shared_deal_status');
          // Update the deal status to price_negotiation so the price card shows
          setChats(prev => {
            const client = prev[clientId];
            if (!client) return prev;
            const now = new Date();
            const timeStr = now.getHours() + '.' + now.getMinutes().toString().padStart(2, '0');
            return {
              ...prev,
              [clientId]: {
                ...client,
                deal: {
                  dealStatus: 'price_negotiation',
                  proposalPrice: '',
                  orderTitle: orderTitle || '',
                  suggestedBudget: budget || ''
                },
                messages: [
                  {
                    id: Date.now(),
                    sender: 'system',
                    type: 'system',
                    variant: 'order-accepted',
                    text: `Order "${orderTitle}" has been accepted! Please send your price proposal to get started.`,
                    time: timeStr
                  }
                ],
                lastMsg: `Order accepted: ${orderTitle}`
              }
            };
          });
        }
      } catch (e) {
        console.error('Error parsing open_chat_client:', e);
      }
      localStorage.removeItem('open_chat_client');
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'shared_chat_msg' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const senderId = data.sender === 'lilisha' || data.sender === 'zelika' ? 'lilisha' : data.sender;
          if (chats[senderId]) {
            setChats((prev) => {
              const client = prev[senderId];
              const newMessages = [
                ...client.messages,
                {
                  id: Date.now() + Math.random(),
                  sender: senderId,
                  text: data.text,
                  time: data.time,
                  type: 'text'
                }
              ];
              return {
                ...prev,
                [senderId]: {
                  ...client,
                  messages: newMessages,
                  lastMsg: data.text,
                  unread: activeClientId === senderId ? 0 : client.unread + 1
                }
              };
            });
          }
        } catch (err) {
          console.error("Error parsing shared_chat_msg:", err);
        }
      }

      if (e.key === 'shared_deal_status' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          setChats((prev) => {
            const client = prev.lilisha;
            return {
              ...prev,
              lilisha: {
                ...client,
                deal: {
                  dealStatus: data.dealStatus,
                  proposalPrice: data.proposalPrice
                }
              }
            };
          });
        } catch (err) {
          console.error("Error parsing shared_deal_status:", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [activeClientId]);

  // Tutup menu attachment jika klik di luar (baris 414)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(e.target) &&
        btnAttachmentRef.current &&
        !btnAttachmentRef.current.contains(e.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Auto-scroll chatContainer (Mencegah teks menumpuk / tertutup input - baris 459)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  // --- 3. HANDLER FUNCTIONS (LOGIKA AKSI JAVASCRIPT ASLI) ---

  const handleLogout = () => {
    window.location.href = 'chooseRole'; // Sesuai baris 364
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const now = new Date();
      const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'veny',
          text: inputValue,
          time: timeStr,
          type: 'text'
        }
      ]);

      const chatPayload = { sender: 'veny', text: inputValue, time: timeStr };
      localStorage.setItem('shared_chat_msg', JSON.stringify(chatPayload));

      setInputValue('');
    }
  };

  // Fungsi menghasilkan bubble file dinamis + auto client reply
  const handleSendFileBubble = (tipeFile) => {
    setShowAttachmentMenu(false);
    const now = new Date();
    const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');

    let namaFile = "Project_Draft_Final.pdf";
    let ukuranFile = "2.4 MB";
    let ikonClass = "fas fa-file-alt";

    if (tipeFile.includes("Photo")) {
      namaFile = "Project_Preview.png";
      ukuranFile = "4.1 MB";
      ikonClass = "fas fa-image";
    } else if (tipeFile.includes("Audio")) {
      namaFile = "Voice_Note_Brief.mp3";
      ukuranFile = "1.8 MB";
      ikonClass = "fas fa-microphone";
    }

    const fileId = Date.now();
    setChatMessages((prev) => [
      ...prev,
      {
        id: fileId,
        sender: 'veny',
        type: 'file',
        fileName: namaFile,
        fileSize: ukuranFile,
        fileIcon: ikonClass,
        time: timeStr
      }
    ]);

    // Auto client reply after 1.8 seconds
    if (!isAwaitingReview) {
      setIsAwaitingReview(true);
      setTimeout(() => {
        const replyTime = new Date();
        const replyTimeStr = replyTime.getHours() + "." + replyTime.getMinutes().toString().padStart(2, '0');
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: activeClientId,
            type: 'text',
            text: 'I received the file! Let me review it now...',
            time: replyTimeStr
          }
        ]);

        // Then after another 2 seconds, show the review action card
        setTimeout(() => {
          const cardTime = new Date();
          const cardTimeStr = cardTime.getHours() + "." + cardTime.getMinutes().toString().padStart(2, '0');
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'system',
              type: 'client-review',
              time: cardTimeStr
            }
          ]);
        }, 2000);
      }, 1800);
    }
  };

  // Client approves the draft
  const handleClientApprove = () => {
    const now = new Date();
    const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');

    // Remove the client-review card and replace with approved messages and payment receipt
    setChatMessages((prev) => {
      const filtered = prev.filter(m => m.type !== 'client-review');
      return [
        ...filtered,
        {
          id: Date.now(),
          sender: 'system',
          type: 'system',
          variant: 'approved',
          text: 'Client Has Approved the Draft Project',
          time: timeStr
        },
        {
          id: Date.now() + 1,
          sender: 'system',
          type: 'system',
          variant: 'notify',
          text: 'Freelancer will get notified when the client approved',
          time: timeStr
        },
        {
          id: Date.now() + 2,
          sender: activeClientId,
          type: 'bukti-pembayaran',
          time: timeStr
        }
      ];
    });

    const updated = { ...currentDeal, dealStatus: 'payment_received' };
    setCurrentDeal(updated);
    localStorage.setItem('shared_deal_status', JSON.stringify(updated));
    setIsAwaitingReview(false);
  };

  // Client declines / requests revision
  const handleClientRevision = () => {
    const now = new Date();
    const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');

    setChatMessages((prev) => {
      const filtered = prev.filter(m => m.type !== 'client-review');
      return [
        ...filtered,
        {
          id: Date.now(),
          sender: 'system',
          type: 'system',
          variant: 'revision',
          text: 'Client Want Revision on the Draft Project',
          time: timeStr
        }
      ];
    });

    const updated = { ...currentDeal, dealStatus: 'declining' };
    setCurrentDeal(updated);
    localStorage.setItem('shared_deal_status', JSON.stringify(updated));
    setIsAwaitingReview(false);
  };

  const freelancerSubmitForReview = () => {
    const updated = { ...currentDeal, dealStatus: 'in_review' };
    setCurrentDeal(updated);
    localStorage.setItem('shared_deal_status', JSON.stringify(updated));
  };

  const freelancerSelesaikanProject = () => {
    const now = new Date();
    const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');
    const updated = { ...currentDeal, dealStatus: 'completed_success' };
    setCurrentDeal(updated);
    localStorage.setItem('shared_deal_status', JSON.stringify(updated));
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'system',
        type: 'system',
        variant: 'completed',
        text: 'Project has been marked as Completed by Freelancer',
        time: timeStr
      }
    ]);
  };


  const [priceInput, setPriceInput] = useState('');

  const handleStartProject = () => {
    setShowStartProjectPopup(false);
    
    // 1. Move deal status to project_started
    const updatedDeal = {
      ...currentDeal,
      dealStatus: 'project_started'
    };
    setCurrentDeal(updatedDeal);
    localStorage.setItem('shared_deal_status', JSON.stringify(updatedDeal));

    // 2. Set client projects to IN PROGRESS (Step 2) in localStorage
    const savedProjects = localStorage.getItem('client_projects');
    if (savedProjects) {
      try {
        const projs = JSON.parse(savedProjects);
        const updated = projs.map(p => p.id === 'anniversary' ? {
          ...p,
          status: 'IN PROGRESS',
          st: 'ip',
          progress: 25,
          step: 2
        } : p);
        localStorage.setItem('client_projects', JSON.stringify(updated));
        
        // Dispatch custom storage event for local updates
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error(err);
      }
    }

    // 3. Wait 5 seconds, then freelancer sends the file draft, and it advances to in_review (Step 3)
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.getHours() + "." + now.getMinutes().toString().padStart(2, '0');
      
      setChats(prev => {
        const client = prev.lilisha;
        if (!client) return prev;

        const newMessages = [
          ...client.messages,
          {
            id: Date.now(),
            sender: 'veny',
            type: 'file',
            fileName: 'Project_Draft_Final.pdf',
            fileSize: '2.4 MB',
            fileIcon: 'fas fa-file-alt',
            time: timeStr
          },
          {
            id: Date.now() + 1,
            sender: 'lilisha',
            type: 'text',
            text: 'I received the file! Let me review it now...',
            time: timeStr
          },
          {
            id: Date.now() + 2,
            sender: 'system',
            type: 'client-review',
            time: timeStr
          }
        ];
        
        const updatedDealReview = {
          ...client.deal,
          dealStatus: 'in_review'
        };
        
        // Sync with localStorage
        localStorage.setItem('shared_deal_status', JSON.stringify(updatedDealReview));
        
        return {
          ...prev,
          lilisha: {
            ...client,
            deal: updatedDealReview,
            messages: newMessages,
            lastMsg: '📁 Project_Draft_Final.pdf'
          }
        };
      });

      // Update client projects in localStorage to step 3 (In Review)
      const savedProjs = localStorage.getItem('client_projects');
      if (savedProjs) {
        try {
          const projs = JSON.parse(savedProjs);
          const updated = projs.map(p => p.id === 'anniversary' ? {
            ...p,
            status: 'IN REVIEW',
            st: 'rv',
            progress: 50,
            step: 3
          } : p);
          localStorage.setItem('client_projects', JSON.stringify(updated));
          
          window.dispatchEvent(new Event('storage'));
        } catch (err) {
          console.error(err);
        }
      }
    }, 5000);
  };

  const handleSendProposal = () => {
    const price = parseFloat(priceInput);
    if (!priceInput || isNaN(price) || price <= 0) return;
    const now = new Date();
    const timeStr = now.getHours() + '.' + now.getMinutes().toString().padStart(2, '0');
    const proposalVal = price.toFixed(2);
    
    // Add a proposal message bubble
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'veny',
        type: 'text',
        text: `My price proposal for this project is $${proposalVal} USD. Please let me know if that works for you!`,
        time: timeStr
      }
    ]);
    // Transition deal to pending with the sent price
    setCurrentDeal({ dealStatus: 'pending', proposalPrice: proposalVal });
    setPriceInput('');

    // Save active client to reference inside timeout
    const currentClientId = activeClientId;

    // --- AUTOMATED CHAT SCENARIO 1 RESPONSE ---
    setTimeout(() => {
      const replyTime = new Date();
      const replyTimeStr = replyTime.getHours() + '.' + replyTime.getMinutes().toString().padStart(2, '0');
      
      setChats(prev => {
        const client = prev[currentClientId];
        if (!client) return prev;
        
        const updatedDeal = {
          ...client.deal,
          dealStatus: 'price_agreed',
          proposalPrice: proposalVal
        };
        
        // Save to shared deal status in localStorage so client side sees it too
        localStorage.setItem('shared_deal_status', JSON.stringify(updatedDeal));
        
        return {
          ...prev,
          [currentClientId]: {
            ...client,
            deal: updatedDeal,
            messages: [
              ...client.messages,
              {
                id: Date.now(),
                sender: currentClientId,
                type: 'text',
                text: `Great! That price of $${proposalVal} USD works for me. Let's start the project right away.`,
                time: replyTimeStr
              }
            ],
            lastMsg: `Great! That price of $${proposalVal} USD works for me.`
          }
        };
      });

      // Show the start project popup modal immediately when the client replies
      setShowStartProjectPopup(true);
    }, 2000);
  };


  // --- 4. RENDER BLOK DEAL AREA DINAMIS (baris 379 - 410) ---
  const renderFreelancerDeal = () => {
    switch (currentDeal.dealStatus) {
      case 'price_negotiation':
        return (
          <div className="fl-deal-card-negotiation">
            <div className="negotiation-header">PRICE PROPOSAL</div>
            <div className="negotiation-divider"></div>
            <div className="negotiation-body">
              <span className="negotiation-label">OFFER</span>
              <div className="negotiation-input-row">
                <span className="negotiation-sign">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter Price"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="negotiation-input"
                />
                <span className="negotiation-currency">USD</span>
              </div>
              <button
                type="button"
                className="negotiation-btn-send"
                onClick={handleSendProposal}
              >
                Send
              </button>
            </div>
          </div>
        );
      case 'price_agreed':
        return (
          <div className="fl-deal-card" style={{ background: '#F6FFED', border: '1px solid #B7EB8F' }}>
            <h4 style={{ color: '#389E0D' }}>Price Proposal Agreed!</h4>
            <p>Client has agreed to your budget. Please start the project to proceed.</p>
            <div className="price-tag" style={{ color: '#389E0D' }}>$ {currentDeal.proposalPrice} USD</div>
            <button 
              type="button" 
              className="fl-btn-action" 
              style={{ background: '#CCFF00', color: '#000033' }}
              onClick={handleStartProject}
            >
              Start Project
            </button>
          </div>
        );
      case 'pending':
        return (
          <div className="fl-deal-card">
            <h4>Price Proposal Sent</h4>
            <p>Waiting for the client ({activeChat.name}) to Accept or Decline your quote.</p>
            <div className="price-tag">$ {currentDeal.proposalPrice} USD</div>
          </div>
        );
      case 'declining':
        return (
          <div style={{ textAlign: 'center', width: '100%', padding: '5px 0' }}>
            <div className="status-capsule-revision">
              Client Want Revision on the Draft Project
            </div>
          </div>
        );
      case 'counter-sent':
        return (
          <div className="fl-deal-card" style={{ background: '#FFFBE6', border: '1px solid #FFE58F' }}>
            <h4>Counter Offer Received!</h4>
            <p>Client proposed a new budget. Reviewing request...</p>
            <div className="price-tag" style={{ color: '#D46B08' }}>$ {currentDeal.proposalPrice} USD</div>
          </div>
        );
      case 'accepted':
        return (
          <div className="fl-deal-card" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
            <h4 style={{ color: '#096DD9' }}><i className="fas fa-sync-alt fa-spin"></i> Revision Resolved</h4>
            <p>Waiting for the client to upload the receipt / proof of payment to finish the project.</p>
          </div>
        );
      case 'project_started':
        return (
          <div className="fl-deal-card" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
            <h4 style={{ color: '#096DD9' }}><i className="fas fa-play-circle"></i> Project in Progress</h4>
            <p>You can now work on the project. Once completed, submit for client review.</p>
            <button type="button" className="fl-btn-action" onClick={freelancerSubmitForReview}>Submit Work for Review</button>
          </div>
        );
      case 'in_review':
        return (
          <div className="fl-deal-card">
            <h4><i className="fas fa-hourglass-half"></i> Work Under Review</h4>
            <p>You have submitted the work. Waiting for the client to approve or request revision.</p>
            <span className="fl-status-badge" style={{ background: '#FAAD14', color: '#fff' }}>In Review</span>
          </div>
        );
      case 'client_approved':
      case 'payment_received':
        return (
          <div className="fl-complete-card">
            <h4>Complete The Project?</h4>
            <p>Make sure the payment amount are correct and successful before you complete the project.</p>
            <button type="button" className="fl-btn-complete" onClick={freelancerSelesaikanProject}>Complete</button>
          </div>
        );
      case 'completed_success':
        return (
          <div className="fl-deal-card" style={{ background: '#F6FFED', border: '1px solid #B7EB8F' }}>
            <div style={{ width: '52px', height: '52px', background: '#CCFF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <i className="fas fa-check" style={{ fontSize: '1.4rem', color: '#000033' }}></i>
            </div>
            <h4 style={{ color: '#389E0D' }}>Project Completed</h4>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>The project has been successfully completed.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
            --bg-topbar: #000060;       
            --sidebar-bg: #FFFFFF;
            --accent-lime: #CCFF00; 
            --text-dark: #000033;
            --grey-text: #666666;
            --msg-bubble-left: #FFFFFF;
            --msg-bubble-right: #000066; 
            --body-bg: #F5F5F5;          
        }
        body { background-color: var(--body-bg); color: var(--text-dark); overflow: hidden; margin: 0; padding: 0; box-sizing: border-box; }
        .container { display: flex; height: 100vh; }

        .right-area { flex: 1; display: flex; flex-direction: column; height: 100vh; }
        .top-bar { height: 80px; background: var(--bg-topbar); display: flex; align-items: center; justify-content: flex-end; padding: 0 2rem; }
        .header-right { display: flex; align-items: center; gap: 20px; }
        .notification-icon { position: relative; cursor: pointer; }
        .notification-icon i { font-size: 1.2rem; color: #FFFFFF; }
        .notification-icon::after { content: ''; position: absolute; top: -2px; right: -2px; width: 6px; height: 6px; background-color: var(--accent-lime); border-radius: 50%; }
        .header-user-info { display: flex; flex-direction: column; text-align: right; }
        .header-user-info .user-name { font-size: 0.9rem; font-weight: 700; color: #FFFFFF; }
        .header-user-info .user-badge { font-size: 0.65rem; font-weight: 800; color: var(--accent-lime); letter-spacing: 0.5px; margin-top: 2px; }
        .header-avatar img.profile-img { width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--accent-lime); object-fit: cover; }
        .main-content { flex: 1; display: flex; background: white; padding: 0; gap: 0; overflow: hidden; }
        .messages-list { width: 380px; border-right: 1px solid #E5E5E5; background: white; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .messages-list .search-box-chat { position: relative; }
        .messages-list .search-box-chat i { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--grey-text); }
        .messages-list .search-box-chat input { width: 100%; padding: 14px 20px 14px 45px; border-radius: 30px; border: none; background: #F0F0F0; outline: none; font-size: 0.9rem; }
        .chat-item { background: transparent; border-radius: 15px; padding: 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; position: relative; }
        .chat-item img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--accent-lime); }
        .chat-info { flex: 1; }
        .chat-info h4 { font-size: 0.9rem; margin-bottom: 2px; }
        .chat-info p { font-size: 0.75rem; color: var(--grey-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
        .chat-meta { text-align: right; }
        .chat-meta span { font-size: 0.65rem; color: var(--grey-text); }
        .unread-dot { width: 18px; height: 18px; background: var(--accent-lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; margin-left: auto; margin-top: 5px; }
        .chat-window { flex: 1; background: #F4F5F7; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 1.5rem 2rem; display: flex; align-items: center; gap: 15px; background: white; border-bottom: 1px solid #E5E5E5; }
        .chat-header img { width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--accent-lime); }
        .status-dot { color: #73D13D; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; font-weight: 500; margin-top: 2px; }
        .status-dot i { font-size: 0.6rem; }
        .chat-messages { flex: 1; padding: 25px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; overflow-x: hidden; }
        .bubble { max-width: 70%; padding: 15px 20px; border-radius: 18px; font-size: 0.9rem; position: relative; line-height: 1.4; }
        .bubble .time { display: block; font-size: 0.65rem; margin-top: 8px; text-align: right; opacity: 0.7; }
        .bubble.left { background: var(--msg-bubble-left); align-self: flex-start; border-top-left-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .bubble.right { background: var(--msg-bubble-right); color: white; align-self: flex-end; border-top-right-radius: 4px; }
        .attachment-container { position: relative; display: inline-block; }
        .attachment-menu { display: none; position: absolute; bottom: 45px; left: -15px; background-color: var(--msg-bubble-right); border-radius: 12px; padding: 10px 0; width: 200px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); z-index: 100; animation: fadeInMenu 0.2s ease-out; }
        @keyframes fadeInMenu { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .attachment-menu.show { display: block; }
        .attachment-item { display: flex; align-items: center; gap: 15px; padding: 12px 20px; color: #FFFFFF; cursor: pointer; transition: background 0.2s ease; }
        .attachment-item:hover { background-color: rgba(255, 255, 255, 0.1); }
        .attachment-item i { font-size: 1.1rem; width: 20px; text-align: center; color: #FFFFFF !important; }
        .attachment-item span { font-size: 0.9rem; font-weight: 600; }
        .file-attachment-bubble { background-color: var(--msg-bubble-right); color: #FFFFFF; padding: 12px 16px; border-radius: 18px; border-top-right-radius: 4px; display: flex; align-items: center; justify-content: space-between; gap: 20px; min-width: 280px; max-width: 350px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .file-info-wrapper { display: flex; align-items: center; gap: 12px; }
        .file-icon-box { width: 38px; height: 38px; background-color: rgba(255, 255, 255, 0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .file-icon-box i { font-size: 1.1rem; color: #FFFFFF !important; }
        .file-meta { display: flex; flex-direction: column; text-align: left; }
        .file-meta .file-name { font-size: 0.85rem; font-weight: 600; line-height: 1.3; word-break: break-all; }
        .file-meta .file-size { font-size: 0.7rem; opacity: 0.6; margin-top: 2px; }
        .file-download-btn { cursor: pointer; opacity: 0.8; transition: opacity 0.2s; font-size: 1rem; flex-shrink: 0; }
        .file-download-btn:hover { opacity: 1; }
        .chat-input-area { padding: 1.5rem 2rem; background: #F4F5F7; display: flex; align-items: center; gap: 15px; flex-shrink: 0; }
        .input-wrapper { flex: 1; background: var(--msg-bubble-right); border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 15px; }
        .input-wrapper input { flex: 1; border: none; outline: none; font-size: 0.95rem; background: transparent; color: white; }
        .input-wrapper input::placeholder { color: rgba(255, 255, 255, 0.6); }
        .input-wrapper i { color: rgba(255, 255, 255, 0.8); cursor: pointer; font-size: 1.1rem; }
        .btn-send { background: var(--accent-lime); width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; color: var(--text-dark); font-size: 1.1rem; }
        .fl-deal-card { background: #FFFFFF; color: #000033; padding: 15px 20px; margin: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center; }
        .fl-deal-card h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 5px; }
        .fl-deal-card p { font-size: 0.8rem; color: #666; margin-bottom: 10px; }
        .fl-deal-card .price-tag { font-size: 1.4rem; font-weight: 800; color: #2F54EB; margin-bottom: 10px; }
        .fl-btn-action { background: #CCFF00; color: #000033; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.8rem; width: 100%; }
        .fl-status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; background: #E0E0E0; }
        .status-capsule-revision { background-color: #000066; color: #FFFFFF; padding: 12px 30px; border-radius: 30px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 10px auto; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); animation: fadeInCapsule 0.3s ease-out; }
        @keyframes fadeInCapsule { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .fl-complete-card { background: #FFFFFF; border: none; border-radius: 16px; padding: 25px 20px; margin: 15px auto; max-width: 450px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .fl-complete-card h4 { font-size: 1rem; font-weight: 700; color: #000033; margin-bottom: 8px; }
        .fl-complete-card p { font-size: 0.8rem; color: #666666; line-height: 1.4; margin-bottom: 18px; padding: 0 15px; }
        .fl-btn-complete { background-color: #13199c; color: #FFFFFF; border: none; padding: 12px 0; width: 90%; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
        .fl-btn-complete:hover { background-color: #0e137c; }

        /* System messages */
        .sys-msg-wrap { display: flex; justify-content: center; width: 100%; margin: 6px 0; }
        .sys-msg-approved { background: linear-gradient(135deg, #CCFF00 0%, #a8d400 100%); color: #000033; padding: 10px 22px; border-radius: 30px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(204,255,0,0.35); animation: fadeInCapsule 0.4s ease; }
        .sys-msg-revision { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: #fff; padding: 10px 22px; border-radius: 30px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(238,90,36,0.3); animation: fadeInCapsule 0.4s ease; }
        .sys-msg-notify { background: #F0F4FF; color: #2F54EB; padding: 8px 18px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 7px; border: 1px solid #c8d8ff; animation: fadeInCapsule 0.4s ease 0.1s both; }
        .sys-msg-completed { background: linear-gradient(135deg, #CCFF00 0%, #a8d400 100%); color: #000033; padding: 10px 22px; border-radius: 30px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(204,255,0,0.35); animation: fadeInCapsule 0.4s ease; }
        .sys-msg-order-accepted { background: linear-gradient(135deg, #000066 0%, #0000aa 100%); color: #fff; padding: 12px 22px; border-radius: 16px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: flex-start; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,102,0.25); animation: fadeInCapsule 0.4s ease; max-width: 380px; line-height: 1.4; }
        .sys-msg-order-accepted i { margin-top: 2px; flex-shrink: 0; color: #CCFF00; }

        /* Client review action card (inside chat) */
        .client-review-card { background: white; border: 1.5px solid #E5E7EB; border-radius: 16px; padding: 16px 20px; max-width: 300px; align-self: flex-start; box-shadow: 0 4px 14px rgba(0,0,0,0.08); animation: fadeInCapsule 0.4s ease; }
        .client-review-card .cr-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .client-review-card .cr-avatar { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #CCFF00; object-fit: cover; }
        .client-review-card .cr-name { font-size: 0.85rem; font-weight: 700; color: #000033; }
        .client-review-card .cr-role { font-size: 0.7rem; color: #888; }
        .client-review-card .cr-body { font-size: 0.8rem; color: #555; margin-bottom: 14px; line-height: 1.4; }
        .client-review-card .cr-actions { display: flex; gap: 8px; }
        .cr-btn-revision { flex: 1; background: white; color: #EF4444; border: 1.5px solid #EF4444; padding: 9px 0; border-radius: 8px; font-weight: 700; font-size: 0.78rem; cursor: pointer; transition: 0.2s; }
        .cr-btn-revision:hover { background: #FFF5F5; }

        .fl-deal-card-negotiation {
          width: 447px;
          height: 237px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .negotiation-header {
          font-size: 0.82rem;
          font-weight: 700;
          color: #666666;
          text-align: left;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        .negotiation-divider {
          height: 1px;
          background: #E5E7EB;
          margin-bottom: 16px;
        }
        .negotiation-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .negotiation-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #888888;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .negotiation-input-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .negotiation-sign {
          font-size: 1.6rem;
          font-weight: 800;
          color: #000000;
        }
        .negotiation-input {
          width: 120px;
          border: none;
          outline: none;
          font-size: 1.25rem;
          font-weight: 700;
          color: #000033;
          border-bottom: 2px solid #E5E7EB;
          padding-bottom: 2px;
          text-align: left;
        }
        .negotiation-input::placeholder {
          color: #CCCCCC;
        }
        .negotiation-currency {
          font-size: 0.82rem;
          font-weight: 600;
          color: #888888;
        }
        .negotiation-btn-send {
          background: #CCFF00;
          color: #000033;
          border: none;
          width: 100%;
          max-width: 180px;
          padding: 10px 0;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .negotiation-btn-send:hover {
          background: #B3FF00;
        }
      ` }} />

      {/* SIDEBAR UTAL (MEREPLIKASI BARIS 235-260) */}
      <Sidebar onChangePage={onChangePage} currentPage={currentPage} />

      {/* RIGHT WORKSPACE AREA */}
      <div className="right-area">
        {/* TOP BAR HEADER (baris 265-283) */}
        <header className="top-bar">
          <div className="header-right">
            <div className="notification-icon">
              <i className="fas fa-bell"></i>
            </div>
            <div className="header-user-info">
              <span className="user-name name">{userProfile.name}</span>
              <span className="user-badge">VERIFIED PRO</span>
            </div>
            <div className="header-avatar">
              <img src={userProfile.profileImage} className="profile-img" alt={userProfile.name} />
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT SPLIT */}
        <main className="main-content">
          {/* LEFT: CHANNEL LIST IN CHAT VIEW (baris 285-306) */}
          <div className="messages-list">
            <div className="search-box-chat">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="What are you looking for?" />
            </div>
            {Object.values(chats).map((chat) => (
              <div
                key={chat.id}
                className="chat-item"
                style={{
                  background: activeClientId === chat.id ? '#F0F2F5' : 'transparent',
                  borderRadius: '15px'
                }}
                onClick={() => {
                  setActiveClientId(chat.id);
                  setChats(prev => ({
                    ...prev,
                    [chat.id]: {
                      ...prev[chat.id],
                      unread: 0
                    }
                  }));
                }}
              >
                <img src={chat.avatar} alt={chat.name} />
                <div className="chat-info">
                  <h4>{chat.name}</h4>
                  <p>{chat.lastMsg}</p>
                </div>
                <div className="chat-meta">
                  <span>{chat.time}</span>
                  {chat.unread > 0 && <div className="unread-dot">{chat.unread}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: CHAT CONTENT CONTAINER WINDOW (baris 308) */}
          <div className="chat-window">
            <div className="chat-header">
              <img src={activeChat.avatar} alt={activeChat.name} />
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{activeChat.name}</h3>
                <span className="status-dot"><i className="fas fa-circle"></i> Online</span>
              </div>
            </div>

            {/* AREA DEAL DINAMIS */}
            <div 
              id="freelancerDealArea" 
              style={currentDeal.dealStatus === 'price_negotiation' ? { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F5F7' } : {}}
            >
              {renderFreelancerDeal()}
            </div>

            {/* MESSAGE CONTAINER (baris 329) */}
            {currentDeal.dealStatus !== 'price_negotiation' && (
              <div className="chat-messages" id="chatContainer" ref={chatContainerRef}>
                {chatMessages.map((msg) => {
                  // File attachment bubble
                  if (msg.type === 'file') {
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px' }}>
                        <div className="file-attachment-bubble">
                          <div className="file-info-wrapper">
                            <div className="file-icon-box">
                              <i className={msg.fileIcon}></i>
                            </div>
                            <div className="file-meta">
                              <span className="file-name">{msg.fileName}</span>
                              <span className="file-size">{msg.fileSize}</span>
                            </div>
                          </div>
                          <div className="file-download-btn">
                            <i className="fas fa-arrow-down"></i>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // System message (approved / revision / notify / completed)
                  if (msg.type === 'system') {
                    return (
                      <div key={msg.id} className="sys-msg-wrap">
                        {msg.variant === 'approved' && (
                          <div className="sys-msg-approved">
                            <i className="fas fa-check-circle"></i>
                            {msg.text}
                          </div>
                        )}
                        {msg.variant === 'revision' && (
                          <div className="sys-msg-revision">
                            <i className="fas fa-redo-alt"></i>
                            {msg.text}
                          </div>
                        )}
                        {msg.variant === 'notify' && (
                          <div className="sys-msg-notify">
                            <i className="fas fa-bell"></i>
                            {msg.text}
                          </div>
                        )}
                        {msg.variant === 'completed' && (
                          <div className="sys-msg-completed">
                            <i className="fas fa-trophy"></i>
                            {msg.text}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Payment receipt image bubble
                  if (msg.type === 'bukti-pembayaran') {
                    return (
                      <div key={msg.id} className="bubble left" style={{ padding: '10px', maxWidth: '320px' }}>
                        <div style={{
                          width: '300px',
                          height: '180px',
                          background: '#D9D9D9',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#666666',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          marginBottom: '6px'
                        }}>
                          Bukti pembayaran
                        </div>
                        <span className="time" style={{ textAlign: 'left', display: 'block' }}>{msg.time}</span>
                      </div>
                    );
                  }

                  // Client review action card
                  if (msg.type === 'client-review') {
                    return (
                      <div key={msg.id} className="client-review-card">
                        <div className="cr-header">
                          <img src={activeChat.avatar} alt={activeChat.name} className="cr-avatar" />
                          <div>
                            <div className="cr-name">{activeChat.name}</div>
                            <div className="cr-role">Client · Reviewing Draft</div>
                          </div>
                        </div>
                        <div className="cr-body">
                          I've reviewed the draft you sent. Please confirm my decision:
                        </div>
                        <div className="cr-actions">
                          <button className="cr-btn-approve" onClick={handleClientApprove}>
                            <i className="fas fa-check"></i> Approve
                          </button>
                          <button className="cr-btn-revision" onClick={handleClientRevision}>
                            <i className="fas fa-redo"></i> Revision
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Standard text bubble
                  return (
                    <div key={msg.id} className={`bubble ${msg.sender === 'veny' ? 'right' : 'left'}`}>
                      {msg.text}
                      <span className="time">{msg.time}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FOOTER CHAT INPUT FORM (baris 342) */}
            <form className="chat-input-area" id="messageForm" onSubmit={handleSendMessage}>
              <div className="input-wrapper">
                {/* ATTACHMENT ACTION BUTTON CONTAINER */}
                <div className="attachment-container">
                  <i
                    className="fas fa-plus"
                    id="btnAttachment"
                    ref={btnAttachmentRef}
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  ></i>

                  {/* DROPDOWN MENU SELEKTOR ATTACHMENT */}
                  <div className={`attachment-menu ${showAttachmentMenu ? 'show' : ''}`} id="attachmentMenu" ref={attachmentMenuRef}>
                    <div className="attachment-item" onClick={() => handleSendFileBubble('File')}>
                      <i className="fas fa-file-alt"></i>
                      <span>File</span>
                    </div>
                    <div className="attachment-item" onClick={() => handleSendFileBubble('Photo & videos')}>
                      <i className="fas fa-image"></i>
                      <span>Photo & videos</span>
                    </div>
                    <div className="attachment-item" onClick={() => handleSendFileBubble('Audio')}>
                      <i className="fas fa-headphones"></i>
                      <span>Audio</span>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  id="messageInput"
                  placeholder="Type a message..."
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <i className="far fa-smile"></i>
              </div>
              <button type="submit" className="btn-send">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* START PROJECT POPUP MODAL */}
      {showStartProjectPopup && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowStartProjectPopup(false)}
        >
          <div 
            style={{
              background: 'white',
              width: '400px',
              borderRadius: '24px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              color: '#000033'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: '#CCFF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <i className="fas fa-handshake" style={{ fontSize: '1.8rem', color: '#000033' }}></i>
              </div>
            </div>
            <h3 style={{ fontWeight: '800', fontSize: '1.4rem', marginBottom: '10px' }}>Price Proposal Agreed!</h3>
            <p style={{ fontSize: '0.82rem', color: '#666666', marginBottom: '24px', lineHeight: '1.4' }}>
              {activeChat.name} has agreed to your proposal. Click below to start the project.
            </p>
            <button 
              type="button" 
              onClick={handleStartProject}
              style={{
                background: '#CCFF00',
                color: '#000033',
                border: 'none',
                width: '100%',
                padding: '14px',
                borderRadius: '50px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(204,255,0,0.3)'
              }}
            >
              Start Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}