import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OTP from "./pages/OTP";

import CaseSubmission from "./pages/CaseSubmission";
import LegalChatbot from "./pages/chat-bot";
import AdvocateSearch from "./pages/AdvocateSearch";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/Signup";
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './pages/firebase'
import { useState,useEffect } from "react";
/* import VakilSetu from "./pages/VakilSetu";
 */
const queryClient = new QueryClient();

function App(){ 
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() );
        }
      }
    })
  },[])
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user?(<CaseSubmission/>):(<Index />)} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/case-submission" element={<CaseSubmission />} />
          <Route path="/advocate-search" element={<AdvocateSearch />} />
<Route path="/vakil-setu" element={<LegalChatbot />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>)
};

export default App;
