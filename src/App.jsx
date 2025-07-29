import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import InvoicesPage from "@/components/pages/InvoicesPage";
import ClientsPage from "@/components/pages/ClientsPage";
import ServicesPage from "@/components/pages/ServicesPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InvoicesPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="services" element={<ServicesPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;