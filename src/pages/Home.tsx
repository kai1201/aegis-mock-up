import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Upload, 
  GitCompare, 
  Brain, 
  ChevronRight,
  Clock,
  Star,
  Cpu,
  Building2,
  LifeBuoy,
  Loader2,
  AlertCircle,
  ArrowRight,
  Package,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for suggestions and search results
const mockSuggestions = [
  { type: 'keyword', value: 'Ethernet 3.3V QFN', category: 'Popular Search' },
  { type: 'mpn', value: 'STM32F407VGT6', category: 'Part Number' },
  { type: 'cpn', value: 'CPN-123456', category: 'Company Part Number' },
  { type: 'manufacturer', value: 'STMicroelectronics', category: 'Manufacturer' },
  { type: 'category', value: 'Microcontrollers', category: 'Category' },
  { type: 'keyword', value: 'USB Type-C', category: 'Popular Search' },
  { type: 'mpn', value: 'LM2596S-5.0', category: 'Part Number' },
  { type: 'keyword', value: 'Buck Converter', category: 'Popular Search' },
];

const recentSearches = [
  'STM32F407VGT6',
  'Ethernet PHY 3.3V',
  'USB Type-C Connector',
  'Buck Converter 5V',
  'MLCC 10uF 50V'
];

const favoriteComponents = [
  { mpn: 'STM32F407VGT6', manufacturer: 'STMicroelectronics', description: '32-bit ARM Cortex-M4 MCU' },
  { mpn: 'LM2596S-5.0', manufacturer: 'Texas Instruments', description: 'Step-Down Voltage Regulator' },
  { mpn: 'GRM32ER71H106KA12L', manufacturer: 'Murata', description: 'MLCC Capacitor 10µF 50V' }
];

const quickSuggestionChips = [
  'Microcontrollers',
  'Power Management',
  'Connectors',
  'Passive Components',
  'Memory',
  'Sensors',
  'RF Components',
  'Protection Circuits'
];

const categories = [
  { name: 'Active Components', count: '2.1M', icon: Cpu },
  { name: 'Passive Components', count: '1.8M', icon: Package },
  { name: 'Connectors', count: '890K', icon: Zap },
  { name: 'Electromechanical', count: '450K', icon: Shield }
];

const manufacturers = [
  { name: 'Texas Instruments', count: '125K' },
  { name: 'STMicroelectronics', count: '98K' },
  { name: 'Analog Devices', count: '87K' },
  { name: 'Infineon', count: '76K' },
  { name: 'Microchip', count: '65K' }
];

const lifecycleStates = [
  { name: 'Active', count: '4.2M', color: 'bg-green-500', description: 'Currently in production' },
  { name: 'NRND', count: '890K', color: 'bg-yellow-500', description: 'Not recommended for new designs' },
  { name: 'LTB', count: '340K', color: 'bg-orange-500', description: 'Last time buy opportunity' },
  { name: 'Obsolete', count: '1.1M', color: 'bg-red-500', description: 'No longer available' }
];

type SearchState = 'empty' | 'loading' | 'error';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('empty');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(mockSuggestions);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(mockSuggestions);
    }
  }, [searchQuery]);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    setSearchState('loading');
    // Simulate search delay
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'alternatives':
        navigate('/cross-reference');
        break;
      case 'bom-risk':
        navigate('/bom-analyzer');
        break;
      default:
        break;
    }
  };

  const handleChipClick = (chip: string) => {
    setSearchQuery(chip);
    handleSearch(chip);
  };

  const getLifecycleBadge = (name: string, color: string) => (
    <Badge variant="outline" className={`${color} text-white dark:text-white border-0`}>
      {name}
    </Badge>
  );

  const renderSearchState = () => {
    switch (searchState) {
      case 'loading':
        return (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">{t('home.searchingComponents')}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center justify-center py-8 text-red-500">
            <AlertCircle className="h-8 w-8" />
            <span className="ml-2">{t('home.searchFailed')}</span>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg mb-2">{t('home.whatComponentLookingFor')}</p>
            <p className="text-sm">{t('home.trySearchingBy')}</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">{t('home.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Large Search Bar */}
        <div className="max-w-3xl mx-auto space-y-4">
          <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('layout.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                      setShowSuggestions(false);
                    }
                  }}
                  className="pl-12 pr-24 h-14 text-lg border-2 border-border focus:border-primary"
                />
                <Button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
                  disabled={searchState === 'loading'}
                >
                  {searchState === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('common.search')}
                    </>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[800px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>{t('home.noSuggestionsFound')}</CommandEmpty>
                  {filteredSuggestions.length > 0 && (
                    <CommandGroup heading={t('home.suggestions')}>
                      {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            handleSearch(suggestion.value);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span>{suggestion.value}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {quickSuggestionChips.map((chip) => (
              <Button
                key={chip}
                variant="outline"
                size="sm"
                onClick={() => handleChipClick(chip)}
                className="text-sm hover:bg-primary hover:text-primary-foreground border-border dark:border-border dark:text-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
              >
                {chip}
              </Button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => handleQuickAction('alternatives')}
              className="flex items-center space-x-2"
            >
              <GitCompare className="h-4 w-4" />
              <span>{t('home.findAlternatives')}</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('bom-risk')}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t('home.analyzeBOMRisk')}</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mini Facets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categories */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  {t('home.categories')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChipClick(category.name)}
                    className="w-full justify-between text-left h-auto p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-3 w-3" />
                      <span className="text-xs">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Manufacturers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('home.manufacturers')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {manufacturers.map((manufacturer) => (
                  <Button
                    key={manufacturer.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChipClick(manufacturer.name)}
                    className="w-full justify-between text-left h-auto p-2"
                  >
                    <span className="text-xs truncate">{manufacturer.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {manufacturer.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Lifecycle Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <LifeBuoy className="h-4 w-4 mr-2" />
                  {t('home.lifecycleStatus')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lifecycleStates.map((state) => (
                  <div
                    key={state.name}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted dark:hover:bg-muted cursor-pointer"
                    onClick={() => handleChipClick(`lifecycle:${state.name}`)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${state.color} dark:${state.color}`} />
                      <span className="text-xs text-foreground">{state.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground">
                      {state.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Search State Display */}
          <Card>
            <CardContent className="py-8">
              {renderSearchState()}
            </CardContent>
          </Card>

          {/* Recent Searches & Favorites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('home.recentSearches')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="w-full justify-start text-left h-auto p-2"
                  >
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-xs">{search}</span>
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  {t('home.favoriteComponents')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {favoriteComponents.map((component, index) => (
                  <div
                    key={index}
                    className="p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => navigate(`/component/${component.mpn}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-medium">{component.mpn}</div>
                        <div className="text-xs text-muted-foreground">{component.manufacturer}</div>
                        <div className="text-xs text-muted-foreground">{component.description}</div>
                      </div>
                      <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Shortcuts */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t('home.quickTools')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/bom-analyzer')}
                className="w-full justify-start"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('home.bomUpload')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/cross-reference')}
                className="w-full justify-start"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {t('home.compareParts')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ai-assistant')}
                className="w-full justify-start"
              >
                <Brain className="h-4 w-4 mr-2" />
                {t('home.aiExpert')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t('home.needHelp')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {t('home.needHelpDescription')}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <LifeBuoy className="h-4 w-4 mr-2" />
                {t('home.contactSupport')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
