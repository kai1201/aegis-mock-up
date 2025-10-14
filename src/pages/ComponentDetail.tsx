import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, ExternalLink, FileText, TrendingUp, Package, Zap, Thermometer, Clock, DollarSign, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Building2, Calendar, Download, ChartBar as BarChart3, Flag, Copy, MapPin, Star, Truck, Globe, Cpu, Layers, Gauge, Users, Building, Info, ChevronRight } from 'lucide-react';
import { Send } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart, ComposedChart } from 'recharts';
import DataTable from '@/components/DataTable';
import AIPanel from '@/components/AIPanel';
import RiskBadge from '@/components/RiskBadge';
import CompatibilityScore from '@/components/CompatibilityScore';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdoptionSummary, AdoptionMini, INDUSTRY_SEGMENTS } from '@/types/adoption';
// import CrossReferenceTable from '@/components/CrossReferenceTable';

// Mock adoption data
const mockAdoptionData: AdoptionSummary = {
  companyCount: 342,
  confidence: 'Verified',
  asOf: '2024-09-01',
  segments: [
    { name: 'Automotive', sharePct: 45 },
    { name: 'Industrial', sharePct: 30 },
    { name: 'Consumer', sharePct: 15 },
    { name: 'Medical', sharePct: 7 },
    { name: 'Telecom', sharePct: 3 }
  ],
  topNotables: [
    { displayName: 'Large-scale Automotive OEM (Tier-1)', disclose: false },
    { displayName: 'Major Industrial Automation Company', disclose: false },
    { displayName: 'Large Consumer Electronics Manufacturer', disclose: false },
    { displayName: 'Global Medical Device Company', disclose: false },
    { displayName: 'Fortune 500 Automotive Supplier', disclose: false },
    { displayName: 'Leading European Industrial Group', disclose: false },
    { displayName: 'Top-tier Technology Conglomerate', disclose: false },
    { displayName: 'Major Asian Electronics Manufacturer', disclose: false }
  ]
};

const mockDesignWinTimeline = [
  { quarter: 'Q1 2022', wins: 12 },
  { quarter: 'Q2 2022', wins: 18 },
  { quarter: 'Q3 2022', wins: 24 },
  { quarter: 'Q4 2022', wins: 31 },
  { quarter: 'Q1 2023', wins: 28 },
  { quarter: 'Q2 2023', wins: 35 },
  { quarter: 'Q3 2023', wins: 42 },
  { quarter: 'Q4 2023', wins: 38 },
  { quarter: 'Q1 2024', wins: 45 },
  { quarter: 'Q2 2024', wins: 52 }
];

// Mock data for component details
const mockComponentData = {
  'STM32F407VGT6': {
    basicInfo: {
      partNumber: 'STM32F407VGT6',
      manufacturer: 'STMicroelectronics',
      logo: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=100',
      series: 'STM32F4',
      type: 'ARM Cortex-M4',
      category: 'Microcontroller',
      lifecycleStatus: 'NRND',
      releaseYear: '2011',
      longevityProgram: 'ST 10Y program',
      applicationMarkets: ['Automotive', 'Industrial', 'Consumer'],
      countryOfOrigin: 'France',
      compliance: {
        rohs: true,
        halogenFree: true,
        conflictMinerals: 'Compliant'
      }
    },
    keySpecs: {
      // Overview key specs (6-8 fields max)
      voltage: '1.8V–3.6V',
      temperature: '−40~85°C', 
      cpu: '168 MHz ARM Cortex-M4',
      memory: '1MB Flash, 192KB RAM',
      package: 'LQFP-100',
      battery: 'VBAT support',
      
      // Complete technical specs
      performance: {
        cpuFrequency: '168 MHz',
        coreType: 'ARM Cortex-M4F',
        fpu: 'Single precision',
        instructionCache: '4KB',
        dataCache: '4KB'
      },
      electrical: {
        supplyVoltage: '1.8V to 3.6V',
        supplyCurrentRun: '120 mA @ 168MHz',
        supplyCurrentSleep: '170 μA',
        supplyCurrentStandby: '2.1 μA',
        powerConsumption: '432 mW'
      },
      timing: {
        cpuClock: '168 MHz max',
        peripheralClock: '84 MHz max',
        crystalOscillator: '4-26 MHz',
        internalOscillator: '16 MHz ±1%'
      },
      interfaces: {
        uart: '4 channels',
        spi: '3 channels', 
        i2c: '3 channels',
        can: '2 channels',
        usb: 'OTG FS/HS',
        ethernet: 'MAC 10/100',
        sdio: '1 channel'
      },
      memory: {
        flash: '1024 KB',
        sram: '192 KB',
        ccm: '64 KB',
        backup: '4 KB'
      }
    },
    packageAssembly: {
      packageFamily: 'LQFP',
      jedecCode: 'MS-026',
      variant: 'LQFP-100_14x14',
      pinCount: 100,
      pitch: '0.5 mm',
      bodySize: '14×14×1.6 mm',
      leadSpan: '16×16 mm',
      standoff: '0.05-0.15 mm',
      heightClass: 'Low profile',
      
      footprint: {
        ipcStandard: 'IPC-7351B',
        padLength: '1.5 mm',
        padWidth: '0.3 mm',
        maskExpansion: '0.05 mm',
        pasteRatio: '100%',
        exposedPad: 'None'
      },
      
      termination: {
        leadType: 'Gull wing',
        plating: 'Matte Sn',
        coplanarity: '±0.08 mm',
        pin1Marker: 'Chamfer + dot',
        numbering: 'Counter-clockwise'
      },
      
      assemblability: {
        msl: 'MSL-3 (168h @ 30°C/60%RH)',
        peakReflow: '260°C',
        jStd002: 'Compatible',
        tapeReel: {
          orientation: 'Face up',
          pocketPitch: '24 mm',
          pocketDepth: '2.1 mm',
          qtyPerReel: '500'
        },
        markingCode: 'STM32F407VGT6',
        rohs: true,
        halogenFree: true
      },
      
      thermal: {
        thetaJA: '45 °C/W',
        thetaJC: '8 °C/W',
        psiJT: '15 °C/W',
        pMax: '2.8 W @ 85°C'
      }
    },
    supplyInfo: {
      currentLeadTime: '26 weeks',
      priceRange: '$8.45 - $12.30',
      moq: 1000,
      multiple: 1000,
      fpq: 250000,
      stockLevel: 2500,
      distributors: ['Digi-Key', 'Mouser', 'Arrow', 'Avnet'],
      packagingForm: ['Tape & Reel', 'Tray'],
      manufacturingLocations: [
        { location: 'Tours, France', age: '12 years' },
        { location: 'Malta', age: '8 years' }
      ]
    },
    riskSignals: {
      lifecycleDate: '2024-01-15',
      eolPrediction: 85,
      confidence: 'High',
      driverNotes: 'NRND status, factory migration, legacy process node',
      documents: ['PCN-ST-2024-003', 'PDN-ST-2024-001'],
      newsSignals: ['Factory migration announced', 'Roadmap update Q1 2024'],
      vendorSignals: {
        salesTrend: 'Declining',
        newProductCadence: 'Reduced',
        categoryTags: ['Legacy', 'Automotive']
      }
    },
  },
  // Add more mock data for other components
  'MSP430G2553IPW20': {
    basicInfo: {
      partNumber: 'MSP430G2553IPW20',
      manufacturer: 'Texas Instruments',
      logo: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=100',
      series: 'MSP430G2xx',
      type: '16-bit MCU',
      category: 'Microcontroller',
      lifecycleStatus: 'Last Time Buy',
      releaseYear: '2009',
      longevityProgram: 'TI Extended Life Program',
      applicationMarkets: ['Industrial', 'Consumer'],
      countryOfOrigin: 'USA',
      compliance: {
        rohs: true,
        halogenFree: false,
        conflictMinerals: 'Compliant'
      }
    },
    keySpecs: {
      voltage: '1.8V–3.6V',
      temperature: '−40~85°C',
      cpu: '16 MHz MSP430',
      package: 'TSSOP-20',
      battery: 'Ultra-low power',
      
      performance: {
        cpuFrequency: '16 MHz',
        coreType: '16-bit RISC',
        fpu: 'None',
        instructionCache: 'None',
        dataCache: 'None'
      },
      electrical: {
        supplyVoltage: '1.8V to 3.6V',
        supplyCurrentRun: '230 μA @ 1MHz',
        supplyCurrentSleep: '0.5 μA',
        supplyCurrentStandby: '0.1 μA',
        powerConsumption: '1 mW'
      },
      timing: {
        cpuClock: '16 MHz max',
        peripheralClock: '16 MHz max',
        crystalOscillator: 'N/A',
        internalOscillator: '12 MHz ±5%'
      },
      interfaces: {
        uart: '1 channel',
        spi: '1 channel', 
        i2c: '1 channel',
        can: 'N/A',
        usb: 'N/A',
        ethernet: 'N/A',
        sdio: 'N/A'
      },
      memory: {
        flash: '16 KB',
        sram: '512 B',
        ccm: 'N/A',
        backup: 'N/A'
      }
    },
    packageAssembly: {
      packageFamily: 'TSSOP',
      jedecCode: 'MO-153',
      variant: 'TSSOP-20_4.4x6.5',
      pinCount: 20,
      pitch: '0.65 mm',
      bodySize: '4.4×6.5×1.1 mm',
      leadSpan: '6.6×8.1 mm',
      standoff: '0.05-0.15 mm',
      heightClass: 'Low profile',
      
      footprint: {
        ipcStandard: 'IPC-7351B',
        padLength: '1.2 mm',
        padWidth: '0.4 mm',
        maskExpansion: '0.05 mm',
        pasteRatio: '100%',
        exposedPad: 'None'
      },
      
      termination: {
        leadType: 'Gull wing',
        plating: 'Matte Sn',
        coplanarity: '±0.10 mm',
        pin1Marker: 'Dot',
        numbering: 'Counter-clockwise'
      },
      
      assemblability: {
        msl: 'MSL-1 (Unlimited)',
        peakReflow: '260°C',
        jStd002: 'Compatible',
        tapeReel: {
          orientation: 'Face up',
          pocketPitch: '12 mm',
          pocketDepth: '1.5 mm',
          qtyPerReel: '2500'
        },
        markingCode: 'MSP430G2553IPW20',
        rohs: true,
        halogenFree: false
      },
      
      thermal: {
        thetaJA: '90 °C/W',
        thetaJC: '25 °C/W',
        psiJT: '30 °C/W',
        pMax: '1.4 W @ 85°C'
      }
    },
    supplyInfo: {
      currentLeadTime: '40 weeks',
      priceRange: '$1.25 - $2.10',
      moq: 2500,
      multiple: 2500,
      fpq: 100000,
      stockLevel: 1200,
      distributors: ['Digi-Key', 'Mouser', 'TI Direct'],
      packagingForm: ['Tape & Reel'],
      manufacturingLocations: [
        { location: 'Dallas, USA', age: '15 years' }
      ]
    },
    riskSignals: {
      lifecycleDate: '2024-06-30',
      eolPrediction: 95,
      confidence: 'Very High',
      driverNotes: 'LTB announced, migration to MSP430FR series',
      documents: ['PCN-TI-2024-001', 'LTB-TI-2024-002'],
      newsSignals: ['Last time buy announced', 'Migration to MSP430FR series'],
      vendorSignals: {
        salesTrend: 'Steep decline',
        newProductCadence: 'Stopped',
        categoryTags: ['Legacy', 'Obsolete']
      }
    },
  },
};

const mockLeadTimeData = [
  { month: 'Jan', leadTime: 12 },
  { month: 'Feb', leadTime: 14 },
  { month: 'Mar', leadTime: 18 },
  { month: 'Apr', leadTime: 22 },
  { month: 'May', leadTime: 26 },
  { month: 'Jun', leadTime: 26 },
];

const mockPriceData = [
  { month: 'Jan', min: 7.89, avg: 8.45, max: 9.12 },
  { month: 'Feb', min: 8.12, avg: 8.78, max: 9.45 },
  { month: 'Mar', min: 8.45, avg: 9.12, max: 9.89 },
  { month: 'Apr', min: 8.89, avg: 9.56, max: 10.23 },
  { month: 'May', min: 9.12, avg: 9.89, max: 10.67 },
  { month: 'Jun', min: 9.45, avg: 10.23, max: 11.12 },
];

const mockAlternatives = [
  {
    partNumber: 'STM32F405VGT6',
    manufacturer: 'STMicroelectronics',
    compatibility: 95,
    package: 'LQFP-100',
    price: '$7.89',
    leadTime: '22 weeks',
    stock: 5000,
    type: 'Drop-in',
  },
  {
    partNumber: 'LPC4088FET208',
    manufacturer: 'NXP',
    compatibility: 85,
    package: 'LQFP-208',
    price: '$9.12',
    leadTime: '18 weeks',
    stock: 3200,
    type: 'Minor redesign',
  },
  {
    partNumber: 'TM4C1294NCPDT',
    manufacturer: 'Texas Instruments',
    compatibility: 80,
    package: 'TQFP-128',
    price: '$7.25',
    leadTime: '16 weeks',
    stock: 8000,
    type: 'Minor redesign',
  },
];

const mockDocuments = [
  {
    id: 'PCN-ST-2024-003',
    title: 'STM32F407VG Product Change Notification',
    type: 'PCN',
    supplier: 'STMicroelectronics',
    partNumber: 'STM32F407VGT6',
    lastTimeBuy: new Date('2024-03-31'),
    lastShipment: new Date('2024-09-30'),
    status: 'Active',
    riskLevel: 'critical',
  },
  {
    id: 'PDN-ST-2024-001',
    title: 'STM32F407VG Product Discontinuation Notice',
    type: 'PDN',
    supplier: 'STMicroelectronics',
    partNumber: 'STM32F407VGT6',
    lastTimeBuy: new Date('2024-06-30'),
    lastShipment: new Date('2024-12-31'),
    status: 'Active',
    riskLevel: 'high',
  },
];

export default function ComponentDetail() {
  const { partNumber } = useParams<{ partNumber: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showCrossReferenceTable, setShowCrossReferenceTable] = useState(false);
  const [vendorFilter, setVendorFilter] = useState('All Vendors');
  const [bomQuantity, setBomQuantity] = useState(1);
  const [bomProject, setBomProject] = useState('');
  const [alertSettings, setAlertSettings] = useState({
    eol: true,
    leadTime: true,
    price: false,
    stock: true,
    pcn: true
  });

  const decodedPartNumber = partNumber ? decodeURIComponent(partNumber) : '';
  const componentData = mockComponentData[decodedPartNumber as keyof typeof mockComponentData] || mockComponentData['STM32F407VGT6'];

  const handleAlternativeClick = (partNumber: string) => {
    navigate(`/component/${encodeURIComponent(partNumber)}`);
  };

  const handleAddToBOM = () => {
    // In a real app, this would add the component to a BOM
    console.log(`Adding ${bomQuantity} units of ${componentData.basicInfo.partNumber} to BOM project: ${bomProject}`);
  };

  const toggleAlert = (alertType: string) => {
    setAlertSettings(prev => ({
      ...prev,
      [alertType]: !prev[alertType as keyof typeof prev]
    }));
  };

  const alternativesColumns = [
    {
      key: 'compatibility',
      title: 'Compatibility',
      sortable: true,
      render: (value: number, row: any) => (
        <div>
          <CompatibilityScore score={value} showProgressBar={true} />
          <Badge variant={row.type === 'Drop-in' ? 'default' : 'secondary'} className="text-xs">
            {row.type}
          </Badge>
        </div>
      ),
    },
    {
      key: 'partNumber',
      title: 'Part Number',
      sortable: true,
      render: (value: string) => (
        <code 
          className="bg-muted dark:bg-muted px-2 py-1 rounded text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-foreground"
          onClick={() => handleAlternativeClick(value)}
        >
          {value}
        </code>
      ),
    },
    {
      key: 'manufacturer',
      title: 'Manufacturer',
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'package',
      title: 'Package',
      sortable: true,
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'leadTime',
      title: 'Lead Time',
      sortable: true,
    },
    {
      key: 'stock',
      title: 'Stock',
      sortable: true,
      render: (value: number) => (
        <Badge variant={value > 5000 ? 'default' : value > 2000 ? 'secondary' : 'destructive'}>
          {value.toLocaleString()}
        </Badge>
      ),
    },
  ];

  const getLifecycleColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'NRND': return 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'Last Time Buy': return 'bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800';
      case 'Obsolete': return 'bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-950/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center space-x-3">
              <Package className="w-6 h-6" />
              <span>{componentData.basicInfo.partNumber}</span>
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline" className="flex items-center space-x-2">
                <Building2 className="w-3 h-3" />
                <span>{componentData.basicInfo.manufacturer}</span>
              </Badge>
              <Badge variant="secondary">{componentData.basicInfo.category}</Badge>
              <Badge className={`border ${getLifecycleColor(componentData.basicInfo.lifecycleStatus)}`}>
                {componentData.basicInfo.lifecycleStatus}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="packages">Packages & Assembly</TabsTrigger>
              <TabsTrigger value="supply">Supply Chain</TabsTrigger>
              <TabsTrigger value="adoption">Adoption</TabsTrigger>
              <TabsTrigger value="eol-insights">EOL Insights</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold font-mono">{componentData.basicInfo.partNumber}</div>
                          <Badge className={`${getLifecycleColor(componentData.basicInfo.lifecycleStatus)}`}>
                            {componentData.basicInfo.lifecycleStatus}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            {componentData.basicInfo.longevityProgram}
                          </Badge>
                        </div>
                        <Button>
                          <FileText className="w-4 h-4 mr-2" />
                          Datasheet
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{componentData.basicInfo.manufacturer}</span>
                        </span>
                        <span>{componentData.basicInfo.series}</span>
                        <span>{componentData.basicInfo.type}</span>
                        <span>{componentData.basicInfo.category}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Introduction Date</label>
                          <p className="text-sm font-semibold">{componentData.basicInfo.releaseYear}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country of Origin</label>
                          <p className="text-sm font-semibold flex items-center space-x-1">
                            <Flag className="w-3 h-3" />
                            <span>{componentData.basicInfo.countryOfOrigin}</span>
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RoHS/Halogen-free</label>
                          <div className="flex space-x-1">
                            <Badge variant={componentData.basicInfo.compliance.rohs ? "default" : "destructive"} className="text-xs">
                              RoHS
                            </Badge>
                            <Badge variant={componentData.basicInfo.compliance.halogenFree ? "default" : "secondary"} className="text-xs">
                              Halogen-free
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conflict Minerals</label>
                          <p className="text-sm font-semibold text-green-600">{componentData.basicInfo.compliance.conflictMinerals}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Application/Target Markets</label>
                        <div className="flex flex-wrap gap-2">
                          {componentData.basicInfo.applicationMarkets.map((market, index) => (
                            <Badge key={index} variant="outline">{market}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Longevity Tile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-3">
                        <div className="text-3xl font-bold text-blue-600">{componentData.basicInfo.longevityProgram}</div>
                        <div className="text-sm text-muted-foreground">Extended availability program</div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-medium">Program Benefits</div>
                          <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                            <li>10-year availability guarantee</li>
                            <li>No design changes without notice</li>
                            <li>Direct factory support</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Specs Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Specifications</CardTitle>
                    <div className="text-sm text-muted-foreground">Displays 6–8 fields maximum</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      <div className="text-center">
                        <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Voltage</div>
                        <div className="font-semibold">{componentData.keySpecs.voltage}</div>
                      </div>
                      <div className="text-center">
                        <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Temperature</div>
                        <div className="font-semibold">{componentData.keySpecs.temperature}</div>
                      </div>
                      <div className="text-center">
                        <Cpu className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">CPU</div>
                        <div className="font-semibold">{componentData.keySpecs.cpu}</div>
                      </div>
                      <div className="text-center">
                        <Layers className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Memory</div>
                        <div className="font-semibold">
                          {typeof componentData.keySpecs.memory === 'string' 
                            ? componentData.keySpecs.memory 
                            : componentData.keySpecs.memory?.flash && componentData.keySpecs.memory?.sram
                              ? `${componentData.keySpecs.memory.flash}, ${componentData.keySpecs.memory.sram}`
                              : 'N/A'
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <Package className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Package</div>
                        <div className="font-semibold">{componentData.keySpecs.package}</div>
                      </div>
                      <div className="text-center">
                        <Gauge className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Battery</div>
                        <div className="font-semibold">{componentData.keySpecs.battery}</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm">
                        View all specs →
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Supply Snapshots Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supply Snapshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="text-center">
                        <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Lead Time</div>
                        <div className="text-xl font-bold text-orange-600">{componentData.supplyInfo.currentLeadTime}</div>
                      </div>
                      <div className="text-center">
                        <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Price Range</div>
                        <div className="text-xl font-bold text-blue-600">{componentData.supplyInfo.priceRange}</div>
                      </div>
                      <div className="text-center">
                        <Package className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">MOQ/Multiple</div>
                        <div className="text-xl font-bold text-purple-600">{componentData.supplyInfo.moq.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <Truck className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">FPQ</div>
                        <div className="text-xl font-bold text-indigo-600">{componentData.supplyInfo.fpq.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Stock</div>
                        <div className="text-xl font-bold text-green-600">{componentData.supplyInfo.stockLevel.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Mini sparklines placeholder */}
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold">Mini Sparklines (6 months)</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Lead Time Trend</div>
                          <div className="h-8 bg-orange-100 rounded flex items-end justify-center space-x-1">
                            {Array.from({length: 6}).map((_, i) => (
                              <div key={i} className="w-2 bg-orange-500 rounded-t" style={{height: `${20 + i * 5}px`}} />
                            ))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Price Trend</div>
                          <div className="h-8 bg-blue-100 rounded flex items-end justify-center space-x-1">
                            {Array.from({length: 6}).map((_, i) => (
                              <div key={i} className="w-2 bg-blue-500 rounded-t" style={{height: `${15 + i * 6}px`}} />
                            ))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Stock Trend</div>
                          <div className="h-8 bg-green-100 rounded flex items-end justify-center space-x-1">
                            {Array.from({length: 6}).map((_, i) => (
                              <div key={i} className="w-2 bg-green-500 rounded-t" style={{height: `${25 - i * 2}px`}} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex space-x-3">
                      <Button>Add to BOM</Button>
                      <Button variant="outline">Add to Compare</Button>
                      <Button variant="outline">Find Alternatives</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Adoption Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Adoption</span>
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        See details → Adoption tab
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Main Metric */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          Used by ~{mockAdoptionData.companyCount} companies
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {mockAdoptionData.confidence} • As of {new Date(mockAdoptionData.asOf).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          <Info className="w-3 h-3 inline ml-1 cursor-help" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Enterprise Showcase */}
                        <div>
                          <h4 className="font-semibold mb-3">Enterprise Showcase</h4>
                          <div className="space-y-3">
                            {/* Logos Grid (for permitted companies) */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Verified Users:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {mockAdoptionData.topNotables?.filter(company => company.disclose).slice(0, 4).map((company, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                                    <img 
                                      src={company.logoUrl} 
                                      alt={company.displayName}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                    <span className="text-sm font-medium">{company.displayName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Anonymous showcase */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Additional Users:</p>
                              <div className="space-y-1">
                                {mockAdoptionData.topNotables?.filter(company => !company.disclose).slice(0, 3).map((company, index) => (
                                  <div key={index} className="text-sm text-foreground">
                                    • {company.displayName}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Segment Share Mini Chart */}
                        <div>
                          <h4 className="font-semibold mb-3">Market Segments</h4>
                          <div className="space-y-3">
                            {mockAdoptionData.segments.slice(0, 4).map((segment, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="text-sm font-medium w-20 text-right">{segment.sharePct}%</div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-foreground">{segment.name}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${segment.sharePct}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Confidence Badge */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Badge variant={mockAdoptionData.confidence === 'Verified' ? 'default' : 'secondary'}>
                            {mockAdoptionData.confidence === 'Verified' ? '✓ Verified by Macnica' : 'Estimated (model)'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sources: Customer databases, design-win records, market research
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="specifications">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Complete Technical Specifications</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy CSV
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy JSON
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Performance Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Cpu className="w-5 h-5 mr-2" />
                        Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">CPU Frequency</label>
                          <p className="font-semibold">{componentData.keySpecs.performance?.cpuFrequency || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Core Type</label>
                          <p className="font-semibold">{componentData.keySpecs.performance?.coreType || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">FPU</label>
                          <p className="font-semibold">{componentData.keySpecs.performance?.fpu || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Instruction Cache</label>
                          <p className="font-semibold">{componentData.keySpecs.performance?.instructionCache || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Data Cache</label>
                          <p className="font-semibold">{componentData.keySpecs.performance?.dataCache || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Electrical Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Electrical
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Supply Voltage</label>
                          <p className="font-semibold">{componentData.keySpecs.electrical?.supplyVoltage || componentData.keySpecs.voltage}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Supply Current (Run)</label>
                          <p className="font-semibold">{componentData.keySpecs.electrical?.supplyCurrentRun || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Supply Current (Sleep)</label>
                          <p className="font-semibold">{componentData.keySpecs.electrical?.supplyCurrentSleep || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Supply Current (Standby)</label>
                          <p className="font-semibold">{componentData.keySpecs.electrical?.supplyCurrentStandby || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Power Consumption</label>
                          <p className="font-semibold">{componentData.keySpecs.electrical?.powerConsumption || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timing Specifications */}
                    {componentData.keySpecs.timing && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          Timing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">CPU Clock</label>
                            <p className="font-semibold">{componentData.keySpecs.timing.cpuClock}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Peripheral Clock</label>
                            <p className="font-semibold">{componentData.keySpecs.timing.peripheralClock}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Crystal Oscillator</label>
                            <p className="font-semibold">{componentData.keySpecs.timing.crystalOscillator}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Internal Oscillator</label>
                            <p className="font-semibold">{componentData.keySpecs.timing.internalOscillator}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interface Specifications */}
                    {componentData.keySpecs.interfaces && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Globe className="w-5 h-5 mr-2" />
                          Interfaces
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">UART</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.uart}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">SPI</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.spi}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">I2C</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.i2c}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">CAN</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.can}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">USB</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.usb}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Ethernet</label>
                            <p className="font-semibold">{componentData.keySpecs.interfaces.ethernet}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Memory Specifications */}
                    {componentData.keySpecs.memory && typeof componentData.keySpecs.memory === 'object' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Layers className="w-5 h-5 mr-2" />
                          Memory
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Flash</label>
                            <p className="font-semibold">{componentData.keySpecs.memory.flash}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">SRAM</label>
                            <p className="font-semibold">{componentData.keySpecs.memory.sram}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">CCM</label>
                            <p className="font-semibold">{componentData.keySpecs.memory.ccm}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Backup</label>
                            <p className="font-semibold">{componentData.keySpecs.memory.backup}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <CardTitle>Package Information & Assembly Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Package Family */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Package Family & Dimensions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Package Family</label>
                          <p className="font-semibold">{componentData.packageAssembly?.packageFamily || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">JEDEC Code</label>
                          <p className="font-semibold">{componentData.packageAssembly?.jedecCode || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Variant</label>
                          <p className="font-semibold">{componentData.packageAssembly?.variant || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Pin Count</label>
                          <p className="font-semibold">{componentData.packageAssembly?.pinCount || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Pitch</label>
                          <p className="font-semibold">{componentData.packageAssembly?.pitch || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Body Size (L×W×H)</label>
                          <p className="font-semibold">{componentData.packageAssembly?.bodySize || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Lead Span</label>
                          <p className="font-semibold">{componentData.packageAssembly?.leadSpan || 'N/A'}</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <label className="text-sm font-medium text-muted-foreground">Height Class</label>
                          <p className="font-semibold">{componentData.packageAssembly?.heightClass || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footprint/Land Pattern */}
                    {componentData.packageAssembly?.footprint && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Footprint/Land Pattern</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">IPC Standard</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.ipcStandard}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Pad Length</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.padLength}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Pad Width</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.padWidth}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Mask Expansion</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.maskExpansion}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Paste Ratio</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.pasteRatio}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Exposed Pad</label>
                            <p className="font-semibold">{componentData.packageAssembly.footprint.exposedPad}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Termination */}
                    {componentData.packageAssembly?.termination && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Termination</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Lead Type</label>
                            <p className="font-semibold">{componentData.packageAssembly.termination.leadType}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Plating</label>
                            <p className="font-semibold">{componentData.packageAssembly.termination.plating}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Coplanarity</label>
                            <p className="font-semibold">{componentData.packageAssembly.termination.coplanarity}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Pin-1 Marker</label>
                            <p className="font-semibold">{componentData.packageAssembly.termination.pin1Marker}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Numbering</label>
                            <p className="font-semibold">{componentData.packageAssembly.termination.numbering}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assemblability & Standards */}
                    {componentData.packageAssembly?.assemblability && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Assemblability & Standards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">MSL (J-STD-020)</label>
                            <p className="font-semibold">{componentData.packageAssembly.assemblability.msl}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Peak Reflow</label>
                            <p className="font-semibold">{componentData.packageAssembly.assemblability.peakReflow}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">J-STD-002</label>
                            <p className="font-semibold">{componentData.packageAssembly.assemblability.jStd002}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Marking Code</label>
                            <p className="font-semibold">{componentData.packageAssembly.assemblability.markingCode}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">RoHS</label>
                            <Badge variant={componentData.packageAssembly.assemblability.rohs ? "default" : "destructive"}>
                              {componentData.packageAssembly.assemblability.rohs ? 'Compliant' : 'Non-compliant'}
                            </Badge>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Halogen-free</label>
                            <Badge variant={componentData.packageAssembly.assemblability.halogenFree ? "default" : "secondary"}>
                              {componentData.packageAssembly.assemblability.halogenFree ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>

                        {/* Tape & Reel Details */}
                        {componentData.packageAssembly.assemblability.tapeReel && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Tape & Reel</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="p-3 border rounded-lg">
                                <label className="text-sm font-medium text-muted-foreground">Orientation</label>
                                <p className="font-semibold">{componentData.packageAssembly.assemblability.tapeReel.orientation}</p>
                              </div>
                              <div className="p-3 border rounded-lg">
                                <label className="text-sm font-medium text-muted-foreground">Pocket Pitch</label>
                                <p className="font-semibold">{componentData.packageAssembly.assemblability.tapeReel.pocketPitch}</p>
                              </div>
                              <div className="p-3 border rounded-lg">
                                <label className="text-sm font-medium text-muted-foreground">Pocket Depth</label>
                                <p className="font-semibold">{componentData.packageAssembly.assemblability.tapeReel.pocketDepth}</p>
                              </div>
                              <div className="p-3 border rounded-lg">
                                <label className="text-sm font-medium text-muted-foreground">Qty/Reel</label>
                                <p className="font-semibold">{componentData.packageAssembly.assemblability.tapeReel.qtyPerReel}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Thermal & Electrical */}
                    {componentData.packageAssembly?.thermal && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Thermal & Electrical</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">θJA</label>
                            <p className="font-semibold">{componentData.packageAssembly.thermal.thetaJA}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">θJC</label>
                            <p className="font-semibold">{componentData.packageAssembly.thermal.thetaJC}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">ΨJT</label>
                            <p className="font-semibold">{componentData.packageAssembly.thermal.psiJT}</p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <label className="text-sm font-medium text-muted-foreground">Pmax</label>
                            <p className="font-semibold">{componentData.packageAssembly.thermal.pMax}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="supply">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lead Time Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={mockLeadTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="leadTime" stroke="#3b82f6" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Price Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={mockPriceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="min" stroke="#10b981" strokeWidth={2} name="Min Price" />
                            <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} name="Avg Price" />
                            <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} name="Max Price" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Supply Chain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{componentData.supplyInfo.currentLeadTime}</div>
                        <div className="text-sm text-muted-foreground">Current Lead Time</div>
                      </div>
                      
                      <div className="text-center">
                        <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{componentData.supplyInfo.priceRange}</div>
                        <div className="text-sm text-muted-foreground">Price Range</div>
                      </div>
                      
                      <div className="text-center">
                        <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{componentData.supplyInfo.moq.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">MOQ</div>
                      </div>
                      
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{componentData.supplyInfo.stockLevel.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Available Stock</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-3 text-foreground">Approved Distributors</h3>
                      <div className="flex flex-wrap gap-2">
                        {componentData.supplyInfo.distributors.map((distributor, index) => (
                          <Badge key={index} variant="outline">{distributor}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="adoption">
              <div className="space-y-6">
                {/* KPIs Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Adoption Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {mockAdoptionData.companyCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Companies</div>
                        <Badge variant={mockAdoptionData.confidence === 'Verified' ? 'default' : 'secondary'} className="mt-2">
                          {mockAdoptionData.confidence}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-3">Top Segments</div>
                        <div className="flex flex-wrap gap-2">
                          {mockAdoptionData.segments.slice(0, 3).map((segment, index) => (
                            <Badge key={index} variant="outline" className="flex items-center space-x-1">
                              <span>{segment.name}</span>
                              <span className="text-blue-600 font-medium">{segment.sharePct}%</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-3">Data Sources</div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">Customer DB</Badge>
                          <Badge variant="outline" className="text-xs">Design Wins</Badge>
                          <Badge variant="outline" className="text-xs">Market Research</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          As of {new Date(mockAdoptionData.asOf).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Segment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAdoptionData.segments.map((segment, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{segment.name}</span>
                              <span className="text-sm font-bold text-blue-600">{segment.sharePct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${segment.sharePct}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Design-Win Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockDesignWinTimeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quarter" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="wins" stroke="#3b82f6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Base</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Breakdown by industry & company size
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAdoptionData.topNotables?.map((company, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium">{company.displayName}</div>
                              <div className="text-sm text-muted-foreground">
                                {mockAdoptionData.segments[index % mockAdoptionData.segments.length]?.name || 'Industrial'} • Large Enterprise
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {componentData.basicInfo.series}
                            </Badge>
                            {mockAdoptionData.confidence === 'Verified' && (
                              <Badge variant="default" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Disclosure Footer */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Badge variant={mockAdoptionData.confidence === 'Verified' ? 'default' : 'secondary'}>
                          {mockAdoptionData.confidence === 'Verified' ? '✓ Verified by Macnica' : 'Estimated (model)'}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Sources: Customer databases, design-win records, market research • Updated {new Date(mockAdoptionData.asOf).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="eol-insights" className="space-y-6">
              <Tabs defaultValue="graphs" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="graphs" className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Graph Layer</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>AI EOL Assistant</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="graphs" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lead Time & Price Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={mockLeadTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Line yAxisId="left" type="monotone" dataKey="leadTime" stroke="#3b82f6" strokeWidth={2} name="Lead Time (weeks)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Stock Levels Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={mockLeadTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="leadTime" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ai">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-orange-600" />
                        <span>EOL Intelligence Assistant</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          Online
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ask questions about EOL timeline, alternatives, and migration strategies
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="flex justify-start">
                          <div className="flex space-x-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-muted border rounded-2xl p-4">
                              <div className="prose prose-sm max-w-none">
                                <p className="mb-3 text-foreground">Hello! I'm your EOL Intelligence assistant for <code className="bg-muted px-2 py-1 rounded text-foreground">{componentData.basicInfo.partNumber}</code>.</p>
                                
                                {language === 'ja' ? (
                                <div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-4">
                                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">現在のEOLステータス</h4>
                                  <p className="text-orange-800 dark:text-orange-200 mb-2">
                                    このコンポーネントは以下の理由により<strong>{componentData.riskSignals.eolPrediction}%のEOL確率</strong>を示しています：
                                  </p>
                                  <ul className="list-disc list-inside text-orange-800 dark:text-orange-200 space-y-1 text-sm">
                                    <li>リードタイム延長を伴うNRNDステータスの宣言</li>
                                    <li>生産能力に影響する工場移転の発表</li>
                                    <li>レガシープロセスノードの製造終了移行</li>
                                  </ul>
                                </div>

                                <p className="mb-3 text-foreground">以下のことでお手伝いできます：</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                                  <li>EOLタイムライン予測とリスク分析</li>
                                  <li>代替コンポーネントの推奨</li>
                                  <li>移行戦略と実装計画</li>
                                  <li>サプライチェーン影響評価</li>
                                  <li>PCN/PDNドキュメント分析と洞察</li>
                                </ul>
                                
                                <p className="mt-3 text-foreground">このコンポーネントのEOLステータスについて何を知りたいですか？</p>
                                </div>
                                ) : (
                                <div>
                                
                                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-4">
                                  <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">Current EOL Status</h4>
                                  <p className="text-orange-800 dark:text-orange-200 mb-2">
                                    This component shows <strong>{componentData.riskSignals.eolPrediction}% EOL probability</strong> based on:
                                  </p>
                                  <ul className="list-disc list-inside text-orange-800 dark:text-orange-200 space-y-1 text-sm">
                                    <li>NRND status declared with extended lead times</li>
                                    <li>Factory migration announced affecting production capacity</li>
                                    <li>Legacy process node facing end-of-life transitions</li>
                                  </ul>
                                </div>

                                <p className="mb-3 text-foreground">I can help you with:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                                  <li>EOL timeline predictions and risk analysis</li>
                                  <li>Alternative component recommendations</li>
                                  <li>Migration strategies and implementation plans</li>
                                  <li>Supply chain impact assessment</li>
                                  <li>PCN/PDN document analysis and insights</li>
                                </ul>
                                
                                <p className="mt-3 text-foreground">What would you like to know about this component's EOL status?</p>
                                </div>
                                )}
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-border space-y-2">
                                <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">PCN</Badge>
                                  <span className="text-xs hover:underline flex items-center space-x-1 text-foreground">
                                    <span>PCN-ST-2024-003</span>
                                    <ExternalLink className="w-2 h-2" />
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">datasheet</Badge>
                                  <span className="text-xs hover:underline flex items-center space-x-1 text-foreground">
                                    <span>STM32F407VG Datasheet Rev 5</span>
                                    <ExternalLink className="w-2 h-2" />
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">news</Badge>
                                  <span className="text-xs hover:underline flex items-center space-x-1 text-foreground">
                                    <span>ST Factory Migration Announcement</span>
                                    <ExternalLink className="w-2 h-2" />
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-3 text-xs opacity-70 text-muted-foreground">
                                Just now
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap gap-2 px-6">
                          {language === 'ja' ? (
                            <>
                              <Button variant="outline" size="sm" className="text-xs">
                                この部品はEOLのリスクがありますか？
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                この部品を代替品TI MSP430F5529と比較
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                最適な代替品は何ですか？
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                この部品はいつ廃止されますか？
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                移行タイムラインを表示
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                サプライチェーン影響を分析
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" className="text-xs">
                                Is this part at risk of EOL?
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Compare this part to the alternative TI MSP430F5529
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                What are the best alternatives?
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                When will this part be discontinued?
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Show migration timeline
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Analyze supply chain impact
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="border-t p-4">
                        <div className="mb-3 text-xs text-foreground">
                          💡 {language === 'ja' ? 
                            '試してみてください：「この部品はEOLのリスクがありますか？」または「この部品を代替品TI MSP430F5529と比較してください」' : 
                            'Try asking: "Is this part at risk of EOL?" or "Compare this part to the alternative TI MSP430F5529"'
                          }
                        </div>
                        <div className="flex space-x-4">
                          <Textarea
                            placeholder={language === 'ja' ? 
                              'EOLタイムライン、代替品、移行戦略について質問...' : 
                              'Ask about EOL timeline, alternatives, migration strategies...'
                            }
                            className="flex-1 min-h-[3rem] max-h-32 resize-none bg-background"
                          />
                          <Button className="px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="alternatives">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Cross-References & Alternatives</CardTitle>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Vendor Filter:</label>
                        <Select
                          value={vendorFilter} 
                          onValueChange={setVendorFilter}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Vendors">All Vendors</SelectItem>
                            <SelectItem value="STMicroelectronics">STMicroelectronics</SelectItem>
                            <SelectItem value="Texas Instruments">Texas Instruments</SelectItem>
                            <SelectItem value="NXP">NXP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DataTable columns={alternativesColumns} data={mockAlternatives} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Datasheet & Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-blue-500" />
                          <div>
                            <p className="font-medium text-foreground">Official Datasheet</p>
                            <p className="text-sm text-muted-foreground">Complete technical specifications</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-green-500" />
                          <div>
                            <p className="font-medium text-foreground">Application Notes</p>
                            <p className="text-sm text-muted-foreground">Design guidelines and recommendations</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-purple-500" />
                          <div>
                            <p className="font-medium text-foreground">Product Roadmap</p>
                            <p className="text-sm text-muted-foreground">Future product plans and timeline</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>PCN/PDN Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {componentData.riskSignals.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            <div>
                              <p className="font-medium text-red-900 dark:text-red-200">{doc}</p>
                              <p className="text-sm text-red-700 dark:text-red-300">Official change notification</p>
                            </div>
                          </div>
                            <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        All documents are sourced directly from manufacturer databases and verified for authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* AI Panel */}
          <div className="fixed bottom-4 right-4">
            <AIPanel 
              isOpen={showAIPanel} 
              onClose={() => setShowAIPanel(false)}
              context={`Component analysis for ${componentData.basicInfo.partNumber}`}
            />
          </div>
        </div>
      </div>

      {/* Cross-Reference Table Modal - Commented out until component is created */}
      {/* {showCrossReferenceTable && (
        <div>Cross Reference Table Placeholder</div>
      )} */}
    </div>
  );
}
