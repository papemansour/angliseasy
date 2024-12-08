import React from 'react';
import { levels } from '../data/courses';
import { LevelCard } from './LevelCard';

export function Levels() {
  return (
    <section id="levels" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      </div>
    </section>
  );
}