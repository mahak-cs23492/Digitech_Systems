import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
  const contactCards = [
    {
      icon: <FiPhone />,
      title: 'Telephone Support',
      desc: 'Connect directly with sales team or technicians.',
      value: '+91 9927700201'
    },
    {
      icon: <FiMail />,
      title: 'Email Correspondence',
      desc: 'Send us business quotes or inquiries.',
      value: 'ds873@rediffmail.com'
    },
    {
      icon: <FiMapPin />,
      title: 'Retail Shop Address',
      desc: 'Visit our flagship computer hardware hub.',
      value: 'Shop No. 1, Marris Tower, Marris Road, Aligarh',
      link: 'https://www.google.com/maps/search/?api=1&query=Shop+No.+1,+Marris+Tower,+Marris+Road,+Aligarh',
      actionText: 'Get Directions'
    }
  ];

  return (
    <div className="bg-neutralbg min-h-screen">
      
      {/* Hero Banner Header (Center Aligned, matching About page style) */}
      <div className="relative bg-slate-950 py-20 text-center text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-slate-950"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 z-10 space-y-4">
          <span className="text-accent font-extrabold text-xs tracking-widest uppercase">Support Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact DigiTech Systems</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Have questions about laptop specifications, custom configurations, or services? We are here to help.
          </p>
        </div>
      </div>

      {/* Contact Cards Grid Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((c, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4 hover:border-accent/15 hover:shadow-cardHover transition duration-300 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="bg-accent/10 text-accent p-3.5 rounded-2xl w-max">
                  {c.icon}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{c.title}</h4>
                <p className="text-slate-450 text-xs leading-relaxed">{c.desc}</p>
                <p className="font-extrabold text-slate-800 text-sm select-all">{c.value}</p>
              </div>
              {c.link && c.actionText ? (
                <a 
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-secondary font-bold text-xs flex items-center space-x-1 pt-4 text-left border-t border-slate-50 w-full block"
                >
                  <span>{c.actionText}</span>
                </a>
              ) : (
                <div className="pt-4 border-t border-slate-50 text-[11px] text-slate-400">
                  Plain text detail for manual copy
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Redirect (Option B) & Map layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">
        
        {/* Option B: WhatsApp Chat */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-50 pb-3">Direct Inquiries</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Have a question about laptop stock, custom configurations, repairs, or service pricing? Connect with us directly on WhatsApp for instant assistance.
            </p>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start space-x-3.5 mt-2">
              <span className="text-2xl text-emerald-600">💬</span>
              <div className="space-y-1">
                <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Fast Response Timings</h5>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Monday – Sunday: 11:00 AM – 8:30 PM (Quick updates from our support team)
                </p>
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/919927700201?text=Hi,%20I%20have%20an%20inquiry%20regarding%20DigiTech%20Systems"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition duration-300 transform active:scale-98 flex items-center justify-center space-x-2 text-sm hover:shadow-lg mt-6"
          >
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>

        {/* Operating Hours & Stylized Map placeholder */}
        <div className="space-y-6 flex flex-col">
          
          {/* Operating Hours card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FiClock className="text-accent" />
              <span>Business Operations Hours</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-650 pt-2">
              <div>
                <p className="font-bold text-slate-800">Monday - Sunday (Open all 7 days)</p>
                <p className="text-xs text-slate-400 mt-1">11:00 AM - 8:30 PM</p>
              </div>
            </div>
          </div>

          {/* Map Simulation Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card flex-1 min-h-[250px] relative overflow-hidden flex flex-col justify-end">
            <div className="absolute inset-0 bg-slate-50 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            
            <div className="absolute top-1/3 left-0 right-0 h-4 bg-slate-200 rotate-1"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-slate-200 -rotate-2"></div>
            
            <div className="absolute top-1/3 left-1/3 -mt-6 -ml-4 z-10 flex flex-col items-center">
              <div className="bg-accent text-white p-2 rounded-full shadow-lg border border-white animate-bounce">
                <FiMapPin className="w-5 h-5" />
              </div>
              <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                DigiTech Systems
              </span>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-4 rounded-2xl relative z-10 shadow-lg text-xs max-w-sm m-4 self-start">
              <p className="font-bold text-slate-900 mb-1">DigiTech Store</p>
              <p className="text-slate-500 mb-2 leading-relaxed">Shop No. 1, Marris Tower, Marris Road, In Front of Citi Centre Mall, Aligarh</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Shop+No.+1,+Marris+Tower,+Marris+Road,+Aligarh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline font-bold"
              >
                Open in Maps
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
