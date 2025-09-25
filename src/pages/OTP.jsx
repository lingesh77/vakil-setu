import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Scale, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const inputRefs = useRef([]);
  const [user, setUser] = useState();

  const { signUpData } = location.state || {};

  // Send OTP when component mounts
  useEffect(() => {
    const sendOtp = async () => {
      try {
        await axios.post('http://localhost:5000/send-otp', {
          email: signUpData.email,
          fullName: signUpData.fullName
        });
        toast({
          title: 'OTP Sent',
          description: `OTP has been sent to ${signUpData.email}`
        });
      } catch (err) {
        toast({
          title: 'Error sending OTP',
          description: 'Please try again',
          variant: 'destructive'
        });
      }
    };
    sendOtp();
  }, [signUpData.email, signUpData.fullName]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter all 6 digits',
        variant: 'destructive'
      });
      return;
    }

    // Call backend but ignore response
    try {
      await axios.post('http://localhost:5000/verify-otp', {
        email: signUpData.email,
        otp: otpString
      });
    } catch (err) {
      console.warn('OTP verification ignored', err);
    }

    // Proceed to create Firebase user anyway
    try {
      await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);

     

  

      toast({
        title: 'Signed Up',
        description: 'Successfully signed up!',
        variant: 'default'
      });

      setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while creating user',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    try {
      await axios.post('http://localhost:5000/send-otp', {
        email: signUpData.email,
        fullName: signUpData.fullName
      });
      toast({
        title: 'OTP Resent',
        description: `A new OTP has been sent to ${signUpData.email}`
      });
    } catch (err) {
      toast({
        title: 'Error Resending OTP',
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 legal-gradient">
      <Card className="w-full max-w-md legal-card animate-slide-up">
        <CardHeader className="text-center">
          <Scale className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {signUpData.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-lg font-semibold border-2 border-border bg-input rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleResendOtp}
              className="text-sm text-primary"
            >
              Resend OTP
            </Button>
          </div>

          <Button
            onClick={handleVerifyOtp}
            className="w-full legal-button"
            disabled={otp.some((digit) => !digit)}
          >
            Proceed
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTP;
