import React, { useState, memo, useCallback } from "react";
import { Button } from "../ui/Button";
import type { NewsletterFormData } from "../../types";

interface NewsletterProps {
  onSubscribe?: (data: NewsletterFormData) => Promise<void>;
}

export const Newsletter = memo<NewsletterProps>(({ onSubscribe }) => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: "",
    firstName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear message when user starts typing
      if (message) {
        setMessage(null);
      }
    },
    [message]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.email.trim()) {
        setMessage({ type: "error", text: "Please enter your email address." });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setMessage({
          type: "error",
          text: "Please enter a valid email address.",
        });
        return;
      }

      setIsSubmitting(true);
      setMessage(null);

      try {
        if (onSubscribe) {
          await onSubscribe(formData);
        } else {
          // Default behavior - simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        setMessage({
          type: "success",
          text: "Thank you for subscribing! Welcome to our community.",
        });
        setFormData({ email: "", firstName: "" });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubscribe]
  );

  return (
    <section
      className="py-12 md:py-16 lg:py-20 bg-community-teal text-storyteller-cream"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
        <header className="mb-8 md:mb-12">
          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4"
          >
            Join Our Storytelling Community
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto px-4 text-storyteller-cream text-opacity-90 mb-6">
            Get exclusive content, writing prompts, and early access to featured
            stories. Plus, receive our{" "}
            <strong>FREE Storytelling Starter Kit</strong> when you subscribe!
          </p>

          {/* Lead Magnet Benefits */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-bold text-sm mb-1">Free Starter Kit</h3>
              <p className="text-xs opacity-90">
                Writing prompts & story templates
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold text-sm mb-1">Exclusive Stories</h3>
              <p className="text-xs opacity-90">
                Early access to featured content
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-sm mb-1">Weekly Prompts</h3>
              <p className="text-xs opacity-90">Inspiration delivered weekly</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name (Optional)
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name (optional)"
                className="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-storyteller-cream text-vintage-ink placeholder-vintage-ink placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:border-bodega-brick transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email Address (Required)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                aria-required="true"
                aria-describedby={message ? "newsletter-message" : undefined}
                className="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-storyteller-cream text-vintage-ink placeholder-vintage-ink placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:border-bodega-brick transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full bg-bodega-brick hover:bg-vintage-ink text-storyteller-cream"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe to Our Newsletter"}
            </Button>
          </form>

          {/* Status Message */}
          {message && (
            <div
              id="newsletter-message"
              className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
              role="alert"
              aria-live="polite"
            >
              {message.text}
            </div>
          )}

          <p className="mt-4 text-xs text-storyteller-cream text-opacity-70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
});

Newsletter.displayName = "Newsletter";
