import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../utils/api.js';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const web3FormsKey = import.meta.env.VITE_WEB3FORMS_KEY;

      if (web3FormsKey) {
        // Submit via Web3Forms free service
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name,
            email,
            phone: phone || 'Not Provided',
            subject: subject || 'New Contact Submission',
            message: message
          })
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Web3Forms submission failed');
        }
      } else {
        // Fallback: Submit directly to backend database API
        await API.post('/api/contact', { name, email, subject, message, phone });
      }

      toast.success('Your message has been sent successfully. A DigiTech Systems consultant will contact you shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Page Header */}
      <div className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 z-10 space-y-4">
          <span className="text-accent font-extrabold text-xs tracking-widest uppercase">Support Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact DigiTech Systems</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
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
                  target={c.link.startsWith('http') ? '_blank' : '_self'}
                  rel={c.link.startsWith('http') ? 'noopener noreferrer' : undefined}
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

      {/* Form Submission & Map layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 py-10">
        
        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-50 pb-3">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9927700201"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Subject (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Custom Workstation Configuration"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Message Content</label>
              <textarea
                rows="5"
                placeholder="How can DigiTech Systems help you today? Detail specs or request services..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-secondary text-white font-bold py-3.5 px-6 rounded-xl text-xs shadow-md transition duration-300 flex items-center justify-center space-x-2"
            >
              <FiSend />
              <span>{loading ? 'Submitting...' : 'Submit Message'}</span>
            </button>
          </form>
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
            {/* Styled Map Background Grid representation */}
            <div className="absolute inset-0 bg-slate-50 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            
            {/* Styled Road Mock lines */}
            <div className="absolute top-1/3 left-0 right-0 h-4 bg-slate-200 rotate-1"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-slate-200 -rotate-2"></div>
            
            {/* Pin mock mark */}
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
