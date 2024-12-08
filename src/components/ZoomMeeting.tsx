import React from 'react';
import { Video } from 'lucide-react';

interface ZoomMeetingProps {
  meetingUrl: string;
  courseTitle: string;
}

export function ZoomMeeting({ meetingUrl, courseTitle }: ZoomMeetingProps) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Video size={20} />
        <h4 className="font-semibold">Live Class</h4>
      </div>
      <p className="text-sm text-gray-600 mt-2">Join the live class for {courseTitle}</p>
      <a
        href={meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-300"
      >
        <Video size={16} />
        Join Zoom Meeting
      </a>
    </div>
  );
}