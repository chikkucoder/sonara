"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, Package, ShoppingCart, BarChart3, Shield, Smartphone, Check, ArrowRight, Menu, X, Sparkles, TrendingUp, Users, Award } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track gold, silver, diamond inventory with weight, purity, and real-time stock updates.",
  },
  {
    icon: ShoppingCart,
    title: "Sales & Billing",
    description: "B2B, B2C, and private sales with GST invoicing and multiple payment modes.",
  },
  {
    icon: Gem,
    title: "Girvi Management",
    description:
      "Complete mortgage/pledge tracking with customer details, interest calculation, and auction management.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Daily inventory reports, sales analytics, and profit tracking with beautiful charts.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Bank-grade security for your precious business data with automatic backups.",
  },
  {
    icon: Smartphone,
    title: "Easy to Use",
    description: "Simple, intuitive interface designed specifically for jewelry shop owners.",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small jewelry shops",
    features: ["Up to 500 inventory items", "Basic sales & billing", "Simple reports", "Email support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "For growing jewelry businesses",
    features: [
      "Unlimited inventory items",
      "B2B & B2C sales",
      "Girvi management",
      "Advanced reports",
      "Priority support",
      "Multi-user access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹4,999",
    period: "/month",
    description: "For large jewelry chains",
    features: [
      "Everything in Professional",
      "Multiple branches",
      "Custom integrations",
      "Dedicated account manager",
      "On-site training",
      "24/7 phone support",
    ],
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-md">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">ELNEB</span>
            </div>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#features" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Features
              </a>
              <Link href="/about" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                About Us
              </Link>
              <a href="#pricing" className="text-sm lg:text-base text-gray-600 hover:text-amber-700 transition-colors font-medium">
                Pricing
              </a>
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
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Gem className="w-4 h-4 animate-pulse" />
              #1 Jewelry Shop Management Software
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance px-4">
              Complete Solution for Your <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Jewelry Business</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto text-pretty px-4">
              Manage inventory, track sales, handle Girvi accounts, and grow your jewelry business with our powerful yet
              simple software.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-gray-300 text-gray-700 hover:bg-gray-50">
                Watch Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • 14-day free trial</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-gray-200 shadow-2xl overflow-hidden bg-white">
              <div className="bg-gray-800 p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <img src="/jewelry-shop-dashboard-with-gold-theme-showing-inv.jpg" alt="ELNEB Dashboard" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "5,000+", label: "Jewelry Shops" },
              { value: "₹500Cr+", label: "Sales Managed" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform">
                <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">{stat.value}</div>
                <div className="mt-2 text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
              Everything You Need to Run Your Shop
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for jewelry businesses in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-amber-400 transition-colors group bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Built by Jewelers, for Jewelers
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We understand the unique challenges of running a jewelry business in India. From managing intricate
                inventory with different purities and weights, to handling Girvi accounts and GST compliance - we've
                built ELNEB to solve real problems.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our team has worked closely with jewelry shop owners across India to create software that's powerful yet
                easy to use. No complicated setup, no technical knowledge required.
              </p>
              <div className="space-y-4">
                {[
                  "Made in India, for Indian jewelry businesses",
                  "Hindi & English language support",
                  "GST compliant invoicing",
                  "Works offline too",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-gray-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/indian-jewelry-shop-owner-using-software-on-tablet.jpg" alt="Jewelry shop owner using ELNEB" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Choose the plan that fits your business. All plans include free setup and training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white ${plan.popular ? "border-amber-500 shadow-xl scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="font-serif text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <span className="font-serif text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 px-4">
            Ready to Transform Your Jewelry Business?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join 5,000+ jewelry shops already using ELNEB to grow their business.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-amber-800 hover:bg-amber-50 shadow-lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
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
              <a href="#features" className="hover:text-amber-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-amber-400 transition-colors">
                Pricing
              </a>
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
