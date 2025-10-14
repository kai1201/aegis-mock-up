import { useState } from 'react';
import { X, Copy, Download, Plus, MessageCircle, ExternalLink, ChevronDown, ChevronRight, Info, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Package, Shield, Wrench, FileText, CircleX as XCircle, CircleHelp as HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReasoningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  altPart: {
    partNumber: string;
    manufacturer: string;
    keySpecs: Record<string, any>;
    interfaces: string[];
    package: Record<string, any>;
    lifecycle: Record<string, any>;
    compliance: string[];
    price: string;
    leadTime: string;
    stock: number;
  };
  compatibility: number;
  fitType: string;
}

interface CriterionScore {
  name: string;
  weight: number;
  score: number; // 0, 0.5, or 1
  status: 'pass' | 'partial' | 'fail';
  requirement: string;
  altValue: string;
  comment: string;
}

interface EOLSignal {
  category: 'lifecycle' | 'manufacturing' | 'market' | 'official' | 'news';
  type: 'safe' | 'partial' | 'risk';
  signal: string;
  evidence: string;
  impact: string;
  source: string;
  lastUpdated: string;
}

interface Risk {
  category: 'Technical' | 'Supply' | 'Compliance';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  descriptionKey?: string;
  impact: string;
  impactKey?: string;
  mitigation: string;
  mitigationKey?: string;
}

interface Citation {
  label: string;
  url: string;
  type: 'datasheet' | 'product-page' | 'pcn-pdn' | 'distributor' | 'lifecycle' | 'news';
  note?: string;
  lastAccessed: string;
  verified: boolean;
}

const mockCriterionScores: CriterionScore[] = [
  {
    name: 'Package Footprint & Pinout',
    weight: 35,
    score: 1,
    status: 'pass',
    requirement: 'LQFP-100, 0.5mm pitch',
    altValue: 'LQFP-100, 0.5mm pitch',
    comment: 'identicalFootprint'
  },
  {
    name: 'Electrical Limits',
    weight: 15,
    score: 1,
    status: 'pass',
    requirement: '1.8V-3.6V, 120mA max',
    altValue: '1.8V-3.6V, 110mA max',
    comment: 'slightlyLowerCurrent'
  },
  {
    name: 'Timing Performance',
    weight: 10,
    score: 0.5,
    status: 'partial',
    requirement: '168MHz ARM Cortex-M4',
    altValue: '180MHz ARM Cortex-M4',
    comment: 'higherPerformance'
  },
  {
    name: 'Protocols & Interfaces',
    weight: 10,
    score: 1,
    status: 'pass',
    requirement: 'SPI, I2C, UART, USB OTG',
    altValue: 'SPI, I2C, UART, USB OTG',
    comment: 'allRequiredInterfaces'
  },
  {
    name: 'Thermal Environment',
    weight: 5,
    score: 1,
    status: 'pass',
    requirement: '-40°C to +85°C',
    altValue: '-40°C to +85°C',
    comment: 'identicalTemperature'
  },
  {
    name: 'Mechanical',
    weight: 5,
    score: 1,
    status: 'pass',
    requirement: '14x14x1.4mm',
    altValue: '14x14x1.4mm',
    comment: 'samePackageDimensions'
  },
  {
    name: 'Regulatory & Quality',
    weight: 5,
    score: 1,
    status: 'pass',
    requirement: 'RoHS compliant',
    altValue: 'RoHS compliant',
    comment: 'meetsRegulatory'
  },
  {
    name: 'Firmware & Driver Impact',
    weight: 10,
    score: 0.5,
    status: 'partial',
    requirement: 'STM32F4 HAL compatible',
    altValue: 'STM32F4 HAL with minor changes',
    comment: 'minorRegisterDifferences'
  },
  {
    name: 'Form Fit Function',
    weight: 5,
    score: 1,
    status: 'pass',
    requirement: 'General purpose MCU',
    altValue: 'General purpose MCU',
    comment: 'sameFunctionalCategory'
  }
];

const mockEOLSignals: EOLSignal[] = [
  {
    category: 'lifecycle',
    type: 'safe',
    signal: 'Active Status',
    evidence: 'Listed as "Active" on ST product selector',
    impact: 'Part is in active production',
    source: 'ST Product Selector',
    lastUpdated: '2024-01-15'
  },
  {
    category: 'manufacturing',
    type: 'partial',
    signal: '200mm Wafer Process',
    evidence: 'Manufactured on 200mm wafer technology',
    impact: 'Medium-term risk as industry moves to 300mm',
    source: 'ST Manufacturing Data',
    lastUpdated: '2024-01-10'
  },
  {
    category: 'manufacturing',
    type: 'safe',
    signal: '90nm Process Node',
    evidence: 'Mature 90nm process node with stable yield',
    impact: 'Stable manufacturing process',
    source: 'ST Technical Documentation',
    lastUpdated: '2024-01-12'
  },
  {
    category: 'market',
    type: 'safe',
    signal: 'Stable Lead Times',
    evidence: 'Lead time maintained at 22 weeks ±2 weeks over 6 months',
    impact: 'Consistent supply chain performance',
    source: 'Distributor Data Aggregation',
    lastUpdated: '2024-01-14'
  },
  {
    category: 'official',
    type: 'safe',
    signal: 'ST 10-year Longevity Program',
    evidence: 'Part included in ST 10-year longevity commitment',
    impact: 'Guaranteed availability until 2034',
    source: 'ST Longevity Program Document',
    lastUpdated: '2024-01-01'
  },
  {
    category: 'market',
    type: 'partial',
    signal: 'Price Volatility',
    evidence: '8% price increase over last 6 months',
    impact: 'Supply/demand imbalance indicators',
    source: 'Market Price Tracking',
    lastUpdated: '2024-01-15'
  }
];

const mockRisks: Risk[] = [
  {
    category: 'Technical',
    severity: 'Low',
    description: 'ADC register mapping differences',
    descriptionKey: 'adcRegisterMappingDifferences',
    impact: 'Minor firmware changes required',
    impactKey: 'minorFirmwareChangesRequired',
    mitigation: 'Update ADC initialization code (~0.5 day effort)',
    mitigationKey: 'updateAdcInitializationCode'
  },
  {
    category: 'Supply',
    severity: 'Medium',
    description: 'Longer lead time than original',
    descriptionKey: 'longerLeadTimeThanOriginal',
    impact: 'Production scheduling impact',
    impactKey: 'productionSchedulingImpact',
    mitigation: 'Order early or maintain buffer stock',
    mitigationKey: 'orderEarlyOrMaintainBufferStock'
  },
  {
    category: 'Technical',
    severity: 'Low',
    description: 'Higher performance may affect power consumption',
    descriptionKey: 'higherPerformanceMayAffectPowerConsumption',
    impact: 'Slight increase in power draw',
    impactKey: 'slightIncreaseInPowerDraw',
    mitigation: 'Verify power budget and thermal design',
    mitigationKey: 'verifyPowerBudgetAndThermalDesign'
  }
];

const mockCitations: Citation[] = [
  {
    label: 'STM32F405VGT6 Datasheet Rev 5',
    url: '#',
    type: 'datasheet',
    note: 'Pages 45-67 for electrical characteristics',
    lastAccessed: '2024-01-15',
    verified: true
  },
  {
    label: 'STMicroelectronics Product Page',
    url: '#',
    type: 'product-page',
    lastAccessed: '2024-01-15',
    verified: true
  },
  {
    label: 'ST Longevity Program Document',
    url: '#',
    type: 'lifecycle',
    note: '10-year commitment details',
    lastAccessed: '2024-01-01',
    verified: true
  },
  {
    label: 'Digi-Key Product Listing',
    url: '#',
    type: 'distributor',
    note: 'Lead time and MOQ data',
    lastAccessed: '2024-01-15',
    verified: true
  },
  {
    label: 'ST Manufacturing Process Overview',
    url: '#',
    type: 'news',
    note: 'Wafer technology and fab locations',
    lastAccessed: '2024-01-10',
    verified: false
  }
];

export default function ReasoningDrawer({
  isOpen,
  onClose,
  altPart,
  compatibility,
  fitType
}: ReasoningDrawerProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'lifecycle': true,
    'manufacturing': true,
    'market': false,
    'official': true,
    'news': false
  });

  const getTranslatedEOLText = (text: string): string => {
    if (language === 'ja') {
      // For now, return the original text since specific EOL signal translations aren't defined
      // TODO: Add specific EOL signal translations to LanguageContext.tsx if needed
      return text;
    }
    return text;
  };

  const getCategoryNameJa = (category: string): string => {
    switch (category) {
      case 'lifecycle': return 'ライフサイクル';
      case 'manufacturing': return '製造';
      case 'market': return '市場';
      case 'official': return '公式';
      case 'news': return 'ニュース';
      default: return category;
    }
  };
  
  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800';
      case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const getEOLSignalColor = (type: string) => {
    switch (type) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800';
      case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-950/20 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const getEOLSignalIcon = (type: string) => {
    switch (type) {
      case 'safe': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'risk': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCompatibilityDescription = (percent: number) => {
    if (percent >= 95) return t('reasoning.dropInReplacement');
    if (percent >= 85) return t('reasoning.minorChangesNeeded');
    return t('reasoning.redesignRequired');
  };

  const getEOLRiskLevel = () => {
    const riskSignals = mockEOLSignals.filter(s => s.type === 'risk').length;
    const safeSignals = mockEOLSignals.filter(s => s.type === 'safe').length;
    const partialSignals = mockEOLSignals.filter(s => s.type === 'partial').length;

    if (riskSignals >= 2) return 'High';
    if (riskSignals === 1 || partialSignals >= 2) return 'Medium';
    return 'Low';
  };

  const eolRiskLevel = getEOLRiskLevel();

  const getCompatibilityTooltip = (percent: number) => {
    if (percent >= 95) return 'Drop-in: No PCB or firmware changes expected';
    if (percent >= 85) return 'Minor changes: Small PCB or firmware tweaks needed';
    return 'Redesign needed: Significant changes required';
  };

  const getEOLRiskTooltip = (level: string) => {
    switch (level) {
      case 'High': return t('reasoning.highRiskTooltip');
      case 'Medium': return t('reasoning.mediumRiskTooltip');
      case 'Low': return t('reasoning.lowRiskTooltip');
      default: return t('reasoning.riskLevelAssessment');
    }
  };

  const totalScore = mockCriterionScores.reduce((sum, criterion) => 
    sum + (criterion.weight * criterion.score), 0
  );

  const handleCopySummary = () => {
    const summary = language === 'ja' ? 
      `${t('reasoning.alternativeAnalysis')}: ${altPart.partNumber}
${t('reasoning.compatibility')}: ${compatibility}% (${fitType})
${t('reasoning.eolRisk')}: ${eolRiskLevel}

${t('reasoning.keyTakeaways')}:
• ${compatibility}%${t('reasoning.compatibilityWith')}${fitType}${t('reasoning.replacement')}
• ${mockCriterionScores.filter(c => c.status === 'pass').length}/${mockCriterionScores.length} ${t('reasoning.criteriaPassed')}
• ${t('reasoning.eolRisk')}: ${eolRiskLevel} - ${mockEOLSignals.filter(s => s.type === 'safe').length} ${t('reasoning.safeSignals')}、${mockEOLSignals.filter(s => s.type === 'risk').length} ${t('reasoning.riskSignals')}
• ${t('reasoning.mainConsiderations')}: ${mockRisks.filter(r => r.severity === 'High' || r.severity === 'Medium').map(r => r.description).join(', ')}
• ${t('reasoning.recommendation')}: ${compatibility >= 95 ? t('reasoning.useAsIs') : compatibility >= 85 ? t('reasoning.useWithChanges') : t('reasoning.evaluateCarefully')}` :
      `Alternative Analysis: ${altPart.partNumber}
Compatibility: ${compatibility}% (${fitType})
EOL Risk: ${eolRiskLevel}

Key takeaways:
• ${fitType} replacement with ${compatibility}% compatibility
• ${mockCriterionScores.filter(c => c.status === 'pass').length}/${mockCriterionScores.length} criteria passed
• EOL Risk: ${eolRiskLevel} - ${mockEOLSignals.filter(s => s.type === 'safe').length} safe signals, ${mockEOLSignals.filter(s => s.type === 'risk').length} risk signals
• Main considerations: ${mockRisks.filter(r => r.severity === 'High' || r.severity === 'Medium').map(r => r.description).join(', ')}
• Recommendation: ${compatibility >= 95 ? 'Use as-is' : compatibility >= 85 ? 'Use with small changes' : 'Evaluate carefully'}`;
    
    navigator.clipboard.writeText(summary);
  };

  const handleExport = () => {
    console.log('Exporting reasoning analysis as PDF...');
  };

  const handleAddToBOM = () => {
    console.log(`Adding ${altPart.partNumber} to BOM...`);
  };

  const handleAskAI = () => {
    console.log(`Opening AI assistant for ${altPart.partNumber}...`);
  };

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex" style={{ zIndex: 9999 }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        
        {/* Drawer */}
        <div className="ml-auto w-[720px] bg-background shadow-xl flex flex-col h-screen relative z-10">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-background border-b p-6 z-20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs font-medium">{altPart.manufacturer.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{altPart.partNumber}</h2>
                  <p className="text-muted-foreground">{altPart.manufacturer}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={`text-lg px-3 py-1 border cursor-help ${
                    compatibility >= 95 ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-800' :
                    compatibility >= 85 ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-200 dark:border-orange-800' :
                    'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-800'
                  }`}>
                    {compatibility}% Compatible
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getCompatibilityTooltip(compatibility)}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={`text-lg px-3 py-1 border cursor-help ${getRiskColor(eolRiskLevel)}`}>
                    {eolRiskLevel} EOL Risk
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getEOLRiskTooltip(eolRiskLevel)}</p>
                </TooltipContent>
              </Tooltip>

              <Badge variant="outline">{fitType}</Badge>
              {altPart.compliance?.includes('RoHS') && <Badge variant="outline">RoHS</Badge>}
              {altPart.compliance?.includes('AEC-Q100') && <Badge variant="outline">AEC-Q100</Badge>}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopySummary}>
                <Copy className="w-4 h-4 mr-2" />
                {t('reasoning.copySummary')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                {t('reasoning.exportPDF')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddToBOM}>
                <Plus className="w-4 h-4 mr-2" />
                {t('reasoning.addToBOM')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleAskAI}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('reasoning.askAI')}
              </Button>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col relative z-10">
              <TabsList className="grid w-full grid-cols-7 mx-6 mt-4 relative z-10">
                <TabsTrigger value="summary" className="text-xs">{t('reasoning.summaryTab')}</TabsTrigger>
                <TabsTrigger value="compatibility" className="text-xs">{t('reasoning.compatibilityTab')}</TabsTrigger>
                <TabsTrigger value="supply" className="text-xs">{t('reasoning.supplyTab')}</TabsTrigger>
                <TabsTrigger value="eol-reasoning" className="text-xs">{t('reasoning.eolReasoningTab')}</TabsTrigger>
                <TabsTrigger value="risks" className="text-xs">{t('reasoning.risksTab')}</TabsTrigger>
                <TabsTrigger value="implementation" className="text-xs">{t('reasoning.implementationTab')}</TabsTrigger>
                <TabsTrigger value="sources" className="text-xs">{t('reasoning.sourcesTab')}</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6 min-h-0 relative z-10">
                <TabsContent value="summary" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('reasoning.keyTakeaways')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{fitType} {t('reasoning.replacement')}</p>
                          <p className="text-sm text-muted-foreground">
                            {compatibility}% {t('reasoning.compatibilityWith')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{t('reasoning.minorFirmwareAdjustments')}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('reasoning.adcRegisterMapping')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{t('reasoning.betterAvailability')}</p>
                          <p className="text-sm text-muted-foreground">
                            {altPart.leadTime} {t('reasoning.vsOriginal')} 26 {t('reasoning.weeks')}, {altPart.stock.toLocaleString()} {t('reasoning.unitsInStock')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{eolRiskLevel} {t('reasoning.eolRisk')}</p>
                          <p className="text-sm text-muted-foreground">
                            {eolRiskLevel === 'Low' ? t('reasoning.stableWithLongevity') :
                             eolRiskLevel === 'Medium' ? t('reasoning.mixedSignals') :
                             t('reasoning.multipleRiskFactors')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {t('reasoning.recommendation')}: {compatibility >= 95 ? t('reasoning.useAsDropIn') : 
                                         compatibility >= 85 ? t('reasoning.useWithVerification') : 
                                         t('reasoning.evaluateCarefully')}
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          {compatibility >= 95 ? t('reasoning.excellentDropIn') :
                           compatibility >= 85 ? t('reasoning.goodAlternative') :
                           t('reasoning.considerBackup')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('reasoning.compatibilityBreakdown')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--border))"
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={compatibility >= 95 ? '#10b981' : compatibility >= 85 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="3"
                                strokeDasharray={`${compatibility}, 100`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-foreground">{compatibility}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-2">
                            {getCompatibilityDescription(compatibility)}
                          </p>
                          <div className="space-y-1">
                            {mockCriterionScores.slice(0, 3).map((criterion, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="text-foreground">{criterion.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-foreground">{(criterion.weight * criterion.score).toFixed(0)}%</span>
                                  {getStatusIcon(criterion.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compatibility" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('reasoning.technicalMatchAnalysis')}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t('reasoning.scoredMatrix')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockCriterionScores.map((criterion, index) => (
                          <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-medium text-foreground">{criterion.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {criterion.weight}% {t('reasoning.weight')}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`border ${getStatusColor(criterion.status)}`}>
                                  {t(`reasoning.${criterion.status}`)}
                                </Badge>
                                <span className="text-sm font-medium text-foreground">
                                  {(criterion.weight * criterion.score).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">{t('reasoning.requirement')}</p>
                                <p className="text-foreground">{criterion.requirement}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">{t('reasoning.alternative')}</p>
                                <p className="text-foreground">{criterion.altValue}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">{t('reasoning.assessment')}</p>
                                <p className="text-foreground">{t(`reasoning.${criterion.comment}`)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="supply" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>{t('reasoning.lifecycleStatus')}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.status')}</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-200">{t('reasoning.active')}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.lastUpdated')}</span>
                          <span className="text-sm text-muted-foreground">2024-01-15</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.longevityProgram')}</span>
                          <Badge variant="outline">ST 10-{t('reasoning.year')}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{t('reasoning.supplyChain')}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.leadTime')}</span>
                          <span className="text-sm font-medium text-foreground">{altPart.leadTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.moq')}</span>
                          <span className="text-sm text-muted-foreground">1,000 {t('reasoning.pcs')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{t('reasoning.stockLevel')}</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-200">
                            {altPart.stock.toLocaleString()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('reasoning.approvedDistributors')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {['Digi-Key', 'Mouser', 'Arrow', 'Avnet'].map((distributor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                            <span className="font-medium text-foreground">{distributor}</span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">{altPart.price}</p>
                              <p className="text-xs text-muted-foreground">{t('reasoning.inStock')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="eol-reasoning" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Risk Assessment: {eolRiskLevel}</span>
                        <Badge className={`border ${getRiskColor(eolRiskLevel)}`}>
                          {mockEOLSignals.filter(s => s.type === 'safe').length} {t('reasoning.safe')} • {mockEOLSignals.filter(s => s.type === 'partial').length} {t('reasoning.partial')} • {mockEOLSignals.filter(s => s.type === 'risk').length} {t('reasoning.riskSignals')}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t('reasoning.analysisBasedOn')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(
                          mockEOLSignals.reduce((acc, signal) => {
                            if (!acc[signal.category]) acc[signal.category] = [];
                            acc[signal.category].push(signal);
                            return acc;
                          }, {} as Record<string, EOLSignal[]>)
                        ).map(([category, signals]) => (
                          <Collapsible 
                            key={category} 
                            open={expandedSections[category]} 
                            onOpenChange={() => toggleSection(category)}
                          >
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                  {expandedSections[category] ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                  <h3 className="font-medium text-foreground capitalize">
                                    {language === 'ja' ? getCategoryNameJa(category) : category.charAt(0).toUpperCase() + category.slice(1)} {language === 'ja' ? 'シグナル' : 'Signals'}
                                  </h3>
                                  <Badge className={`border ${getEOLSignalColor(
                                    signals.some(s => s.type === 'risk') ? 'risk' :
                                    signals.some(s => s.type === 'partial') ? 'partial' : 'safe'
                                  )}`}>
                                    {signals.length} {language === 'ja' ? 'シグナル' : 'signals'}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {signals.map((signal, index) => (
                                    <div key={index} className={`w-2 h-2 rounded-full ${
                                      signal.type === 'safe' ? 'bg-green-500' :
                                      signal.type === 'partial' ? 'bg-orange-500' : 'bg-red-500'
                                    }`} />
                                  ))}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 space-y-2">
                                {signals.map((signal, index) => (
                                  <div key={index} className={`p-3 border rounded-lg ${getEOLSignalColor(signal.type)}`}>
                                    <div className="flex items-start space-x-3">
                                      {getEOLSignalIcon(signal.type)}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <h4 className="font-medium text-sm">{getTranslatedEOLText(signal.signal)}</h4>
                                          <span className="text-xs opacity-70">
                                            {signal.lastUpdated}
                                          </span>
                                        </div>
                                        <p className="text-sm mb-2">{getTranslatedEOLText(signal.evidence)}</p>
                                        <div className="text-xs space-y-1">
                                          <div>
                                            <span className="font-medium">{t('reasoning.impact')}:</span> {getTranslatedEOLText(signal.impact)}
                                          </div>
                                          <div>
                                            <span className="font-medium">{t('reasoning.source')}:</span> {getTranslatedEOLText(signal.source)}
                                          </div>
                                        </div>
                                        </div>
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('reasoning.overallEolAssessment')}</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {eolRiskLevel === 'Low' ? 
                            t('reasoning.strongStability') :
                           eolRiskLevel === 'Medium' ?
                            t('reasoning.mixedSignalsDetected') :
                            t('reasoning.multipleRiskFactorsPresent')
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risks" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                     <CardTitle className="text-base">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockRisks.map((risk, index) => (
                          <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline">{risk.category}</Badge>
                                <Badge className={cn("border", getRiskColor(risk.severity))}>
                                  {risk.severity}
                                </Badge>
                              </div>
                            </div>
                            
                            <h3 className="font-medium mb-2 text-foreground">
                              {risk.descriptionKey && language === 'ja' ? t('reasoning.' + risk.descriptionKey) : risk.description}
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">{t('reasoning.impact')}</p>
                                <p className="text-foreground">
                                  {risk.impactKey && language === 'ja' ? t('reasoning.' + risk.impactKey) : risk.impact}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">{t('reasoning.mitigation')}</p>
                                <p className="text-foreground">
                                  {risk.mitigationKey && language === 'ja' ? t('reasoning.' + risk.mitigationKey) : risk.mitigation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="implementation" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Wrench className="w-4 h-4" />
                        <span>{t('reasoning.implementationGuide')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">✓ {t('reasoning.pcbCompatibility')}</h3>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>• {t('reasoning.solderLandPattern')}</li>
                          <li>• {t('reasoning.verifyDecoupling')}</li>
                          <li>• {t('reasoning.noPcbChanges')}</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-2">⚠ {t('reasoning.firmwareChanges')}</h3>
                        <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                          <li>• {t('reasoning.updateAdcInit')}</li>
                          <li>• {t('reasoning.verifyClockConfig')}</li>
                          <li>• {t('reasoning.testPeripherals')}</li>
                          <li>• {t('reasoning.estimatedEffort')}</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📋 {t('reasoning.validationChecklist')}</h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• {t('reasoning.powerConsumption')}</li>
                          <li>• {t('reasoning.thermalTesting')}</li>
                          <li>• {t('reasoning.communicationInterfaces')}</li>
                          <li>• {t('reasoning.adcAccuracy')}</li>
                          <li>• {t('reasoning.usbOtgFunctionality')}</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sources" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{t('reasoning.citationsSources')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockCitations.map((citation, index) => (
                          <div key={index} className="flex items-start justify-between p-3 border border-border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {citation.type.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <h3 className="font-medium text-foreground">{citation.label}</h3>
                                {!citation.verified && (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                                    {t('reasoning.needsVerification')}
                                  </Badge>
                                )}
                              </div>
                              {citation.note && (
                                <p className="text-sm text-muted-foreground mb-1">{citation.note}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {t('reasoning.lastAccessed')}: {citation.lastAccessed}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">{t('reasoning.sourceVerification')}</p>
                            <p className="text-xs text-orange-800 dark:text-orange-200">
                              {t('reasoning.sourceVerificationText')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
