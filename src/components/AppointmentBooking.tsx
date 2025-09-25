import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Clock, User, CheckCircle, Phone, Video, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface Advocate {
  id: number
  name: string
  specialization: string[]
  location: string
}

interface AppointmentBookingProps {
  advocate: Advocate
  isOpen: boolean
  onClose: () => void
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ advocate, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [meetingType, setMeetingType] = useState<string>('')
  const [purpose, setPurpose] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const { toast } = useToast()

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ]

  const meetingTypes = [
    { value: 'in-person', label: 'In-Person Meeting', icon: MapPin },
    { value: 'video-call', label: 'Video Call', icon: Video },
    { value: 'phone-call', label: 'Phone Call', icon: Phone }
  ]

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !meetingType) {
      toast({
        title: "Missing Information",
        description: "Please select date, time, and meeting type",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsBooked(true)

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${advocate.name} has been confirmed.`
    })
  }

  const handleClose = () => {
    setSelectedDate(undefined)
    setSelectedTime('')
    setMeetingType('')
    setPurpose('')
    setIsBooked(false)
    onClose()
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    const dayOfWeek = date.getDay()
    // Disable past dates and weekends
    return date < today || dayOfWeek === 0 || dayOfWeek === 6
  }

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
                <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {meetingTypes.find(type => type.value === meetingType)?.icon && (
                  <>{React.createElement(meetingTypes.find(type => type.value === meetingType)!.icon, { className: "w-4 h-4 text-primary" })}</>
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
    )
  }

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
                <Label className="text-sm font-medium">Specializations</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {advocate.specialization.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground mt-1">{advocate.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Consultation Fee</Label>
                <p className="text-sm text-muted-foreground mt-1">₹2,000 for 30 minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Select Date</Label>
              <Card className="legal-surface p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-md border-0 p-0"
                />
              </Card>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="animate-slide-up">
                <Label className="text-sm font-medium mb-3 block">Select Time</Label>
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
                <Label className="text-sm font-medium mb-3 block">Meeting Type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger className="legal-input">
                    <SelectValue placeholder="Choose meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Purpose */}
            {meetingType && (
              <div className="animate-slide-up">
                <Label htmlFor="purpose" className="text-sm font-medium mb-2 block">
                  Purpose of Meeting (Optional)
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="Brief description of your legal matter..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="legal-input min-h-24"
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
  )
}

export default AppointmentBooking