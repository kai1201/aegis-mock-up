import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useRFQ } from '@/contexts/RFQContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileText, MessageCircle, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, History, Folder, ShoppingCart, Plus, UserCheck, TrendingUp, TrendingDown, AlertCircle, Package, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import DataTable from '@/components/DataTable';
import AIPanel from '@/components/AIPanel';
import RiskBadge from '@/components/RiskBadge';
import RFQCart from '@/components/RFQCart';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface BOMItem {
  id: string;
  lineNumber: number;
  refdes: string;
  partNumber: string;
  manufacturer: string;
  description: string;
  quantity: number;
  unitPrice: number;
  alternativePrice?: number;
  costSavings?: number;
  lifecycle: 'Active' | 'NRND' | 'EOL' | 'Obsolete';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  leadTime: number; // in weeks
  stock: number;
  priceTrend: 'up' | 'down' | 'stable';
  priceChange?: number;
  alternativeSuggestions: Array<{
    partNumber: string;
    manufacturer: string;
    compatibility: number;
    price: number;
    leadTime: number;
  }>;
  notes?: string;
  mappingStatus: 'matched' | 'partial' | 'error' | 'manual';
}

interface ParseStatus {
  status: 'idle' | 'parsing' | 'mapping' | 'analyzing' | 'complete' | 'error';
  progress: number;
  currentStep: string;
  errors: Array<{
    line: number;
    column: string;
    message: string;
  }>;
  warnings: Array<{
    line: number;
    message: string;
  }>;
}

interface BOMProject {
  id: string;
  name: string;
  timestamp: Date;
  itemCount: number;
  riskScore: number;
  status: 'active' | 'archived';
}

const mockBOMData: BOMItem[] = [
  {
    id: '1',
    lineNumber: 1,
    refdes: 'U1, U3, U5',
    partNumber: 'STM32F407VGT6',
    manufacturer: 'STMicroelectronics',
    description: '32-bit MCU, ARM Cortex-M4, 168MHz, 1MB Flash',
    quantity: 3,
    unitPrice: 8.45,
    alternativePrice: 7.89,
    costSavings: 1.68,
    lifecycle: 'EOL',
    riskLevel: 'critical',
    riskFactors: ['EOL Announced', 'High Lead Time', 'Limited Stock'],
    leadTime: 26,
    stock: 2500,
    priceTrend: 'up',
    priceChange: 15.2,
    alternativeSuggestions: [
      {
        partNumber: 'STM32F405VGT6',
        manufacturer: 'STMicroelectronics',
        compatibility: 95,
        price: 7.89,
        leadTime: 12
      },
      {
        partNumber: 'STM32F407VET6',
        manufacturer: 'STMicroelectronics',
        compatibility: 85,
        price: 7.25,
        leadTime: 16
      }
    ],
    notes: 'EOL notice received Q1 2024. Recommend immediate redesign.',
    mappingStatus: 'matched'
  },
  {
    id: '2',
    lineNumber: 2,
    refdes: 'U2, U4',
    partNumber: 'LM2596S-5.0',
    manufacturer: 'Texas Instruments',
    description: 'Switching Regulator, 5V Output, 3A',
    quantity: 2,
    unitPrice: 1.25,
    alternativePrice: 1.18,
    costSavings: 0.14,
    lifecycle: 'NRND',
    riskLevel: 'high',
    riskFactors: ['High MOQ', 'Extended Lead Time'],
    leadTime: 18,
    stock: 8750,
    priceTrend: 'stable',
    alternativeSuggestions: [
      {
        partNumber: 'LM2596S-5.0/NOPB',
        manufacturer: 'Texas Instruments',
        compatibility: 100,
        price: 1.18,
        leadTime: 12
      }
    ],
    mappingStatus: 'matched'
  },
  {
    id: '3',
    lineNumber: 3,
    refdes: 'C1-C10',
    partNumber: 'GRM32ER71H106KA12L',
    manufacturer: 'Murata',
    description: '10uF Ceramic Capacitor, 50V, X7R, 1206',
    quantity: 10,
    unitPrice: 0.35,
    alternativePrice: 0.32,
    costSavings: 0.30,
    lifecycle: 'Active',
    riskLevel: 'medium',
    riskFactors: ['Price Volatility', 'Supply Chain Risk'],
    leadTime: 12,
    stock: 125000,
    priceTrend: 'up',
    priceChange: 8.5,
    alternativeSuggestions: [
      {
        partNumber: 'GRM32ER71H106KA12K',
        manufacturer: 'Murata',
        compatibility: 100,
        price: 0.32,
        leadTime: 8
      },
      {
        partNumber: 'CL32B106KAJNNNE',
        manufacturer: 'Samsung',
        compatibility: 95,
        price: 0.28,
        leadTime: 10
      }
    ],
    notes: 'Price increased 8.5% last quarter',
    mappingStatus: 'matched'
  },
  {
    id: '4',
    lineNumber: 4,
    refdes: 'R1-R20',
    partNumber: 'RC0603FR-0710KL',
    manufacturer: 'Yageo',
    description: '10K Resistor, 1%, 0603, Thick Film',
    quantity: 20,
    unitPrice: 0.02,
    alternativePrice: 0.02,
    costSavings: 0,
    lifecycle: 'Active',
    riskLevel: 'low',
    riskFactors: [],
    leadTime: 4,
    stock: 500000,
    priceTrend: 'stable',
    alternativeSuggestions: [
      {
        partNumber: 'RC0603JR-0710KL',
        manufacturer: 'Yageo',
        compatibility: 95,
        price: 0.018,
        leadTime: 4
      }
    ],
    mappingStatus: 'matched'
  },
  {
    id: '5',
    lineNumber: 5,
    refdes: 'Q1, Q2',
    partNumber: 'UNKNOWN_PART_123',
    manufacturer: 'Unknown',
    description: 'Transistor (mapping failed)',
    quantity: 2,
    unitPrice: 0,
    lifecycle: 'Active',
    riskLevel: 'critical',
    riskFactors: ['Part Not Found', 'Manual Review Required'],
    leadTime: 0,
    stock: 0,
    priceTrend: 'stable',
    alternativeSuggestions: [],
    notes: 'Part number not found in database. Manual review required.',
    mappingStatus: 'error'
  }
];

const mockBOMHistory: BOMProject[] = [
  {
    id: '1',
    name: 'Project Alpha - Main Board',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    itemCount: 47,
    riskScore: 75,
    status: 'active',
  },
  {
    id: '2',
    name: 'Project Beta - Power Module',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    itemCount: 23,
    riskScore: 45,
    status: 'active',
  },
  {
    id: '3',
    name: 'Project Gamma - Sensor Board',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    itemCount: 31,
    riskScore: 60,
    status: 'archived',
  },
  {
    id: '4',
    name: 'Legacy System - Rev C',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    itemCount: 89,
    riskScore: 85,
    status: 'archived',
  },
];

export default function BOMAnalyzer() {
  const navigate = useNavigate();
  const { addToRFQ } = useRFQ();
  const { t } = useLanguage();
  const [bomData, setBomData] = useState<BOMItem[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [bomHistory, setBomHistory] = useState<BOMProject[]>(mockBOMHistory);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [costScenario, setCostScenario] = useState<'original' | 'alternatives' | 'cheapest'>('original');
  const [parseStatus, setParseStatus] = useState<ParseStatus>({
    status: 'idle',
    progress: 0,
    currentStep: '',
    errors: [],
    warnings: []
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Simulate comprehensive file upload and processing with status updates
      setAnalysisComplete(false);
      setParseStatus({
        status: 'parsing',
        progress: 0,
        currentStep: 'Reading file...',
        errors: [],
        warnings: []
      });

      const steps = [
        { step: 'parsing', message: 'Parsing CSV/Excel file...', duration: 1000 },
        { step: 'mapping', message: 'Mapping columns and validating data...', duration: 1500 },
        { step: 'analyzing', message: 'Analyzing parts and finding matches...', duration: 2000 },
        { step: 'complete', message: 'Analysis complete', duration: 500 }
      ];

      let currentStepIndex = 0;
      let progress = 0;

      const processStep = () => {
        if (currentStepIndex >= steps.length) {
          setBomData(mockBOMData);
          setAnalysisComplete(true);
          setParseStatus({
            status: 'complete',
            progress: 100,
            currentStep: 'Analysis complete',
            errors: [
              { line: 5, column: 'MPN', message: 'Part number "UNKNOWN_PART_123" not found in database' }
            ],
            warnings: [
              { line: 1, message: 'STM32F407VGT6 is marked as EOL - consider alternatives' },
              { line: 3, message: 'Price volatility detected for GRM32ER71H106KA12L' }
            ]
          });
          return;
        }

        const currentStep = steps[currentStepIndex];
        setParseStatus(prev => ({
          ...prev,
          status: currentStep.step as any,
          currentStep: currentStep.message,
          progress: Math.round((currentStepIndex / steps.length) * 100)
        }));

        setTimeout(() => {
          currentStepIndex++;
          processStep();
        }, currentStep.duration);
      };

      processStep();
    }
  }, []);

  const handleComponentClick = (partNumber: string) => {
    navigate(`/component/${encodeURIComponent(partNumber)}`);
  };

  const loadBOMProject = (projectId: string) => {
    const project = bomHistory.find(p => p.id === projectId);
    if (project) {
      setBomData(mockBOMData);
      setAnalysisComplete(true);
      setSelectedProject(projectId);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(bomData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleAddToRFQ = (items: BOMItem[]) => {
    const rfqItems = items.map(item => ({
      partNumber: item.partNumber,
      manufacturer: item.manufacturer,
      description: item.description,
      quantity: item.quantity,
      targetPrice: item.unitPrice,
      source: 'bom' as const,
      bomRowId: item.id,
    }));

    addToRFQ(rfqItems);
    
    // Clear selections after adding
    setSelectedItems(new Set());
    
    toast.success(`${items.length} item${items.length > 1 ? 's' : ''} added to RFQ`, {
      action: {
        label: 'View RFQ',
        onClick: () => navigate('/rfq?tab=new'),
      },
    });
  };

  const handleAddSelectedToRFQ = () => {
    const selectedBOMItems = bomData.filter(item => selectedItems.has(item.id));
    handleAddToRFQ(selectedBOMItems);
  };

  const handleAddSingleToRFQ = (item: BOMItem) => {
    handleAddToRFQ([item]);
  };

  const downloadSampleTemplate = () => {
    const csvContent = [
      'Line#,RefDes,MPN,Manufacturer,Description,Quantity,Unit Price',
      '1,U1,STM32F407VGT6,STMicroelectronics,32-bit MCU ARM Cortex-M4,1,8.45',
      '2,R1-R10,RC0603FR-0710KL,Yageo,10K Resistor 1% 0603,10,0.02',
      '3,C1-C5,GRM32ER71H106KA12L,Murata,10uF Ceramic Cap 50V X7R 1206,5,0.35',
      '4,U2,LM2596S-5.0,Texas Instruments,Switching Regulator 5V 3A,1,1.25'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bom_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkFindAlternatives = () => {
    const selectedBOMItems = bomData.filter(item => selectedItems.has(item.id));
    toast.success(`Finding alternatives for ${selectedBOMItems.length} components...`);
    // Implementation would trigger alternative search
  };

  const handleNotifyExpert = () => {
    const selectedBOMItems = bomData.filter(item => selectedItems.has(item.id));
    const criticalItems = selectedBOMItems.filter(item => item.riskLevel === 'critical' || item.mappingStatus === 'error');
    
    toast.success(`Expert notification sent for ${criticalItems.length > 0 ? criticalItems.length : selectedBOMItems.length} components`);
    // Implementation would send notification to Macnica expert
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const columns = [
    {
      key: 'select',
      title: '',
      render: (value: any, row: BOMItem) => (
        <div className="flex flex-col items-center space-y-2">
          {row.id === bomData[0]?.id && (
            <Checkbox
              checked={selectedItems.size === bomData.length && bomData.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all items"
            />
          )}
          <Checkbox
            checked={selectedItems.has(row.id)}
            onCheckedChange={(checked) => handleSelectItem(row.id, !!checked)}
            aria-label={`Select ${row.partNumber}`}
          />
        </div>
      ),
    },
    {
      key: 'riskLevel',
      title: t('bom.risk'),
      render: (value: string) => <RiskBadge type={value as any}>{value.toUpperCase()}</RiskBadge>,
    },
    {
      key: 'refdes',
      title: t('bom.refDes'),
      render: (value: string) => <code className="text-xs bg-muted px-2 py-1 rounded text-foreground font-medium">{value}</code>,
    },
    {
      key: 'partNumber',
      title: t('bom.partNumber'),
      sortable: true,
      render: (value: string, row: BOMItem) => (
        <div>
          <code 
            className="bg-muted px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-foreground font-medium"
            onClick={() => handleComponentClick(value)}
          >
            {value}
          </code>
          <p className="text-xs text-muted-foreground mt-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'manufacturer',
      title: t('bom.manufacturer'),
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'quantity',
      title: t('bom.qty'),
      sortable: true,
      className: 'text-center',
    },
    {
      key: 'unitPrice',
      title: t('bom.unitPrice'),
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
      className: 'text-right',
    },
    {
      key: 'leadTime',
      title: t('bom.leadTime'),
      sortable: true,
      render: (value: number, row: BOMItem) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={value > 20 ? 'text-red-600 font-medium' : ''}>{value} weeks</span>
        </div>
      ),
    },
    {
      key: 'riskFactors',
      title: t('bom.riskFactors'),
      render: (value: string[]) => (
        <div className="space-y-1">
          {value.map((factor, index) => (
            <div key={index} className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-gray-600">{factor}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'alternativeSuggestions',
      title: t('bom.suggestedReplacement'),
      render: (value: any[], row: BOMItem) => {
        if (!value || value.length === 0) return <span className="text-gray-400">-</span>;
        const topAlternative = value[0];
        return (
          <div className="space-y-1">
            <code 
              className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleComponentClick(topAlternative.partNumber)}
            >
              {topAlternative.partNumber}
            </code>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">{topAlternative.compatibility}% {t('bom.compatible')}</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              ${topAlternative.price.toFixed(2)} 
              {row.costSavings && row.costSavings > 0 && (
                <span className="ml-1">(-${row.costSavings.toFixed(2)} {t('bom.totalSavings')})</span>
              )}
            </div>
            {value.length > 1 && (
              <div className="text-xs text-muted-foreground">
                +{value.length - 1} more alternatives
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'rfqActions',
      title: 'RFQ',
      render: (value: any, row: BOMItem) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddSingleToRFQ(row)}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          {t('bom.addToRFQSingle')}
        </Button>
      ),
    },
  ];

  const riskSummary = {
    critical: bomData.filter(item => item.riskLevel === 'critical').length,
    high: bomData.filter(item => item.riskLevel === 'high').length,
    medium: bomData.filter(item => item.riskLevel === 'medium').length,
    low: bomData.filter(item => item.riskLevel === 'low').length,
  };

  const totalItems = bomData.length;
  const riskScore = totalItems > 0 
    ? ((riskSummary.critical * 4 + riskSummary.high * 3 + riskSummary.medium * 2 + riskSummary.low * 1) / (totalItems * 4)) * 100
    : 0;
  const calculateScenarioCosts = () => {
    const originalCost = bomData.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const alternativesCost = bomData.reduce((sum, item) => 
      sum + ((item.alternativePrice || item.unitPrice) * item.quantity), 0);
    const cheapestCost = bomData.reduce((sum, item) => {
      // Assume cheapest viable (>=90% compatibility) is 10% cheaper on average
      const cheapestPrice = item.unitPrice * 0.9;
      return sum + (cheapestPrice * item.quantity);
    }, 0);

    return {
      original: originalCost,
      alternatives: alternativesCost,
      cheapest: cheapestCost
    };
  };

  const scenarioCosts = calculateScenarioCosts();
  const totalSavings = scenarioCosts.original - scenarioCosts.alternatives;
  const savingsPercentage = (totalSavings / scenarioCosts.original) * 100;

  const costChartData = [
    { name: 'Original BOM', cost: scenarioCosts.original, color: '#ef4444' },
    { name: 'With Alternatives', cost: scenarioCosts.alternatives, color: '#10b981' },
    { name: 'Cheapest Viable', cost: scenarioCosts.cheapest, color: '#3b82f6' }
  ];

  const riskDistributionData = [
    { name: 'Critical', value: riskSummary.critical, color: '#ef4444' },
    { name: 'High', value: riskSummary.high, color: '#f97316' },
    { name: 'Medium', value: riskSummary.medium, color: '#eab308' },
    { name: 'Low', value: riskSummary.low, color: '#10b981' }
  ];

  return (
    <div className="max-w-full space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('bom.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('bom.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowAIPanel(true)} className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span>{t('bom.askAI')}</span>
        </Button>
      </div>

      {/* BOM History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 text-foreground">
            <History className="w-5 h-5" />
            <span>{t('bom.uploadBOMFile')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {bomHistory.map((project) => (
              <div
                key={project.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedProject === project.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                }`}
                onClick={() => loadBOMProject(project.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-sm">{project.name}</h3>
                  </div>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{project.itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span className={project.riskScore > 70 ? 'text-red-600 font-medium' : project.riskScore > 50 ? 'text-amber-600' : 'text-green-600'}>
                      {project.riskScore}%
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {formatDistanceToNow(project.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!analysisComplete ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>{t('bom.uploadTitle')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-blue-600 dark:text-blue-400">Drop your BOM file here</p>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-2">
                    Drag & drop your BOM file here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports CSV, XLS, XLSX files
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSampleTemplate();
                    }}
                    className="mx-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample Template
                  </Button>
                </div>
              )}
            </div>

            {/* Parsing Status */}
            {parseStatus.status !== 'idle' && parseStatus.status !== 'complete' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">{parseStatus.currentStep}</span>
                  <span>{parseStatus.progress}%</span>
                </div>
                <Progress value={parseStatus.progress} className="w-full" />
              </div>
            )}

            {/* Errors and Warnings */}
            {parseStatus.status === 'complete' && (parseStatus.errors.length > 0 || parseStatus.warnings.length > 0) && (
              <div className="mt-4 space-y-2">
                {parseStatus.errors.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-medium mb-1">{parseStatus.errors.length} parsing errors found:</div>
                      {parseStatus.errors.map((error, index) => (
                        <div key={index} className="text-sm">
                          Line {error.line}, Column "{error.column}": {error.message}
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}
                {parseStatus.warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="font-medium mb-1">{parseStatus.warnings.length} warnings:</div>
                      {parseStatus.warnings.map((warning, index) => (
                        <div key={index} className="text-sm">
                          Line {warning.line}: {warning.message}
                        </div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Enhanced Summary Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{totalItems}</div>
                  <div className="text-sm text-muted-foreground"># MPN</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((bomData.filter(item => item.lifecycle === 'Active').length / totalItems) * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">% Active</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {bomData.filter(item => item.lifecycle === 'EOL' || item.lifecycle === 'Obsolete').length}
                  </div>
                  <div className="text-sm text-muted-foreground"># LTB/Obsolete</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(bomData.reduce((sum, item) => sum + item.leadTime, 0) / totalItems) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Lead Time (wks)</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {riskScore.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-xs text-muted-foreground">Risk Breakdown</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{riskSummary.critical}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>{riskSummary.high}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{riskSummary.medium}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{riskSummary.low}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Action Buttons with Bulk Actions */}
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={handleNotifyExpert}
                    disabled={selectedItems.size === 0}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Notify Expert</span>
                  </Button>
                </div>
                
                {selectedItems.size > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.size} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkFindAlternatives}
                      className="flex items-center space-x-1"
                    >
                      <Target className="w-4 h-4" />
                      <span>Find Alternatives</span>
                    </Button>
                    <Button
                      onClick={handleAddSelectedToRFQ}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to RFQ</span>
                    </Button>
                  </div>
                )}
              </div>
              
              {selectedItems.size === 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Select components to enable bulk actions</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Use checkboxes to select components for bulk operations like finding alternatives or creating RFQs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk-based RFQ Suggestions */}
          {analysisComplete && riskSummary.critical + riskSummary.high > 0 && (
            <Card className="w-full bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-orange-900 dark:text-orange-100">{t('bom.highRiskDetected')}</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mt-1 mb-3">
                      {riskSummary.critical + riskSummary.high} {t('bom.highRiskDescription')}
                    </p>
                    <Button
                      onClick={() => {
                        const riskyItems = bomData.filter(item => 
                          item.riskLevel === 'critical' || item.riskLevel === 'high'
                        );
                        handleAddToRFQ(riskyItems);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t('bom.addAllHighRisk')} ({riskSummary.critical + riskSummary.high})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Impact Analysis */}
          {analysisComplete && (
            <Tabs defaultValue="cost-impact" className="w-full space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cost-impact">{t('bom.costImpact')}</TabsTrigger>
                <TabsTrigger value="risk-analysis">{t('bom.riskAnalysis')}</TabsTrigger>
              </TabsList>

              <TabsContent value="cost-impact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-foreground">{t('bom.bomCostScenarios')}</CardTitle>
                      <Select value={costScenario} onValueChange={(value: any) => setCostScenario(value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">{t('bom.originalParts')}</SelectItem>
                          <SelectItem value="alternatives">{t('bom.selectedAlternatives')}</SelectItem>
                          <SelectItem value="cheapest">{t('bom.cheapestViable')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={costChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']} />
                            <Bar dataKey="cost" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('bom.currentBOMCost')}</h3>
                          <div className="text-2xl font-bold text-blue-600">
                            ${scenarioCosts.original.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">{t('bom.withAlternatives')}</h3>
                          <div className="text-2xl font-bold text-green-600">
                            ${scenarioCosts.alternatives.toFixed(2)}
                          </div>
                          <div className="text-sm text-green-800 dark:text-green-200 mt-1">
                            {t('bom.estimatedSaving')}: {savingsPercentage.toFixed(1)}% (${totalSavings.toFixed(2)}) {t('bom.perBuild')}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                          <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">{t('bom.cheapestViableOption')}</h3>
                          <div className="text-2xl font-bold text-purple-600">
                            ${scenarioCosts.cheapest.toFixed(2)}
                          </div>
                          <div className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                            {t('bom.maximumPotentialSaving')}: {(((scenarioCosts.original - scenarioCosts.cheapest) / scenarioCosts.original) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{t('bom.exportOptions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        {t('bom.costImpactReport')}
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        {t('bom.bomWithAlternatives')}
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        {t('bom.costAnalysisData')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk-analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{t('bom.riskDistribution')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={riskDistributionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {riskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium text-foreground">{t('bom.riskSummary')}</h3>
                        {riskDistributionData.map((risk, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded" 
                                style={{ backgroundColor: risk.color }}
                              />
                              <span className="font-medium text-foreground">{risk.name} {t('bom.risk')}</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">{risk.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Legacy Action Buttons - keeping for backward compatibility */}
          <Card className="hidden">
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Risk Report</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export with Replacements</span>
                </Button>
                <Button>Apply All Suggested Replacements</Button>
              </div>
            </CardContent>
          </Card>

          {/* BOM Table */}
          <DataTable columns={columns} data={bomData} className="w-full" />
        </>
      )}

      {/* AI Panel */}
      <div className="fixed bottom-4 right-4">
        <AIPanel 
          isOpen={showAIPanel} 
          onClose={() => setShowAIPanel(false)}
          context="BOM risk analysis and component replacement recommendations"
        />
      </div>
      
      {/* RFQ Cart */}
      <div className="fixed top-20 right-6 z-50">
        <RFQCart />
      </div>
    </div>
  );
}
