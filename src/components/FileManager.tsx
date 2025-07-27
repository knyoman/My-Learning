import React, { useState } from 'react';
import { FileManager } from '../utils/fileManager';
import { FolderArchive, Download, Trash2, RefreshCw } from 'lucide-react';

export const FileManagerComponent: React.FC = () => {
  const [files, setFiles] = useState(FileManager.getAllProjectFiles());
  const [showManager, setShowManager] = useState(false);

  const refreshFiles = () => {
    setFiles(FileManager.getAllProjectFiles());
  };

  const handleDeleteFile = (projectId: number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      if (FileManager.deleteProjectFile(projectId)) {
        refreshFiles();
      }
    }
  };

  const handleDownloadFile = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportFileList = () => {
    const fileList = FileManager.exportFileList();
    const blob = new Blob([fileList], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-files-list.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fileCount = Object.keys(files).length;

  if (!showManager) {
    return (
      <button
        onClick={() => setShowManager(true)}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg transition-all duration-300 z-50"
      >
        <FolderArchive size={20} />
        Files ({fileCount})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <FolderArchive className="text-purple-300" size={24} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-xl">Project File Manager</h2>
              <p className="text-gray-400 text-sm">Manage all uploaded project files</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshFiles}
              className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={exportFileList}
              className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm"
            >
              Export List
            </button>
            <button
              onClick={() => setShowManager(false)}
              className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-all text-sm"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {fileCount === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-800/50 rounded-full inline-block mb-4">
                <FolderArchive className="text-gray-400" size={48} />
              </div>
              <h3 className="text-white text-xl mb-2">No files uploaded</h3>
              <p className="text-gray-400">Upload ZIP files to your projects to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(files).map((file: any) => (
                <div
                  key={file.id}
                  className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-full">
                        <FolderArchive className="text-orange-300" size={16} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Project #{file.id}</h4>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">
                          {file.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="p-1.5 bg-orange-500/20 text-orange-300 rounded hover:bg-orange-500/30 transition-all"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-1.5 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Size: {FileManager.formatFileSize(file.size)}</p>
                    <p>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                    <p className="truncate">Path: /data/projects/{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};