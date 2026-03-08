
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TipsTricks from './components/TipsTricks';
import Toolkit from './components/Toolkit';
import ThreatAnalyzer from './components/ThreatAnalyzer';
import AIAssistant from './components/AIAssistant';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard />;
      case AppTab.TIPS:
        return <TipsTricks />;
      case AppTab.TOOLKIT:
        return <Toolkit />;
      case AppTab.ANALYZE:
        return <ThreatAnalyzer />;
      case AppTab.AI_ASSISTANT:
        return <AIAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
