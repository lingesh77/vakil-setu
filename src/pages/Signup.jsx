import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [userType, setUserType] = useState('user');
  const dobInputRef = useRef(null);

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    district: '',
    password: '',
    confirmPassword: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signUpData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address including "@" and domain.',
        variant: 'destructive',
      });
      return;
    }

    // Phone validation
    const phoneOnly = signUpData.phone.replace(/\D/g, '');
    if (phoneOnly.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a 10-digit number',
        variant: 'destructive',
      });
      return;
    }

    // Strong password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()\-_=+{}[\]:;"'<>,./\\|]).{8,}$/;
    if (!passwordPattern.test(signUpData.password)) {
      toast({
        title: 'Weak Password',
        description:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
        variant: 'destructive',
      });
      return;
    }

    // Password match check
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const formattedPhone = `+91${phoneOnly}`;
    console.log('SignUp Data:', signUpData);

    toast({
      title: 'Account Created',
      description: `Account created as ${userType}. Please verify your OTP.`,
    });

    setTimeout(() => {
      navigate('/otp', { state: { userType, phone: formattedPhone,signUpData:signUpData} });
    }, 1000);
  };

  const ReqLabel = ({ children }) => (
    <Label className="font-medium">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 legal-gradient">
      <Card className="w-full max-w-lg legal-card">
        <CardHeader className="text-center">
          <Scale className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join our legal platform</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
 
          <div className="flex justify-center">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Already have an account? Sign in
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <ReqLabel>Full Name (As per ID)</ReqLabel>
              <Input
                name="fullName"
                value={signUpData.fullName}
                onChange={handleChange}
                placeholder="Enter your full official name"
                required
              />
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <ReqLabel>Date of Birth</ReqLabel>
              <div className="relative flex items-center">
                <Input
                  ref={dobInputRef}
                  name="dob"
                  type="date"
                  value={signUpData.dob}
                  onChange={handleChange}
                  placeholder="Select your date of birth"
                  required
                  className="pr-10 cursor-pointer"
                />
                <Calendar
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                  color="#FFD700"
                  onClick={() => {
                    if (dobInputRef.current?.showPicker) {
                      dobInputRef.current.showPicker();
                    } else {
                      dobInputRef.current?.click();
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <ReqLabel>Mobile Number</ReqLabel>
              <Input
                name="phone"
                type="tel"
                value={signUpData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>Email Address</ReqLabel>
              <Input
                name="email"
                type="email"
                value={signUpData.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>Full Postal Address</ReqLabel>
              <Input
                name="address"
                value={signUpData.address}
                onChange={handleChange}
                placeholder="Enter your complete postal address"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>State</ReqLabel>
              <Input
                name="state"
                value={signUpData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>District</ReqLabel>
              <Input
                name="district"
                value={signUpData.district}
                onChange={handleChange}
                placeholder="Enter your district / city"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>Password</ReqLabel>
              <Input
                name="password"
                type="password"
                value={signUpData.password}
                onChange={handleChange}
                placeholder="At least 8 chars, UPPER/lower/special/#"
                required
              />
            </div>

            <div className="space-y-2">
              <ReqLabel>Confirm Password</ReqLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={signUpData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type your password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
