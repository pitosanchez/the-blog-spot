import { memo } from "react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Dr. Alex Chen, MD",
    role: "Co-Founder & CEO",
    bio: "Emergency physician who saw the need for better medical education platforms. Built MedCreator Hub to empower healthcare educators.",
    avatar: "👨‍⚕️",
    credentials: "Board Certified Emergency Medicine",
  },
  {
    name: "Dr. Maria Rodriguez, MD",
    role: "Co-Founder & CMO",
    bio: "Former residency director passionate about case-based learning and medical education innovation.",
    avatar: "👩‍⚕️",
    credentials: "Internal Medicine, Medical Education Fellow",
  },
  {
    name: "David Kim",
    role: "CTO & HIPAA Officer",
    bio: "Healthcare tech expert ensuring our platform meets the highest standards of medical data security and compliance.",
    avatar: "🔒",
    credentials: "HIPAA Security Officer Certified",
  },
];

const values = [
  {
    title: "Patient Privacy First",
    description:
      "Full HIPAA compliance and patient privacy protection in every feature we build.",
    icon: "🛡️",
  },
  {
    title: "Evidence-Based Education",
    description:
      "Supporting medical educators in creating content that improves patient outcomes.",
    icon: "📊",
  },
  {
    title: "Fair Compensation",
    description: "Medical educators deserve 90% of their earnings. Period.",
    icon: "⚖️",
  },
  {
    title: "Clinical Excellence",
    description:
      "Peer review and quality standards ensure the highest level of medical education.",
    icon: "⭐",
  },
];

const stats = [
  {
    number: "200+",
    label: "Medical Creators",
    description: "Board-certified physicians",
  },
  {
    number: "10K+",
    label: "CME Hours",
    description: "Delivered to date",
  },
  {
    number: "15+",
    label: "Specialties",
    description: "Represented on platform",
  },
  {
    number: "100%",
    label: "HIPAA Compliant",
    description: "Full compliance guaranteed",
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
              Built by <span className="text-medical-blue">Physicians</span>,
              <br />
              for Healthcare
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              We started MedCreator Hub because medical professionals deserve a platform
              designed specifically for healthcare education—with full compliance,
              fair compensation, and features that actually matter.
            </p>

            <div className="inline-flex items-center gap-2 bg-charcoal/50 backdrop-blur-xl border border-warm-gray/20 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-electric-sage rounded-full animate-pulse"></div>
              <span className="text-sm text-warm-gray">
                Founded in 2024 by practicing physicians
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
              Our <span className="text-medical-blue">Values</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              These principles guide how we build a platform that serves
              the unique needs of medical professionals.
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
              Meet the <span className="text-medical-blue">Team</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Healthcare professionals and tech experts working together to
              revolutionize medical education.
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
                {member.credentials && (
                  <p className="text-medical-blue text-xs font-medium">
                    {member.credentials}
                  </p>
                )}
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
              Our <span className="text-medical-blue">Mission</span>
            </h2>
            <p className="text-2xl text-warm-gray leading-relaxed mb-8 max-w-3xl mx-auto">
              To empower medical professionals to monetize their expertise while
              advancing healthcare education globally. Built with compliance,
              designed for impact, and committed to fair compensation.
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
