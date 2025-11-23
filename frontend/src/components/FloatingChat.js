import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickMessages = [
    "📚 Informations sur les cours",
    "💰 Tarifs et paiements",
    "📅 Horaires disponibles",
    "🎓 Niveaux d'anglais"
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Ouvre WhatsApp avec le message
      const whatsappNumber = "221123456789"; // À remplacer par le vrai numéro
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      setMessage('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce"
          aria-label="Ouvrir le chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            !
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border-2 border-teal-200 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-white font-bold">My KALAMA English</h3>
                <p className="text-teal-100 text-xs">En ligne • Réponse rapide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gradient-to-b from-teal-50 to-white min-h-[300px] max-h-[400px] overflow-y-auto">
            {/* Welcome Message */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border-l-4 border-teal-600">
              <p className="text-gray-800 font-semibold mb-2">👋 Bonjour !</p>
              <p className="text-gray-600 text-sm">
                Comment puis-je vous aider aujourd'hui ? Choisissez un sujet ou écrivez votre question.
              </p>
            </div>

            {/* Quick Replies */}
            <div className="space-y-2">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(msg)}
                  className="w-full text-left bg-white hover:bg-teal-50 border-2 border-teal-200 hover:border-teal-400 rounded-lg p-3 transition text-sm text-gray-700 hover:text-teal-800"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-2 border-teal-100">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 border-teal-200 focus:border-teal-400"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Vous serez redirigé vers WhatsApp
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default FloatingChat;
