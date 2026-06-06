import React, { useState, useEffect } from 'react';
import LandingPage from './Client/LandingPage';
import ExplorePage from './Client/Explore';
import ChatsApp from './Client/Chat';       // ← sudah ada
import FreeLanZDashboard from './Client/Project'; // ← tambah ini (file sudah ada di folder)
import ProjectEvaluation from './Client/Rating'; // ← tambah ini (file sudah ada di folder)
import ChooseRole from './Client/ChooseRole';
import Register from './Client/Register';
import RegisterClient from './Client/RegisterClient';
import RegisterFreelancer from './Freelancer/Register/RegisterFreelancer';
import RegisterFreelancer2 from './Freelancer/Register/RegisterFreelancer2';
// import FreelancerDashboard from './Freelancer/Dashboard/Dashboard';
import Login from './Client/Login';
import ClientProfile from './Client/Profile/ClientProfile';

import DashboardFromLancer from './Freelancer/Dashboard/DashBoardLancer'; 
import UserFeed from './Freelancer/UserFeed/UserFeed';
import Messages from './Freelancer/Messages/Messages';
import Order from './Freelancer/Order/Order';
import SettingUser from './Freelancer/SettingUser/SettingUser';

// Clear demo state on initial page load/reload to reset template states
localStorage.removeItem('freelancer_orders');
localStorage.removeItem('freelancer_chats_v2');
localStorage.removeItem('shared_deal_status');
localStorage.removeItem('open_chat_client');
localStorage.removeItem('client_projects');

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  // State global untuk memantau status rating agar sinkron secara real-time saat berpindah halaman
  const [isRated, setIsRated] = useState(() => !!localStorage.getItem("isProjectRated"));

  // SINKRONISASI: Jalankan efek untuk memantau perubahan localStorage jika user submit rating
  useEffect(() => {
    const handleStorageChange = () => {
      setIsRated(!!localStorage.getItem("isProjectRated"));
    };
    
    // Periksa ulang setiap kali halaman berubah
    handleStorageChange();
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onChangePage={setCurrentPage} />;
      case 'chooseRole':
        return <ChooseRole onChangePage={setCurrentPage} />;
      case 'register':
        return <Register onChangePage={setCurrentPage} />;
      case 'registerClient':
        return <RegisterClient onChangePage={setCurrentPage} />;
      case 'registerFreelancer':
        return <RegisterFreelancer onChangePage={setCurrentPage} />;
      case 'registerFreelancer2':
        return <RegisterFreelancer2 onChangePage={setCurrentPage} />;
      case 'login':
        return <Login onChangePage={setCurrentPage} />;
      case 'explore':
        return <ExplorePage onChangePage={setCurrentPage} currentPage={currentPage} />;
      case 'project':
        return (
          <FreeLanZDashboard 
            onChangePage={setCurrentPage} 
            currentPage={currentPage} 
            isRated={isRated} 
          />
        );
      case 'rating':
        return <ProjectEvaluation onChangePage={setCurrentPage} />; 
      case 'profile':
        return <ClientProfile onChangePage={setCurrentPage} currentPage={currentPage} />;

      // =========================================================================
      // CASE HALAMAN FREELANCER (Sudah Bersih & Kirim Props Lengkap)
      // =========================================================================
      case 'freelancerDashboard':
        // Memanggil komponen dari DashBoardLancer.jsx yang sudah di-import di atas
        return <DashboardFromLancer onChangePage={setCurrentPage} currentPage={currentPage} />;
      case 'userFeed':
        return <UserFeed onChangePage={setCurrentPage} currentPage={currentPage} />;
      case 'messages':
        return <Messages onChangePage={setCurrentPage} currentPage={currentPage} />;
      case 'order':
        return <Order onChangePage={setCurrentPage} currentPage={currentPage} />;
      case 'settingUser':
        return <SettingUser onChangePage={setCurrentPage} currentPage={currentPage} />;

      case 'chat':
      default:
        return <ChatsApp onChangePage={setCurrentPage} currentPage={currentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;