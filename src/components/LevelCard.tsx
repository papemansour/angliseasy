import React, { useState } from 'react';
import { Level } from '../types/course';
import { Lock, HelpCircle, Mail } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { toast } from 'react-hot-toast';

interface LevelCardProps {
  level: Level;
}

export function LevelCard({ level }: LevelCardProps) {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleUnlock = () => {
    if (level.name === 'DÉBUTANT' && code === 'prima') {
      setIsUnlocked(true);
      setError('');
      toast.success(`${level.name} level unlocked!`);
    } else {
      setError('Invalid access code');
    }
  };

  const emailSubject = `Access Code Request for ${level.name} Level`;
  const emailBody = `Hello,\n\nI would like to request an access code for the ${level.name} level.\n\nThank you.`;
  const mailtoLink = `mailto:papemansour01@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{level.name}</h3>
        <p className="text-gray-600 mb-4">{level.description}</p>
        
        {!isUnlocked ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Lock className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter access code"
                  className="border rounded px-3 py-2 w-full"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <HelpCircle size={20} />
                </button>
              </div>
              {showTooltip && (
                <div className="absolute right-0 top-10 bg-gray-800 text-white text-sm rounded p-3 w-64 z-10">
                  <p>This content is for members only. To get your access code, please click the "Request Access Code" button below to send us an email.</p>
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <button
                onClick={handleUnlock}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Unlock Level
              </button>
              <a
                href={mailtoLink}
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition duration-300"
              >
                <Mail size={16} />
                Request Access Code
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {level.courses.map((course) => (
              <CourseCard key={course.id} course={course} meetLink={level.meetLink} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}