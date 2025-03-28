'use client';

import { Button } from '@repo/ui/button';
import { Brain, MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 pl-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Chat</span>
          </div>
          <div className='text-xl text-primary animate-pulse pl-6 '>CHAT WITH ME</div>
          <div className="flex items-center gap-4 pr-4">
            <Button size="lg" className="text-lg  animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-2 py-1 border-white hover:bg-gray-500" variant='primary' >
              login
            </Button>
            <Button size="lg" className="text-lg animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-2 py-1 border-white hover:bg-gray-500" variant='primary'>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
          <div className="flex justify-center mb-8">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Experience Next-Gen AI Chat
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            Engage with our intelligent AI assistant powered by cutting-edge technology.
            Join now and see the future of conversation.
          </p>
          <Button size="lg" className="text-lg animate-in fade-in slide-in-from-bottom-6 duration-100 delay-50 border px-2 py-1 border-white hover:bg-gray-500" variant='primary'>
            Get Started
          </Button>
        </div>
      </div>

  
     

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AI Chat</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Next-generation AI chat platform for seamless communication.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Documentation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AI Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}