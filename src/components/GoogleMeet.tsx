import React from 'react';
import { Video } from 'lucide-react';

interface GoogleMeetProps {
  courseTitle: string;
  meetLink: string;
}

export function GoogleMeet({ courseTitle, meetLink }: GoogleMeetProps) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Video size={20} />
        <h4 className="font-semibold">Live Class</h4>
      </div>
      <p className="text-sm text-gray-600 mt-2">Join the live class for {courseTitle}</p>
      <a
        href={meetLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-300"
      >
        <Video size={16} />
        Join Google Meet
      </a>
    </div>
  );
}