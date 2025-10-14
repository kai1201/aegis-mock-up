# Extracted Prompts from Component Intelligence Project

This document catalogs all prompts, system messages, and AI-related templates found in the project.

## Overview

This React TypeScript project appears to be a component intelligence platform with AI assistance for electronic component analysis, supply chain management, and parts finding. The AI system uses various prompts and templates to generate responses about component alternatives, supply chain risks, and market analysis.

## 1. System Welcome Messages

### English Welcome Prompt
```
Hello! I'm your Component Intelligence assistant. I can help you with part analysis, EOL insights, cross-references, and supply chain risks. How can I assist you today?
```
**Location**: `src/contexts/LanguageContext.tsx` - `translations.en.ai.welcome`

### Japanese Welcome Prompt
```
こんにちは！私はコンポーネント・インテリジェンス・アシスタントです。部品分析、EOL洞察、クロスリファレンス、サプライチェーンリスクについてお手伝いできます。今日はどのようにお手伝いしましょうか？
```
**Location**: `src/contexts/LanguageContext.tsx` - `translations.ja.ai.welcome`

## 2. AI Response Generation Templates

### Component Alternative Response Template (English)
```
I've found 10 excellent alternatives for your component replacement needs. Each recommendation includes detailed compatibility analysis, supply chain assessment, and implementation considerations.

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

Would you like me to provide more detailed analysis for any specific alternatives, or help you compare options based on your priorities?
```
**Location**: `src/pages/AIAssistant.tsx` - `generateAIResponse` function

### Component Alternative Response Template (Japanese)
```
コンポーネント交換のニーズに対して10の優れた代替品を見つけました。各推奨事項には、詳細な互換性分析、サプライチェーン評価、実装に関する考慮事項が含まれています。

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

特定の代替品についてより詳細な分析を提供したり、優先順位に基づいてオプションを比較するお手伝いをしましょうか？
```

### Generic Query Response Template (English)
```
Based on your query "{query}", I can provide comprehensive analysis including market trends, supply chain risks, and strategic recommendations.

This analysis draws from our extensive database of component specifications, supplier intelligence, and real-time market data to give you actionable insights for your design and sourcing decisions.

For more specific recommendations, please let me know:
• Specific part numbers you're working with
• Your application requirements and constraints
• Timeline and volume considerations
• Preferred suppliers or manufacturers

I can help you find the best alternatives and assess supply chain risks for your components.
```
**Location**: `src/pages/AIAssistant.tsx` - `generateAIResponse` function

### Generic Query Response Template (Japanese)
```
お問い合わせ「{query}」に基づいて、市場動向、サプライチェーンリスク、戦略的推奨事項を含む包括的な分析を提供できます。

この分析は、コンポーネント仕様、サプライヤーインテリジェンス、リアルタイム市場データの広範なデータベースから得られ、設計と調達の決定に実用的な洞察を提供します。

より具体的な推奨事項については、以下をお知らせください：
• 作業中の特定の部品番号
• アプリケーション要件と制約
• タイムラインと数量の考慮事項
• 優先サプライヤーまたはメーカー

最適な代替品を見つけ、コンポーネントのサプライチェーンリスクを評価するお手伝いをします。
```

## 3. Quick Action Prompts

### English Quick Actions
- **Part Search**: "Find alternatives for STM32F407VGT6"
- **Risk Analysis**: "Analyze supply chain risks for my BOM"
- **Market Trends**: "Show market trends for power management ICs"

### Japanese Quick Actions
- **Part Search**: "STM32F407VGT6の代替品を検索"
- **Risk Analysis**: "私のBOMのサプライチェーンリスクを分析"
- **Market Trends**: "電源管理ICの市場動向を表示"

**Location**: `src/contexts/LanguageContext.tsx` - `translations.[lang].ai.quickActions`

## 4. Suggested Query Templates

### English Suggested Queries
1. "STM32F407VGT6の95%以上の互換性を持つ代替品を検索"
2. "What are the current supply chain risks for automotive MCUs?"
3. "Compare lead times between TI and ST microcontrollers"
4. "Which capacitor suppliers have the most stable pricing?"
5. "Show pin-compatible alternatives for LPC4088FET208"

### Japanese Suggested Queries
1. "95%以上の互換性を持つSTM32F407VGT6の代替品を検索"
2. "自動車用MCUの現在のサプライチェーンリスクは何ですか？"
3. "TIとSTマイクロコントローラーのリードタイムを比較"
4. "どのコンデンササプライヤーが最も安定した価格設定を持っていますか？"
5. "LPC4088FET208のピン互換代替品を表示"

**Location**: `src/contexts/LanguageContext.tsx` - `translations.[lang].ai.suggestedQuery`

## 5. Input Placeholders

### English
- "Ask about parts, risks, alternatives, or market trends..."

### Japanese
- "部品、リスク、代替品、市場動向について質問してください..."

**Location**: `src/contexts/LanguageContext.tsx` - `translations.[lang].ai.inputPlaceholder`

## 6. AI Panel Context Prompts

### Default AI Panel Prompt
```
Hello! I'm your Component Risk Intelligence assistant. I can help you with part analysis, EOL insights, cross-references, and supply chain risks. How can I assist you today?
```

### Contextual AI Panel Prompt
```
I can help you understand the data in this context. What would you like to know?
```

**Location**: `src/components/AIPanel.tsx`

## 7. Component Detail Assistant Prompt

```
Hello! I'm your EOL Intelligence assistant for {partNumber}.
```

**Location**: `src/pages/ComponentDetail.tsx`

## 8. Component Recommendation Reasoning Templates

The system includes detailed reasoning templates for component recommendations including:

- **Compatibility Analysis**: Technical match scoring with weighted criteria
- **Supply Chain Assessment**: Lead times, stock levels, risk factors
- **Implementation Guidance**: PCB compatibility, firmware changes, validation checklists
- **EOL Risk Assessment**: Lifecycle status, stability indicators

**Location**: Various components in `src/components/` and reasoning logic

## 9. Market Insights Templates

### Critical Alerts
- "47 components entering last-time-buy phase"
- "Average increase across semiconductor categories"
- "15 market intelligence reports published this week"

**Location**: `src/contexts/LanguageContext.tsx` - `translations.[lang].ai.insights`

## 10. Expert Escalation Prompts

### Escalation Message
```
Our AI has limited context for complex technical decisions. A Macnica expert can provide deeper insights.
```

### Contact Form Instructions
```
Please describe what was missing or unclear in the AI response, or provide additional context for your inquiry...
```

**Location**: `src/contexts/LanguageContext.tsx` - `translations.[lang].macnicaExpert`

## Architecture Notes

1. **Multi-language Support**: All prompts are internationalized with English and Japanese versions
2. **Context-Aware Responses**: Different prompts are used based on the user's current context (component detail, BOM analysis, etc.)
3. **Dynamic Content**: Prompts include placeholder variables for personalization (part numbers, quantities, etc.)
4. **Escalation Path**: Built-in fallback to human experts when AI responses are insufficient
5. **Component-Specific Data**: The system includes detailed component specifications and recommendations that feed into response generation

## Usage Patterns

The prompt system is designed around:
- **Component analysis and alternatives**
- **Supply chain risk assessment** 
- **EOL (End of Life) predictions**
- **Cross-reference matching**
- **Market intelligence and trends**
- **Cost optimization recommendations**

This appears to be a sophisticated B2B platform for electronics professionals working with component sourcing and supply chain management.
