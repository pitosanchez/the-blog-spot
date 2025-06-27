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
            Everything You Need,{" "}
            <span className="text-electric-sage">Nothing You Don't</span>
          </h2>
          <p className="text-responsive-base text-warm-gray max-w-3xl mx-auto">
            Built by creators, for creators. Simple tools that actually help you
            earn.
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
            Why Creators <span className="text-electric-sage">Choose Us</span>
          </h3>

          {/* Mobile-friendly table */}
          <div className="hidden sm:block glassmorphism rounded-2xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-electric-sage/10 border-b border-warm-gray/20">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left font-bold text-crisp-white text-sm sm:text-base">
                    Feature
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-bold text-electric-sage text-sm sm:text-base">
                    The Blog Spot
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
                  <td className="px-4 sm:px-6 py-4 text-center text-electric-sage font-bold text-base sm:text-lg">
                    90%
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    80-87%
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Payout Schedule
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-electric-sage font-bold text-base sm:text-lg">
                    Weekly
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Monthly
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Minimum Payout
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-electric-sage font-bold text-base sm:text-lg">
                    $25
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    $50-100
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Export Subscribers
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-electric-sage font-bold text-base sm:text-lg">
                    ✓ Anytime
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Limited
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-medium text-crisp-white text-sm sm:text-base">
                    Platform Fees
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-electric-sage font-bold text-base sm:text-lg">
                    None
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center text-warm-gray text-sm sm:text-base">
                    Various
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
