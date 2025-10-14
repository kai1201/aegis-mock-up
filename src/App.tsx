import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { RFQProvider } from '@/contexts/RFQContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ComponentDetail from '@/pages/ComponentDetail';
import SearchResults from '@/pages/SearchResults';
import CrossReference from '@/pages/CrossReference';
import CompareParts from '@/pages/CompareParts';
import BOMAnalyzer from '@/pages/BOMAnalyzer';
import AIAssistant from '@/pages/AIAssistant';
import RFQManager from '@/pages/RFQManager';
import RFQDetail from '@/pages/RFQDetail';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RFQProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/component/:partNumber" element={<ComponentDetail />} />
                <Route path="/cross-reference" element={<CrossReference />} />
                <Route path="/compare" element={<CompareParts />} />
                <Route path="/bom-analyzer" element={<BOMAnalyzer />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/rfq" element={<RFQManager />} />
                <Route path="/rfq/:rfqId" element={<RFQDetail />} />
              </Routes>
            </Layout>
            <Toaster />
          </Router>
        </RFQProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
