"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, Award, Users, Target, Heart, TrendingUp, Shield, Sparkles, CheckCircle2 } from "lucide-react"

export default function AboutPage() {

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every feature we build is designed with jewelry shop owners in mind. Your success is our mission."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your business data is precious. We protect it with bank-grade security and regular backups."
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We continuously improve our platform with the latest technology to keep you ahead."
    },
    {
      icon: Users,
      title: "Community",
      description: "We're building a community of successful jewelry entrepreneurs helping each other grow."
    }
  ]

  const milestones = [
    { year: "2020", event: "Founded with a vision to digitize jewelry businesses" },
    { year: "2021", event: "Launched first version, helped 100+ shops go digital" },
    { year: "2022", event: "Introduced Girvi management & mobile apps" },
    { year: "2023", event: "Crossed 2,000 active jewelry shops across India" },
    { year: "2024", event: "Managed over ₹300 Cr in jewelry transactions" },
    { year: "2026", event: "Serving 5,000+ jewelry businesses nationwide" }
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      bio: "Third-generation jeweler who digitized his family business before creating JewelPro"
    },
    {
      name: "Priya Sharma",
      role: "Chief Product Officer",
      bio: "15+ years building software for retail, passionate about user experience"
    },
    {
      name: "Amit Patel",
      role: "Head of Customer Success",
      bio: "Helps jewelry shop owners maximize their business potential with technology"
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
              <Link href="/about" className="text-sm lg:text-base text-amber-700 font-semibold">
                About Us
              </Link>
              <Link href="/#pricing" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/contact" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
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
            <Sparkles className="w-4 h-4 animate-pulse" />
            Our Story
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-4">
            Empowering Jewelry Businesses <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Across India</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            We started ELNEB because we believe every jewelry shop owner deserves access to powerful, 
            easy-to-use technology that helps them focus on what matters most - growing their business 
            and serving their customers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Making Technology Accessible for Traditional Businesses
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The jewelry business has been passed down through generations in India. It's built on trust, 
                craftsmanship, and personal relationships. But running a modern jewelry shop requires managing 
                complex inventory, handling multiple payment methods, staying GST compliant, and so much more.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                That's where we come in. ELNEB bridges the gap between traditional business practices 
                and modern technology. We've created software that honors the way you work while giving you 
                the tools to compete in today's market.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mb-2">5,000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mb-2">₹500Cr+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Sales Processed</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center p-8">
                <Award className="w-full h-full text-amber-200" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-600 to-amber-700 text-white p-6 rounded-xl shadow-xl">
                <div className="font-serif text-2xl font-bold">4.9/5</div>
                <div className="text-sm">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at ELNEB
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-gray-200 hover:border-amber-400 transition-all hover:shadow-lg group bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <value.icon className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              From a small startup to India's leading jewelry management platform
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-400 transition-colors shadow-sm">
                      <div className="font-serif text-2xl font-bold text-amber-700 mb-2">{milestone.year}</div>
                      <p className="text-gray-600">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="relative flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center border-4 border-white shadow-lg">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate team dedicated to revolutionizing jewelry retail in India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-700 text-center text-sm mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Jewelry Shops Choose ELNEB
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Built for Indian Jewelry Businesses",
                    description: "We understand purity calculations, making charges, GST on jewelry, and all the nuances of running a jewelry shop in India."
                  },
                  {
                    title: "Simple Yet Powerful",
                    description: "No complicated setup or training needed. Start managing your inventory and sales in minutes, not days."
                  },
                  {
                    title: "Dedicated Support",
                    description: "Our team speaks your language (literally!). Get help in Hindi or English, whenever you need it."
                  },
                  {
                    title: "Continuous Innovation",
                    description: "We regularly release new features based on feedback from jewelry shop owners like you."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-amber-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-white border border-amber-200 flex items-center justify-center p-12">
                <TrendingUp className="w-full h-full text-amber-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join 5,000+ Successful Jewelry Shops?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-amber-800 hover:bg-amber-50">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
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
