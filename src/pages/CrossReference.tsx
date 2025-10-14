import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, ExternalLink, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Info, ArrowLeft, Upload, Filter, Save, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import DataTable from '@/components/DataTable';
import AIPanel from '@/components/AIPanel';
import RiskBadge from '@/components/RiskBadge';
import ReasoningDrawer from '@/components/ReasoningDrawer';
import CompatibilityScore from '@/components/CompatibilityScore';
import CrossReferenceTable from '@/components/CrossReferenceTable';
import { useLanguage } from '@/contexts/LanguageContext';

const mockCrossReferences = [
  {
    id: '1',
    partNumber: 'STM32F407VGT6',
    supplier: 'STMicroelectronics',
    compatibility: 100,
    price: 8.45,
    moq: 1000,
    leadTime: '26 weeks',
    riskLevel: 'high',
    stock: 2500,
    description: 'Original part - direct replacement',
    package: 'LQFP-100',
  },
  {
    id: '2',
    partNumber: 'STM32F405VGT6',
    supplier: 'STMicroelectronics',
    compatibility: 95,
    price: 7.89,
    moq: 1000,
    leadTime: '22 weeks',
    riskLevel: 'medium',
    stock: 5000,
    description: 'Same family, slightly lower performance',
    package: 'LQFP-100',
  },
  {
    id: '3',
    partNumber: 'LPC4088FET208',
    supplier: 'NXP',
    compatibility: 85,
    price: 9.12,
    moq: 2500,
    leadTime: '18 weeks',
    riskLevel: 'medium',
    stock: 3200,
    description: 'ARM Cortex-M4, different peripheral set',
    package: 'LQFP-208',
  },
  {
    id: '4',
    partNumber: 'TM4C1294NCPDT',
    supplier: 'Texas Instruments',
    compatibility: 80,
    price: 7.25,
    moq: 1000,
    leadTime: '16 weeks',
    riskLevel: 'low',
    stock: 8000,
    description: 'Similar performance, different vendor ecosystem',
    package: 'TQFP-128',
  },
  {
    id: '5',
    partNumber: 'SAMV71Q21B',
    supplier: 'Microchip',
    compatibility: 75,
    price: 8.95,
    moq: 1000,
    leadTime: '14 weeks',
    riskLevel: 'low',
    stock: 6500,
    description: 'ARM Cortex-M7, higher performance alternative',
    package: 'BGA-144',
  },
];

export default function CrossReference() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const initialQuery = searchParams.get('q') || 'STM32F407VGT6';
  const fromPage = searchParams.get('from');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('compatibility');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showReasoningDrawer, setShowReasoningDrawer] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<any>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCrossReferenceTable, setShowCrossReferenceTable] = useState(false);

  useEffect(() => {
    console.log('STATE CHANGE - showReasoningDrawer:', showReasoningDrawer);
    console.log('STATE CHANGE - selectedAlternative:', selectedAlternative);
  }, [showReasoningDrawer, selectedAlternative]);

  // Advanced filter states
  const [filters, setFilters] = useState({
    packageMatch: true,
    pinoutMatch: true,
    voltageRange: [1.8, 5.0],
    tempRange: [-40, 125],
    aecQ: false,
    maxMOQ: 10000,
    maxLeadTime: 52,
  });

  const handleComponentClick = (partNumber: string) => {
    navigate(`/component/${encodeURIComponent(partNumber)}`);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = [...mockCrossReferences].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });


  const handleBackToSearch = () => {
    if (fromPage === 'search') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&mode=alt`);
    } else {
      navigate('/');
    }
  };

  const toggleCompare = (partNumber: string) => {
    setCompareList(prev => 
      prev.includes(partNumber) 
        ? prev.filter(p => p !== partNumber)
        : prev.length < 3 ? [...prev, partNumber] : prev
    );
  };

  const handleOpenCrossReference = () => {
    console.log('Opening cross-reference table with parts:', compareList);
    setShowCrossReferenceTable(true);
  };


  const columns = useMemo(() => [
    {
      key: 'compatibility',
      title: t('partfinder.compatibility'),
      sortable: true,
      render: (_value: number) => (
        <div className="flex items-center space-x-2">
                  <CompatibilityScore score={_value} showProgressBar={true} />
                  {_value === 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {_value < 85 && <AlertTriangle className="w-4 h-4 text-orange-500" />}
        </div>
      ),
    },
    {
      key: 'partNumber',
      title: t('partfinder.partNumber'),
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <code 
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-gray-900 dark:text-gray-100"
            onClick={() => handleComponentClick(value)}
          >
            {value}
          </code>
          <p className="text-xs text-gray-500 mt-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'supplier',
      title: t('partfinder.manufacturer'),
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'price',
      title: t('partfinder.price'),
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
      className: 'text-right',
    },
    {
      key: 'moq',
      title: 'MOQ',
      sortable: true,
      render: (value: number) => value.toLocaleString(),
      className: 'text-right',
    },
    {
      key: 'package',
      title: 'Package',
      sortable: true,
    },
    {
      key: 'leadTime',
      title: t('partfinder.leadTime'),
      sortable: true,
    },
    {
      key: 'stock',
      title: t('partfinder.stock'),
      sortable: true,
      render: (value: number) => (
        <Badge variant={value > 5000 ? 'default' : value > 2000 ? 'secondary' : 'destructive'}>
          {value.toLocaleString()}
        </Badge>
      ),
    },
    {
      key: 'riskLevel',
      title: t('partfinder.risk'),
      render: (value: string) => <RiskBadge type={value as any}>{value.toUpperCase()}</RiskBadge>,
    },
    {
      key: 'actions',
      title: t('partfinder.actions'),
      render: (_value: any, row: any) => {
        const buttonText = t('partfinder.showReasoning');
        return (
            <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 1 }}>
              <Checkbox
                checked={compareList.includes(row.partNumber)}
                onCheckedChange={() => toggleCompare(row.partNumber)}
                disabled={!compareList.includes(row.partNumber) && compareList.length >= 3}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('=== BUTTON CLICKED ===');
                  console.log('Language:', language);
                  console.log('Button text:', buttonText);
                  console.log('Row:', row.partNumber);
                  console.log('Current states - showReasoningDrawer:', showReasoningDrawer, 'selectedAlternative:', selectedAlternative);

                  setSelectedAlternative(row);
                  setShowReasoningDrawer(true);

                  console.log('After setting states');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: '90px',
                  height: '32px',
                  userSelect: 'none'
                }}
              >
                <Info style={{ width: '12px', height: '12px', marginRight: '0.25rem', flexShrink: 0 }} />
                <span>{buttonText}</span>
              </button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
        );
      },
    },
  ], [t, language, compareList, toggleCompare, showReasoningDrawer, selectedAlternative]);

  return (
    <div className="max-w-full space-y-6">
      {/* Breadcrumb */}
      {fromPage && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button onClick={handleBackToSearch} className="hover:text-blue-600">
            {fromPage === 'search' ? 'Search Results' : 'Home'}
          </button>
          <span>/</span>
          <span className="font-medium">Part Finder (Advanced)</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{t('partfinder.title')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('partfinder.subtitle')}
          </p>
        </div>

        {/* Search Section - Now at top */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{t('partfinder.searchFilters')}</span>
              <div className="flex items-center space-x-2">
                {fromPage && (
                  <Button variant="outline" size="sm" onClick={handleBackToSearch}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {fromPage === 'search' ? t('partfinder.backToSearch') : t('partfinder.backToHome')}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('partfinder.enterPartNumber')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Button className="w-full">{t('partfinder.searchAlternatives')}</Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('partfinder.uploadBOM')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOM Upload Modal */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('partfinder.bomBatch')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors border-border hover:border-muted-foreground">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('partfinder.uploadBOMBatch')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('partfinder.advancedFilters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">{t('partfinder.compatibility')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="packageMatch" 
                      checked={filters.packageMatch}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, packageMatch: !!checked }))}
                    />
                    <label htmlFor="packageMatch" className="text-sm">{t('partfinder.packageFootprint')}</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pinoutMatch" 
                      checked={filters.pinoutMatch}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, pinoutMatch: !!checked }))}
                    />
                    <label htmlFor="pinoutMatch" className="text-sm">{t('partfinder.pinoutCompatible')}</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aecQ" 
                      checked={filters.aecQ}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, aecQ: !!checked }))}
                    />
                    <label htmlFor="aecQ" className="text-sm">{t('partfinder.aecQualified')}</label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">{t('partfinder.electricalRanges')}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">{t('partfinder.voltageRange')}</label>
                    <Slider
                      value={filters.voltageRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, voltageRange: value }))}
                      max={12}
                      min={0.8}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{filters.voltageRange[0]}V</span>
                      <span>{filters.voltageRange[1]}V</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t('partfinder.temperatureRange')}</label>
                    <Slider
                      value={filters.tempRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, tempRange: value }))}
                      max={150}
                      min={-55}
                      step={5}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{filters.tempRange[0]}°C</span>
                      <span>{filters.tempRange[1]}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">{t('partfinder.supplyChain')}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">{t('partfinder.maxMOQ')}</label>
                    <Select value={filters.maxMOQ.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, maxMOQ: parseInt(value) }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1,000</SelectItem>
                        <SelectItem value="5000">5,000</SelectItem>
                        <SelectItem value="10000">10,000</SelectItem>
                        <SelectItem value="25000">25,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t('partfinder.maxLeadTime')}</label>
                    <Select value={filters.maxLeadTime.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, maxLeadTime: parseInt(value) }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 weeks</SelectItem>
                        <SelectItem value="26">26 weeks</SelectItem>
                        <SelectItem value="52">52 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">{t('partfinder.presetsActions')}</h3>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('partfinder.loadPreset')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automotive">{t('partfinder.automotiveGrade')}</SelectItem>
                      <SelectItem value="industrial">{t('partfinder.industrialTemp')}</SelectItem>
                      <SelectItem value="consumer">{t('partfinder.consumerElectronics')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Save className="w-4 h-4 mr-1" />
                      {t('partfinder.save')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      {t('partfinder.export')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sticky Actions Bar */}
      <Card className="sticky top-4 z-10 bg-background/95 backdrop-blur">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {mockCrossReferences.length} {t('partfinder.alternativesFound')}
              </span>
              {compareList.length > 0 && (
                <Badge variant="secondary">
                  {compareList.length} {t('partfinder.selectedForComparison')}
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              {compareList.length > 1 && (
                <Button variant="outline" size="sm">
                  {t('partfinder.compareSelected')} ({compareList.length})
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('partfinder.exportResults')}
              </Button>
              <Button size="sm">
                {t('partfinder.addSelectedToBOM')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('partfinder.foundAlternatives')} <span className="font-semibold">{mockCrossReferences.length} {t('partfinder.alternativesFound')}</span> {t('partfinder.alternativesFor')}{' '}
                <code className="bg-muted px-2 py-1 rounded">{searchQuery}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Reference Table */}
      <DataTable
        key={`datatable-${language}`}
        columns={columns}
        data={sortedData}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Side-by-side Comparison Modal */}
      {compareList.length > 1 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('partfinder.comparison')} ({compareList.length}/3)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-3">
                {compareList.map((partNumber, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <code className="bg-muted px-2 py-1 rounded">{partNumber}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCompare(partNumber)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="sm" onClick={handleOpenCrossReference}>
                {t('partfinder.compareSelectedParts')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cross-Reference Table Modal */}
      {showCrossReferenceTable && (
        <CrossReferenceTable
          originalComponent={{
            partNumber: searchQuery,
            manufacturer: 'STMicroelectronics',
            specs: {
              package: { value: 'LQFP-100', status: 'match' },
              pinCount: { value: '100', status: 'match' },
              pinAssignment: { value: 'STM32 Standard', status: 'match', tooltip: 'Standard STM32 pinout configuration' },
              voltage: { value: '1.8V-3.6V', status: 'match' },
              frequency: { value: '168MHz', status: 'match' },
              memory: { value: '1MB Flash, 192KB RAM', status: 'match' },
            }
          }}
          alternatives={compareList.map(partNumber => {
            const component = mockCrossReferences.find(c => c.partNumber === partNumber);
            const compatibility = component?.compatibility || 0;

            // Determine pin assignment compatibility
            let pinAssignmentStatus: 'match' | 'partial' | 'mismatch' = 'match';
            let pinAssignmentValue = 'Pin Compatible';
            let pinAssignmentTooltip = 'Pins are fully compatible with original part';

            if (partNumber.startsWith('LPC')) {
              pinAssignmentStatus = 'mismatch';
              pinAssignmentValue = 'Different Pinout';
              pinAssignmentTooltip = 'Requires PCB redesign - different pin mapping';
            } else if (partNumber.startsWith('TM4C')) {
              pinAssignmentStatus = 'partial';
              pinAssignmentValue = 'Mostly Compatible';
              pinAssignmentTooltip = 'Most pins compatible, some alternate functions differ';
            } else if (partNumber.startsWith('STM32F405')) {
              pinAssignmentStatus = 'match';
              pinAssignmentValue = 'STM32 Compatible';
              pinAssignmentTooltip = 'Drop-in replacement with identical pinout';
            }

            return {
              partNumber,
              manufacturer: component?.supplier || 'Unknown',
              specs: {
                package: { value: component?.package || 'Unknown', status: (component?.compatibility ?? 0) >= 95 ? 'match' : (component?.compatibility ?? 0) >= 85 ? 'partial' : 'mismatch' },
                pinCount: { value: '100', status: 'match' },
                pinAssignment: { value: pinAssignmentValue, status: pinAssignmentStatus, tooltip: pinAssignmentTooltip },
                voltage: { value: '1.8V-3.6V', status: compatibility >= 90 ? 'match' : 'partial' },
                frequency: { value: '168MHz', status: compatibility >= 85 ? 'match' : 'partial' },
                memory: { value: '1MB Flash, 192KB RAM', status: compatibility >= 80 ? 'match' : 'partial' },
              }
            };
          })}
          onClose={() => setShowCrossReferenceTable(false)}
          onAddToBOM={(partNumber) => {
            console.log(`Adding ${partNumber} to BOM`);
          }}
          onExplainDifferences={(partNumbers) => {
            console.log(`Explaining differences for: ${partNumbers.join(', ')}`);
          }}
        />
      )}

      {/* Reasoning Drawer */}
      {(() => {
        console.log('Rendering check - selectedAlternative:', selectedAlternative);
        console.log('Rendering check - showReasoningDrawer:', showReasoningDrawer);
        return selectedAlternative && (
          <ReasoningDrawer
            isOpen={showReasoningDrawer}
            onClose={() => {
              console.log('Closing drawer');
              setShowReasoningDrawer(false);
            }}
            altPart={{
              partNumber: selectedAlternative.partNumber,
              manufacturer: selectedAlternative.supplier,
              keySpecs: {},
              interfaces: ['SPI', 'I2C', 'UART', 'USB OTG'],
              package: { type: selectedAlternative.package, pitch: '0.5mm' },
              lifecycle: { status: 'Active' },
              compliance: ['RoHS'],
              price: selectedAlternative.price,
              leadTime: selectedAlternative.leadTime,
              stock: selectedAlternative.stock
            }}
            compatibility={selectedAlternative.compatibility}
            fitType={selectedAlternative.type || 'Drop-in'}
          />
        );
      })()}

      {/* AI Panel */}
      <div className="fixed bottom-4 right-4">
        <AIPanel 
          isOpen={showAIPanel} 
          onClose={() => setShowAIPanel(false)}
          context={`Cross-reference analysis for ${searchQuery}`}
        />
      </div>
    </div>
  );
}
