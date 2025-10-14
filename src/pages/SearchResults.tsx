import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Edit, 
  ExternalLink, 
  Package, 
  Zap, 
  Thermometer, 
  Clock, 
  Building2, 
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  ShoppingCart,
  CheckSquare,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for search results
const mockComponents = [
  {
    id: '1',
    mpn: 'STM32F407VGT6',
    cpn: 'MCU-STM32-001',
    manufacturer: 'STMicroelectronics',
    series: 'STM32F4',
    category: 'Microcontrollers',
    productCategory: '32-bit MCUs',
    lifecycle: 'NRND',
    longevity: null,
    description: '32-bit ARM Cortex-M4 MCU with FPU, 1MB Flash, 192KB RAM',
    package: { name: 'LQFP', pins: 100 },
    packageFamily: 'LQFP',
    supplyVoltageMin: 1.8,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '1.8V - 3.6V',
      maxFreq: '168MHz',
      flash: '1MB',
      ram: '192KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 2500, price: 8.45, leadTime: 26, vendor: 'Macnica' },
      digikey: { stock: 1200, price: 9.12, leadTime: 12, vendor: 'Digi-Key' },
      mouser: { stock: 890, price: 8.89, leadTime: 16, vendor: 'Mouser' },
      total: 4590
    },
    leadTime: 26,
    priceRange: '$8.45 - $9.12',
    moq: 1000,
    multiple: 1000,
    fpq: 1000,
    eolPrediction: 75,
    leadTimeSparkline: [28, 26, 24, 26, 28, 26],
    compliance: ['RoHS', 'Halogen-free'],
    countryOfOrigin: 'Malaysia',
    datasheet: 'https://example.com/stm32f407-datasheet.pdf',
    adoptionMini: {
      companyCount: 342,
      confidence: 'Verified' as const,
      segmentsTop2: ['Automotive', 'Industrial'],
      notableShort: ['Global Automotive OEM', 'Industrial Tier-1']
    }
  },
  {
    id: '2',
    mpn: 'STM32F405VGT6',
    cpn: 'MCU-STM32-002',
    manufacturer: 'STMicroelectronics',
    series: 'STM32F4',
    category: 'Microcontrollers',
    productCategory: '32-bit MCUs',
    lifecycle: 'Active',
    longevity: '10Y Program',
    description: '32-bit ARM Cortex-M4 MCU, 1MB Flash, 192KB RAM',
    package: { name: 'LQFP', pins: 100 },
    packageFamily: 'LQFP',
    supplyVoltageMin: 1.8,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '1.8V - 3.6V',
      maxFreq: '168MHz',
      flash: '1MB',
      ram: '192KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 5200, price: 7.89, leadTime: 18, vendor: 'Macnica' },
      digikey: { stock: 2100, price: 8.12, leadTime: 8, vendor: 'Digi-Key' },
      mouser: { stock: 1500, price: 7.95, leadTime: 10, vendor: 'Mouser' },
      arrow: { stock: 3200, price: 7.76, leadTime: 14, vendor: 'Arrow' },
      total: 12000
    },
    leadTime: 18,
    priceRange: '$7.76 - $8.12',
    moq: 1000,
    multiple: 1000,
    fpq: 1000,
    eolPrediction: null,
    leadTimeSparkline: [20, 18, 16, 18, 19, 18],
    compliance: ['RoHS', 'Halogen-free', 'Conflict-free'],
    countryOfOrigin: 'Philippines',
    datasheet: 'https://example.com/stm32f405-datasheet.pdf',
    adoptionMini: {
      companyCount: 1240,
      confidence: 'Verified' as const,
      segmentsTop2: ['Automotive', 'Consumer'],
      notableShort: ['Large-scale EV Manufacturer', 'Consumer Electronics Giant']
    }
  },
  {
    id: '3',
    mpn: 'LPC4088FET208',
    cpn: 'MCU-NXP-001',
    manufacturer: 'NXP',
    series: 'LPC40xx',
    category: 'Microcontrollers',
    productCategory: '32-bit MCUs',
    lifecycle: 'Active',
    longevity: null,
    description: 'ARM Cortex-M4 MCU with Ethernet, USB, CAN',
    package: { name: 'LQFP', pins: 208 },
    packageFamily: 'LQFP',
    supplyVoltageMin: 3.0,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '3.0V - 3.6V',
      maxFreq: '120MHz',
      flash: '512KB',
      ram: '96KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 1800, price: 9.12, leadTime: 14, vendor: 'Macnica' },
      avnet: { stock: 950, price: 9.45, leadTime: 16, vendor: 'Avnet' },
      total: 2750
    },
    leadTime: 14,
    priceRange: '$9.12 - $9.45',
    moq: 2500,
    multiple: 500,
    fpq: 2500,
    eolPrediction: null,
    leadTimeSparkline: [16, 14, 12, 14, 15, 14],
    compliance: ['RoHS'],
    countryOfOrigin: 'China',
    datasheet: 'https://example.com/lpc4088-datasheet.pdf',
    adoptionMini: {
      companyCount: 85,
      confidence: 'Estimated' as const,
      segmentsTop2: ['Industrial', 'Medical'],
      notableShort: ['Industrial Tier-1', 'Medical OEM']
    }
  },
  {
    id: '4',
    mpn: 'TM4C1294NCPDT',
    cpn: 'MCU-TI-001',
    manufacturer: 'Texas Instruments',
    series: 'TM4C129x',
    category: 'Microcontrollers',
    productCategory: '32-bit MCUs',
    lifecycle: 'Active',
    longevity: null,
    description: 'ARM Cortex-M4F MCU with Integrated Ethernet MAC and PHY',
    package: { name: 'TQFP', pins: 128 },
    packageFamily: 'TQFP',
    supplyVoltageMin: 3.0,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '3.0V - 3.6V',
      maxFreq: '120MHz',
      flash: '1MB',
      ram: '256KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 4500, price: 7.25, leadTime: 12, vendor: 'Macnica' },
      digikey: { stock: 6200, price: 7.45, leadTime: 6, vendor: 'Digi-Key' },
      mouser: { stock: 3100, price: 7.38, leadTime: 8, vendor: 'Mouser' },
      total: 13800
    },
    leadTime: 12,
    priceRange: '$7.25 - $7.45',
    moq: 1000,
    multiple: 1000,
    fpq: 1000,
    eolPrediction: null,
    leadTimeSparkline: [14, 12, 10, 12, 13, 12],
    compliance: ['RoHS', 'Conflict-free'],
    countryOfOrigin: 'Philippines',
    datasheet: 'https://example.com/tm4c1294-datasheet.pdf',
    adoptionMini: {
      companyCount: 456,
      confidence: 'Verified' as const,
      segmentsTop2: ['Industrial', 'Telecom'],
      notableShort: ['Global Industrial Conglomerate', 'Telecom Infrastructure Leader']
    }
  },
  {
    id: '5',
    mpn: 'SAMV71Q21B',
    cpn: 'MCU-MCHP-001',
    manufacturer: 'Microchip',
    series: 'SAMV71',
    category: 'Microcontrollers',
    productCategory: '32-bit MCUs',
    lifecycle: 'Active',
    longevity: null,
    description: 'ARM Cortex-M7 MCU with Ethernet, CAN-FD, High-speed USB',
    package: { name: 'BGA', pins: 144 },
    packageFamily: 'BGA',
    supplyVoltageMin: 3.0,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '3.0V - 3.6V',
      maxFreq: '300MHz',
      flash: '2MB',
      ram: '384KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 890, price: 12.45, leadTime: 20, vendor: 'Macnica' },
      digikey: { stock: 450, price: 13.12, leadTime: 24, vendor: 'Digi-Key' },
      total: 1340
    },
    leadTime: 20,
    priceRange: '$12.45 - $13.12',
    moq: 1000,
    multiple: 1000,
    fpq: 1000,
    eolPrediction: null,
    leadTimeSparkline: [22, 20, 18, 20, 21, 20],
    compliance: ['RoHS', 'Halogen-free'],
    countryOfOrigin: 'Thailand',
    datasheet: 'https://example.com/samv71-datasheet.pdf',
    adoptionMini: {
      companyCount: 128,
      confidence: 'Estimated' as const,
      segmentsTop2: ['Automotive', 'Industrial'],
      notableShort: ['Automotive Tier-1', 'Industrial OEM']
    }
  },
  {
    id: '6',
    mpn: 'ESP32-S3-WROOM-1',
    cpn: 'MCU-ESP-001',
    manufacturer: 'Espressif Systems',
    series: 'ESP32-S3',
    category: 'Microcontrollers',
    productCategory: 'WiFi/BT MCUs',
    lifecycle: 'LTB',
    longevity: null,
    description: 'WiFi + Bluetooth MCU Module with dual-core processor',
    package: { name: 'Module', pins: 41 },
    packageFamily: 'Module',
    supplyVoltageMin: 3.0,
    supplyVoltageMax: 3.6,
    tempMin: -40,
    tempMax: 85,
    keySpecs: {
      voltageRange: '3.0V - 3.6V',
      maxFreq: '240MHz',
      flash: '16MB',
      ram: '512KB',
      tempRange: '-40°C to +85°C'
    },
    stockSnapshot: {
      macnica: { stock: 15600, price: 4.89, leadTime: 8, vendor: 'Macnica' },
      digikey: { stock: 8900, price: 5.12, leadTime: 4, vendor: 'Digi-Key' },
      mouser: { stock: 12500, price: 4.95, leadTime: 6, vendor: 'Mouser' },
      total: 37000
    },
    leadTime: 8,
    priceRange: '$4.89 - $5.12',
    moq: 500,
    multiple: 500,
    fpq: 500,
    eolPrediction: 45,
    leadTimeSparkline: [10, 8, 6, 8, 9, 8],
    compliance: ['RoHS'],
    countryOfOrigin: 'China',
    datasheet: 'https://example.com/esp32s3-datasheet.pdf',
    adoptionMini: {
      companyCount: 2840,
      confidence: 'Estimated' as const,
      segmentsTop2: ['Consumer', 'Industrial'],
      notableShort: ['Consumer OEM', 'IoT Vendor']
    }
  }
];

// Facet options
const manufacturerOptions = ['STMicroelectronics', 'Texas Instruments', 'NXP', 'Microchip', 'Espressif Systems', 'Analog Devices', 'Infineon'];
const categoryOptions = ['Microcontrollers', 'Power Management', 'Analog ICs', 'Interface ICs', 'Memory', 'Logic'];
const seriesOptions = ['STM32F4', 'LPC40xx', 'TM4C129x', 'SAMV71', 'ESP32-S3'];
const packageFamilyOptions = ['LQFP', 'TQFP', 'BGA', 'QFN', 'SOIC', 'Module'];
const lifecycleOptions = ['Active', 'NRND', 'LTB', 'Obsolete'];
const vendorOptions = ['Macnica', 'Digi-Key', 'Mouser', 'Arrow', 'Avnet'];
const complianceOptions = ['RoHS', 'Halogen-free', 'Conflict-free'];
const leadTimeBands = ['≤8w', '9-16w', '17-24w', '>24w'];

type SearchState = 'idle' | 'loading' | 'error' | 'no-results';

interface Filters {
  manufacturers: string[];
  categories: string[];
  series: string[];
  packageFamilies: string[];
  lifecycles: string[];
  vendors: string[];
  compliance: string[];
  supplyVoltageRange: [number, number];
  tempRange: [number, number];
  stockMin: number;
  leadTimeBands: string[];
  moqMax: number;
  adoptionRanges: string[];
  segments: string[];
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const query = searchParams.get('q') || '';
  const [editQuery, setEditQuery] = useState(query);
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState<Filters>({
    manufacturers: [],
    categories: [],
    series: [],
    packageFamilies: [],
    lifecycles: [],
    vendors: [],
    compliance: [],
    supplyVoltageRange: [1.0, 5.0],
    tempRange: [-55, 125],
    stockMin: 0,
    leadTimeBands: [],
    moqMax: 100000,
    adoptionRanges: [],
    segments: []
  });

  // Collapsible states for facet sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    manufacturer: false,
    category: false,
    series: false,
    package: false,
    lifecycle: false,
    vendor: false,
    voltage: false,
    temperature: false,
    stock: false,
    leadtime: false,
    moq: false,
    compliance: false,
    adoption: false,
    segments: false
  });

  const filteredComponents = mockComponents.filter(component => {
    if (filters.manufacturers.length > 0 && !filters.manufacturers.includes(component.manufacturer)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(component.category)) return false;
    if (filters.series.length > 0 && !filters.series.includes(component.series)) return false;
    if (filters.packageFamilies.length > 0 && !filters.packageFamilies.includes(component.packageFamily)) return false;
    if (filters.lifecycles.length > 0 && !filters.lifecycles.includes(component.lifecycle)) return false;
    if (filters.vendors.length > 0) {
      const hasVendor = filters.vendors.some(vendor => 
        Object.values(component.stockSnapshot).some((stock: any) => stock.vendor === vendor)
      );
      if (!hasVendor) return false;
    }
    if (filters.compliance.length > 0) {
      const hasCompliance = filters.compliance.some(comp => component.compliance.includes(comp));
      if (!hasCompliance) return false;
    }
    if (component.supplyVoltageMin < filters.supplyVoltageRange[0] || component.supplyVoltageMax > filters.supplyVoltageRange[1]) return false;
    if (component.tempMin < filters.tempRange[0] || component.tempMax > filters.tempRange[1]) return false;
    if (component.stockSnapshot.total < filters.stockMin) return false;
    if (filters.leadTimeBands.length > 0) {
      const leadTime = component.leadTime;
      const matchesBand = filters.leadTimeBands.some(band => {
        switch (band) {
          case '≤8w': return leadTime <= 8;
          case '9-16w': return leadTime >= 9 && leadTime <= 16;
          case '17-24w': return leadTime >= 17 && leadTime <= 24;
          case '>24w': return leadTime > 24;
          default: return false;
        }
      });
      if (!matchesBand) return false;
    }
    if (component.moq > filters.moqMax) return false;
    return true;
  });

  const handleSearch = () => {
    if (editQuery.trim()) {
      setSearchParams({ q: editQuery.trim() });
      setIsEditingQuery(false);
      setSearchState('loading');
      // Simulate loading
      setTimeout(() => {
        setSearchState(filteredComponents.length === 0 ? 'no-results' : 'idle');
      }, 800);
    }
  };

  const toggleFilterValue = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: (prev[filterType] as string[]).includes(value)
        ? (prev[filterType] as string[]).filter((v: string) => v !== value)
        : [...(prev[filterType] as string[]), value]
    }));
  };

  const toggleCompareSelection = (componentId: string) => {
    setSelectedForCompare(prev =>
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      manufacturers: [],
      categories: [],
      series: [],
      packageFamilies: [],
      lifecycles: [],
      vendors: [],
      compliance: [],
      supplyVoltageRange: [1.0, 5.0],
      tempRange: [-55, 125],
      stockMin: 0,
      leadTimeBands: [],
      moqMax: 100000,
      adoptionRanges: [],
      segments: []
    });
  };

  const getLifecycleBadgeColor = (lifecycle: string) => {
    switch (lifecycle) {
      case 'Active': return 'bg-green-500';
      case 'NRND': return 'bg-yellow-500';
      case 'LTB': return 'bg-orange-500';
      case 'Obsolete': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock > 5000) return 'bg-green-100 text-green-800 border-green-200';
    if (stock > 1000) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const hasActiveFilters = () => {
    return filters.manufacturers.length > 0 ||
           filters.categories.length > 0 ||
           filters.series.length > 0 ||
           filters.packageFamilies.length > 0 ||
           filters.lifecycles.length > 0 ||
           filters.vendors.length > 0 ||
           filters.compliance.length > 0 ||
           filters.supplyVoltageRange[0] !== 1.0 ||
           filters.supplyVoltageRange[1] !== 5.0 ||
           filters.tempRange[0] !== -55 ||
           filters.tempRange[1] !== 125 ||
           filters.stockMin !== 0 ||
           filters.leadTimeBands.length > 0 ||
           filters.moqMax !== 100000;
  };

  const handleComponentClick = (mpn: string) => {
    navigate(`/component/${encodeURIComponent(mpn)}`);
  };

  const renderStateContent = () => {
    switch (searchState) {
      case 'loading':
        return (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Searching components...</p>
              <p className="text-sm text-muted-foreground">Please wait while we find the best matches</p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-red-600">Search failed</p>
              <p className="text-sm text-muted-foreground mb-4">Please try again or refine your search terms</p>
              <Button onClick={() => setSearchState('idle')}>Try Again</Button>
            </div>
          </div>
        );
      case 'no-results':
        return (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try broadening your search or removing some filters
              </p>
              <div className="flex space-x-2 justify-center">
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                )}
                <Button onClick={() => setIsEditingQuery(true)}>
                  Modify Search
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            {filteredComponents.map((component) => (
              <Card 
                key={component.id} 
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                style={{ borderLeftColor: component.lifecycle === 'Active' ? '#10b981' : component.lifecycle === 'NRND' ? '#f59e0b' : component.lifecycle === 'LTB' ? '#f97316' : '#ef4444' }}
                onClick={() => handleComponentClick(component.mpn)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedForCompare.includes(component.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleCompareSelection(component.id);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <code className="text-lg font-bold bg-blue-50 text-blue-900 px-2 py-1 rounded">
                            {component.mpn}
                          </code>
                          <span className="text-sm font-medium text-gray-700">
                            {component.manufacturer}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={component.lifecycle === 'Active' ? 'default' : 
                                      component.lifecycle === 'NRND' ? 'secondary' : 
                                      component.lifecycle === 'LTB' ? 'outline' : 'destructive'}
                              className="text-xs"
                            >
                              {component.lifecycle}
                            </Badge>
                            {component.longevity && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                {component.longevity}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(component.datasheet, '_blank');
                          }}
                          className="shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Meta Line */}
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                        <span>{component.series}</span>
                        <span>•</span>
                        <span>{component.productCategory}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {component.package.name}-{component.package.pins}
                        </span>
                      </div>

                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Key Specs */}
                        <div className="space-y-1">
                          <div className="font-medium text-gray-700 mb-1">Key Specs</div>
                          <div className="space-y-0.5">
                            <div>{component.keySpecs.voltageRange}</div>
                            <div>{component.keySpecs.maxFreq}</div>
                            <div>{component.keySpecs.flash}/{component.keySpecs.ram}</div>
                            <div>{component.keySpecs.tempRange}</div>
                          </div>
                        </div>

                        {/* Supply Snapshot */}
                        <div className="space-y-1">
                          <div className="font-medium text-gray-700 mb-1">Supply Snapshot</div>
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>Lead Time:</span>
                              <span className="font-medium">{component.leadTime}w</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium text-green-600">{component.priceRange}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stock:</span>
                              <Badge className={`${getStockBadgeColor(component.stockSnapshot.total)} text-xs h-4`}>
                                {component.stockSnapshot.total.toLocaleString()}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>MOQ:</span>
                              <span className="font-medium">{component.moq.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Risk/EOL & Actions */}
                        <div className="space-y-1">
                          <div className="font-medium text-gray-700 mb-1">Risk & Actions</div>
                          <div className="space-y-1">
                            {component.eolPrediction && (
                              <div className="flex items-center gap-2">
                                <span>EOL Risk:</span>
                                <Badge variant="destructive" className="text-xs h-4">
                                  {component.eolPrediction}%
                                </Badge>
                              </div>
                            )}
                            {/* Lead time sparkline placeholder */}
                            <div className="flex items-center gap-1">
                              <span>Trend:</span>
                              <div className="flex items-end gap-0.5 h-3">
                                {component.leadTimeSparkline.map((value, index) => (
                                  <div
                                    key={index}
                                    className="w-1 bg-blue-400 rounded-sm"
                                    style={{ height: `${(value / Math.max(...component.leadTimeSparkline)) * 12}px` }}
                                  />
                                ))}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full h-7 text-xs mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle add to RFQ
                              }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to RFQ
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Adoption Block */}
                      {component.adoptionMini && (
                        <div className="mt-3 p-2 bg-gray-50 rounded border">
                          <div className="text-xs font-medium text-gray-600 mb-1">Adoption</div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">Used by ~{component.adoptionMini.companyCount} companies</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant={component.adoptionMini.confidence === 'Verified' ? 'default' : 'secondary'} className="text-xs h-4">
                                      {component.adoptionMini.confidence}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      {component.adoptionMini.confidence === 'Verified' 
                                        ? 'Data verified through direct sources (CRM, BOM uploads, design wins)'
                                        : 'Estimated based on market signals, teardowns, and industry analysis'
                                      }
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1">
                              {component.adoptionMini.notableShort && component.adoptionMini.notableShort.length > 0 && (
                                <>
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-gray-600">Notable: {component.adoptionMini.notableShort.slice(0, 2).join(', ')}</span>
                                </>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {component.adoptionMini.segmentsTop2?.slice(0, 2).map((segment, index) => (
                                <Badge key={index} variant="outline" className="text-xs h-4 bg-blue-50 text-blue-700 border-blue-200">
                                  {segment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Compliance badges */}
                      {component.compliance.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {component.compliance.map((comp, index) => (
                            <Badge key={index} variant="outline" className="text-xs h-4 bg-gray-50">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
    }
  };

  if (!query) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('partfinder.title')}</h2>
              <p className="text-gray-600 mb-4">{t('partfinder.enterPartNumber')}</p>
              <Button onClick={() => navigate('/')}>
                {t('partfinder.backToHome')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span>Search</span>
        <span>/</span>
        <span className="font-medium text-gray-900">{query}</span>
      </div>

      {/* Query Recap & Edit Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="flex items-center space-x-2">
                  {isEditingQuery ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editQuery}
                        onChange={(e) => setEditQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-64"
                        placeholder="Search parts, suppliers, or documents..."
                      />
                      <Button size="sm" onClick={handleSearch}>Search</Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingQuery(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg font-medium">Search results for "</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">{query}</code>
                      <span className="text-lg font-medium">"</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingQuery(true)}
                        className="ml-2"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Search
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchState === 'loading' ? 'Searching...' : `${filteredComponents.length} results found`}
                  {hasActiveFilters() && ` (${mockComponents.length} total before filtering)`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="leadtime-short">Lead Time: Shortest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stock-high">Stock: High to Low</SelectItem>
                    <SelectItem value="compatibility">Compatibility Score</SelectItem>
                    <SelectItem value="eol-risk">EOL Risk: Low to High</SelectItem>
                    <SelectItem value="adoption-desc">Adoption: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Compare Bar */}
      {selectedForCompare.length >= 2 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardContent className="py-3 px-6">
              <div className="flex items-center space-x-4">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedForCompare.length} components selected
                </span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Compare
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedForCompare([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Facets */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
                {hasActiveFilters() && (
                  <Button size="sm" variant="ghost" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Manufacturer Filter */}
              <Collapsible open={!collapsedSections.manufacturer} onOpenChange={() => toggleSection('manufacturer')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Manufacturer
                      {filters.manufacturers.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.manufacturers.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.manufacturer ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {manufacturerOptions.map(manufacturer => (
                    <div key={manufacturer} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mfg-${manufacturer}`}
                        checked={filters.manufacturers.includes(manufacturer)}
                        onCheckedChange={() => toggleFilterValue('manufacturers', manufacturer)}
                      />
                      <label htmlFor={`mfg-${manufacturer}`} className="text-sm cursor-pointer">
                        {manufacturer}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Category Filter */}
              <Collapsible open={!collapsedSections.category} onOpenChange={() => toggleSection('category')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Category
                      {filters.categories.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.categories.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.category ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {categoryOptions.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleFilterValue('categories', category)}
                      />
                      <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Series Filter */}
              <Collapsible open={!collapsedSections.series} onOpenChange={() => toggleSection('series')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Series
                      {filters.series.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.series.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.series ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {seriesOptions.map(series => (
                    <div key={series} className="flex items-center space-x-2">
                      <Checkbox
                        id={`series-${series}`}
                        checked={filters.series.includes(series)}
                        onCheckedChange={() => toggleFilterValue('series', series)}
                      />
                      <label htmlFor={`series-${series}`} className="text-sm cursor-pointer">
                        {series}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Package Family Filter */}
              <Collapsible open={!collapsedSections.package} onOpenChange={() => toggleSection('package')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Package Family
                      {filters.packageFamilies.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.packageFamilies.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.package ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {packageFamilyOptions.map(pkg => (
                    <div key={pkg} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pkg-${pkg}`}
                        checked={filters.packageFamilies.includes(pkg)}
                        onCheckedChange={() => toggleFilterValue('packageFamilies', pkg)}
                      />
                      <label htmlFor={`pkg-${pkg}`} className="text-sm cursor-pointer">
                        {pkg}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Lifecycle Filter */}
              <Collapsible open={!collapsedSections.lifecycle} onOpenChange={() => toggleSection('lifecycle')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Lifecycle
                      {filters.lifecycles.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.lifecycles.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.lifecycle ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {lifecycleOptions.map(lifecycle => (
                    <div key={lifecycle} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lc-${lifecycle}`}
                        checked={filters.lifecycles.includes(lifecycle)}
                        onCheckedChange={() => toggleFilterValue('lifecycles', lifecycle)}
                      />
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getLifecycleBadgeColor(lifecycle)}`} />
                        <label htmlFor={`lc-${lifecycle}`} className="text-sm cursor-pointer">
                          {lifecycle}
                        </label>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Supply Voltage Range */}
              <Collapsible open={!collapsedSections.voltage} onOpenChange={() => toggleSection('voltage')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Supply Voltage
                    </span>
                    {collapsedSections.voltage ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Range: {filters.supplyVoltageRange[0]}V - {filters.supplyVoltageRange[1]}V
                    </label>
                    <Slider
                      value={filters.supplyVoltageRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, supplyVoltageRange: value as [number, number] }))}
                      max={5.0}
                      min={1.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Temperature Range */}
              <Collapsible open={!collapsedSections.temperature} onOpenChange={() => toggleSection('temperature')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Thermometer className="h-4 w-4 mr-2" />
                      Temperature
                    </span>
                    {collapsedSections.temperature ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Range: {filters.tempRange[0]}°C - {filters.tempRange[1]}°C
                    </label>
                    <Slider
                      value={filters.tempRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, tempRange: value as [number, number] }))}
                      max={125}
                      min={-55}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Stock Filter */}
              <Collapsible open={!collapsedSections.stock} onOpenChange={() => toggleSection('stock')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Minimum Stock
                    </span>
                    {collapsedSections.stock ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Min Stock: {filters.stockMin.toLocaleString()}
                    </label>
                    <Slider
                      value={[filters.stockMin]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, stockMin: value[0] }))}
                      max={20000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Vendor Filter */}
              <Collapsible open={!collapsedSections.vendor} onOpenChange={() => toggleSection('vendor')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Vendors
                      {filters.vendors.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.vendors.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.vendor ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {vendorOptions.map(vendor => (
                    <div key={vendor} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vendor-${vendor}`}
                        checked={filters.vendors.includes(vendor)}
                        onCheckedChange={() => toggleFilterValue('vendors', vendor)}
                      />
                      <label htmlFor={`vendor-${vendor}`} className="text-sm cursor-pointer">
                        {vendor}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Lead Time Bands Filter */}
              <Collapsible open={!collapsedSections.leadtime} onOpenChange={() => toggleSection('leadtime')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Lead Time
                      {filters.leadTimeBands.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.leadTimeBands.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.leadtime ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {leadTimeBands.map(band => (
                    <div key={band} className="flex items-center space-x-2">
                      <Checkbox
                        id={`leadtime-${band}`}
                        checked={filters.leadTimeBands.includes(band)}
                        onCheckedChange={() => toggleFilterValue('leadTimeBands', band)}
                      />
                      <label htmlFor={`leadtime-${band}`} className="text-sm cursor-pointer">
                        {band}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* MOQ Filter */}
              <Collapsible open={!collapsedSections.moq} onOpenChange={() => toggleSection('moq')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Max MOQ
                    </span>
                    {collapsedSections.moq ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Max MOQ: {filters.moqMax.toLocaleString()}
                    </label>
                    <Slider
                      value={[filters.moqMax]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, moqMax: value[0] }))}
                      max={100000}
                      min={1}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Compliance Filter */}
              <Collapsible open={!collapsedSections.compliance} onOpenChange={() => toggleSection('compliance')}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">
                      Compliance
                      {filters.compliance.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filters.compliance.length}
                        </Badge>
                      )}
                    </span>
                    {collapsedSections.compliance ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {complianceOptions.map(comp => (
                    <div key={comp} className="flex items-center space-x-2">
                      <Checkbox
                        id={`compliance-${comp}`}
                        checked={filters.compliance.includes(comp)}
                        onCheckedChange={() => toggleFilterValue('compliance', comp)}
                      />
                      <label htmlFor={`compliance-${comp}`} className="text-sm cursor-pointer">
                        {comp}
                      </label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderStateContent()}
        </div>
      </div>
    </div>
  );
}
