import React from 'react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useRFQ } from '@/contexts/RFQContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, Search, Filter, FileText, MessageCircle, Clock, DollarSign, Package, Send, Download, Eye, CreditCard as Edit, Trash2, Calendar, Building2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DataTable from '@/components/DataTable';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface RFQItem {
  id: string;
  partNumber: string;
  manufacturer: string;
  description: string;
  quantity: number;
  targetPrice?: number;
  needByDate?: Date;
  notes?: string;
}

interface RFQ {
  id: string;
  title: string;
  status: 'draft' | 'sent' | 'pending' | 'answered' | 'closed';
  createdDate: Date;
  submittedBy: string;
  suppliers: string[];
  items: RFQItem[];
  totalItems: number;
  estimatedValue: number;
  needByDate?: Date;
  notes?: string;
  responseCount: number;
  lastActivity: Date;
}

const mockRFQs: RFQ[] = [
  {
    id: 'RFQ-2024-001',
    title: 'Q1 Production Components',
    status: 'answered',
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submittedBy: 'John Smith',
    suppliers: ['Digi-Key', 'Mouser'],
    items: [],
    totalItems: 15,
    estimatedValue: 12500,
    needByDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    responseCount: 2,
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'RFQ-2024-002',
    title: 'Power Management ICs - Urgent',
    status: 'pending',
    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    submittedBy: 'Sarah Johnson',
    suppliers: ['Arrow', 'Avnet'],
    items: [],
    totalItems: 8,
    estimatedValue: 8900,
    needByDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    responseCount: 1,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'RFQ-2024-003',
    title: 'MCU Alternatives Assessment',
    status: 'sent',
    createdDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    submittedBy: 'Mike Chen',
    suppliers: ['TI Direct', 'ST Direct'],
    items: [],
    totalItems: 3,
    estimatedValue: 2400,
    responseCount: 0,
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export default function RFQManager() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rfqDraft, clearRFQ, createRFQFromDraft } = useRFQ();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('list');
  const [rfqs, setRfqs] = useState<RFQ[]>(mockRFQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [showNewRFQForm, setShowNewRFQForm] = useState(false);
  const [newRFQItems, setNewRFQItems] = useState<RFQItem[]>([]);
  const [newRFQTitle, setNewRFQTitle] = useState('');
  const [newRFQNotes, setNewRFQNotes] = useState('');

  // Check if we should show the new RFQ tab (from BOM Analyzer)
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'new' && rfqDraft) {
      setActiveTab('new');
      setShowNewRFQForm(true);
      // Pre-populate with draft data
      setNewRFQTitle(rfqDraft.title);
      setNewRFQItems(rfqDraft.items.map(item => ({
        id: item.id,
        partNumber: item.partNumber,
        manufacturer: item.manufacturer,
        description: item.description,
        quantity: item.quantity,
        targetPrice: item.targetPrice,
        needByDate: item.needByDate,
        notes: item.notes,
      })));
    }
  }, [searchParams, rfqDraft]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Simulate BOM parsing
      const mockItems: RFQItem[] = [
        {
          id: '1',
          partNumber: 'STM32F407VGT6',
          manufacturer: 'STMicroelectronics',
          description: '32-bit MCU, ARM Cortex-M4',
          quantity: 1000,
          targetPrice: 8.50,
          needByDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          partNumber: 'LM2596S-5.0',
          manufacturer: 'Texas Instruments',
          description: 'Switching Regulator, 5V Output',
          quantity: 500,
          targetPrice: 1.25,
        },
      ];
      setNewRFQItems(mockItems);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'answered': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'sent': return <Send className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'answered': return <MessageCircle className="w-3 h-3" />;
      case 'closed': return <Package className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rfq.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || rfq.suppliers.some(s => s === supplierFilter);
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const rfqColumns = [
    {
      key: 'id',
      title: t('rfq.rfqId'),
      sortable: true,
      render: (value: string, row: RFQ) => (
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <code className="font-mono text-sm">{value}</code>
        </div>
      ),
    },
    {
      key: 'title',
      title: t('rfq.title.header'),
      sortable: true,
      render: (value: string, row: RFQ) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-gray-500">{row.totalItems} {t('rfq.items')} • ${row.estimatedValue.toLocaleString()}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: t('rfq.status'),
      render: (value: string) => (
        <Badge className={`border ${getStatusColor(value)} flex items-center space-x-1`}>
          {getStatusIcon(value)}
          <span>{value.toUpperCase()}</span>
        </Badge>
      ),
    },
    {
      key: 'suppliers',
      title: t('rfq.suppliers.header'),
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((supplier, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {supplier}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} {t('common.more')}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'responseCount',
      title: t('rfq.responses'),
      render: (value: number, row: RFQ) => (
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value}</span>
          {row.status === 'answered' && value > 0 && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      ),
    },
    {
      key: 'needByDate',
      title: t('rfq.needBy'),
      render: (value: Date | undefined) => (
        value ? (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{value.toLocaleDateString()}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'lastActivity',
      title: t('rfq.lastActivity'),
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm text-gray-600">
          {formatDistanceToNow(value, { addSuffix: true })}
        </span>
      ),
    },
    {
      key: 'actions',
      title: t('rfq.actions'),
      render: (value: any, row: RFQ) => (
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => navigate(`/rfq/${row.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="w-4 h-4" />
          </Button>
          {row.status === 'draft' && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const addNewItem = () => {
    const newItem: RFQItem = {
      id: Date.now().toString(),
      partNumber: '',
      manufacturer: '',
      description: '',
      quantity: 1,
    };
    setNewRFQItems([...newRFQItems, newItem]);
  };

  const updateItem = (id: string, field: keyof RFQItem, value: any) => {
    setNewRFQItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setNewRFQItems(items => items.filter(item => item.id !== id));
  };

  const submitRFQ = () => {
    let rfqId: string;
    
    if (rfqDraft && newRFQItems.length === 0) {
      // Creating from draft
      rfqId = createRFQFromDraft();
    } else {
      // Creating new RFQ
      rfqId = `RFQ-2024-${String(rfqs.length + 1).padStart(3, '0')}`;
    }
    
    const newRFQ: RFQ = {
      id: rfqId,
      title: newRFQTitle || 'New RFQ',
      status: 'draft',
      createdDate: new Date(),
      submittedBy: 'Current User',
      suppliers: [],
      items: newRFQItems,
      totalItems: newRFQItems.length,
      estimatedValue: newRFQItems.reduce((sum, item) => sum + (item.targetPrice || 0) * item.quantity, 0),
      notes: newRFQNotes,
      responseCount: 0,
      lastActivity: new Date(),
    };

    setRfqs([newRFQ, ...rfqs]);
    setShowNewRFQForm(false);
    setNewRFQItems([]);
    setNewRFQTitle('');
    setNewRFQNotes('');
    setActiveTab('list');
    
    // Clear any draft data
    if (rfqDraft) {
      clearRFQ();
    }
  };

  const allSuppliers = Array.from(new Set(rfqs.flatMap(rfq => rfq.suppliers)));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('rfq.title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">
            {t('rfq.subtitle')}
          </p>
        </div>
        <Button 
          onClick={() => setShowNewRFQForm(true)} 
          className="flex items-center space-x-2 px-6 py-3 text-base"
          size="lg"
        >
          <Plus className="w-4 h-4" />
          <span>{t('rfq.createNewRFQ')}</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="list">{t('rfq.list')}</TabsTrigger>
          {showNewRFQForm && <TabsTrigger value="new">{t('rfq.createNew')}</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-8">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('rfq.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 h-12">
                      <SelectValue placeholder={t('rfq.statusFilter')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('rfq.allStatus')}</SelectItem>
                      <SelectItem value="draft">{t('rfq.draft')}</SelectItem>
                      <SelectItem value="sent">{t('rfq.sent')}</SelectItem>
                      <SelectItem value="pending">{t('rfq.pending')}</SelectItem>
                      <SelectItem value="answered">{t('rfq.answered')}</SelectItem>
                      <SelectItem value="closed">{t('rfq.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger className="w-48 h-12">
                      <SelectValue placeholder={t('rfq.supplierFilter')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('rfq.allSuppliers')}</SelectItem>
                      {allSuppliers.map(supplier => (
                        <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{rfqs.length}</div>
                  <div className="text-sm text-muted-foreground">{t('rfq.totalRFQs')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {rfqs.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('rfq.pending')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {rfqs.filter(r => r.status === 'answered').length}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('rfq.answered')}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${rfqs.reduce((sum, rfq) => sum + rfq.estimatedValue, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('rfq.totalValue')}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RFQ Table */}
          <DataTable columns={rfqColumns} data={filteredRFQs} />
        </TabsContent>

        <TabsContent value="new" className="space-y-8">
          {rfqDraft && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">RFQ Draft from BOM Analysis</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      {t('rfq.reviewCustomize', { count: rfqDraft.items.length })}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {t('rfq.fromBOMAnalyzer')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('rfq.createNew')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('rfq.title.label')}</label>
                  <Input
                    placeholder={t('rfq.titlePlaceholder')}
                    value={newRFQTitle}
                    onChange={(e) => setNewRFQTitle(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('rfq.needByDate')}</label>
                  <Input type="date" className="h-10" />
                </div>
              </div>

              {/* BOM Upload */}
              <div>
                <label className="text-sm font-medium mb-3 block">{t('rfq.uploadBOMFile')}</label>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-border hover:border-muted-foreground bg-background"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  {isDragActive ? (
                    <p className="text-blue-600">{t('rfq.dropBOMHere')}</p>
                  ) : (
                    <div>
                      <p className="text-muted-foreground mb-2">
                        {t('rfq.dragDropBOM')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('rfq.supportedFormats')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">
                    {t('rfq.items')} {rfqDraft && `(${rfqDraft.items.length} from BOM)`}
                  </label>
                  <Button variant="outline" onClick={addNewItem} className="px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('rfq.addItem')}
                  </Button>
                </div>

                {newRFQItems.length > 0 && (
                  <div className="border rounded-lg overflow-hidden bg-background">
                    <div className="bg-muted px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                      <div className="col-span-3">{t('rfq.partNumber')}</div>
                      <div className="col-span-2">{t('rfq.manufacturer')}</div>
                      <div className="col-span-3">{t('rfq.description')}</div>
                      <div className="col-span-1">{t('rfq.quantity')}</div>
                      <div className="col-span-2">{t('rfq.targetPrice')}</div>
                      <div className="col-span-1">{t('rfq.actions')}</div>
                    </div>
                    {newRFQItems.map((item, index) => (
                      <div key={item.id} className="px-4 py-3 border-t grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <Input
                            placeholder={t('rfq.partNumber')}
                            value={item.partNumber}
                            onChange={(e) => updateItem(item.id, 'partNumber', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder={t('rfq.manufacturer')}
                            value={item.manufacturer}
                            onChange={(e) => updateItem(item.id, 'manufacturer', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder={t('rfq.description')}
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            placeholder="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.targetPrice || ''}
                            onChange={(e) => updateItem(item.id, 'targetPrice', parseFloat(e.target.value) || undefined)}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('rfq.notes')}</label>
                <Textarea
                  placeholder={t('rfq.additionalSpecs')}
                  value={newRFQNotes}
                  onChange={(e) => setNewRFQNotes(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewRFQForm(false)}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  onClick={submitRFQ} 
                  disabled={newRFQItems.length === 0 && !rfqDraft} 
                  className="px-6"
                >
                  {t('rfq.create')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}