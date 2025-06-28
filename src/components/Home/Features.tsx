import { memo } from "react";
import { CREATOR_FEATURES } from "../../constants";

export const Features = memo(() => {
  return (
    <section
      className="py-16 sm:py-20 bg-charcoal/50"
      aria-label="Platform features"
    >
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16 space-y-responsive-sm">
          <h2 className="font-display font-bold text-responsive-xl text-crisp-white">
            Medical-Grade Features,{" "}
            <span className="text-medical-blue">Built for Healthcare</span>
          </h2>
          <p className="text-responsive-base text-warm-gray max-w-3xl mx-auto">
            Purpose-built for medical professionals. HIPAA compliant, CME integrated,
            and designed for clinical education.
          </p>
        </div>

        <div className="grid-responsive-features mb-12 sm:mb-16">
          {CREATOR_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="glassmorphism rounded-xl p-6 sm:p-8 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105 touch-target"
            >
              <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-crisp-white mb-3">
                {feature.title}
              </h3>
              <p className="text-warm-gray leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="max-w-5xl mx-auto">
          <h3 className="font-display font-bold text-responsive-lg text-crisp-white text-center mb-8 sm:mb-12">
            Why Physicians <span className="text-medical-blue">Choose MedCreator Hub</span>
          </h3>

          {/* Mobile-friendly table */}
          <div className="hidden sm:block glassmorphism rounded-2xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-electric-sage/10 border-b border-warm-gray/20">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-crisp-white text-sm sm:text-base">
                    Feature
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-bold text-medical-blue text-sm sm:text-base">
                    MedCreator Hub
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-bold text-warm-gray text-sm sm:text-base">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/10">
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Revenue Share
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-medical-blue font-bold text-base sm:text-lg">
                    90%
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    80-87%
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    HIPAA Compliance
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-medical-blue font-bold text-base sm:text-lg">
                    ✓ Full
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    None
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    CME Credits
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-medical-blue font-bold text-base sm:text-lg">
                    ✓ Integrated
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Not Available
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    License Verification
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-medical-blue font-bold text-base sm:text-lg">
                    ✓ Automated
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Not Available
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Weekly Payouts
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-medical-blue font-bold text-base sm:text-lg">
                    ✓ Yes
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Monthly Only
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile card layout for comparison */}
          <div className="sm:hidden space-y-4">
            <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-crisp-white text-sm">
                  Revenue Share
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-electric-sage font-bold text-lg">
                  90%
                </span>
                <span className="text-warm-gray text-sm">vs 80-87%</span>
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-crisp-white text-sm">
                  Payout Schedule
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-electric-sage font-bold text-lg">
                  Weekly
                </span>
                <span className="text-warm-gray text-sm">vs Monthly</span>
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-crisp-white text-sm">
                  Minimum Payout
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-electric-sage font-bold text-lg">
                  $25
                </span>
                <span className="text-warm-gray text-sm">vs $50-100</span>
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-crisp-white text-sm">
                  Export Subscribers
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-electric-sage font-bold text-lg">
                  ✓ Anytime
                </span>
                <span className="text-warm-gray text-sm">vs Limited</span>
              </div>
            </div>
            <div className="glassmorphism rounded-xl p-4 backdrop-blur-xl border border-warm-gray/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-crisp-white text-sm">
                  Platform Fees
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-electric-sage font-bold text-lg">
                  None
                </span>
                <span className="text-warm-gray text-sm">vs Various</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = "Features";
