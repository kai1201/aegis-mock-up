import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, CreditCard as Edit, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRFQ } from '@/contexts/RFQContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RFQCart() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { rfqDraft, removeFromRFQ, updateRFQItem, clearRFQ, getTotalItems, createRFQFromDraft } = useRFQ();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const totalItems = getTotalItems();

  const handleRemoveItem = (itemId: string) => {
    removeFromRFQ(itemId);
    toast.success(t('rfq.itemRemoved'));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateRFQItem(itemId, { quantity });
    setEditingItem(null);
  };

  const handleCreateRFQ = () => {
    const rfqId = createRFQFromDraft();
    setIsOpen(false);
    toast.success(t('rfq.createdSuccessfully'));
    navigate(`/rfq/${rfqId}`);
  };

  const handleViewDraft = () => {
    setIsOpen(false);
    navigate('/rfq?tab=new');
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="relative shadow-lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('rfq.cart')}
            <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-white">
              {totalItems}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('rfq.draft')}</span>
                  <Badge variant="secondary">{totalItems} {t('rfq.items')}</Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {rfqDraft && (
                <p className="text-xs text-muted-foreground">
                  {t('rfq.created')} {formatDistanceToNow(rfqDraft.createdAt, { addSuffix: true })}
                </p>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {rfqDraft?.items.map((item) => (
                  <div key={item.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
                          {item.partNumber}
                        </code>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {item.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.manufacturer}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{t('rfq.qty')}:</span>
                      {editingItem === item.id ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          onBlur={() => setEditingItem(null)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              setEditingItem(null);
                            }
                          }}
                          className="h-6 w-16 text-xs"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-sm font-medium hover:text-blue-600 flex items-center space-x-1"
                        >
                          <span>{item.quantity.toLocaleString()}</span>
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                      {item.targetPrice && (
                        <>
                          <span className="text-xs text-muted-foreground">{t('rfq.target')}:</span>
                          <span className="text-xs font-medium">${item.targetPrice.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t bg-muted/50">
                <div className="flex space-x-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewDraft}
                    className="flex-1"
                  >
                    {t('rfq.editDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearRFQ}
                    className="text-red-600 hover:text-red-700"
                  >
                    {t('rfq.clearAll')}
                  </Button>
                </div>
                <Button onClick={handleCreateRFQ} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {t('rfq.create')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
