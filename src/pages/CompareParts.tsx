import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeftRight, FileDown, Star, AlertTriangle, Clock, Shield, Zap, Package2, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RiskBadge from '@/components/RiskBadge';
import { useLanguage } from '@/contexts/LanguageContext';

interface Component {
  mpn: string;
  manufacturer: string;
  description: string;
  category: string;
  lifecycle: 'Active' | 'NRND' | 'Obsolete';
  package: string;
  leadTime: number;
  price: number;
  stock: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  specs: {
    [category: string]: {
      [key: string]: string | number;
    };
  };
  compliance: {
    rohs: boolean;
    reach: boolean;
    conflict: boolean;
  };
  longevity: {
    expectedEol: string;
    replacementStatus: string;
    supportYears: number;
  };
}

const mockComponents: Component[] = [
  {
    mpn: 'STM32F407VGT6',
    manufacturer: 'STMicroelectronics',
    description: '32-bit ARM Cortex-M4 MCU with FPU, 1MB Flash, 192KB RAM',
    category: 'Microcontrollers',
    lifecycle: 'Active',
    package: 'LQFP-100',
    leadTime: 12,
    price: 8.45,
    stock: 15420,
    risk: 'Low',
    specs: {
      'Core': {
        'Architecture': 'ARM Cortex-M4',
        'Clock Speed': '168 MHz',
        'Cores': 1
      },
      'Memory': {
        'Flash': '1024 KB',
        'SRAM': '192 KB',
        'EEPROM': '0 KB'
      },
      'I/O': {
        'GPIO Pins': 82,
        'ADC Channels': 16,
        'PWM Channels': 14
      },
      'Power': {
        'Supply Voltage': '1.8V - 3.6V',
        'Power Consumption': '50 mA',
        'Sleep Current': '1.7 µA'
      }
    },
    compliance: {
      rohs: true,
      reach: true,
      conflict: false
    },
    longevity: {
      expectedEol: '2030+',
      replacementStatus: 'No replacement needed',
      supportYears: 15
    }
  },
  {
    mpn: 'ESP32-WROOM-32',
    manufacturer: 'Espressif Systems',
    description: 'Wi-Fi & Bluetooth combo module with ESP32 SoC',
    category: 'Wireless Modules',
    lifecycle: 'Active',
    package: 'Module',
    leadTime: 8,
    price: 3.25,
    stock: 28740,
    risk: 'Low',
    specs: {
      'Core': {
        'Architecture': 'Xtensa LX6',
        'Clock Speed': '240 MHz',
        'Cores': 2
      },
      'Memory': {
        'Flash': '4096 KB',
        'SRAM': '520 KB',
        'EEPROM': '0 KB'
      },
      'I/O': {
        'GPIO Pins': 34,
        'ADC Channels': 18,
        'PWM Channels': 16
      },
      'Power': {
        'Supply Voltage': '3.0V - 3.6V',
        'Power Consumption': '80 mA',
        'Sleep Current': '5 µA'
      }
    },
    compliance: {
      rohs: true,
      reach: true,
      conflict: false
    },
    longevity: {
      expectedEol: '2028+',
      replacementStatus: 'ESP32-S3 available',
      supportYears: 10
    }
  }
];

export default function CompareParts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedParts, setSelectedParts] = useState<Component[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableParts] = useState<Component[]>(mockComponents);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const parts = searchParams.get('parts');
    if (parts) {
      const partMpns = parts.split(',');
      const components = mockComponents.filter(comp => partMpns.includes(comp.mpn));
      setSelectedParts(components);
    }
  }, [searchParams]);

  const addPart = (part: Component) => {
    if (selectedParts.length >= 4) return;
    if (selectedParts.find(p => p.mpn === part.mpn)) return;
    
    const newParts = [...selectedParts, part];
    setSelectedParts(newParts);
    setSearchParams({ parts: newParts.map(p => p.mpn).join(',') });
    setSearchQuery('');
  };

  const removePart = (mpn: string) => {
    const newParts = selectedParts.filter(p => p.mpn !== mpn);
    setSelectedParts(newParts);
    if (newParts.length > 0) {
      setSearchParams({ parts: newParts.map(p => p.mpn).join(',') });
    } else {
      setSearchParams({});
    }
  };

  const swapParts = (index1: number, index2: number) => {
    const newParts = [...selectedParts];
    [newParts[index1], newParts[index2]] = [newParts[index2], newParts[index1]];
    setSelectedParts(newParts);
    setSearchParams({ parts: newParts.map(p => p.mpn).join(',') });
  };

  const setPrimary = (mpn: string) => {
    const primaryPart = selectedParts.find(p => p.mpn === mpn);
    if (primaryPart) {
      const otherParts = selectedParts.filter(p => p.mpn !== mpn);
      const newParts = [primaryPart, ...otherParts];
      setSelectedParts(newParts);
      setSearchParams({ parts: newParts.map(p => p.mpn).join(',') });
    }
  };

  const exportComparison = (format: 'csv' | 'pdf') => {
    // Implementation for export functionality
    console.log(`Exporting comparison as ${format}`);
  };

  const getVerdictAnalysis = () => {
    if (selectedParts.length < 2) return null;
    
    return {
      better_leadtime: selectedParts.reduce((best, part) => 
        part.leadTime < best.leadTime ? part : best
      ),
      better_longevity: selectedParts.reduce((best, part) => 
        part.longevity.supportYears > best.longevity.supportYears ? part : best
      ),
      better_price: selectedParts.reduce((best, part) => 
        part.price < best.price ? part : best
      ),
      lowest_risk: selectedParts.reduce((best, part) => {
        const riskOrder = { 'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3 };
        return riskOrder[part.risk] < riskOrder[best.risk] ? part : best;
      })
    };
  };

  const verdict = getVerdictAnalysis();

  const getHighlightClass = (value: any, values: any[]) => {
    if (typeof value === 'number') {
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (value === min) return 'bg-green-50 border-green-200';
      if (value === max) return 'bg-red-50 border-red-200';
    }
    return '';
  };

  const filteredParts = availableParts.filter(part =>
    !selectedParts.find(sp => sp.mpn === part.mpn) &&
    (part.mpn.toLowerCase().includes(searchQuery.toLowerCase()) ||
     part.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
     part.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('compareParts.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('compareParts.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => exportComparison('csv')}>
            <FileDown className="w-4 h-4 mr-2" />
            {t('compareParts.exportCSV')}
          </Button>
          <Button variant="outline" onClick={() => exportComparison('pdf')}>
            <FileDown className="w-4 h-4 mr-2" />
            {t('compareParts.exportPDF')}
          </Button>
        </div>
      </div>

      {/* Selected Parts Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('compareParts.selectedParts')} ({selectedParts.length}/4)</span>
            {selectedParts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedParts([]);
                  setSearchParams({});
                }}
              >
                {t('compareParts.clearAll')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedParts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p>{t('compareParts.noPartsSelected')}</p>
              <p className="text-sm">{t('compareParts.searchAndAdd')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedParts.map((part, index) => (
                <div key={part.mpn} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{part.mpn}</h3>
                      <p className="text-xs text-muted-foreground">{part.manufacturer}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <Star className="w-3 h-3 mr-1" />
                          {t('compareParts.primary')}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePart(part.mpn)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{part.description}</p>
                  <div className="flex items-center justify-between">
                    <RiskBadge type={part.risk.toLowerCase() as 'low' | 'medium' | 'high' | 'critical'}>
                      {part.risk}
                    </RiskBadge>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrimary(part.mpn)}
                        className="h-6 px-2 text-xs"
                        disabled={index === 0}
                      >
                        {t('compareParts.setPrimary')}
                      </Button>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => swapParts(0, index)}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Parts Search */}
      {selectedParts.length < 4 && (
        <Card>
          <CardHeader>
          <CardTitle>{t('compareParts.addPartsToCompare')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('compareParts.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredParts.slice(0, 10).map(part => (
                    <div key={part.mpn} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{part.mpn}</h4>
                        <p className="text-xs text-muted-foreground">{part.manufacturer}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{part.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPart(part)}
                      >
                        {t('compareParts.add')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Verdict */}
      {verdict && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Zap className="w-5 h-5 mr-2" />
              {t('compareParts.aiAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="text-sm">
              <strong>{verdict.better_leadtime.mpn}</strong> {t('compareParts.analysis.betterLeadTime')} ({verdict.better_leadtime.leadTime} {t('compareParts.values.weeks')}), 
              <strong> {verdict.better_longevity.mpn}</strong> {t('compareParts.analysis.longestSupport')} ({verdict.better_longevity.longevity.supportYears} {t('compareParts.values.years')}), 
              <strong> {verdict.better_price.mpn}</strong> {t('compareParts.analysis.mostCostEffective')} (${verdict.better_price.price}), and 
              <strong> {verdict.lowest_risk.mpn}</strong> {t('compareParts.analysis.lowestRisk')}.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comparison Tabs */}
      {selectedParts.length >= 2 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t('compareParts.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="package">{t('compareParts.tabs.package')}</TabsTrigger>
            <TabsTrigger value="specs">{t('compareParts.tabs.specifications')}</TabsTrigger>
            <TabsTrigger value="supply">{t('compareParts.tabs.supply')}</TabsTrigger>
            <TabsTrigger value="compliance">{t('compareParts.tabs.compliance')}</TabsTrigger>
            <TabsTrigger value="longevity">{t('compareParts.tabs.longevity')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('compareParts.headers.property')}</TableHead>
                      {selectedParts.map(part => (
                        <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.manufacturer')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">{part.manufacturer}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.description')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center text-sm">{part.description}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.category')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">{part.category}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.lifecycle')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          <Badge variant={part.lifecycle === 'Active' ? 'default' : 'destructive'}>
                            {t(`compareParts.values.${part.lifecycle.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.riskLevel')}</TableCell>
                      {selectedParts.map(part => (
                      <TableCell key={part.mpn} className="text-center">
                          <RiskBadge type={part.risk.toLowerCase() as 'low' | 'medium' | 'high' | 'critical'}>
                            {part.risk}
                          </RiskBadge>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="package" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('compareParts.headers.property')}</TableHead>
                      {selectedParts.map(part => (
                        <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.packageType')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">{part.package}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4">
            {Object.keys(selectedParts[0]?.specs || {}).map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('compareParts.headers.specification')}</TableHead>
                        {selectedParts.map(part => (
                          <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.keys(selectedParts[0]?.specs[category] || {}).map(spec => (
                        <TableRow key={spec}>
                          <TableCell className="font-medium">{spec}</TableCell>
                          {selectedParts.map(part => (
                            <TableCell key={part.mpn} className="text-center">
                              {part.specs[category]?.[spec] || 'N/A'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="supply" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('compareParts.headers.property')}</TableHead>
                      {selectedParts.map(part => (
                        <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.leadTime')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell 
                          key={part.mpn} 
                          className={`text-center ${getHighlightClass(part.leadTime, selectedParts.map(p => p.leadTime))}`}
                        >
                          {part.leadTime} {t('compareParts.values.weeks')}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.price')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell 
                          key={part.mpn} 
                          className={`text-center ${getHighlightClass(part.price, selectedParts.map(p => p.price))}`}
                        >
                          ${part.price}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.stock')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          {part.stock.toLocaleString()}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('compareParts.tabs.compliance')}</TableHead>
                      {selectedParts.map(part => (
                        <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.rohs')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          <Badge variant={part.compliance.rohs ? 'default' : 'destructive'}>
                            {part.compliance.rohs ? t('compareParts.values.yes') : t('compareParts.values.no')}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.reach')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          <Badge variant={part.compliance.reach ? 'default' : 'destructive'}>
                            {part.compliance.reach ? t('compareParts.values.yes') : t('compareParts.values.no')}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.conflictFree')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          <Badge variant={!part.compliance.conflict ? 'default' : 'destructive'}>
                            {!part.compliance.conflict ? t('compareParts.values.yes') : t('compareParts.values.no')}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="longevity" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('compareParts.headers.property')}</TableHead>
                      {selectedParts.map(part => (
                        <TableHead key={part.mpn} className="text-center">{part.mpn}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.expectedEol')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          {part.longevity.expectedEol}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.supportYears')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell 
                          key={part.mpn} 
                          className={`text-center ${getHighlightClass(part.longevity.supportYears, selectedParts.map(p => p.longevity.supportYears))}`}
                        >
                          {part.longevity.supportYears} {t('compareParts.values.years')}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('compareParts.headers.replacementStatus')}</TableCell>
                      {selectedParts.map(part => (
                        <TableCell key={part.mpn} className="text-center">
                          {part.longevity.replacementStatus}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
