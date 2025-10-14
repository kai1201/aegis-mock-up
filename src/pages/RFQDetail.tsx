import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Download, FileText, MessageCircle, Clock, DollarSign, Package, Building2, User, Calendar, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

interface QuotationItem {
  partNumber: string;
  unitPrice: number;
  moq: number;
  leadTime: string;
  availability: string;
  validUntil: Date;
  notes?: string;
  translationKey?: string;
  alternatives?: Array<{
    partNumber: string;
    manufacturer: string;
    unitPrice: number;
    reason: string;
  }>;
}

interface Message {
  id: string;
  type: 'user' | 'supplier' | 'system';
  sender: string;
  content: string;
  timestamp: Date;
  quotation?: {
    supplier: string;
    items: QuotationItem[];
    totalValue: number;
    validUntil: Date;
    terms: string;
    notes?: string;
    translationKey?: string;
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const mockRFQData = {
  id: 'RFQ-2024-001',
  title: 'Q1 Production Components',
  titleKey: 'rfqDetail.q1ProductionComponents',
  status: 'answered' as const,
  createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  submittedBy: 'John Smith',
  suppliers: ['Digi-Key', 'Mouser'],
  needByDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  notes: 'Components needed for Q1 production run. Please provide best pricing for quantities shown.',
  notesKey: 'rfqDetail.q1ProductionNotes',
  items: [
    {
      id: '1',
      partNumber: 'STM32F407VGT6',
      manufacturer: 'STMicroelectronics',
      description: '32-bit MCU, ARM Cortex-M4',
      quantity: 1000,
      targetPrice: 8.50,
    },
    {
      id: '2',
      partNumber: 'LM2596S-5.0',
      manufacturer: 'Texas Instruments',
      description: 'Switching Regulator, 5V Output',
      quantity: 500,
      targetPrice: 1.25,
    },
    {
      id: '3',
      partNumber: 'GRM32ER71H106KA12L',
      manufacturer: 'Murata',
      description: '10uF Ceramic Capacitor, 50V',
      quantity: 2000,
      targetPrice: 0.35,
    },
  ] as RFQItem[],
};

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'system',
    sender: 'System',
    content: 'rfqDetail.rfqCreatedSent',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'supplier',
    sender: 'Digi-Key Sales',
    content: 'rfqDetail.thankYouRFQ',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    quotation: {
      supplier: 'Digi-Key',
      items: [
        {
          partNumber: 'STM32F407VGT6',
          unitPrice: 8.25,
          moq: 1,
          leadTime: '26 weeks',
          availability: 'In Stock (2,500 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: 'Volume pricing available for 5K+ quantities',
          translationKey: 'rfqDetail.volumePricing',
        },
        {
          partNumber: 'LM2596S-5.0',
          unitPrice: 1.18,
          moq: 1,
          leadTime: '18 weeks',
          availability: 'In Stock (8,200 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          partNumber: 'GRM32ER71H106KA12L',
          unitPrice: 0.32,
          moq: 4000,
          leadTime: '12 weeks',
          availability: 'In Stock (50,000 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          alternatives: [
            {
              partNumber: 'GRM32ER71H106KA02L',
              manufacturer: 'Murata',
              unitPrice: 0.28,
              reason: 'Same specs, different packaging - 15% cost savings',
            },
          ],
        },
      ],
      totalValue: 9490,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: 'NET 30, FOB Origin',
      notes: 'All items in stock and ready to ship. Volume discounts available.',
      translationKey: 'rfqDetail.allItemsInStock',
    },
  },
  {
    id: '3',
    type: 'user',
    sender: 'John Smith',
    content: 'rfqDetail.confirmLeadTime',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: '4',
    type: 'supplier',
    sender: 'Digi-Key Sales',
    content: 'rfqDetail.stockAvailable',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: '5',
    type: 'supplier',
    sender: 'Mouser Electronics',
    content: 'rfqDetail.competitiveQuotation',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    quotation: {
      supplier: 'Mouser Electronics',
      items: [
        {
          partNumber: 'STM32F407VGT6',
          unitPrice: 7.95,
          moq: 1,
          leadTime: '22 weeks',
          availability: 'In Stock (1,800 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: 'Special pricing for quantities over 1K',
          translationKey: 'rfqDetail.specialPricing',
        },
        {
          partNumber: 'LM2596S-5.0',
          unitPrice: 1.22,
          moq: 1,
          leadTime: '16 weeks',
          availability: 'In Stock (5,500 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          partNumber: 'GRM32ER71H106KA12L',
          unitPrice: 0.34,
          moq: 2000,
          leadTime: '10 weeks',
          availability: 'In Stock (75,000 pcs)',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      ],
      totalValue: 9290,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: 'NET 30, FOB Destination',
      notes: 'Free shipping on orders over $500. Extended warranty available.',
      translationKey: 'rfqDetail.freeShipping',
    },
  },
];

export default function RFQDetail() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeSupplier, setActiveSupplier] = useState('all');

  const rfqData = mockRFQData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'answered': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      sender: 'John Smith',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const quotationMessages = messages.filter(m => m.quotation);
  const filteredMessages = activeSupplier === 'all' 
    ? messages 
    : messages.filter(m => 
        m.type === 'system' || 
        m.type === 'user' || 
        (m.quotation && m.quotation.supplier === activeSupplier) ||
        (m.sender.toLowerCase().includes(activeSupplier.toLowerCase()))
      );

  const totalEstimatedValue = rfqData.items.reduce((sum, item) => 
    sum + (item.targetPrice || 0) * item.quantity, 0
  );

  const exportSummary = () => {
    console.log('Exporting RFQ summary...');
  };

  const copyRFQId = () => {
    navigator.clipboard.writeText(rfqData.id);
  };

  const getMessageContent = (message: Message): string => {
    if (message.content.startsWith('rfqDetail.')) {
      switch (message.content) {
        case 'rfqDetail.rfqCreatedSent':
          return t(message.content).replace('{count}', rfqData.suppliers.length.toString());
        case 'rfqDetail.confirmLeadTime':
          return t(message.content).replace('{partNumber}', 'STM32F407VGT6');
        case 'rfqDetail.stockAvailable':
          return t(message.content)
            .replace('{partNumber}', 'STM32F407VGT6')
            .replace('{stock}', '2,500')
            .replace('{leadTime}', language === 'ja' ? '26週間' : '26 weeks');
        default:
          return t(message.content);
      }
    }
    return message.content;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/rfq')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('rfqDetail.backToRFQs')}
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-foreground">
                {language === 'ja' ? t('rfqDetail.q1ProductionComponents') : rfqData.title}
              </h1>
              <Badge className={`border ${getStatusColor(rfqData.status)}`}>
                {rfqData.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-base text-muted-foreground">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span className="font-mono cursor-pointer hover:text-blue-600 text-base" onClick={copyRFQId}>
                  {rfqData.id}
                </span>
                <Copy className="w-3 h-3 cursor-pointer hover:text-blue-600" onClick={copyRFQId} />
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{rfqData.submittedBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{rfqData.createdDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={exportSummary}>
            <Download className="w-4 h-4 mr-2" />
            {t('rfqDetail.exportSummary')}
          </Button>
          <Button size="lg" className="px-6">
            <Send className="w-4 h-4 mr-2" />
            {t('rfqDetail.sendToMoreSuppliers')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - RFQ Details */}
        <div className="xl:col-span-1 space-y-6">
          {/* RFQ Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('rfqDetail.rfqDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-base">
                <div>
                  <label className="font-medium text-foreground">{t('rfqDetail.totalItems')}</label>
                  <p className="text-lg text-foreground">{rfqData.items.length}</p>
                </div>
                <div>
                  <label className="font-medium text-foreground">{t('rfqDetail.estValue')}</label>
                  <p className="text-lg font-semibold text-green-600">${totalEstimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium text-foreground">{t('rfqDetail.needBy')}</label>
                  <p className="text-lg text-foreground">{rfqData.needByDate?.toLocaleDateString() || t('rfqDetail.notSpecified')}</p>
                </div>
                <div>
                  <label className="font-medium text-foreground">{t('rfqDetail.suppliers')}</label>
                  <p className="text-lg text-foreground">{rfqData.suppliers.length}</p>
                </div>
              </div>
              
              {rfqData.notes && (
                <div>
                  <label className="font-medium text-foreground block mb-1">{t('rfqDetail.notes')}</label>
                  <p className="text-base text-muted-foreground bg-muted p-4 rounded-lg">
                    {language === 'ja' ? t('rfqDetail.q1ProductionNotes') : rfqData.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('rfqDetail.requestedItems')}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {rfqData.items.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <code className="text-base font-mono bg-muted px-3 py-1 rounded text-foreground">
                        {item.partNumber}
                      </code>
                      <Badge variant="outline">
                        {item.manufacturer}
                      </Badge>
                    </div>
                    <p className="text-base text-muted-foreground mb-3">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">{t('rfqDetail.qty')}:</span> {item.quantity.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{t('rfqDetail.target')}:</span> ${item.targetPrice?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quotation Summary */}
          {quotationMessages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('rfqDetail.quotationSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {quotationMessages.map((msg, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{msg.quotation!.supplier}</Badge>
                        <span className="text-xl font-bold text-green-600">
                          ${msg.quotation!.totalValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{t('rfqDetail.validUntil')}: {msg.quotation!.validUntil.toLocaleDateString()}</p>
                        <p>{t('rfqDetail.terms')}: {msg.quotation!.terms}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Q&A Thread */}
        <div className="xl:col-span-2">
          <Card className="h-[900px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center space-x-2 text-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('rfqDetail.qaThread')}</span>
                </CardTitle>
                <Tabs value={activeSupplier} onValueChange={setActiveSupplier} className="w-auto">
                  <TabsList className="h-10">
                    <TabsTrigger value="all" className="text-sm px-4">{t('rfqDetail.all')}</TabsTrigger>
                    {rfqData.suppliers.map(supplier => (
                      <TabsTrigger key={supplier} value={supplier} className="text-sm px-4">
                        {supplier}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {filteredMessages.map((message) => (
                  <div key={message.id} className={cn(
                    "max-w-[85%] rounded-lg p-6",
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white ml-auto' 
                      : message.type === 'system'
                      ? 'bg-muted text-foreground border border-border'
                      : 'bg-card border border-border shadow-md text-foreground'
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-base">
                          {message.sender}
                        </span>
                        {message.type === 'supplier' && (
                          <Badge variant="outline">
                            {t('rfqDetail.supplier')}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-base mb-4 leading-relaxed">
                      {getMessageContent(message)}
                    </p>

                    {/* Quotation Details */}
                    {message.quotation && (
                      <div className="mt-6 p-6 bg-muted rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg text-foreground">{t('rfqDetail.quotationDetails')}</h4>
                          <span className="text-2xl font-bold text-green-600">
                            ${message.quotation.totalValue.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {message.quotation.items.map((item, index) => (
                            <div key={index} className="bg-muted/50 p-4 rounded-lg border border-border">
                              <div className="flex justify-between items-start mb-2">
                                <code className="text-base font-mono text-foreground">{item.partNumber}</code>
                                <span className="font-bold text-green-600 text-lg">
                                  ${item.unitPrice.toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                                <div>MOQ: {item.moq.toLocaleString()}</div>
                                <div>{t('rfqDetail.leadTime')}: {item.leadTime}</div>
                                <div>{t('rfqDetail.stock')}: {item.availability}</div>
                              </div>
                              
                              {item.notes && (
                                <p className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded">
                                  {item.translationKey ? t(item.translationKey) : item.notes}
                                </p>
                              )}
                              
                              {item.alternatives && item.alternatives.length > 0 && (
                                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded">
                                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                                    {t('rfqDetail.alternativeSuggested')}:
                                  </p>
                                  {item.alternatives.map((alt, altIndex) => (
                                    <div key={altIndex} className="text-sm text-amber-700 dark:text-amber-300">
                                      <code>{alt.partNumber}</code> - ${alt.unitPrice.toFixed(2)}
                                      <p className="mt-1">{alt.reason}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <span className="font-medium">{t('rfqDetail.validUntil')}:</span> {message.quotation.validUntil.toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">{t('rfqDetail.terms')}:</span> {message.quotation.terms}
                            </div>
                          </div>
                          {message.quotation.notes && (
                            <p className="mt-3 italic text-base text-foreground">
                              {message.quotation.translationKey ? t(message.quotation.translationKey) : message.quotation.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <FileText className="w-3 h-3" />
                            <a href={attachment.url} className="hover:underline">
                              {attachment.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-6">
                <div className="flex space-x-4">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('rfqDetail.askQuestion')}
                    className="flex-1 min-h-[3rem] resize-none text-base bg-background"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()} size="lg" className="px-6">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
