import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Calculator, Download, ChartBar as BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TCOCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  originalComponent: any;
  alternatives: any[];
}

interface TCOInputs {
  qtyPerBuild: number;
  buildsPerYear: number;
  scrapPercent: number;
  shippingCost: number;
  leadTimeBufferDays: number;
  inventoryCarryingCost: number;
}

interface TCOResult {
  partNumber: string;
  unitPrice: number;
  effectiveUnitCost: number;
  annualCost: number;
  annualCostDelta: number;
  breakdown: {
    materialCost: number;
    scrapCost: number;
    shippingCost: number;
    inventoryCost: number;
    moqPenalty: number;
  };
}

export default function TCOCalculator({ isOpen, onClose, originalComponent, alternatives }: TCOCalculatorProps) {
  const [inputs, setInputs] = useState<TCOInputs>({
    qtyPerBuild: 100,
    buildsPerYear: 12,
    scrapPercent: 2,
    shippingCost: 50,
    leadTimeBufferDays: 30,
    inventoryCarryingCost: 0.15
  });

  const [activeTab, setActiveTab] = useState('calculator');

  if (!isOpen) return null;

  const calculateTCO = (component: any): TCOResult => {
    const annualQty = inputs.qtyPerBuild * inputs.buildsPerYear;
    const unitPrice = component.pricing?.avg || component.price || 0;
    
    // Material cost
    const materialCost = unitPrice * annualQty;
    
    // Scrap cost
    const scrapCost = materialCost * (inputs.scrapPercent / 100);
    
    // Shipping cost (allocated per unit)
    const shippingCostPerUnit = inputs.shippingCost / inputs.qtyPerBuild;
    const totalShippingCost = shippingCostPerUnit * annualQty;
    
    // Inventory carrying cost
    const avgInventoryValue = (unitPrice * inputs.qtyPerBuild * inputs.leadTimeBufferDays) / 365;
    const inventoryCost = avgInventoryValue * inputs.inventoryCarryingCost;
    
    // MOQ penalty (if MOQ > qty per build)
    const moq = component.moq || 0;
    const moqPenalty = moq > inputs.qtyPerBuild ? 
      (unitPrice * (moq - inputs.qtyPerBuild) * inputs.inventoryCarryingCost) : 0;
    
    const totalAnnualCost = materialCost + scrapCost + totalShippingCost + inventoryCost + moqPenalty;
    const effectiveUnitCost = totalAnnualCost / annualQty;
    
    return {
      partNumber: component.partNumber,
      unitPrice,
      effectiveUnitCost,
      annualCost: totalAnnualCost,
      annualCostDelta: 0, // Will be calculated relative to original
      breakdown: {
        materialCost,
        scrapCost,
        shippingCost: totalShippingCost,
        inventoryCost,
        moqPenalty
      }
    };
  };

  const originalTCO = calculateTCO(originalComponent);
  const alternativeTCOs = alternatives.map(alt => {
    const tco = calculateTCO(alt);
    return {
      ...tco,
      annualCostDelta: tco.annualCost - originalTCO.annualCost
    };
  });

  const allTCOs = [{ ...originalTCO, annualCostDelta: 0 }, ...alternativeTCOs];

  const chartData = allTCOs.map(tco => ({
    name: tco.partNumber,
    'Unit Price': tco.unitPrice,
    'Effective Unit Cost': tco.effectiveUnitCost,
    'Annual Cost': tco.annualCost / 1000, // Convert to thousands
    'Cost Delta': tco.annualCostDelta / 1000
  }));

  const updateInput = (field: keyof TCOInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-4 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <span>Total Cost of Ownership Calculator</span>
              </h2>
              <p className="text-gray-600 mt-1">
                Compare true costs including MOQ, shipping, inventory, and operational factors
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">TCO Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qtyPerBuild">Qty per Build</Label>
                        <Input
                          id="qtyPerBuild"
                          type="number"
                          value={inputs.qtyPerBuild}
                          onChange={(e) => updateInput('qtyPerBuild', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buildsPerYear">Builds per Year</Label>
                        <Input
                          id="buildsPerYear"
                          type="number"
                          value={inputs.buildsPerYear}
                          onChange={(e) => updateInput('buildsPerYear', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scrapPercent">Scrap % / Over-buy</Label>
                        <Input
                          id="scrapPercent"
                          type="number"
                          step="0.1"
                          value={inputs.scrapPercent}
                          onChange={(e) => updateInput('scrapPercent', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCost">Shipping Cost per Order</Label>
                        <Input
                          id="shippingCost"
                          type="number"
                          value={inputs.shippingCost}
                          onChange={(e) => updateInput('shippingCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="leadTimeBufferDays">Lead Time Buffer (days)</Label>
                        <Input
                          id="leadTimeBufferDays"
                          type="number"
                          value={inputs.leadTimeBufferDays}
                          onChange={(e) => updateInput('leadTimeBufferDays', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inventoryCarryingCost">Inventory Carrying Cost (%)</Label>
                        <Input
                          id="inventoryCarryingCost"
                          type="number"
                          step="0.01"
                          value={inputs.inventoryCarryingCost}
                          onChange={(e) => updateInput('inventoryCarryingCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Original Component</h3>
                        <div className="text-2xl font-bold text-blue-600">
                          ${originalTCO.effectiveUnitCost.toFixed(3)}
                        </div>
                        <div className="text-sm text-blue-800">Effective Unit Cost</div>
                        <div className="text-lg font-semibold text-blue-600 mt-2">
                          ${originalTCO.annualCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-800">Annual Cost</div>
                      </div>

                      {alternativeTCOs.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium">Best Alternative</h3>
                          {alternativeTCOs
                            .sort((a, b) => a.effectiveUnitCost - b.effectiveUnitCost)
                            .slice(0, 1)
                            .map(tco => (
                              <div key={tco.partNumber} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="font-medium text-green-900">{tco.partNumber}</div>
                                <div className="text-2xl font-bold text-green-600">
                                  ${tco.effectiveUnitCost.toFixed(3)}
                                </div>
                                <div className="text-sm text-green-800">Effective Unit Cost</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  {tco.annualCostDelta < 0 ? (
                                    <TrendingDown className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <TrendingUp className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className={`font-semibold ${tco.annualCostDelta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${Math.abs(tco.annualCostDelta).toLocaleString()} 
                                    {tco.annualCostDelta < 0 ? ' savings' : ' increase'} annually
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost Comparison Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Unit Price" fill="#3b82f6" name="Unit Price ($)" />
                      <Bar dataKey="Effective Unit Cost" fill="#10b981" name="Effective Unit Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Annual Cost Delta</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.slice(1)}> {/* Exclude original */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="Cost Delta" 
                        fill={(entry: any) => entry['Cost Delta'] < 0 ? '#10b981' : '#ef4444'}
                        name="Annual Cost Delta ($K)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="p-6">
              <div className="space-y-6">
                {allTCOs.map((tco, index) => (
                  <Card key={tco.partNumber}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{tco.partNumber}</span>
                        {index === 0 && <span className="text-sm font-normal text-gray-500">(Original)</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Material Cost</div>
                          <div className="text-lg font-semibold">${tco.breakdown.materialCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Scrap Cost</div>
                          <div className="text-lg font-semibold">${tco.breakdown.scrapCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Shipping</div>
                          <div className="text-lg font-semibold">${tco.breakdown.shippingCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Inventory</div>
                          <div className="text-lg font-semibold">${tco.breakdown.inventoryCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">MOQ Penalty</div>
                          <div className="text-lg font-semibold">${tco.breakdown.moqPenalty.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Annual Cost:</span>
                          <span className="text-xl font-bold">${tco.annualCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-medium">Effective Unit Cost:</span>
                          <span className="text-lg font-semibold">${tco.effectiveUnitCost.toFixed(3)}</span>
                        </div>
                        {index > 0 && (
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-medium">vs Original:</span>
                            <span className={`text-lg font-semibold ${tco.annualCostDelta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {tco.annualCostDelta < 0 ? '-' : '+'}${Math.abs(tco.annualCostDelta).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              TCO calculations are estimates. Actual costs may vary based on specific supplier terms and conditions.
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export TCO Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}