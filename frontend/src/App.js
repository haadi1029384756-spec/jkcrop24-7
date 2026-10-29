import React from 'react';
import Registration from './components/Registration';
import FarmerDashboard from './components/FarmerDashboard';

function App() {
  // Set this to 'true' to see Dashboard, 'false' to see Registration
  const isLoggedIn = false; 

  return (
    <div>
      {isLoggedIn ? <FarmerDashboard /> : <Registration />}
    </div>
  );
}
export default App;