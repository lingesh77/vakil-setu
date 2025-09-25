import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageCarousel } from '@/components/ImageCarousel';
import court1 from '@/assets/court-1.jpg';
import court2 from '@/assets/court-2.jpg';
import court3 from '@/assets/court-3.jpg';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth,db} from './firebase'
import{ doc, getDoc } from 'firebase/firestore';
export default function SignInPage() {
  const [userType, setUserType] = useState('user');
  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const carouselImages = [court1, court2, court3];

  const handleSubmit =async (e) => {
    e.preventDefault();

try{
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
  

              navigate('/case-submission') 
                  toast({
      title: 'Login Successful',
      description: `User Logged in Successfully `,
    });

      }



}
catch (error) {
      console.error('Error signing in:', error);
       toast({
      title: 'Login Unsuccessful',
      description: `Invalid email or password`,
      variant: 'destructive',
    });
}



 

  };
  const ReqLabel = ({ children }) => (
    <Label className="font-medium">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ImageCarousel images={carouselImages} className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <Scale className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Advocate Flow</h1>
            <p className="text-xl opacity-90">Professional Legal Solutions</p>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 legal-gradient">
        <Card className="w-full max-w-md legal-card">
          <CardHeader className="text-center">
            <Scale className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
         
            {/* Switch to Sign Up Page */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/signup')}
              >
                Don’t have an account? Sign up
              </Button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
       
                   <div className="space-y-2">
                     <ReqLabel>Email Address</ReqLabel>
                     <Input
                       name="email"
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="yourname@example.com"
                       required
                     />
                   </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=> setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
