import React, { useState } from 'react';
import { levels } from '../../data/courses';
import { useDocumentStore } from '../../store/documentStore';
import { useHomeworkStore } from '../../store/homeworkStore';
import { AdminLevelCard } from './AdminLevelCard';

export function AdminLevels() {
  const [selectedLevel, setSelectedLevel] = useState('');
  const { addDocument, getDocuments, deleteDocument } = useDocumentStore();
  const { getHomework, deleteHomework } = useHomeworkStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Levels</h2>
      <div className="grid grid-cols-1 gap-6">
        {levels.map((level) => (
          <AdminLevelCard
            key={level.id}
            level={level}
            documents={getDocuments(level.id)}
            homework={getHomework(level.id)}
            onAddDocument={(document) => addDocument(level.id, document)}
            onDeleteDocument={(documentId) => deleteDocument(level.id, documentId)}
            onDeleteHomework={(homeworkId) => deleteHomework(level.id, homeworkId)}
            isSelected={selectedLevel === level.id}
            onSelect={() => setSelectedLevel(level.id)}
          />
        ))}
      </div>
    </div>
  );
}