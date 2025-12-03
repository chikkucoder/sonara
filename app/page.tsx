"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, Package, ShoppingCart, BarChart3, Shield, Smartphone, Check, ArrowRight, Menu, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Gem className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">JewelPro</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground">
                About
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground">
                Pricing
              </a>
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Log in
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gem className="w-4 h-4" />
              #1 Jewelry Shop Management Software
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Complete Solution for Your <span className="text-primary">Jewelry Business</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Manage inventory, track sales, handle Girvi accounts, and grow your jewelry business with our powerful yet
              simple software.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent">
                Watch Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required • 14-day free trial</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border shadow-2xl overflow-hidden bg-card">
              <div className="bg-sidebar p-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <img src="/jewelry-shop-dashboard-with-gold-theme-showing-inv.jpg" alt="JewelPro Dashboard" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "5,000+", label: "Jewelry Shops" },
              { value: "₹500Cr+", label: "Sales Managed" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to Run Your Shop
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for jewelry businesses in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built by Jewelers, for Jewelers
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We understand the unique challenges of running a jewelry business in India. From managing intricate
                inventory with different purities and weights, to handling Girvi accounts and GST compliance - we've
                built JewelPro to solve real problems.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
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
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/indian-jewelry-shop-owner-using-software-on-tablet.jpg" alt="Jewelry shop owner using JewelPro" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include free setup and training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="font-serif text-xl font-semibold text-card-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                  <div className="mt-4 mb-6">
                    <span className="font-serif text-4xl font-bold text-card-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-sidebar">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sidebar-foreground mb-6">
            Ready to Transform Your Jewelry Business?
          </h2>
          <p className="text-lg text-sidebar-foreground/70 mb-8">
            Join 5,000+ jewelry shops already using JewelPro to grow their business.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Gem className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold text-foreground">JewelPro</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 JewelPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
