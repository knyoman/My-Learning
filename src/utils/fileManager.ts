export interface ProjectFile {
  id: number;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
}

export class FileManager {
  private static readonly STORAGE_KEY = 'projectFiles';
  private static readonly BASE_PATH = '/data/projects';

  static async saveProjectFile(projectId: number, file: File): Promise<ProjectFile> {
    try {
      // Create a unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `project-${projectId}-${timestamp}-${file.name}`;
      
      // Create file URL for browser storage
      const fileUrl = URL.createObjectURL(file);
      
      const projectFile: ProjectFile = {
        id: projectId,
        name: fileName,
        url: fileUrl,
        uploadDate: new Date().toISOString(),
        size: file.size
      };

      // Save to localStorage for persistence
      const existingFiles = this.getAllProjectFiles();
      const updatedFiles = {
        ...existingFiles,
        [projectId]: projectFile
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFiles));
      
      // Log the file path for reference
      console.log(`File saved: ${this.BASE_PATH}/${fileName}`);
      
      return projectFile;
    } catch (error) {
      console.error('Error saving project file:', error);
      throw new Error('Failed to save project file');
    }
  }

  static getProjectFile(projectId: number): ProjectFile | null {
    const files = this.getAllProjectFiles();
    return files[projectId] || null;
  }

  static getAllProjectFiles(): { [key: number]: ProjectFile } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading project files:', error);
      return {};
    }
  }

  static deleteProjectFile(projectId: number): boolean {
    try {
      const files = this.getAllProjectFiles();
      const file = files[projectId];
      
      if (file) {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(file.url);
        
        // Remove from storage
        delete files[projectId];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
        
        console.log(`File deleted: ${this.BASE_PATH}/${file.name}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting project file:', error);
      return false;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getProjectFolderPath(projectId: number): string {
    return `${this.BASE_PATH}/project-${projectId}`;
  }

  static exportFileList(): string {
    const files = this.getAllProjectFiles();
    const fileList = Object.values(files).map(file => ({
      projectId: file.id,
      fileName: file.name,
      uploadDate: file.uploadDate,
      size: this.formatFileSize(file.size),
      path: `${this.BASE_PATH}/${file.name}`
    }));
    
    return JSON.stringify(fileList, null, 2);
  }
}