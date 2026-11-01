import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ui';
import { MainLayout } from './layouts';
import { HomePage, ToolWorkspacePage } from './pages';
import { useDocumentQueue, useDesktopBridge, useMobileBridge } from './hooks';

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

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
  } = useDocumentQueue(setActiveTab);

  // Electron Windows Desktop IPC integration
  useDesktopBridge(importRawFiles);

  // Flutter Android mobile bridge and URL hash routing integration
  useMobileBridge({
    activeTab,
    setActiveTab,
    setShowSplash,
    onFilesReceived: importRawFiles,
  });

  return (
    <MainLayout
      showSplash={showSplash}
      onSplashComplete={() => setShowSplash(false)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      fileCounts={fileCounts}
      onShowSplash={() => setShowSplash(true)}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <HomePage
              onSelectTool={(toolId) => setActiveTab(toolId)}
              onQuickUpload={handleHomeQuickUpload}
              fileCounts={fileCounts}
              onShowSplash={() => setShowSplash(true)}
            />
          </motion.div>
        ) : (
          <ToolWorkspacePage
            key={activeTab}
            activeTab={activeTab}
            onBackToHome={() => setActiveTab('home')}
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
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
