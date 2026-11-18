
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/Image/onrent-logo.png"
                alt="OnRent Logo"
                width={150}
                height={50}
                className="h-auto w-36 object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Rent the equipment you need, when you need it.
              OnRent makes equipment rental simple, affordable,
              and accessible for everyone.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full bg-slate-800 p-2.5 transition hover:bg-blue-500"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full bg-slate-800 p-2.5 transition hover:bg-blue-500"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="rounded-full bg-slate-800 p-2.5 transition hover:bg-blue-500"
              >
                <FaXTwitter size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-full bg-slate-800 p-2.5 transition hover:bg-blue-500"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="transition hover:text-blue-400">
                  All Equipment
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition hover:text-blue-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-blue-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Support
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="transition hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-blue-400">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-blue-400">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-blue-400" />
                <span>Chattogram, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={19} className="shrink-0 text-blue-400" />
                <span>support@onrent.com</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={19} className="shrink-0 text-blue-400" />
                <span>+880 1XXXXXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} OnRent. All rights reserved.
            </p>

            <p>
              Made with <span className="text-orange-500">♥</span> for
              smarter equipment rentals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
