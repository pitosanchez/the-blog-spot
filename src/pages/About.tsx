import { memo } from "react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Alex Chen",
    role: "Co-Founder & CEO",
    bio: "Former creator who got tired of platforms taking 50% cuts. Built The Blog Spot to give creators what they deserve.",
    avatar: "👨‍💻",
    twitter: "@alexchen",
  },
  {
    name: "Maria Rodriguez",
    role: "Co-Founder & CTO",
    bio: "Ex-Google engineer who believes technology should empower creators, not exploit them.",
    avatar: "👩‍💻",
    twitter: "@mariarodriguez",
  },
  {
    name: "David Kim",
    role: "Head of Creator Success",
    bio: "Helps creators maximize their earnings and build sustainable businesses on our platform.",
    avatar: "🚀",
    twitter: "@davidkim",
  },
];

const values = [
  {
    title: "Creators First",
    description:
      "Every decision we make starts with asking: 'Does this help creators succeed?'",
    icon: "👥",
  },
  {
    title: "Radical Transparency",
    description:
      "No hidden fees, no algorithm manipulation, no surprise policy changes.",
    icon: "🔍",
  },
  {
    title: "Fair Revenue Share",
    description: "90% to creators isn't just generous—it's what's right.",
    icon: "⚖️",
  },
  {
    title: "Build to Last",
    description:
      "We're building a sustainable platform that will be here for the long haul.",
    icon: "🏗️",
  },
];

const stats = [
  {
    number: "500+",
    label: "Active Creators",
    description: "Building their businesses",
  },
  {
    number: "$250K+",
    label: "Creator Earnings",
    description: "Paid out to date",
  },
  {
    number: "90%",
    label: "Revenue Share",
    description: "Industry leading",
  },
  {
    number: "5min",
    label: "Setup Time",
    description: "From signup to earning",
  },
];

export const About = memo(() => {
  return (
    <div className="bg-ink-black text-crisp-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>

        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Built by <span className="text-electric-sage">Creators</span>,
              <br />
              for Creators
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              We started The Blog Spot because we were tired of platforms that
              treated creators like products to be monetized instead of partners
              to be empowered.
            </p>

            <div className="inline-flex items-center gap-2 bg-charcoal/50 backdrop-blur-xl border border-warm-gray/20 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-electric-sage rounded-full animate-pulse"></div>
              <span className="text-sm text-warm-gray">
                Founded in 2024 by former creators
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                Our <span className="text-electric-sage">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-warm-gray leading-relaxed">
                <p>
                  In 2023, our founder Alex was earning $3,000/month from his
                  newsletter on another platform. But after fees, he was only
                  keeping $1,500. That's when we realized the creator economy
                  had a fundamental problem.
                </p>
                <p>
                  Platforms were taking massive cuts while providing minimal
                  value. Creators were doing all the work—writing, building
                  audiences, creating value—while platforms collected 30-50% for
                  basic hosting and payment processing.
                </p>
                <p>
                  So we built something different. A platform where creators
                  keep what they earn. Where transparency isn't a marketing
                  gimmick—it's how we operate. Where your success is our
                  success, not our opportunity to extract more value.
                </p>
              </div>
            </div>

            <div className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="font-bold text-xl mb-2">The Problem</h3>
                  <p className="text-warm-gray text-sm">
                    Other platforms take 30-50% of creator earnings for basic
                    services
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="font-bold text-xl mb-2">Our Solution</h3>
                  <p className="text-warm-gray text-sm">
                    Take only what's needed (10%) and give creators the tools
                    they deserve
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="font-bold text-xl mb-2">The Result</h3>
                  <p className="text-warm-gray text-sm">
                    Creators earn 80% more than on traditional platforms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Growing <span className="text-electric-sage">Together</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Every milestone represents creators building sustainable
              businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glassmorphism rounded-xl p-6 backdrop-blur-xl border border-warm-gray/20 text-center hover:border-electric-sage/50 transition-all duration-300"
              >
                <div className="text-4xl font-display font-black text-electric-sage mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-bold mb-1">{stat.label}</div>
                <div className="text-warm-gray text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Our <span className="text-electric-sage">Values</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              These aren't just words on a wall. They guide every product
              decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-warm-gray leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Meet the <span className="text-electric-sage">Team</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Former creators and engineers who understand both sides of the
              equation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="glassmorphism rounded-2xl p-8 backdrop-blur-xl border border-warm-gray/20 text-center hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-electric-sage/20 to-hot-coral/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                  {member.avatar}
                </div>

                <h3 className="font-bold text-xl mb-2">{member.name}</h3>
                <div className="text-electric-sage text-sm font-medium mb-4">
                  {member.role}
                </div>
                <p className="text-warm-gray text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>

                <a
                  href={`https://twitter.com/${member.twitter.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-electric-sage hover:text-electric-sage/80 transition-colors text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  {member.twitter}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Our <span className="text-electric-sage">Mission</span>
            </h2>
            <p className="text-2xl text-warm-gray leading-relaxed mb-8 max-w-3xl mx-auto">
              To build the creator economy platform we wish existed when we were
              starting out. Fair, transparent, and designed to help creators
              succeed—not extract value from them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/get-started"
                className="btn-coral group relative overflow-hidden"
              >
                <span className="relative z-10">Join Our Mission</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-electric-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/creators" className="btn-secondary">
                Meet Our Creators
              </Link>
            </div>

            {/* Contact */}
            <div className="mt-12 pt-8 border-t border-warm-gray/20">
              <p className="text-warm-gray text-sm mb-4">
                Questions? Ideas? Just want to chat?
              </p>
              <a
                href="mailto:hello@theblogspot.com"
                className="text-electric-sage hover:text-electric-sage/80 transition-colors font-medium"
              >
                hello@theblogspot.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

About.displayName = "About";

export default About;
