import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Download, Plus, MessageCircle, ChevronDown, ChevronRight, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleX as XCircle, CircleHelp as HelpCircle, Building2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Component {
  partNumber: string;
  manufacturer: string;
  logo?: string;
  specs: Record<string, {
    value: string;
    status: 'match' | 'partial' | 'mismatch' | 'unknown';
    tooltip?: string;
    datasheetRef?: string;
  }>;
}

interface SpecCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  specs: Array<{
    key: string;
    label: string;
    unit?: string;
    description?: string;
  }>;
}

interface CrossReferenceTableProps {
  originalComponent: Component;
  alternatives: Component[];
  onClose: () => void;
  onAddToBOM?: (partNumber: string) => void;
  onExplainDifferences?: (partNumbers: string[]) => void;
  className?: string;
}

const specCategories: SpecCategory[] = [
  {
    name: 'Package & Mechanical',
    icon: Package,
    specs: [
      { key: 'package', label: 'Package', description: 'Physical package type and dimensions' },
      { key: 'pinCount', label: 'Pin Count', description: 'Total number of pins/balls' },
      { key: 'pinAssignment', label: 'Pin Assignment / Pin Mapping', description: 'Pin-to-pin mapping and signal assignment compatibility' },
      { key: 'pitch', label: 'Pitch', unit: 'mm', description: 'Pin-to-pin spacing' },
      { key: 'dimensions', label: 'Dimensions', unit: 'mm', description: 'Package length × width × height' },
    ]
  },
  {
    name: 'Electrical Characteristics',
    icon: Building2,
    specs: [
      { key: 'voltage', label: 'Supply Voltage', unit: 'V', description: 'Operating voltage range' },
      { key: 'current', label: 'Supply Current', unit: 'mA', description: 'Typical operating current' },
      { key: 'power', label: 'Power Consumption', unit: 'mW', description: 'Maximum power dissipation' },
      { key: 'frequency', label: 'Max Frequency', unit: 'MHz', description: 'Maximum operating frequency' },
    ]
  },
  {
    name: 'Memory & Performance',
    icon: Building2,
    specs: [
      { key: 'flashMemory', label: 'Flash Memory', unit: 'KB', description: 'Program memory capacity' },
      { key: 'ramMemory', label: 'RAM Memory', unit: 'KB', description: 'Data memory capacity' },
      { key: 'eeprom', label: 'EEPROM', unit: 'KB', description: 'Non-volatile data memory' },
      { key: 'coreType', label: 'Core Type', description: 'Processor core architecture' },
    ]
  },
];

const mockOriginalComponent: Component = {
  partNumber: 'STM32F103C8T6',
  manufacturer: 'STMicroelectronics',
  specs: {
    package: { value: 'LQFP-48', status: 'match', tooltip: 'Standard LQFP package' },
    pinCount: { value: '48', status: 'match' },
    pitch: { value: '0.5', status: 'match' },
    dimensions: { value: '7×7×1.4', status: 'match' },
    voltage: { value: '2.0-3.6', status: 'match', tooltip: 'Wide voltage range for flexibility' },
    current: { value: '36', status: 'match' },
    power: { value: '130', status: 'match' },
    frequency: { value: '72', status: 'match' },
    flashMemory: { value: '64', status: 'match' },
    ramMemory: { value: '20', status: 'match' },
    eeprom: { value: 'None', status: 'match' },
    coreType: { value: 'ARM Cortex-M3', status: 'match' },
  }
};

const mockAlternatives: Component[] = [
  {
    partNumber: 'STM32F103CBT6',
    manufacturer: 'STMicroelectronics',
    specs: {
      package: { value: 'LQFP-48', status: 'match' },
      pinCount: { value: '48', status: 'match' },
      pitch: { value: '0.5', status: 'match' },
      dimensions: { value: '7×7×1.4', status: 'match' },
      voltage: { value: '2.0-3.6', status: 'match' },
      current: { value: '36', status: 'match' },
      power: { value: '130', status: 'match' },
      frequency: { value: '72', status: 'match' },
      flashMemory: { value: '128', status: 'partial', tooltip: 'Double flash memory - upgrade path' },
      ramMemory: { value: '20', status: 'match' },
      eeprom: { value: 'None', status: 'match' },
      coreType: { value: 'ARM Cortex-M3', status: 'match' },
    }
  },
  {
    partNumber: 'GD32F103C8T6',
    manufacturer: 'GigaDevice',
    specs: {
      package: { value: 'LQFP-48', status: 'match' },
      pinCount: { value: '48', status: 'match' },
      pinAssignment: { value: 'GD32 Compatible', status: 'partial', tooltip: 'Pin-compatible with minor differences in alternate functions' },
      pitch: { value: '0.5', status: 'match' },
      dimensions: { value: '7×7×1.4', status: 'match' },
      voltage: { value: '2.6-3.6', status: 'partial', tooltip: 'Narrower voltage range - check power supply' },
      current: { value: '32', status: 'match', tooltip: 'Slightly lower current consumption' },
      power: { value: '115', status: 'match' },
      frequency: { value: '108', status: 'partial', tooltip: 'Higher performance - may need clock adjustment' },
      flashMemory: { value: '64', status: 'match' },
      ramMemory: { value: '20', status: 'match' },
      eeprom: { value: 'None', status: 'match' },
      coreType: { value: 'ARM Cortex-M3', status: 'match' },
    }
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'match': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case 'mismatch': return <XCircle className="w-4 h-4 text-red-600" />;
    case 'unknown': return <HelpCircle className="w-4 h-4 text-gray-400" />;
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'match': return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    case 'partial': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
    case 'mismatch': return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
    case 'unknown': return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800';
    default: return '';
  }
};

export default function CrossReferenceTable({
  originalComponent = mockOriginalComponent,
  alternatives = mockAlternatives,
  onClose,
  onAddToBOM,
  onExplainDifferences,
  className
}: CrossReferenceTableProps) {
  const { t } = useLanguage();
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Package & Mechanical': true,
    'Electrical Characteristics': true,
    'Memory & Performance': false,
  });
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>([]);

  const allComponents = [originalComponent, ...alternatives];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const toggleAlternativeSelection = (partNumber: string) => {
    setSelectedAlternatives(prev =>
      prev.includes(partNumber)
        ? prev.filter(p => p !== partNumber)
        : [...prev, partNumber]
    );
  };

  const shouldShowSpec = (specKey: string) => {
    if (!showOnlyDifferences) return true;
    
    // Check if any component has a different value for this spec
    const originalValue = originalComponent.specs[specKey]?.value;
    return alternatives.some(alt => alt.specs[specKey]?.value !== originalValue);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting cross-reference table as ${format}`);
    // In a real app, this would generate and download the file
  };

  const handleExplainDifferences = () => {
    const partNumbers = [originalComponent.partNumber, ...alternatives.map(alt => alt.partNumber)];
    onExplainDifferences?.(partNumbers);
  };

  const getCategoryName = (categoryName: string) => {
    const categoryMap: Record<string, string> = {
      'Package & Mechanical': t('crossRef.packageMechanical'),
      'Electrical Characteristics': t('crossRef.electricalCharacteristics'),
      'Memory & Performance': t('crossRef.memoryPerformance'),
      'Interfaces & Peripherals': t('crossRef.interfacesPeripherals'),
      'Environmental': t('crossRef.environmental'),
      'Supply & Cost': t('crossRef.supplyCost'),
      'Lifecycle & Supply': t('crossRef.lifecycleSupply'),
    };
    return categoryMap[categoryName] || categoryName;
  };

  return (
    <TooltipProvider>
      <div className={cn('fixed inset-0 z-50 bg-black/50', className)}>
        <div className="fixed inset-4 bg-background rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-background border-b p-6 z-20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{t('crossRef.title')}</h2>
                <p className="text-muted-foreground">
                  {t('crossRef.subtitle', { count: allComponents.length })}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Component Headers */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="font-medium text-sm text-muted-foreground">{t('crossRef.specification')}</div>
              {allComponents.map((component, index) => (
                <div key={component.partNumber} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {component.manufacturer.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <Badge variant={index === 0 ? 'default' : 'outline'} className="text-xs">
                        {index === 0 ? t('crossRef.original') : `${t('crossRef.alternative')} ${index}`}
                      </Badge>
                    </div>
                  </div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {component.partNumber}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    {component.manufacturer}
                  </p>
                  {index > 0 && (
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        checked={selectedAlternatives.includes(component.partNumber)}
                        onChange={() => toggleAlternativeSelection(component.partNumber)}
                        className="mr-1"
                      />
                      <span className="text-xs">Select</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-differences"
                    checked={showOnlyDifferences}
                    onCheckedChange={setShowOnlyDifferences}
                  />
                  <label htmlFor="show-differences" className="text-sm font-medium">
                    {t('crossRef.showOnlyDifferences')}
                  </label>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>{t('crossRef.match')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span>{t('crossRef.partial')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span>{t('crossRef.mismatch')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedAlternatives.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedAlternatives.forEach(part => onAddToBOM?.(part))}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('crossRef.addSelectedToBOM')} ({selectedAlternatives.length})
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('crossRef.exportExcel')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('crossRef.exportPDF')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExplainDifferences}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('crossRef.explainDifferences')}
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {specCategories.map((category) => {
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategories[category.name];
                
                return (
                  <Card key={category.name}>
                    <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.name)}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardTitle className="text-base flex items-center space-x-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <CategoryIcon className="w-4 h-4" />
                            <span>{getCategoryName(category.name)}</span>
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/5">{t('crossRef.specification')}</TableHead>
                                {allComponents.map((component, index) => (
                                  <TableHead key={component.partNumber} className="text-left">
                                    {index === 0 ? t('crossRef.original') : `${t('crossRef.alternative')} ${index}`}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {category.specs
                                .filter(spec => shouldShowSpec(spec.key))
                                .map((spec) => (
                                <TableRow key={spec.key}>
                                  <TableCell className="font-medium">
                                    <div>
                                      <span>{spec.label}</span>
                                      {spec.unit && (
                                        <span className="text-muted-foreground ml-1">({spec.unit})</span>
                                      )}
                                      {spec.description && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <HelpCircle className="w-3 h-3 text-muted-foreground ml-1 inline cursor-help" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="max-w-xs">{spec.description}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </TableCell>
                                  {allComponents.map((component) => {
                                    const specData = component.specs[spec.key];
                                    if (!specData) {
                                      return (
                                        <TableCell key={component.partNumber} className="text-left">
                                          <span className="text-muted-foreground">—</span>
                                        </TableCell>
                                      );
                                    }
                                    
                                    return (
                                      <TableCell key={component.partNumber} className="text-left">
                                        <div className={cn(
                                          'inline-flex items-center space-x-2 px-3 py-1 rounded-md border',
                                          getStatusColor(specData.status)
                                        )}>
                                          {getStatusIcon(specData.status)}
                                          <span className="font-medium">{specData.value}</span>
                                          {specData.tooltip && (
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <HelpCircle className="w-3 h-3 cursor-help" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p className="max-w-xs">{specData.tooltip}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          )}
                                        </div>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
              
              {/* Price Disclaimer */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{t('crossRef.priceDisclaimer')}</p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                      {t('crossRef.priceDisclaimerText')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}