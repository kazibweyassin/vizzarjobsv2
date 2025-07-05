import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="w-full">
        <Outlet />
      </main>
      
      {/* Footer */}
      
    </div>
  );
};

export default AppLayout;