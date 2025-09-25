import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Scale, Search, MapPin, Calendar, Award, Phone, Mail,
  User, Star, Briefcase, Clock, X, CheckCircle,
  AlertCircle, CalendarIcon, Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// ---- Sample Data ----

const mockAdvocates = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    experience: 15,
    specialization: ["Criminal Law", "Corporate Law"],
    location: "New Delhi",
    qualification: "LLB, LLM (Harvard)",
    description: "Senior advocate with extensive experience in criminal and corporate law. Known for handling high-profile cases with exceptional success rate.",
    casesWon: 245,
    rating: 4.8,
    phone: "+91 98765 43210",
    email: "rajesh.kumar@lawfirm.com",
    practiceAreas: ["Criminal Defense", "Corporate Litigation", "Constitutional Law"],
    barCouncil: "Bar Council of Delhi"
  },
  {
    id: 2,
    name: "Advocate Priya Sharma",
    experience: 12,
    specialization: ["Family Law", "Property Law"],
    location: "Mumbai",
    qualification: "LLB, LLM (Oxford)",
    description: "Specialist in family and property matters with a compassionate approach to client representation.",
    casesWon: 189,
    rating: 4.7,
    phone: "+91 98765 43211",
    email: "priya.sharma@chambers.com",
    practiceAreas: ["Divorce & Custody", "Property Disputes", "Inheritance Law"],
    barCouncil: "Bar Council of Maharashtra"
  },
  {
    id: 3,
    name: "Sr. Advocate Vikram Singh",
    experience: 22,
    specialization: ["Civil Law", "Commercial Law"],
    location: "Bangalore",
    qualification: "LLB, LLM, Doctorate in Law",
    description: "Distinguished senior advocate with over two decades of experience in civil and commercial litigation.",
    casesWon: 356,
    rating: 4.9,
    phone: "+91 98765 43212",
    email: "vikram.singh@legal.com",
    practiceAreas: ["Civil Litigation", "Commercial Disputes", "Contract Law"],
    barCouncil: "Bar Council of Karnataka"
  },
  {
    id: 4,
    name: "Advocate Meera Patel",
    experience: 8,
    specialization: ["Labour Law", "Consumer Law"],
    location: "Ahmedabad",
    qualification: "LLB, LLM (Cambridge)",
    description: "Young and dynamic advocate specializing in labour disputes and consumer protection cases.",
    casesWon: 134,
    rating: 4.6,
    phone: "+91 98765 43213",
    email: "meera.patel@advocates.com",
    practiceAreas: ["Employment Disputes", "Consumer Protection", "Service Matters"],
    barCouncil: "Bar Council of Gujarat"
  },
  {
    id: 5,
    name: "Advocate Arjun Reddy",
    experience: 18,
    specialization: ["Tax Law", "Banking Law"],
    location: "Hyderabad",
    qualification: "LLB, LLM, CA",
    description: "Expert in taxation and banking laws with dual qualification as Chartered Accountant and Lawyer.",
    casesWon: 278,
    rating: 4.8,
    phone: "+91 98765 43214",
    email: "arjun.reddy@taxlaw.com",
    practiceAreas: ["Income Tax", "GST", "Banking Regulations"],
    barCouncil: "Bar Council of Telangana"
  },
  {
    id: 6,
    name: "Advocate Kavya Nair",
    experience: 10,
    specialization: ["Intellectual Property", "Cyber Law"],
    location: "Chennai",
    qualification: "LLB, LLM (IP Law)",
    description: "Technology law specialist with expertise in intellectual property and cyber crime cases.",
    casesWon: 167,
    rating: 4.7,
    phone: "+91 98765 43215",
    email: "kavya.nair@iplaw.com",
    practiceAreas: ["Patent Law", "Trademark", "Cyber Crime"],
    barCouncil: "Bar Council of Tamil Nadu"
  }
];

// ---- AppointmentBooking Component ----

const AppointmentBooking = ({ advocate, isOpen, onClose, onBookingConfirmed }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];
  
  const meetingTypes = [
    { value: 'in-person', label: 'In-Person Meeting', icon: MapPin },
    { value: 'video-call', label: 'Video Call', icon: Video },
    { value: 'phone-call', label: 'Phone Call', icon: Phone }
  ];
  
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !meetingType) {
      toast({
        title: "Missing Information",
        description: "Please select date, time, and meeting type",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAppointment = {
      id: Date.now().toString(),
      advocateId: advocate.id,
      advocateName: advocate.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'pending',
      consultationType: meetingType,
      notes: purpose,
      createdAt: new Date().toISOString()
    };
    
    onBookingConfirmed(newAppointment);
    setIsSubmitting(false);
    setIsBooked(true);
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${advocate.name} has been confirmed.`
    });
  };
  
  const handleClose = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setMeetingType('');
    setPurpose('');
    setIsBooked(false);
    onClose();
  };
  
  const isDateDisabled = (date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  };
  
  const formatDate = (date) => date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (isBooked) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="legal-card max-w-md">
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 animate-pulse" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Appointment Confirmed!</h3>
              <p className="text-muted-foreground">
                Your meeting with <span className="font-semibold text-primary">{advocate.name}</span> has been scheduled.
              </p>
            </div>
            <Card className="legal-surface p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>{selectedDate && formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {meetingTypes.find(type => type.value === meetingType)?.icon && (
                  <>
                    {React.createElement(meetingTypes.find(type => type.value === meetingType).icon, { 
                      className: "w-4 h-4 text-primary" 
                    })}
                  </>
                )}
                <span>{meetingTypes.find(type => type.value === meetingType)?.label}</span>
              </div>
            </Card>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email shortly with meeting details.
              </p>
              <Button onClick={handleClose} className="legal-button w-full">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="legal-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Book Appointment with {advocate.name}
          </DialogTitle>
          <DialogDescription>
            Schedule a consultation for your legal matters
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Advocate Info */}
          <Card className="legal-surface">
            <CardHeader>
              <CardTitle className="text-lg">{advocate.name}</CardTitle>
              <CardDescription>Legal Consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Specializations</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {advocate.specialization.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <p className="text-sm text-muted-foreground mt-1">{advocate.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Consultation Fee</label>
                <p className="text-sm text-muted-foreground mt-1">₹2,000 for 30 minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Date</label>
              <Card className="legal-surface p-3">
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  <div className="font-medium text-muted-foreground">Sun</div>
                  <div className="font-medium text-muted-foreground">Mon</div>
                  <div className="font-medium text-muted-foreground">Tue</div>
                  <div className="font-medium text-muted-foreground">Wed</div>
                  <div className="font-medium text-muted-foreground">Thu</div>
                  <div className="font-medium text-muted-foreground">Fri</div>
                  <div className="font-medium text-muted-foreground">Sat</div>
                  
                  {/* Simple date picker */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const today = new Date();
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const startOfCalendar = new Date(startOfMonth);
                    startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
                    const currentDate = new Date(startOfCalendar);
                    currentDate.setDate(currentDate.getDate() + i);
                    
                    const isCurrentMonth = currentDate.getMonth() === today.getMonth();
                    const isToday = currentDate.toDateString() === today.toDateString();
                    const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
                    const isDisabled = isDateDisabled(currentDate);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => !isDisabled && setSelectedDate(currentDate)}
                        disabled={isDisabled}
                        className={`
                          p-2 rounded-md text-sm transition-colors
                          ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                          ${isToday && !isSelected ? 'bg-accent text-accent-foreground' : ''}
                          ${!isCurrentMonth ? 'text-muted-foreground/50' : ''}
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'}
                        `}
                      >
                        {currentDate.getDate()}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="animate-slide-up">
                <label className="text-sm font-medium mb-3 block">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "legal-button" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Type */}
            {selectedTime && (
              <div className="animate-slide-up">
                <label className="text-sm font-medium mb-3 block">Meeting Type</label>
                <div className="space-y-2">
                  {meetingTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setMeetingType(type.value)}
                      className={`
                        w-full p-3 rounded-md border text-left transition-colors
                        ${meetingType === type.value 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:bg-accent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-4 h-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purpose */}
            {meetingType && (
              <div className="animate-slide-up">
                <label htmlFor="purpose" className="text-sm font-medium mb-2 block">
                  Purpose of Meeting (Optional)
                </label>
                <textarea
                  id="purpose"
                  placeholder="Brief description of your legal matter..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="legal-input min-h-24 w-full p-3 border rounded-md resize-none"
                />
              </div>
            )}

            {/* Submit Button */}
            {meetingType && (
              <div className="animate-slide-up">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="legal-button w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Confirm Appointment
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---- AdvocateSearch Component ----

const AdvocateSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdvocates, setFilteredAdvocates] = useState(mockAdvocates);
  const [selectedAdvocateForBooking, setSelectedAdvocateForBooking] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showMyAppointments, setShowMyAppointments] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredAdvocates(mockAdvocates);
      return;
    }
    
    const filtered = mockAdvocates.filter(advocate =>
      advocate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advocate.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
      advocate.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredAdvocates(filtered);
    toast({ 
      title: "Search Results", 
      description: `Found ${filtered.length} advocate(s) matching your criteria` 
    });
  };

  const handleConnect = (advocate) => setSelectedAdvocateForBooking(advocate);

  const handleBookingConfirmed = (newAppointment) => 
    setAppointments(prev => [...prev, newAppointment]);

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelled' }
          : appointment
      )
    );
    toast({ 
      title: "Appointment Cancelled", 
      description: "Your appointment has been cancelled successfully" 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':   return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />;
      default:          return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending':   return 'secondary';
      case 'cancelled': return 'destructive';
      default:          return 'outline';
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));

  // --- Appointments Page ---
  if (showMyAppointments) {
    return (
      <div className="min-h-screen legal-gradient p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground mt-2">View and manage your scheduled appointments</p>
          </div>

          <div className="mb-6">
            <Button onClick={() => setShowMyAppointments(false)} variant="outline">
              ← Back to Search
            </Button>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="legal-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{appointment.advocateName}</h3>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>Date: {appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Time: {appointment.time}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-muted-foreground" />
                              <span>Type: {appointment.consultationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Booked: {new Date(appointment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {appointment.status !== 'cancelled' && (
                        <Button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          variant="outline"
                          size="sm"
                          className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No appointments yet</h3>
              <p className="text-muted-foreground mb-4">You haven't booked any appointments with advocates</p>
              <Button onClick={() => setShowMyAppointments(false)} className="legal-button">
                Find Advocates
              </Button>
            </div>
          )}
        </div>

        {/* Floating Sticky Button */}
        <Button
          className="fixed bottom-4 right-4 w-12 h-12 rounded-lg z-50 flex items-center justify-center legal-button"
          onClick={() => alert('Quick Action!')}
          aria-label="Quick Action"
        >
          <Scale className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  // --- AdvocateSearch Page ---
  return (
    <div className="min-h-screen legal-gradient p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Scale className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Find Your Advocate</h1>
          <p className="text-muted-foreground mt-2">Search and connect with qualified legal professionals</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => setShowMyAppointments(true)}
            className="legal-button"
          >
            <Calendar className="w-4 h-4 mr-2" />
            My Appointments ({appointments.length})
          </Button>
        </div>

        <Card className="legal-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Advocates
            </CardTitle>
            <CardDescription>
              Search by name, specialization, or location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search advocates by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="legal-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="legal-button">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvocates.map((advocate) => (
            <Card key={advocate.id} className="legal-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{advocate.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(advocate.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({advocate.rating})
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{advocate.experience} years</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{advocate.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{advocate.specialization.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span>{advocate.casesWon} cases won</span>
                </div>

                <div className="flex gap-2 pt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="legal-card max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {advocate.name}
                        </DialogTitle>
                        <DialogDescription>
                          Detailed profile and specializations
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold mb-1">Experience</h4>
                              <p className="text-sm text-muted-foreground">{advocate.experience} years</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Qualification</h4>
                              <p className="text-sm text-muted-foreground">{advocate.qualification}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Bar Council</h4>
                              <p className="text-sm text-muted-foreground">{advocate.barCouncil}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold mb-1">Cases Won</h4>
                              <p className="text-sm text-muted-foreground">{advocate.casesWon}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Rating</h4>
                              <div className="flex items-center gap-1">
                                {renderStars(advocate.rating)}
                                <span className="text-sm text-muted-foreground ml-1">
                                  ({advocate.rating}/5)
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Location</h4>
                              <p className="text-sm text-muted-foreground">{advocate.location}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">About</h4>
                          <p className="text-sm text-muted-foreground">{advocate.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Practice Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {advocate.practiceAreas.map((area, index) => (
                              <Badge key={index} variant="outline">{area}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{advocate.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{advocate.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => handleConnect(advocate)}
                            className="legal-button flex-1"
                          >
                            Connect
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Basic Specification
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={() => handleConnect(advocate)}
                    className="legal-button flex-1"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAdvocates.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No advocates found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}

        {selectedAdvocateForBooking && (
          <AppointmentBooking
            advocate={selectedAdvocateForBooking}
            isOpen={!!selectedAdvocateForBooking}
            onClose={() => setSelectedAdvocateForBooking(null)}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}
      </div>

      {/* Sticky Floating Button (appears on Search page) */}
      <Button
        className="fixed bottom-4 right-4 w-12 h-12 rounded-lg z-50 flex items-center justify-center legal-button"
      onClick={() => navigate('/vakil-setu')}
        aria-label="Quick Action"
      > 
        AI
      </Button>
    </div>
  );
};

export default AdvocateSearch;