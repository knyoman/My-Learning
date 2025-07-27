import React, { useState } from 'react';
import { Project, UserProgress } from '../lib/supabase';
import { Check, Star, MessageCircle, ExternalLink, Edit, Save, X, Github } from 'lucide-react';
import { Confetti } from './Confetti';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onToggleComplete: (projectId: number) => void;
  progress?: UserProgress;
  onUpdateNotes: (projectId: number, notes: string) => Promise<void>;
  onUpdateLinks: (projectId: number, githubLink: string, learningLink: string) => Promise<void>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onToggleComplete, 
  progress,
  onUpdateNotes,
  onUpdateLinks 
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [editedLink, setEditedLink] = useState(progress?.learning_link || '');
  const [editedGithubLink, setEditedGithubLink] = useState(progress?.github_link || '');
  const [localNotes, setLocalNotes] = useState(progress?.notes || '');

  const isCompleted = progress?.is_completed || false;
  const currentNote = progress?.notes || '';
  const currentLink = progress?.learning_link || '';
  const currentGithubLink = progress?.github_link || '';

  const handleNoteChange = async (note: string) => {
    setLocalNotes(note);
    try {
      await onUpdateNotes(project.id, note);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleSaveEdit = async () => {
    onEdit(editedProject);
    
    try {
      await onUpdateLinks(project.id, editedGithubLink, editedLink);
    } catch (error) {
      console.error('Error updating links:', error);
    }
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProject(project);
    setEditedLink(progress?.learning_link || '');
    setEditedGithubLink(progress?.github_link || '');
    setIsEditing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'hard': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className={`
      group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02]
      ${isCompleted 
        ? 'border-green-500/50 bg-gradient-to-br from-green-900/20 to-green-800/10' 
        : 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20'
      }
      backdrop-blur-sm
    `}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 z-10">
        {/* Header with edit controls */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
              ${isCompleted ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}
              transition-all duration-300
            `}>
              {project.id}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-purple-300">
                  Tahap {project.stage}
                </span>
                {!isEditing ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                ) : (
                  <select
                    value={editedProject.difficulty}
                    onChange={(e) => setEditedProject({...editedProject, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                    className="px-2 py-1 rounded-full text-xs bg-gray-800 text-white border border-purple-500/30"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                )}
              </div>
              {!isEditing ? (
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
              ) : (
                <input
                  value={editedProject.title}
                  onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg px-3 py-1 text-white text-sm"
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
              >
                <Edit size={14} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all duration-300"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 rounded-full bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-all duration-300"
                >
                  <X size={14} />
                </button>
              </>
            )}
            <button
              onClick={() => onToggleComplete(project.id)}
              className={`
                p-2 rounded-full transition-all duration-300
                ${isCompleted 
                  ? 'bg-green-500 hover:bg-green-400 text-white' 
                  : 'bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white'
                }
              `}
            >
              <Check size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        {!isEditing ? (
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {project.description}
          </p>
        ) : (
          <textarea
            value={editedProject.description}
            onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
            className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg p-3 text-white text-sm resize-none h-20 mb-4"
          />
        )}

        {/* Link input in edit mode */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Learning Resource Link
            </label>
            <input
              type="url"
              value={editedLink}
              onChange={(e) => setEditedLink(e.target.value)}
              placeholder="Enter learning resource URL..."
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        )}
        
        {/* GitHub link input in edit mode */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Repository Link
            </label>
            <input
              type="url"
              value={editedGithubLink}
              onChange={(e) => setEditedGithubLink(e.target.value)}
              placeholder="Enter GitHub repository URL..."
              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} />
            <span className="text-xs">{project.stageName}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all text-xs"
          >
            <MessageCircle size={12} />
            Notes
          </button>
          {currentGithubLink && (
            <div className="relative group">
              <button
                onClick={() => window.open(currentGithubLink, '_blank')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-all text-xs"
              >
                <Github size={12} />
                GitHub
              </button>
              {/* GitHub Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>View on GitHub</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
          {currentLink && (
            <div className="relative group">
              <button
                onClick={() => window.open(currentLink, '_blank')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all text-xs"
              >
                <ExternalLink size={12} />
                Learn
              </button>
              {/* Learn Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Web</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {/* Notes section */}
        {showNotes && (
          <div className="mt-4 space-y-4">
            {/* Notes textarea */}
            <div className="p-4 rounded-lg bg-white/5 border border-purple-500/30">
              <textarea
                value={localNotes}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Add your notes here..."
                className="w-full h-20 bg-transparent border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full"></div>
        )}
      </div>
    </div>
  );
};