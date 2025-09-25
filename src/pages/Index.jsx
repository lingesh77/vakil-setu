import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Scale, Users, Gavel, FileText, Search, MessageCircle } from 'lucide-react'


const Index = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Users,
      title: "User & Admin Access",
      description: "Separate portals for users and administrators"
    },
    {
      icon: FileText,
      title: "Case Management",
      description: "Submit and track legal cases efficiently"
    },
    {
      icon: Search,
      title: "Advocate Search",
      description: "Find qualified advocates for your case"
    },
    {
      icon: MessageCircle,
      title: "AI Assistance",
      description: "Smart chatbot for legal guidance"
    }
  ]

  return (
    <div className="min-h-screen legal-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Scale className="w-20 h-20 mx-auto mb-6 text-primary legal-glow" />
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
VakilSetu          
</h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your comprehensive legal platform for case management, advocate discovery, and professional legal services
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="legal-button text-lg px-8 py-6"
            >
              <Gavel className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            
        
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Legal Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamlined workflows for legal professionals and clients alike
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="legal-card p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="legal-surface py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust Advocate Flow for their case management needs
          </p>
          
          <Button 
            onClick={() => navigate('/login')}
            size="lg"
            className="legal-button text-lg px-12 py-6"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Index;
