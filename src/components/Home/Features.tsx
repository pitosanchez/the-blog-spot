import { memo } from "react";
import { CREATOR_FEATURES } from "../../constants";

export const Features = memo(() => {
  return (
    <section className="py-20 bg-charcoal/50" aria-label="Platform features">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-crisp-white mb-6">
            Everything You Need,{" "}
            <span className="text-electric-sage">Nothing You Don't</span>
          </h2>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Built by creators, for creators. Simple tools that actually help you
            earn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {CREATOR_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="glassmorphism rounded-xl p-8 backdrop-blur-xl border border-warm-gray/20 hover:border-electric-sage/50 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-crisp-white mb-3">
                {feature.title}
              </h3>
              <p className="text-warm-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-display font-bold text-3xl md:text-4xl text-crisp-white text-center mb-12">
            Why Creators <span className="text-electric-sage">Choose Us</span>
          </h3>
          <div className="glassmorphism rounded-2xl backdrop-blur-xl border border-warm-gray/20 overflow-hidden">
            <table className="w-full">
              <thead className="bg-electric-sage/10 border-b border-warm-gray/20">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-crisp-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-electric-sage">
                    The Blog Spot
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-warm-gray">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/10">
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-crisp-white">
                    Revenue Share
                  </td>
                  <td className="px-6 py-4 text-center text-electric-sage font-bold text-lg">
                    90%
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray">
                    80-87%
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-crisp-white">
                    Payout Schedule
                  </td>
                  <td className="px-6 py-4 text-center text-electric-sage font-bold text-lg">
                    Weekly
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray">
                    Monthly
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-crisp-white">
                    Minimum Payout
                  </td>
                  <td className="px-6 py-4 text-center text-electric-sage font-bold text-lg">
                    $25
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray">
                    $50-100
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-crisp-white">
                    Export Subscribers
                  </td>
                  <td className="px-6 py-4 text-center text-electric-sage font-bold text-lg">
                    ✓ Anytime
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray">
                    Limited
                  </td>
                </tr>
                <tr className="hover:bg-electric-sage/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-crisp-white">
                    Platform Fees
                  </td>
                  <td className="px-6 py-4 text-center text-electric-sage font-bold text-lg">
                    None
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray">
                    Various
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = "Features";
