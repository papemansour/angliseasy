import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Euro, DollarSign } from 'lucide-react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');
  const EUR_TO_FCFA = 655.957;

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === 'EUR' ? 'FCFA' : 'EUR';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const formatPrice = (eurPrice) => {
    if (currency === 'EUR') {
      return `${eurPrice}€`;
    } else {
      const fcfaPrice = Math.round(eurPrice * EUR_TO_FCFA);
      return `${fcfaPrice.toLocaleString()} FCFA`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, EUR_TO_FCFA }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-md px-3 py-2">
      <span className="text-sm font-medium text-gray-600">Afficher les prix en :</span>
      <Button
        onClick={toggleCurrency}
        variant={currency === 'EUR' ? 'default' : 'outline'}
        size="sm"
        className={`${
          currency === 'EUR'
            ? 'bg-teal-600 hover:bg-teal-700 text-white'
            : 'hover:bg-teal-50 text-teal-600'
        } transition-all`}
      >
        <Euro className="w-4 h-4 mr-1" />
        EUR (Europe)
      </Button>
      <Button
        onClick={toggleCurrency}
        variant={currency === 'FCFA' ? 'default' : 'outline'}
        size="sm"
        className={`${
          currency === 'FCFA'
            ? 'bg-teal-600 hover:bg-teal-700 text-white'
            : 'hover:bg-teal-50 text-teal-600'
        } transition-all`}
      >
        FCFA (Afrique)
      </Button>
    </div>
  );
};
