import { Link } from 'react-router-dom'

// Components
const Header = () => (
  <header className="border-b border-gray-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-4 items-center justify-center">
            <div className="size-3 rounded-full bg-primary-500"></div>
            <div className="ml-[-6px] size-2 rounded-full bg-primary-500"></div>
          </div>
          <span className="text-lg font-bold text-gray-900">FocusFlow</span>
        </div>

        <nav className="hidden items-center gap-9 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-gray-900 hover:text-primary-600"
          >
            Features
          </a>
          <a
            href="#product"
            className="text-sm font-medium text-gray-900 hover:text-primary-600"
          >
            Product
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-900 hover:text-primary-600"
          >
            Pricing
          </a>
        </nav>

        <Link
          to="/app"
          className="rounded-full bg-primary-500 px-4 py-2 text-sm font-bold text-white hover:bg-primary-600"
        >
          Get Started
        </Link>
      </div>
    </div>
  </header>
)

const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <div className="mb-8 inline-block rounded-xl bg-gray-800 p-12">
        <h1 className="mb-4 text-5xl font-bold leading-tight text-white">
          Achieve Peak Productivity with FocusFlow
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
          Streamline your tasks, eliminate distractions, and unlock your full
          potential with our intuitive task management system.
        </p>
        <Link
          to="/app"
          className="mt-8 inline-block rounded-3xl bg-primary-500 px-8 py-4 text-lg font-bold text-white hover:bg-primary-600"
        >
          Get Started
        </Link>
      </div>
    </div>
  </section>
)

const FeaturesSection = () => {
  const features = [
    {
      icon: '📋',
      title: 'Intuitive Task Management',
      description:
        'Easily create, organize, and prioritize your tasks with our user-friendly interface.'
    },
    {
      icon: '⏰',
      title: 'Time Blocking',
      description:
        'Allocate specific time blocks for each task to maximize efficiency and minimize distractions.'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description:
        'Receive timely reminders to stay on track and never miss a deadline.'
    }
  ]

  return (
    <section id="features" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Key Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            FocusFlow is designed to help you stay organized and focused on what
            matters most.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gray-900">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sophia Carter',
      date: '2023-08-15',
      rating: 5,
      feedback:
        "FocusFlow has completely transformed my workflow. I'm more organized and productive than ever before!",
      likes: 12,
      replies: 2
    },
    {
      name: 'Ethan Bennett',
      date: '2023-09-22',
      rating: 4,
      feedback:
        'A solid task management tool with a clean interface. The time blocking feature is a game-changer.',
      likes: 8,
      replies: 1
    },
    {
      name: 'Olivia Hayes',
      date: '2023-10-10',
      rating: 5,
      feedback:
        'I love the smart reminders! They help me stay on top of my tasks without feeling overwhelmed.',
      likes: 15,
      replies: 0
    }
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Testimonials
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>

              <div className="mb-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < testimonial.rating
                        ? 'text-primary-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mb-4 text-gray-700">{testimonial.feedback}</p>

              <div className="flex gap-4 text-sm text-gray-500">
                <span>👍 {testimonial.likes}</span>
                <span>💬 {testimonial.replies}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PricingSection = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Unlimited Tasks', 'Basic Support'],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      features: [
        'All Basic Features',
        'Advanced Analytics',
        'Priority Support'
      ],
      buttonText: 'Upgrade',
      popular: true
    },
    {
      name: 'Team',
      price: '$19.99',
      features: [
        'All Pro Features',
        'Team Collaboration',
        'Dedicated Account Manager'
      ],
      buttonText: 'Contact Us',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Pricing
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-gray-200 bg-gray-50 p-6"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6 text-center">
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-600">/month</span>
                </div>
              </div>

              <button className="mb-6 w-full rounded-full bg-gray-200 py-3 text-sm font-bold text-gray-900 hover:bg-gray-300">
                {plan.buttonText}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-gray-900">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = () => (
  <section className="bg-gray-900 py-20">
    <div className="mx-auto max-w-4xl px-4 text-center">
      <h2 className="mb-4 text-4xl font-bold text-white">Ready to Focus?</h2>
      <p className="mb-8 text-lg text-gray-300">
        Start your journey towards peak productivity today!
      </p>
      <Link
        to="/app"
        className="inline-block rounded-3xl bg-primary-500 px-8 py-4 text-lg font-bold text-white hover:bg-primary-600"
      >
        Get Started
      </Link>
    </div>
  </section>
)

const Footer = () => (
  <footer className="bg-gray-900 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          <a href="#features" className="text-gray-400 hover:text-white">
            Features
          </a>
          <a href="#product" className="text-gray-400 hover:text-white">
            Product
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-white">
            Pricing
          </a>
          <a href="#contact" className="text-gray-400 hover:text-white">
            Contact
          </a>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-white">
            📱
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            🐦
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            💼
          </a>
        </div>

        <p className="text-sm text-gray-400">
          © 2023 FocusFlow. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
)

// Main Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default LandingPage
