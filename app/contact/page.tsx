"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Gem, Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    alert("Thank you for reaching out! We'll get back to you within 24 hours.")
    setFormData({ name: "", email: "", phone: "", business: "", message: "" })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      subtitle: "Mon-Sat, 9 AM - 7 PM IST"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@jewelpro.in", "sales@jewelpro.in"],
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123, Jewelry Plaza", "Mumbai - 400001, India"],
      subtitle: "By appointment only"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Saturday", "9:00 AM - 7:00 PM IST"],
      subtitle: "Closed on Sundays"
    }
  ]

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "Most jewelry shops are up and running within 2 hours. We provide free setup assistance and training."
    },
    {
      question: "Do you offer on-site training?",
      answer: "Yes! For our Professional and Enterprise plans, we provide on-site training at your shop."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade encryption and automated backups to keep your data safe."
    },
    {
      question: "Can I import my existing data?",
      answer: "Yes, our team will help you import all your existing inventory, customer, and supplier data."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-md">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">ELNEB</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/#features" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Features
              </Link>
              <Link href="/about" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                About Us
              </Link>
              <Link href="/#pricing" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/contact" className="text-sm lg:text-base text-amber-700 font-semibold">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-sm lg:text-base text-gray-700 hover:text-amber-700">Log in</Button>
              </Link>
              <Link href="/login">
                <Button className="text-sm lg:text-base bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md">Get Started</Button>
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="md:hidden">
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <MessageSquare className="w-4 h-4 animate-pulse" />
            We're Here to Help
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-4">
            Get in Touch <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">With Our Team</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Have questions about ELNEB? Want to see a demo? Our team is ready to help you 
            transform your jewelry business.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-gray-200 hover:border-amber-400 transition-all hover:shadow-lg group bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <info.icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm mb-1">{detail}</p>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">{info.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Rajesh Kumar"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="rajesh@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business">Business Name (Optional)</Label>
                  <Input
                    id="business"
                    type="text"
                    placeholder="Ratan Jewellers"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white">
                  Send Message
                  <Send className="ml-2 w-4 h-4" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>

            {/* Side Content */}
            <div className="space-y-8">
              {/* Support Options */}
              <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-amber-200 flex items-center justify-center mb-4">
                    <HeadphonesIcon className="w-6 h-6 text-amber-800" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                    Need Immediate Help?
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Our support team is available Monday through Saturday to assist you with any questions or issues.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">support@elneb.in</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-6" asChild>
                    <a href="tel:+919876543210">Call Now</a>
                  </Button>
                </CardContent>
              </Card>

              {/* FAQs */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="border-gray-200 bg-white">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="text-gray-900 font-medium">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="text-gray-900 font-medium">10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="text-gray-900 font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Visit Our Office
          </h2>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
            <div className="aspect-[21/9] bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <p className="text-gray-700">
                  123, Jewelry Plaza, Mumbai - 400001, India
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Prefer to See It in Action?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Schedule a personalized demo with our team and see how ELNEB can transform your business.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">ELNEB</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-amber-400 transition-colors">
                About Us
              </Link>
              <Link href="/#features" className="hover:text-amber-400 transition-colors">
                Features
              </Link>
              <Link href="/#pricing" className="hover:text-amber-400 transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">
                Contact Us
              </Link>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-sm text-gray-400">© 2026 ELNEB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
