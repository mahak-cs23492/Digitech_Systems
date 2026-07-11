import React from 'react';
import { FiCheckCircle, FiCpu, FiAward, FiUsers } from 'react-icons/fi';

const About = () => {
  const stats = [
    { value: '15+', label: 'Years in Industry' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '100%', label: 'Genuine Products Guaranteed' },
    { value: '24/7', label: 'Tech Support Desk' }
  ];

  return (
    <div className="bg-neutralbg pb-16">
      
      {/* Hero Banner Header */}
      <div className="relative bg-slate-950 py-20 text-center text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-slate-950"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 z-10 space-y-4">
          <span className="text-accent font-extrabold text-xs tracking-widest uppercase">Our Mission</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About DigiTech Systems</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Your complete laptop solution provider in Aligarh, specializing in premium laptops, setups, and retail services.
          </p>
        </div>
      </div>

      {/* Main Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Complete Laptop Solution</h2>
          <p className="text-slate-655 text-sm leading-relaxed text-slate-600">
            At DigiTech Systems, we understand that technology is the engine of modern workflows. Whether you need a premium gaming laptop, a corporate workhorse, or specialized retail options in Aligarh, we have the inventory and expertise to guide you.
          </p>
          <p className="text-slate-655 text-sm leading-relaxed text-slate-600 mt-2">
            We are official authorized distributors for major manufacturers including HP, Dell, Lenovo, and premium accessories brands. Every single item is backed by its official manufacturer warranty, guaranteeing original performance and premium lifecycle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start space-x-3 text-sm">
              <FiCheckCircle className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Original Warranties</h4>
                <p className="text-slate-500 text-xs mt-0.5">Every laptop, screen, and printer includes full box documentation.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <FiCheckCircle className="text-accent w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Certified Tech Engineers</h4>
                <p className="text-slate-500 text-xs mt-0.5">We don't just sell boxes, we configure networks, workstations, and memory.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800"
            alt="office workstations setup"
            className="rounded-3xl shadow-card border border-slate-100 object-cover w-full h-96"
          />
          {/* Accent graphics */}
          <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-2xl hidden sm:block shadow-lg">
            <p className="text-3xl font-extrabold">100%</p>
            <p className="text-xs font-bold text-slate-200 mt-1">Genuine Inventories Only</p>
          </div>
        </div>
      </div>

      {/* Grid boxes: Why choose us */}
      <div className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl font-extrabold text-slate-900">Why DigiTech Systems?</h3>
            <p className="text-slate-500 text-xs mt-1">Our philosophy centers around providing elite customer satisfaction and genuine configurations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-3.5 transition duration-300">
              <div className="bg-accent/10 text-accent p-3.5 rounded-2xl w-max mx-auto">
                <FiCpu className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-850">Elite Hardware Selection</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                We select laptops, monitors, and accessories designed to last. No cheap replicas—only professional systems from top tiers.
              </p>
            </div>
            <div className="bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-3.5 transition duration-300">
              <div className="bg-highlight/10 text-highlight p-3.5 rounded-2xl w-max mx-auto">
                <FiAward className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-850">Certified Partner Status</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                As official certified partners with Dell, HP, and Canon, we receive first-hand inventory access, firmware support, and exclusive pricing benefits.
              </p>
            </div>
            <div className="bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-3.5 transition duration-300">
              <div className="bg-blue-800/10 text-blue-800 p-3.5 rounded-2xl w-max mx-auto">
                <FiUsers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-850">Customer Support Infrastructure</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Connect with our certified tech support desk anytime. We offer help on driver installations, printer setups, and warranty claims.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-4xl font-extrabold text-accent">{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
