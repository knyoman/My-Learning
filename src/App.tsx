import React, { useState, useMemo } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthWrapper } from './components/AuthWrapper';
import { ProjectCard } from './components/ProjectCard';
import { HtmlCssProjectCard } from './components/HtmlCssProjectCard';
import { ReactProjectCard } from './components/ReactProjectCard';
import { ProgressBar } from './components/ProgressBar';
import { FilterControls } from './components/FilterControls';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Code, Sparkles, Zap, Github, BookOpen, Palette, Atom } from 'lucide-react';
import { Confetti } from './components/Confetti';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'php' | 'html-css' | 'react'>('php');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const {
    projects: currentProjects,
    completedProjectIds: currentCompletedTasks,
    loading: dataLoading,
    error: dataError,
    toggleCompletion,
    updateNotes,
    updateLinks,
    getProgressByProjectId
  } = useSupabaseData(currentPage);

  const [showConfetti, setShowConfetti] = useState(false);

  const filteredProjects = useMemo(() => {
    return currentProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = selectedStage === 0 || project.stage === selectedStage;
      const matchesDifficulty = selectedDifficulty === '' || project.difficulty === selectedDifficulty;
      return matchesSearch && matchesStage && matchesDifficulty;
    });
  }, [currentProjects, searchTerm, selectedStage, selectedDifficulty]);

  const stageProgress = useMemo(() => {
    const stages = { 1: { completed: 0, total: 0 }, 2: { completed: 0, total: 0 }, 3: { completed: 0, total: 0 }, 4: { completed: 0, total: 0 } };
    currentProjects.forEach(project => {
      stages[project.stage as keyof typeof stages].total++;
      if (currentCompletedTasks.includes(project.id)) {
        stages[project.stage as keyof typeof stages].completed++;
      }
    });
    return stages;
  }, [currentProjects, currentCompletedTasks]);

  const handleLoadingComplete = () => setIsLoading(false);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedStage(0);
    setSelectedDifficulty('');
  };

  const handleToggleComplete = async (projectId: number) => {
    const isCompleted = currentCompletedTasks.includes(projectId);
    try {
      await toggleCompletion(projectId);
      if (!isCompleted) {
        setShowConfetti(true);
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleProjectUpdate = (projectId: number, updates: any) => {};

  const getPageData = () => {
    if (currentPage === 'react') {
      return {
        title: 'React Learning Journey',
        description: 'Learn React with 200 hands-on projects. From basic components to advanced applications.',
        icon: Atom,
        secondaryIcon: Code,
        gradientFrom: 'from-cyan-400',
        gradientTo: 'to-blue-400',
        bgGradient: 'from-slate-900 via-cyan-900 to-blue-900',
        primary: 'cyan',
        accentColor: 'cyan-400',
        borderColor: 'cyan-500/20'
      };
    } else if (currentPage === 'php') {
      return {
        title: 'PHP Learning Journey',
        description: 'Learn PHP with 200 hands-on projects. From basic logic to advanced web applications.',
        icon: Code,
        secondaryIcon: Sparkles,
        gradientFrom: 'from-purple-400',
        gradientTo: 'to-blue-400',
        bgGradient: 'from-slate-900 via-purple-900 to-blue-900',
        primary: 'purple',
        accentColor: 'purple-400',
        borderColor: 'purple-500/20'
      };
    } else {
      return {
        title: 'HTML & CSS Learning Journey',
        description: 'Learn HTML & CSS with 200 creative projects. From basic layouts to advanced responsive designs.',
        icon: Palette,
        secondaryIcon: Code,
        gradientFrom: 'from-orange-400',
        gradientTo: 'to-red-400',
        bgGradient: 'from-slate-900 via-orange-900 to-red-900',
        primary: 'orange',
        accentColor: 'orange-400',
        borderColor: 'orange-500/20'
      };
    }
  };

  const pageData = getPageData();
  const IconComponent = pageData.icon;
  const SecondaryIconComponent = pageData.secondaryIcon;

  if (isLoading || dataLoading) return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  if (dataError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h1>
          <p className="text-gray-300">{dataError}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper currentPage={currentPage}>
      <div className={`min-h-screen bg-gradient-to-br ${pageData.bgGradient} relative overflow-hidden`}>
        {/* Main content */}
        <div className="relative z-10 pt-8">
          <header className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                    <IconComponent className="text-white" size={40} />
                  </div>
                  <h1 className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${pageData.gradientFrom} ${pageData.gradientTo} bg-clip-text text-transparent`}>
                    {pageData.title}
                  </h1>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                    <SecondaryIconComponent className="text-white" size={40} />
                  </div>
                </div>
                <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
                  {pageData.description} Track your progress and share your achievements!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`bg-gradient-to-br from-${pageData.primary}-500/10 to-${pageData.primary}-600/5 rounded-2xl p-6 border border-${pageData.primary}-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${pageData.primary}-500/20 rounded-xl`}>
                      <BookOpen className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Total Projects</h3>
                      <p className="text-3xl font-bold text-white">200</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Zap className="text-green-300" size={28} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Completed</h3>
                      <p className="text-3xl font-bold text-green-300">{currentCompletedTasks.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Github className="text-blue-300" size={28} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Remaining</h3>
                      <p className="text-3xl font-bold text-blue-300">{currentProjects.length - currentCompletedTasks.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
          </div>

          <div className="px-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <ProgressBar
                completed={currentCompletedTasks.length}
                total={currentProjects.length}
                stageProgress={stageProgress}
                currentPage={currentPage}
              />
            </div>
          </div>

          <div className="px-4 mb-8">
            <div className="max-w-7xl mx-auto">
              <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedStage={selectedStage}
                onStageChange={setSelectedStage}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                onReset={handleReset}
                currentPage={currentPage}
              />
            </div>
          </div>

          <div className="px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={`${currentPage}-${project.id}`}
                    project={project}
                    onEdit={handleProjectUpdate}
                    onToggleComplete={handleToggleComplete}
                    progress={getProgressByProjectId(project.id)}
                    onUpdateNotes={updateNotes}
                    onUpdateLinks={updateLinks}
                  />
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="p-6 bg-white/5 rounded-2xl inline-block mb-6 backdrop-blur-sm border border-white/10">
                    <Code className="text-white/60" size={64} />
                  </div>
                  <h3 className="text-white text-2xl mb-3 font-semibold">No projects found</h3>
                  <p className="text-gray-400 text-lg">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <ScrollToTop />
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-scan {
          animation: scan 6s ease-in-out infinite;
        }
      `}</style>
    </AuthWrapper>
  );
}

export default App;
