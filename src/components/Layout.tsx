import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageCircle, RefreshCw, FileText, Package, User, Settings, X, TriangleAlert as AlertTriangle, ShoppingCart, Sun, Moon, Languages, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const mockNotifications = [
  {
    id: '1',
    title: 'EOL Announcement',
    message: 'STM32F407VGT6 has been added to the discontinuation list',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    type: 'critical',
  },
  {
    id: '2',
    title: 'Lead Time Alert',
    message: 'LM2596S-5.0 lead time increased to 18 weeks',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Price Update',
    message: 'GRM32ER71H106KA12L price increased by 15%',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    type: 'info',
  },
];

const getAlertSettings = (t: (key: string) => string) => [
  { id: 'eol', label: t('notifications.eolAnnouncements'), description: t('notifications.eolAnnouncementsDesc'), enabled: true },
  { id: 'leadtime', label: t('notifications.leadTimeChanges'), description: t('notifications.leadTimeChangesDesc'), enabled: true },
  { id: 'price', label: t('notifications.priceIncreases'), description: t('notifications.priceIncreasesDesc'), enabled: false },
  { id: 'stock', label: t('notifications.lowStock'), description: t('notifications.lowStockDesc'), enabled: true },
  { id: 'pcn', label: t('notifications.pcnPdnDocuments'), description: t('notifications.pcnPdnDocumentsDesc'), enabled: true },
  { id: 'supplier', label: t('notifications.supplierNews'), description: t('notifications.supplierNewsDesc'), enabled: false },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState(getAlertSettings(t));

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Search },
    { name: t('nav.partFinder'), href: '/cross-reference', icon: RefreshCw },
    { name: t('nav.compareParts'), href: '/compare', icon: GitCompare },
    { name: t('nav.bomAnalyzer'), href: '/bom-analyzer', icon: Package },
    { name: t('nav.rfqManager'), href: '/rfq', icon: ShoppingCart },
    { name: t('nav.aiAssistant'), href: '/ai-assistant', icon: MessageCircle },
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card border-border">
        <div className="flex h-16 items-center px-6 w-full">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-foreground">Aegis</h1>
          </div>
          
          <div className="flex-1 max-w-lg mx-auto min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('layout.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
              className="flex items-center space-x-1 min-w-[3rem]"
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs font-medium whitespace-nowrap">{language.toUpperCase()}</span>
            </Button>
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                <Card className="border-0 shadow-lg max-h-[80vh] overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Bell className="w-4 h-4" />
                      <span>{t('notifications.title')}</span>
                      {unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {unreadCount}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="notifications" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                        <TabsTrigger value="notifications" className="flex items-center space-x-2">
                          <Bell className="w-4 h-4" />
                          <span>{t('notifications.title')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>{t('notifications.settings')}</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="notifications" className="mt-0">
                        <div className="px-4 pb-2">
                          <Button onClick={markAllAsRead} variant="outline" size="sm" className="w-full">
                            {t('notifications.markAllAsRead')}
                          </Button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p>{t('notifications.noNotifications')}</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b last:border-b-0 hover:bg-muted/50 ${
                                  !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.type === 'critical' ? 'bg-red-500' :
                                    notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h3 className="font-semibold text-foreground flex items-center space-x-2">
                                          {notification.title}
                                          {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                          )}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1 ml-2">
                                        {!notification.read && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markAsRead(notification.id)}
                                            className="h-6 w-6 p-0"
                                          >
                                            <Bell className="w-3 h-3" />
                                          </Button>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteNotification(notification.id)}
                                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="settings" className="mt-0">
                        <div className="px-4 pb-4">
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div>
                              <h3 className="font-medium mb-3">{t('notifications.alertTypes')}</h3>
                              <div className="space-y-3">
                                {settings.map((setting) => (
                                  <div key={setting.id} className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <div className="text-sm font-medium">{setting.label}</div>
                                      <div className="text-xs text-muted-foreground">{setting.description}</div>
                                    </div>
                                    <Switch
                                      checked={setting.enabled}
                                      onCheckedChange={() => toggleSetting(setting.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <h3 className="font-medium mb-3">{t('notifications.deliveryMethods')}</h3>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-medium">{t('notifications.inAppNotifications')}</div>
                                    <div className="text-xs text-muted-foreground">{t('notifications.inAppNotificationsDesc')}</div>
                                  </div>
                                  <Switch checked={true} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-medium">{t('notifications.emailAlerts')}</div>
                                    <div className="text-xs text-muted-foreground">{t('notifications.emailAlertsDesc')}</div>
                                  </div>
                                  <Switch checked={false} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-medium">{t('notifications.weeklyDigest')}</div>
                                    <div className="text-xs text-muted-foreground">{t('notifications.weeklyDigestDesc')}</div>
                                  </div>
                                  <Switch checked={true} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Top Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="px-6 py-3 flex justify-center">
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="p-6 bg-background min-h-[calc(100vh-8rem)] w-full max-w-none">
        {children}
      </main>
    </div>
  );
}
