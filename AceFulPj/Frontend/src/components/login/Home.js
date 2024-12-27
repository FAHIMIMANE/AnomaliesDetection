import React from 'react';

function Home() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
