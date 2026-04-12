import React from "react";
import Link from "next/link";
import { QuickLinks } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4 mx-auto md:mx-0">MediStore 💊</h2>
          <p className="text-sm">
            Your trusted online pharmacy. Order medicines and health products 
            online, delivered safely to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-primary mx-auto md:mx-0">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {
                QuickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))
            }
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-primary mx-auto md:mx-0">Contact Us</h3>
          <p className="text-sm mb-2">Email: support@medistore.com</p>
          <p className="text-sm mb-4">Phone: +880 123456789</p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-gray-200 text-gray-600 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} MediStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
