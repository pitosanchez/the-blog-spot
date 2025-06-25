import { memo } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export const Footer = memo(() => {
  return (
    <footer className="bg-charcoal border-t border-warm-gray/10">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-warm-gray/10">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Logo className="h-8 w-8 text-electric-sage" />
            <span className="font-display font-bold text-2xl text-crisp-white">
              The Blog Spot
            </span>
          </div>
          <p className="text-warm-gray text-center md:text-right max-w-md">
            The creator platform that actually puts creators first. Keep 90% of
            your earnings.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Creators Column */}
          <div>
            <h3 className="font-body font-bold text-lg mb-4 text-electric-sage">
              For Creators
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/get-started"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  to="/creators"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Browse Creators
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-body font-bold text-lg mb-4 text-electric-sage">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-body font-bold text-lg mb-4 text-electric-sage">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-warm-gray hover:text-crisp-white transition-colors flex items-center gap-2"
                >
                  Status
                  <span className="w-2 h-2 bg-electric-sage rounded-full animate-pulse"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-body font-bold text-lg mb-4 text-electric-sage">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-warm-gray hover:text-crisp-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-warm-gray/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-warm-gray text-sm mb-4 md:mb-0">
            © 2024 The Blog Spot. All rights reserved. Built with ❤️ for
            creators.
          </p>
          <div className="flex items-center space-x-6">
            {/* Performance badges */}
            <div className="flex items-center gap-4 text-xs text-warm-gray">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                60fps
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-electric-sage"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                1.5s load
              </span>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/theblogspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-gray hover:text-electric-sage transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://instagram.com/theblogspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-gray hover:text-electric-sage transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
