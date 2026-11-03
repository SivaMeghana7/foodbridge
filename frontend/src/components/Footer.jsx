import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1E382A] text-white pt-16 pb-12 mt-auto border-t border-[#238052]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#176B45] flex items-center justify-center text-white">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Food<span className="text-[#238052]">Bridge</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Share food. Reduce waste. Build a better community. FoodBridge connects surplus food from local donors directly with individuals and charities in need.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>for zero-waste communities.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-emerald-400 mb-4 font-['Manrope']">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#categories" className="hover:text-white transition-colors">
                  Food Categories
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Find Food Nearby
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition-colors">
                  Donate Surplus
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-emerald-400 mb-4 font-['Manrope']">
              Food Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>Cooked Meals</li>
              <li>Bakery & Pastries</li>
              <li>Fresh Fruits</li>
              <li>Farm Vegetables</li>
              <li>Dairy Products</li>
              <li>Packaged Groceries</li>
            </ul>
          </div>

          {/* Col 4: Contact & Platform */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-emerald-400 mb-4 font-['Manrope']">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@foodbridge.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 456-FOOD</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Community Action Center, Global City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} FoodBridge Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

