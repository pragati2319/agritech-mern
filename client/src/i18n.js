import React, { createContext, useContext, useState } from 'react';

const dict = {
  en: {
    appName: 'AgriTech', dashboard: 'Dashboard', farms: 'Farms', crops: 'Crops', orders: 'Orders',
    forum: 'Experts & Community', admin: 'Admin', login: 'Log in', register: 'Create account', logout: 'Log out',
    name: 'Name', email: 'Email', password: 'Password', save: 'Save', add: 'Add', delete: 'Delete',
    welcome: 'Welcome', noFarms: 'You have no farms yet. Add your first farm.', noCrops: 'No crops yet. Add one to start tracking.',
    farmName: 'Farm name', city: 'City', state: 'State', latitude: 'Latitude', longitude: 'Longitude', acres: 'Size (acres)',
    cropName: 'Crop name', farm: 'Farm', status: 'Status', addLog: 'Add note', pestAlert: 'Report pest', pest: 'Pest', severity: 'Severity',
    weather: 'Weather now', soil: 'Soil health', refresh: 'Refresh weather', place: 'Place order', total: 'Total',
    cart: 'Your cart', post: 'Post question', title: 'Title', body: 'Details', reply: 'Reply', users: 'Users',
    loading: 'Loading...', haveAccount: 'Already have an account?', newHere: 'New here?', language: 'Language'
  },
  hi: {
    appName: 'एग्रीटेक', dashboard: 'डैशबोर्ड', farms: 'खेत', crops: 'फसलें', orders: 'ऑर्डर',
    forum: 'विशेषज्ञ और समुदाय', admin: 'एडमिन', login: 'लॉग इन', register: 'खाता बनाएँ', logout: 'लॉग आउट',
    name: 'नाम', email: 'ईमेल', password: 'पासवर्ड', save: 'सहेजें', add: 'जोड़ें', delete: 'हटाएँ',
    welcome: 'स्वागत है', noFarms: 'अभी कोई खेत नहीं है। अपना पहला खेत जोड़ें।', noCrops: 'अभी कोई फसल नहीं है। ट्रैक करने के लिए जोड़ें।',
    farmName: 'खेत का नाम', city: 'शहर', state: 'राज्य', latitude: 'अक्षांश', longitude: 'देशांतर', acres: 'आकार (एकड़)',
    cropName: 'फसल का नाम', farm: 'खेत', status: 'स्थिति', addLog: 'नोट जोड़ें', pestAlert: 'कीट की सूचना दें', pest: 'कीट', severity: 'गंभीरता',
    weather: 'अभी का मौसम', soil: 'मिट्टी की सेहत', refresh: 'मौसम रीफ़्रेश करें', place: 'ऑर्डर करें', total: 'कुल',
    cart: 'आपकी टोकरी', post: 'सवाल पूछें', title: 'शीर्षक', body: 'विवरण', reply: 'जवाब दें', users: 'उपयोगकर्ता',
    loading: 'लोड हो रहा है...', haveAccount: 'पहले से खाता है?', newHere: 'नए हैं?', language: 'भाषा'
  }
};

const LangCtx = createContext();
export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const change = (l) => { localStorage.setItem('lang', l); setLang(l); };
  const t = (k) => (dict[lang] && dict[lang][k]) || dict.en[k] || k;
  return <LangCtx.Provider value={{ lang, setLang: change, t }}>{children}</LangCtx.Provider>;
};
export const useLang = () => useContext(LangCtx);
