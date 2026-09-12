import { useState, useEffect, useMemo } from 'react';
import Navigation, { ActiveSection } from './components/Navigation';
import RulersSection from './components/RulersSection';
import DatesSection from './components/DatesSection';
import TermsSection from './components/TermsSection';
import ArchitectureSection from './components/ArchitectureSection';
import SchemesSection from './components/SchemesSection';
import ExamQuiz from './components/ExamQuiz';
import AboutPage from './components/AboutPage';
import GlobalSearchModal from './components/GlobalSearchModal';
import BackToTopButton from './components/BackToTopButton';
import InstallPrompt from './components/InstallPrompt';
import UpdatePrompt from './components/UpdatePrompt';
import WelcomePrompt from './components/WelcomePrompt';
import { saveProgress, getAllProgress, resetProgress } from './lib/db';
import { RULERS_DATA } from './data/rulers';
import { DATES_DATA } from './data/dates';
import { TERMS_DATA } from './data/terms';
import { ARCHITECTURE_DATA } from './data/architecture';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('rulers');
  const [showAbout, setShowAbout] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [learnedSet, setLearnedSet] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  // Load progress on initial boot
  useEffect(() => {
    async function loadProgress() {
      try {
        const all = await getAllProgress();
        const set = new Set<string>();
        all.forEach(p => {
          if (p.status === 'learned') {
            set.add(p.id);
          }
        });
        setLearnedSet(set);
      } catch (err) {
        console.error('Failed to load progress from IndexedDB:', err);
      } finally {
        setIsReady(true);
      }
    }
    loadProgress();
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle learned status for any ID
  const handleToggleLearned = async (id: string) => {
    const isCurrentlyLearned = learnedSet.has(id);
    const nextStatus = isCurrentlyLearned ? 'learning' : 'learned';
    
    setLearnedSet(prev => {
      const next = new Set(prev);
      if (isCurrentlyLearned) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    try {
      await saveProgress(id, nextStatus);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const handleResetAllProgress = async () => {
    if (confirm('Внимание! Это очистит весь сохраненный прогресс по всем разделам. Сбросить?')) {
      try {
        await resetProgress();
        setLearnedSet(new Set());
      } catch (err) {
        console.error('Failed to clear database:', err);
      }
    }
  };

  const handleSearchNavigate = (section: ActiveSection) => {
    setActiveSection(section);
  };

  // Counts of learned items per section
  const learnedCounts = useMemo(() => {
    let rulersCount = 0;
    let datesCount = 0;
    let termsCount = 0;
    let archCount = 0;
    let schemesCount = 0;

    learnedSet.forEach(id => {
      if (id.startsWith('date-')) datesCount++;
      else if (id.startsWith('term-')) termsCount++;
      else if (id.startsWith('arch-')) archCount++;
      else if (id.startsWith('scheme-')) schemesCount++;
      else rulersCount++;
    });

    return {
      rulers: rulersCount,
      dates: datesCount,
      terms: termsCount,
      architecture: archCount,
      schemes: schemesCount
    };
  }, [learnedSet]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium text-sm">Загрузка материалов ЕГЭ...</p>
        </div>
      </div>
    );
  }

  if (showAbout) {
    return (
      <>
        <AboutPage 
          onBack={() => setShowAbout(false)} 
          onSelectSection={(sec) => {
            setActiveSection(sec);
            setShowAbout(false);
          }}
        />
        <InstallPrompt />
        <WelcomePrompt />
      </>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Universal Navigation */}
      <Navigation
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAbout={() => setShowAbout(true)}
        learnedCounts={learnedCounts}
      />

      {/* Main Dynamic View */}
      <main className="flex-1 pb-24">
        {activeSection === 'rulers' && (
          <RulersSection
            learnedSet={learnedSet}
            onToggleLearned={handleToggleLearned}
            onResetProgress={handleResetAllProgress}
            onOpenAbout={() => setShowAbout(true)}
          />
        )}

        {activeSection === 'dates' && (
          <DatesSection
            learnedSet={learnedSet}
            onToggleLearned={handleToggleLearned}
          />
        )}

        {activeSection === 'terms' && (
          <TermsSection
            learnedSet={learnedSet}
            onToggleLearned={handleToggleLearned}
          />
        )}

        {activeSection === 'architecture' && (
          <ArchitectureSection
            learnedSet={learnedSet}
            onToggleLearned={handleToggleLearned}
          />
        )}

        {activeSection === 'schemes' && (
          <SchemesSection
            learnedSet={learnedSet}
            onToggleLearned={handleToggleLearned}
          />
        )}

        {activeSection === 'quiz' && (
          <ExamQuiz />
        )}
      </main>

      {/* Floating Back to Top Button */}
      <BackToTopButton />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToSection={handleSearchNavigate}
      />

      {/* PWA Prompts */}
      <InstallPrompt />
      <UpdatePrompt />
      <WelcomePrompt />
    </div>
  );
}
