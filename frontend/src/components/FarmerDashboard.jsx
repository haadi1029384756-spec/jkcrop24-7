import React from 'react';
import { Camera, BookOpen, MessageSquare, Volume2, Bell } from 'lucide-react';

const FarmerDashboard = () => {
  const menuItems = [
    { icon: <Camera size={32}/>, label: "Report Disease", color: "bg-red-500", action: "upload" },
    { icon: <BookOpen size={32}/>, label: "Fertilizer Guide", color: "bg-blue-500", action: "guide" },
    { icon: <Volume2 size={32}/>, label: "Doctor Lectures", color: "bg-green-500", action: "media" },
    { icon: <MessageSquare size={32}/>, label: "AI Help (Voice/Text)", color: "bg-purple-500", action: "bot" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, Farmer 👋</h1>
          <p className="text-slate-500">Kashmir Region | Apple Orchard</p>
        </div>
        <div className="relative">
          <Bell className="text-slate-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">3</span>
        </div>
      </div>

      {/* Quick Alerts Section */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg shadow-sm">
        <p className="text-yellow-800 font-medium">⚠️ ALERT: Late Blight detected in neighboring village. Check your crops!</p>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, idx) => (
          <button key={idx} className="flex flex-col items-center justify-center p-6 rounded-3xl shadow-md bg-white border-b-4 border-slate-200 active:scale-95 transition">
            <div className={`${item.color} text-white p-4 rounded-2xl mb-3`}>
              {item.icon}
            </div>
            <span className="font-bold text-slate-700 text-center">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Nav for Govt Schemes */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around items-center">
        <button className="text-green-600 font-bold flex flex-col items-center"><BookOpen size={20}/> <span className="text-xs">Schemes</span></button>
        <button className="text-slate-400 font-bold flex flex-col items-center"><Volume2 size={20}/> <span className="text-xs">Help</span></button>
      </div>
    </div>
  );
};
export default FarmerDashboard;