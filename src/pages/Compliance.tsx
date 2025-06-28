import { memo } from "react";
import { Link } from "react-router-dom";

export const Compliance = memo(() => {
  return (
    <div className="bg-ink-black text-crisp-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>

        <div className="relative z-10 container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-medical-blue/10 border border-medical-blue/30 rounded-full px-6 py-2 mb-8 mx-auto w-fit">
              <svg className="w-5 h-5 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-medical-blue font-semibold">Full Healthcare Compliance</span>
            </div>
            
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Medical-Grade <span className="text-medical-blue">Security</span>
            </h1>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8">
              Built from the ground up to meet healthcare's strictest privacy and security standards.
            </p>
          </div>
        </div>
      </section>

      {/* HIPAA Compliance */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20">
              <div className="text-center mb-12">
                <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
                  HIPAA <span className="text-medical-blue">Compliant</span>
                </h2>
                <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                  We maintain full HIPAA compliance to protect patient privacy and ensure secure handling of medical information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-medical-blue mb-4">Technical Safeguards</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">256-bit AES Encryption</h4>
                        <p className="text-warm-gray text-sm mt-1">All data encrypted at rest and in transit</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">Access Controls</h4>
                        <p className="text-warm-gray text-sm mt-1">Role-based permissions and audit logs</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">Automatic Backups</h4>
                        <p className="text-warm-gray text-sm mt-1">Secure, encrypted backups with disaster recovery</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-medical-blue mb-4">Administrative Safeguards</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">BAA Agreements</h4>
                        <p className="text-warm-gray text-sm mt-1">Business Associate Agreements for all accounts</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">Staff Training</h4>
                        <p className="text-warm-gray text-sm mt-1">Regular HIPAA training for all team members</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-electric-sage flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold">Incident Response</h4>
                        <p className="text-warm-gray text-sm mt-1">24/7 security monitoring and breach protocols</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Standards */}
      <section className="py-20 bg-charcoal/50">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Medical Content <span className="text-medical-blue">Standards</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Ensuring the highest quality medical education and clinical accuracy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20">
              <div className="w-12 h-12 bg-medical-blue/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Peer Review Process</h3>
              <p className="text-warm-gray">All medical content undergoes peer review by board-certified physicians in the relevant specialty.</p>
            </div>

            <div className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20">
              <div className="w-12 h-12 bg-medical-blue/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">License Verification</h3>
              <p className="text-warm-gray">All medical creators verified through primary source verification with state medical boards.</p>
            </div>

            <div className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20">
              <div className="w-12 h-12 bg-medical-blue/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Evidence-Based Content</h3>
              <p className="text-warm-gray">All educational material must include proper citations and follow evidence-based medicine principles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Anonymization */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-display font-bold text-4xl mb-6">
                    Patient Case <span className="text-medical-blue">Anonymization</span>
                  </h2>
                  <p className="text-xl text-warm-gray mb-8">
                    Share clinical cases safely with our built-in anonymization tools that ensure complete patient privacy.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-electric-sage" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Automatic PHI detection and removal</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-electric-sage" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>DICOM metadata scrubbing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-electric-sage" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Date shifting and identifier replacement</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-electric-sage" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Consent tracking and management</span>
                    </li>
                  </ul>
                </div>
                <div className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-medical-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-medical-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Safe Sharing Certified</h3>
                    <p className="text-warm-gray">Our anonymization tools meet or exceed Safe Harbor standards for de-identification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-12 backdrop-blur-xl border border-warm-gray/20 text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Built for <span className="text-medical-blue">Medical Professionals</span>
            </h2>
            <p className="text-xl text-warm-gray mb-8 max-w-2xl mx-auto">
              Join the platform designed specifically for healthcare creators. Full compliance, no compromises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/get-started"
                className="btn-coral group relative overflow-hidden"
              >
                <span className="relative z-10">Start Creating Safely</span>
                <div className="absolute inset-0 bg-gradient-to-r from-hot-coral to-medical-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/contact" className="btn-secondary">
                Request Compliance Docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Compliance.displayName = "Compliance";

export default Compliance;