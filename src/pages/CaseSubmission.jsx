import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Upload, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import axios from 'axios';

const CaseSubmission = () => {
  const [userData, setUserData] = useState({});
  const [caseData, setCaseData] = useState({
    caseName: '',
    caseNumber: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch logged in user's details from Firestore
  const userdetailsfetching = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User signed in:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });
  };

  console.log("User Data:", userData);

  const handleInputChange = (e) => {
    setCaseData({
      ...caseData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (file) => {
    if (file.type === 'application/pdf') {
      setSelectedFile(file);
      toast({
        title: 'File Selected',
        description: `${file.name} selected successfully`
      });
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a PDF file',
        variant: 'destructive'
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!caseData.caseName || !caseData.caseNumber || !caseData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Case Submitted',
      description: 'Your case has been submitted successfully!'
    });

    setTimeout(() => {
      navigate('/advocate-search');
    }, 1500);
  };

  const userdetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/userdetails', { userData });
      console.log('User Details Response:', response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    userdetailsfetching();
  }, []);

  /* 
  useEffect(() => {
    userdetails();
  }, [userData]); 
  */

  console.log('User Data:', userData);

  return (
    <div className="min-h-screen legal-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Scale className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Submit New Case</h1>
          <p className="text-muted-foreground mt-2">
            Provide case details and upload relevant documents
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Case Information */}
          <Card className="legal-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Case Information
              </CardTitle>
              <CardDescription>
                Enter the basic details of your legal case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseName">Case Name *</Label>
                  <Input
                    id="caseName"
                    name="caseName"
                    placeholder="Enter case name"
                    value={caseData.caseName}
                    onChange={handleInputChange}
                    className="legal-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number *</Label>
                  <Input
                    id="caseNumber"
                    name="caseNumber"
                    placeholder="Enter case number"
                    value={caseData.caseNumber}
                    onChange={handleInputChange}
                    className="legal-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Case Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of your case..."
                    value={caseData.description}
                    onChange={handleInputChange}
                    className="legal-input min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full legal-button flex items-center gap-2"
                >
                  Submit Case
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="legal-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload relevant PDF documents for your case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">Selected file:</p>
                    <p className="font-medium text-primary">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your PDF file here, or
                    </p>
                    <Label htmlFor="fileInput">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Choose File</span>
                      </Button>
                    </Label>
                    <Input
                      id="fileInput"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Supported format: PDF (Max size: 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseSubmission;