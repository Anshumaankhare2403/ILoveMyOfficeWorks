import React, { useState, useCallback, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ErrorBoundary } from './components/ui';
import { MainLayout } from './layouts';
import { useDocumentQueue, useDesktopBridge, useMobileBridge } from './hooks';

// Code-split pages with React.lazy for instant initial load & reduced bundle execution
const HomePage = lazy(() => import('./pages/HomePage'));
const ToolWorkspacePage = lazy(() => import('./pages/ToolWorkspacePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Sleek, zero-layout-shift Suspense fallback with Luxury Sage branding
 */
function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-[#5B7147] select-none">
      <div className="w-8 h-8 border-2 border-[#5B7147]/20 border-t-[#5B7147] rounded-full animate-spin mb-3" />
      <span className="text-xs font-mono font-bold tracking-wider text-[#6B785E] uppercase text-[10px]">
        Loading Workspace...
      </span>
    </div>
  );
}

/**
 * Inner Application Shell wrapped inside Router
 */
function AppShell() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tool ID from route path (e.g. '/tools/merge-pdf' -> 'merge-pdf')
  const isToolsRoute = location.pathname.startsWith('/tools/');
  const isToolRoute = location.pathname.startsWith('/tool/');
  const activeTab = isToolsRoute
    ? location.pathname.replace('/tools/', '')
    : isToolRoute
    ? location.pathname.replace('/tool/', '')
    : 'home';

  // Unified router navigation handler using clean /tools/:toolId routes
  const handleSelectTool = useCallback(
    (toolId) => {
      if (!toolId || toolId === 'home') {
        navigate('/');
      } else {
        navigate(`/tools/${toolId}`);
      }
    },
    [navigate]
  );

  const {
    files,
    queuePage,
    setQueuePage,
    PAGE_SIZE,
    fileCounts,
    handleFilesAdded,
    importRawFiles,
    handleHomeQuickUpload,
    handleRemoveFile,
    handleClearAll,
    handleMoveUp,
    handleMoveDown,
    handleSortAscending,
    handleSortDescending,
    handleReverseOrder,
  } = useDocumentQueue(handleSelectTool);

  // Electron Windows Desktop IPC integration
  useDesktopBridge(importRawFiles);

  // Flutter Android mobile bridge and deep-linking integration
  useMobileBridge({
    activeTab,
    onNavigate: navigate,
    setShowSplash,
    onFilesReceived: importRawFiles,
  });

  return (
    <MainLayout
      showSplash={showSplash}
      onSplashComplete={() => setShowSplash(false)}
      activeTab={activeTab}
      onTabChange={handleSelectTool}
      fileCounts={fileCounts}
      onShowSplash={() => setShowSplash(true)}
    >
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <HomePage
                onSelectTool={handleSelectTool}
                onQuickUpload={handleHomeQuickUpload}
                fileCounts={fileCounts}
                onShowSplash={() => setShowSplash(true)}
              />
            }
          />

          {/* Canonical Deep-Linkable Tool Workspace Route */}
          <Route
            path="/tools/:toolId"
            element={
              <ToolWorkspacePage
                activeTab={activeTab}
                onBackToHome={() => handleSelectTool('home')}
                files={files}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={handleRemoveFile}
                onClearAll={handleClearAll}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSortAscending={handleSortAscending}
                onSortDescending={handleSortDescending}
                onReverseOrder={handleReverseOrder}
                queuePage={queuePage}
                setQueuePage={setQueuePage}
                pageSize={PAGE_SIZE}
              />
            }
          />

          {/* Alias Route /tool/:toolId for backward compatibility */}
          <Route
            path="/tool/:toolId"
            element={
              <ToolWorkspacePage
                activeTab={activeTab}
                onBackToHome={() => handleSelectTool('home')}
                files={files}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={handleRemoveFile}
                onClearAll={handleClearAll}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSortAscending={handleSortAscending}
                onSortDescending={handleSortDescending}
                onReverseOrder={handleReverseOrder}
                queuePage={queuePage}
                setQueuePage={setQueuePage}
                pageSize={PAGE_SIZE}
              />
            }
          />

          {/* In-App Legal & Information Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Custom in-app 404 Page for any unknown routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

/**
 * Root Application Entry with Error Boundary & Adaptive Router
 * Uses BrowserRouter for web SPA and HashRouter fallback for file:// offline environments
 */
export default function App() {
  const RouterComponent =
    typeof window !== 'undefined' && window.location.protocol === 'file:'
      ? HashRouter
      : BrowserRouter;

  return (
    <ErrorBoundary>
      <RouterComponent>
        <AppShell />
      </RouterComponent>
    </ErrorBoundary>
  );
}
