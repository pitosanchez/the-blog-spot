import { memo } from "react";
import { CREATOR_FEATURES } from "../../constants";

export const Features = memo(() => {
  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-b from-white to-cream"
      aria-label="Platform features"
    >
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-vintage-ink mb-4">
            Everything You Need, Nothing You Don't
          </h2>
          <p className="text-lg text-warm-gray-700 max-w-2xl mx-auto">
            Built by creators, for creators. Simple tools that actually help you
            earn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CREATOR_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl p-6 border border-warm-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-source font-bold text-vintage-ink mb-2">
                {feature.title}
              </h3>
              <p className="text-warm-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-playfair font-bold text-vintage-ink text-center mb-8">
            Why Creators Choose Us
          </h3>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-vintage-ink text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-center">The Blog Spot</th>
                  <th className="px-6 py-4 text-center">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium">Revenue Share</td>
                  <td className="px-6 py-4 text-center text-community-teal font-bold">
                    90%
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray-600">
                    80-87%
                  </td>
                </tr>
                <tr className="bg-cream/50">
                  <td className="px-6 py-4 font-medium">Payout Schedule</td>
                  <td className="px-6 py-4 text-center text-community-teal font-bold">
                    Weekly
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray-600">
                    Monthly
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Minimum Payout</td>
                  <td className="px-6 py-4 text-center text-community-teal font-bold">
                    $25
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray-600">
                    $50-100
                  </td>
                </tr>
                <tr className="bg-cream/50">
                  <td className="px-6 py-4 font-medium">Export Subscribers</td>
                  <td className="px-6 py-4 text-center text-community-teal font-bold">
                    ✓ Anytime
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray-600">
                    Limited
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Platform Fees</td>
                  <td className="px-6 py-4 text-center text-community-teal font-bold">
                    None
                  </td>
                  <td className="px-6 py-4 text-center text-warm-gray-600">
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
