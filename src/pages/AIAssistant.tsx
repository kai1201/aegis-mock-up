import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, ExternalLink, TrendingUp, TriangleAlert as AlertTriangle, Search, FileText, Cpu, Star, Clock, DollarSign, History, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import AIAnswerCard from '@/components/AIAnswerCard';
import MacnicaExpertDrawer from '@/components/MacnicaExpertDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url: string;
    type: 'document' | 'chart' | 'news' | 'analysis';
  }>;
  componentRecommendations?: ComponentRecommendation[];
}

interface ComponentRecommendation {
  partNumber: string;
  manufacturer: string;
  compatibility: number;
  price: string;
  leadTime: string;
  stock: number;
  reason: string;
  advantages: string[];
  considerations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface ChatHistory {
  id: string;
  titleKey: string;
  timestamp: Date;
  messageCount: number;
}

const suggestedQueryKeys = [
  'ai.suggestedQuery.findAlternatives',
  'ai.suggestedQuery.supplyRisks',
  'ai.suggestedQuery.compareLeadTimes',
  'ai.suggestedQuery.capacitorSuppliers',
  'ai.suggestedQuery.pinCompatible',
];

const quickActions = [
  { icon: Search, labelKey: 'ai.quickActions.partSearch', queryKey: 'ai.quickActions.searchAlternatives' },
  { icon: AlertTriangle, labelKey: 'ai.quickActions.riskAnalysis', queryKey: 'ai.quickActions.analyzeRisks' },
  { icon: TrendingUp, labelKey: 'ai.quickActions.marketTrends', queryKey: 'ai.quickActions.marketTrendsFor' },
];

const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    titleKey: 'STM32F407VGT6 Alternatives',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messageCount: 8,
  },
  {
    id: '2',
    titleKey: 'TI Power Management Analysis',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messageCount: 12,
  },
  {
    id: '3',
    titleKey: 'MCU Supply Chain Risks',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messageCount: 6,
  },
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '', // Will be set in useEffect
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(mockChatHistory);
  const [showExpertDrawer, setShowExpertDrawer] = useState(false);
  const [expertContext, setExpertContext] = useState<{ question: string; answer: string }>({
    question: '',
    answer: ''
  });

  // Update welcome message when language changes
  React.useEffect(() => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: t('ai.welcome'),
      timestamp: new Date(),
    }]);
  }, [language, t]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with component recommendations
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input, language),
        sources: [
          { title: 'Component Database 2024', url: '#', type: 'document' },
          { title: 'Cross-Reference Analysis', url: '#', type: 'analysis' },
          { title: 'Market Intelligence Report', url: '#', type: 'news' },
        ],
        componentRecommendations: input.toLowerCase().includes('alternative') || input.toLowerCase().includes('replace') || 
          input.includes('代替') || input.includes('代替品') || input.includes('交換') || input.includes('置き換え')
          ? generateComponentRecommendations() 
          : undefined,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateComponentRecommendations = (): ComponentRecommendation[] => [
    {
      partNumber: 'STM32F405VGT6',
      manufacturer: 'STMicroelectronics',
      compatibility: 95,
      price: '$7.89',
      leadTime: '22 weeks',
      stock: 5000,
      reason: 'Same family, pin-compatible with minor performance differences',
      advantages: ['Drop-in replacement', 'Lower power consumption', 'Better availability'],
      considerations: ['Slightly lower clock speed', 'Reduced peripheral count'],
      riskLevel: 'low',
    },
    {
      partNumber: 'LPC4088FET208',
      manufacturer: 'NXP',
      compatibility: 85,
      price: '$9.12',
      leadTime: '18 weeks',
      stock: 3200,
      reason: 'ARM Cortex-M4 with similar performance characteristics',
      advantages: ['Shorter lead time', 'Good stock availability', 'Competitive pricing'],
      considerations: ['Different peripheral set', 'Package size difference', 'Toolchain migration needed'],
      riskLevel: 'medium',
    },
    {
      partNumber: 'TM4C1294NCPDT',
      manufacturer: 'Texas Instruments',
      compatibility: 80,
      price: '$7.25',
      leadTime: '16 weeks',
      stock: 8000,
      reason: 'High-performance MCU with integrated Ethernet',
      advantages: ['Built-in Ethernet PHY', 'Excellent availability', 'Strong ecosystem support'],
      considerations: ['Different architecture', 'Code porting required', 'Learning curve'],
      riskLevel: 'medium',
    },
    {
      partNumber: 'SAMV71Q21B',
      manufacturer: 'Microchip',
      compatibility: 75,
      price: '$8.95',
      leadTime: '14 weeks',
      stock: 6500,
      reason: 'ARM Cortex-M7 offering higher performance',
      advantages: ['Superior performance', 'Advanced security features', 'Good long-term support'],
      considerations: ['Higher power consumption', 'Overkill for simple applications', 'Price premium'],
      riskLevel: 'low',
    },
    {
      partNumber: 'EFM32GG11B820F2048GL192',
      manufacturer: 'Silicon Labs',
      compatibility: 70,
      price: '$6.45',
      leadTime: '12 weeks',
      stock: 4800,
      reason: 'Ultra-low power MCU with large memory',
      advantages: ['Excellent power efficiency', 'Large memory options', 'Good availability'],
      considerations: ['Lower performance', 'Different development tools', 'Limited ecosystem'],
      riskLevel: 'low',
    },
    {
      partNumber: 'ATSAMD51P20A',
      manufacturer: 'Microchip',
      compatibility: 68,
      price: '$5.89',
      leadTime: '10 weeks',
      stock: 7200,
      reason: 'ARM Cortex-M4F with floating point unit',
      advantages: ['Cost effective', 'Good performance/price ratio', 'Maker community support'],
      considerations: ['Different pin layout', 'Limited industrial temperature range', 'Smaller ecosystem'],
      riskLevel: 'low',
    },
    {
      partNumber: 'S32K344NHT1VPBST',
      manufacturer: 'NXP',
      compatibility: 65,
      price: '$12.30',
      leadTime: '20 weeks',
      stock: 2100,
      reason: 'Automotive-grade MCU with safety features',
      advantages: ['Automotive qualified', 'Advanced safety features', 'Long-term availability'],
      considerations: ['Higher cost', 'Automotive focus may be overkill', 'Complex qualification process'],
      riskLevel: 'medium',
    },
    {
      partNumber: 'XMC4700F144K2048',
      manufacturer: 'Infineon',
      compatibility: 62,
      price: '$8.15',
      leadTime: '15 weeks',
      stock: 3600,
      reason: 'Industrial MCU with motor control capabilities',
      advantages: ['Excellent motor control', 'Industrial temperature range', 'Good documentation'],
      considerations: ['Specialized for motor control', 'Limited general-purpose appeal', 'Smaller community'],
      riskLevel: 'medium',
    },
    {
      partNumber: 'ESP32-S3-WROOM-1',
      manufacturer: 'Espressif',
      compatibility: 60,
      price: '$4.25',
      leadTime: '8 weeks',
      stock: 12000,
      reason: 'Dual-core MCU with integrated WiFi and Bluetooth',
      advantages: ['Built-in wireless', 'Very cost effective', 'Excellent availability'],
      considerations: ['Different architecture', 'Power consumption for wireless', 'Consumer-grade focus'],
      riskLevel: 'low',
    },
    {
      partNumber: 'nRF52840-QIAA',
      manufacturer: 'Nordic Semiconductor',
      compatibility: 58,
      price: '$3.95',
      leadTime: '6 weeks',
      stock: 9500,
      reason: 'Bluetooth 5.0 SoC with ARM Cortex-M4',
      advantages: ['Advanced Bluetooth features', 'Low power design', 'Strong wireless ecosystem'],
      considerations: ['Wireless-centric design', 'Limited general I/O', 'Different development approach'],
      riskLevel: 'low',
    },
  ];

  const generateAIResponse = (query: string, language: string): string => {
    if (query.toLowerCase().includes('alternative') || query.toLowerCase().includes('replace')) {
      if (language === 'ja') {
        return `コンポーネント交換のニーズに対して10の優れた代替品を見つけました。各推奨事項には、詳細な互換性分析、サプライチェーン評価、実装に関する考慮事項が含まれています。

**選択基準：**
• ピン互換性とパッケージの類似性
• 性能特性の一致
• サプライチェーンの安定性と可用性
• コスト効率とリードタイム
• 長期サポートとロードマップの整合性

推奨事項は互換性スコアでランク付けされており、上位オプションは最小限の設計変更で済むドロップイン代替品に近いものです。互換性の低いオプションは、より良い可用性やコスト上の利点を提供する場合がありますが、より大幅な設計変更が必要です。

**次のステップ：**
1. 各推奨事項の詳細分析を確認
2. 特定の性能とコスト要件を検討
3. 各オプションの実装工数を評価
4. 現在の価格と在庫状況について優先販売代理店に確認

特定の代替品についてより詳細な分析を提供したり、優先順位に基づいてオプションを比較するお手伝いをしましょうか？`;
      } else {
        return `I've found 10 excellent alternatives for your component replacement needs. Each recommendation includes detailed compatibility analysis, supply chain assessment, and implementation considerations.

**Selection Criteria:**
• Pin compatibility and package similarity
• Performance characteristics match
• Supply chain stability and availability
• Cost-effectiveness and lead times
• Long-term support and roadmap alignment

The recommendations are ranked by compatibility score, with the top options being near drop-in replacements requiring minimal design changes. Lower compatibility options may offer better availability or cost advantages but require more significant design modifications.

**Next Steps:**
1. Review the detailed analysis for each recommendation
2. Consider your specific performance and cost requirements
3. Evaluate the implementation effort for each option
4. Check with your preferred distributors for current pricing and availability

Would you like me to provide more detailed analysis for any specific alternatives, or help you compare options based on your priorities?`;
      }
    }

    if (language === 'ja') {
      return `お問い合わせ「${query}」に基づいて、市場動向、サプライチェーンリスク、戦略的推奨事項を含む包括的な分析を提供できます。

この分析は、コンポーネント仕様、サプライヤーインテリジェンス、リアルタイム市場データの広範なデータベースから得られ、設計と調達の決定に実用的な洞察を提供します。

より具体的な推奨事項については、以下をお知らせください：
• 作業中の特定の部品番号
• アプリケーション要件と制約
• タイムラインと数量の考慮事項
• 優先サプライヤーまたはメーカー

最適な代替品を見つけ、コンポーネントのサプライチェーンリスクを評価するお手伝いをします。`;
    } else {
      return `Based on your query "${query}", I can provide comprehensive analysis including market trends, supply chain risks, and strategic recommendations.

This analysis draws from our extensive database of component specifications, supplier intelligence, and real-time market data to give you actionable insights for your design and sourcing decisions.

For more specific recommendations, please let me know:
• Specific part numbers you're working with
• Your application requirements and constraints
• Timeline and volume considerations
• Preferred suppliers or manufacturers

I can help you find the best alternatives and assess supply chain risks for your components.`;
    }
  };

  const useSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const useQuickAction = (query: string) => {
    setInput(query);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const handleComponentClick = (partNumber: string) => {
    navigate(`/component/${encodeURIComponent(partNumber)}`);
  };

  const loadChatHistory = (historyId: string) => {
    // In a real app, this would load the actual chat history
    const history = chatHistory.find(h => h.id === historyId);
    if (history) {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: `Loaded chat history: "${t(history.titleKey)}" with ${history.messageCount} messages.`,
          timestamp: history.timestamp,
        },
      ]);
    }
  };

  const deleteChatHistory = (historyId: string) => {
    setChatHistory(prev => prev.filter(h => h.id !== historyId));
  };

  const handleContactExpert = (question: string, answer: string) => {
    setExpertContext({ question, answer });
    setShowExpertDrawer(true);
  };

  const handleExpertDrawerClose = () => {
    setShowExpertDrawer(false);
    setExpertContext({ question: '', answer: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col space-y-6 bg-background p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <span>{t('ai.title')}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('ai.subtitle')}
          </p>
        </div>

        <div className="flex gap-6 min-h-[calc(100vh-12rem)] bg-background">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('ai.componentIntelligenceAssistant')}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background min-h-[60vh]">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex space-x-3 max-w-[90%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {message.type === 'user' ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm">
                              <div className="prose prose-sm max-w-none">
                                {message.content.split('\n').map((line, index) => {
                                  if (line.trim() === '') {
                                    return <br key={index} />;
                                  }
                                  return <p key={index} className="mb-2 last:mb-0">{line}</p>;
                                })}
                              </div>
                              <div className="mt-2 text-xs opacity-70">
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full">
                            <AIAnswerCard
                              question={messages.find(m => m.type === 'user' && messages.indexOf(m) === messages.indexOf(message) - 1)?.content || 'Previous question'}
                              answer={message.content}
                              sources={message.sources}
                              timestamp={message.timestamp}
                              onContactExpert={handleContactExpert}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Keep existing component recommendations rendering for backward compatibility */}
                  {messages.map((message) => (
                    message.componentRecommendations && (
                      <div key={`${message.id}-recommendations`} className="w-full">
                        <Card className="mt-4">
                          <CardContent className="pt-6">
                            <div className="mt-6 space-y-4">
                              <h4 className="font-semibold text-foreground flex items-center space-x-2">
                                <Cpu className="w-4 h-4" />
                                <span>{t('ai.recommendations.recommendedAlternatives')}</span>
                              </h4>
                              <div className="grid gap-4">
                                {message.componentRecommendations.map((rec, index) => (
                                  <div key={index} className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                                          <div>
                                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                                              {rec.partNumber}
                                            </code>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                              {rec.manufacturer}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={`border ${getRiskColor(rec.riskLevel)}`}>
                                          {t(`ai.recommendations.${rec.riskLevel}Risk`).toUpperCase()}
                                        </Badge>
                                        <div className="text-right">
                                          <div className="text-sm font-medium">{rec.compatibility}% {t('ai.recommendations.compatible')}</div>
                                          <Progress value={rec.compatibility} className="w-16 h-1" />
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-sm text-foreground mb-3 font-medium">
                                      {language === 'ja' && t(`ai.recommendations.components.${rec.partNumber}.reason`) !== `ai.recommendations.components.${rec.partNumber}.reason` 
                                        ? t(`ai.recommendations.components.${rec.partNumber}.reason`)
                                        : rec.reason}
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                      <div className="flex items-center space-x-1">
                                        <DollarSign className="w-3 h-3 text-green-600" />
                                        <span className="font-medium">{rec.price}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-orange-600" />
                                        <span>{rec.leadTime}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Badge variant={rec.stock > 5000 ? 'default' : rec.stock > 2000 ? 'secondary' : 'destructive'} className="text-xs">
                                          {rec.stock.toLocaleString()} {t('ai.recommendations.stock')}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                      <div>
                                        <p className="font-medium text-green-700 dark:text-green-400 mb-1">✓ {t('ai.recommendations.advantages')}:</p>
                                        <ul className="space-y-1">
                                          {rec.advantages.map((adv, i) => {
                                            const translatedAdv = language === 'ja' && t(`ai.recommendations.components.${rec.partNumber}.advantages.${i}`) !== `ai.recommendations.components.${rec.partNumber}.advantages.${i}`
                                              ? t(`ai.recommendations.components.${rec.partNumber}.advantages.${i}`)
                                              : adv;
                                            return (
                                              <li key={i} className="text-green-600 dark:text-green-400">• {translatedAdv}</li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="font-medium text-orange-700 dark:text-orange-400 mb-1">⚠ {t('ai.recommendations.considerations')}:</p>
                                        <ul className="space-y-1">
                                          {rec.considerations.map((con, i) => {
                                            const translatedCon = language === 'ja' && t(`ai.recommendations.components.${rec.partNumber}.considerations.${i}`) !== `ai.recommendations.components.${rec.partNumber}.considerations.${i}`
                                              ? t(`ai.recommendations.components.${rec.partNumber}.considerations.${i}`)
                                              : con;
                                            return (
                                              <li key={i} className="text-orange-600 dark:text-orange-400">• {translatedCon}</li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="flex justify-end mt-3 space-x-2">
                                      <Button variant="outline" size="sm">
                                        <Star className="w-3 h-3 mr-1" />
                                        {t('ai.recommendations.save')}
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleComponentClick(rec.partNumber)}
                                      >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        {t('ai.recommendations.details')}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-muted border rounded-2xl p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">{t('ai.thinking')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className="border-t p-4 bg-background">
                  <div className="flex space-x-4">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t('ai.inputPlaceholder')}
                      className="flex-1 min-h-[3rem] max-h-32 resize-none bg-background"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="w-80 space-y-4 bg-background">
            {/* Chat History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>{t('ai.chatHistory')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {chatHistory.map((history) => (
                    <div key={history.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => loadChatHistory(history.id)}
                      >
                        <p className="text-sm font-medium truncate text-foreground">{t(history.titleKey)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(history.timestamp, { addSuffix: true })} • {history.messageCount} messages
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteChatHistory(history.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                {chatHistory.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No chat history yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('ai.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => useQuickAction(t(action.queryKey))}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {t(action.labelKey)}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>{t('ai.suggestedQueries')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQueryKeys.map((queryKey, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 whitespace-normal text-xs"
                    onClick={() => useSuggestedQuery(t(queryKey))}
                  >
                    {t(queryKey)}
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t('ai.marketInsights')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-100">{t('ai.insights.criticalEOL')}</span>
                  </div>
                  <p className="text-xs text-red-800 dark:text-red-200">47 {t('ai.insights.criticalEOLDesc')}</p>
                </div>
                
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900 dark:text-orange-100">{t('ai.insights.leadTimes')}</span>
                  </div>
                  <p className="text-xs text-orange-800 dark:text-orange-200">{t('ai.insights.leadTimesDesc')}</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('ai.insights.newIntelligence')}</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200">15 {t('ai.insights.newIntelligenceDesc')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Macnica Expert Drawer */}
      <MacnicaExpertDrawer
        isOpen={showExpertDrawer}
        onClose={handleExpertDrawerClose}
        question={expertContext.question}
        aiAnswer={expertContext.answer}
      />
    </div>
  );
}
