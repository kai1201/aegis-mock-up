import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      partFinder: 'Part Finder',
      compareParts: 'Compare Parts',
      bomAnalyzer: 'BOM Analyzer',
      rfqManager: 'RFQ Manager',
      aiAssistant: 'AI Assistant',
    },
    
    // Layout
    layout: {
      searchPlaceholder: 'Search parts, suppliers, or documents...',
    },
    
    // Home page
    home: {
      title: 'Component Intelligence Dashboard',
      subtitle: 'Real-time insights into component lifecycle, supply chain risks, and market intelligence',
      breakingNews: 'Breaking News',
      newProducts: 'New Products',
      columnsInsights: 'Columns & Insights',
      loadMore: 'Load More Articles',
      seeAll: 'See All Columns',
      
      // Search states
      searchingComponents: 'Searching components...',
      searchFailed: 'Search failed. Please try again.',
      whatComponentLookingFor: 'What component are you looking for?',
      trySearchingBy: 'Try searching by part number, manufacturer, or description',
      noSuggestionsFound: 'No suggestions found.',
      suggestions: 'Suggestions',
      
      // Categories
      categories: 'Categories',
      activeComponents: 'Active Components',
      passiveComponents: 'Passive Components',
      connectors: 'Connectors',
      electromechanical: 'Electromechanical',
      
      // Manufacturers
      manufacturers: 'Manufacturers',
      
      // Lifecycle
      lifecycleStatus: 'Lifecycle Status',
      active: 'Active',
      currentlyInProduction: 'Currently in production',
      nrnd: 'NRND',
      notRecommendedNewDesigns: 'Not recommended for new designs',
      ltb: 'LTB',
      lastTimeBuyOpportunity: 'Last time buy opportunity',
      obsolete: 'Obsolete',
      noLongerAvailable: 'No longer available',
      
      // Quick actions
      findAlternatives: 'Find Alternatives',
      analyzeBOMRisk: 'Analyze BOM Risk',
      
      // Recent searches and favorites
      recentSearches: 'Recent Searches',
      favoriteComponents: 'Favorite Components',
      
      // Sidebar
      quickTools: 'Quick Tools',
      bomUpload: 'BOM Upload',
      aiExpert: 'AI Expert',
      needHelp: 'Need Help?',
      needHelpDescription: 'Get assistance with component selection, cross-referencing, and supply chain analysis.',
      contactSupport: 'Contact Support',
    },
    
    // Stats
    stats: {
      activeEOL: 'Active EOL',
      leadTimeIncrease: 'Lead Time Increase',
      newProducts: 'New Products',
      supplyChainHealth: 'Supply Chain Health',
    },
    
    // AI Assistant
    ai: {
      title: 'AI Assistant',
      subtitle: 'Get intelligent insights about components, supply chains, and market trends',
      componentIntelligenceAssistant: 'Component Intelligence Assistant',
      welcome: 'Hello! I\'m your Component Intelligence assistant. I can help you with part analysis, EOL insights, cross-references, and supply chain risks. How can I assist you today?',
      thinking: 'Analyzing...',
      inputPlaceholder: 'Ask about parts, risks, alternatives, or market trends...',
      chatHistory: 'Chat History',
      suggestedQuerie: 'Suggested Queries',
      marketInsights: 'Market Insights',
      assistantResponse: 'AI Assistant Response',
      generated: 'AI Generated',
      wasThisHelpful: 'Was this helpful?',
      helpful: 'Yes',
      notHelpful: 'No',
      needMoreHelp: 'Need more help?',
      aiLimitedContext: 'Our AI has limited context for complex technical decisions. A Macnica expert can provide deeper insights.',
      contactMacnicaExpert: 'Contact Macnica Expert',
      thankYouFeedback: 'Thank you for your feedback!',
      
      // Quick actions
      quickActions: {
        partSearch: 'Part Search',
        riskAnalysis: 'Risk Analysis',
        marketTrends: 'Market Trends',
        searchAlternatives: 'Find alternatives for STM32F407VGT6',
        analyzeRisks: 'Analyze supply chain risks for my BOM',
        marketTrendsFor: 'Show market trends for power management ICs',
      },
      
      // Suggested queries
      suggestedQueries: {
        // Ensure all keys within this object are unique
        findAlternatives: 'Find alternatives with 95%+ compatibility for STM32F407VGT6',
        supplyRisks: 'What are the current supply chain risks for automotive MCUs?',
        compareLeadTimes: 'Compare lead times between TI and ST microcontrollers',
        capacitorSuppliers: 'Which capacitor suppliers have the most stable pricing?',
        pinCompatible: 'Show pin-compatible alternatives for LPC4088FET208',
      },
      
      // Market insights
      insights: {
        criticalEOL: 'Critical EOL',
        criticalEOLDesc: 'components entering last-time-buy phase',
        leadTimes: 'Lead Times',
        leadTimesDesc: 'Average increase across semiconductor categories',
        newIntelligence: 'New Intelligence',
        newIntelligenceDesc: 'market intelligence reports published this week',
      },
    },
    
    // Part Finder
    partfinder: {
      title: 'Part Finder (Advanced)',
      subtitle: 'Find cross-references and alternatives with detailed compatibility analysis',
      searchFilters: 'Search & Filters',
      enterPartNumber: 'Enter part number to find alternatives...',
      searchAlternatives: 'Search Alternatives',
      uploadBOM: 'Upload BOM',
      bomBatch: 'BOM Batch Processing',
      dropBOMFile: 'Drop your BOM file here',
      uploadBOMBatch: 'Drag & drop your BOM file here, or click to browse\nSupports CSV, XLS, XLSX formats',
      advancedFilters: 'Advanced Filters',
      compatibility: 'Compatibility',
      packageFootprint: 'Package/Footprint Match',
      pinoutCompatible: 'Pinout Compatible',
      aecQualified: 'AEC-Q Qualified',
      electricalRanges: 'Electrical Ranges',
      voltageRange: 'Voltage Range',
      temperatureRange: 'Temperature Range',
      supplyChain: 'Supply Chain',
      maxMOQ: 'Max MOQ',
      maxLeadTime: 'Max Lead Time',
      presetsActions: 'Presets & Actions',
      loadPreset: 'Load Preset',
      automotiveGrade: 'Automotive Grade',
      industrialTemp: 'Industrial Temp',
      consumerElectronics: 'Consumer Electronics',
      save: 'Save',
      export: 'Export',
      alternativesFound: 'alternatives found',
      foundAlternatives: 'Found',
      alternativesFor: 'for',
      selectedForComparison: 'selected for comparison',
      compareSelected: 'Compare Selected',
      exportResults: 'Export Results',
      addSelectedToBOM: 'Add Selected to BOM',
      backToSearch: 'Back to Search',
      backToHome: 'Back to Home',
      
      // Table columns
      partNumber: 'Part Number',
      manufacturer: 'Manufacturer',
      price: 'Price',
      leadTime: 'Lead Time',
      stock: 'Stock',
      risk: 'Risk',
      actions: 'Actions',
      showReasoning: 'Why?',
      
      // Comparison
      comparison: 'Comparison',
      compareSelectedParts: 'Compare Selected Parts',
    },
    
    // BOM Analyzer
    bom: {
      title: 'BOM Analyzer',
      subtitle: 'Analyze your Bill of Materials for supply chain risks and cost optimization opportunities',
      uploadBOMFile: 'Recent BOM Projects',
      uploadTitle: 'Upload BOM File',
      dragDropBOM: 'Drag & drop your BOM file here, or click to browse',
      uploadSupports: 'Supports CSV, XLS, XLSX formats',
      processingBOM: 'Processing BOM...',
      askAI: 'Ask AI',
      
      // Stats
      totalItems: 'Total Items',
      criticalRisk: 'Critical Risk',
      highRisk: 'High Risk',
      mediumRisk: 'Medium Risk',
      riskScore: 'Risk Score',
      
      // Table columns
      refDes: 'Ref Des',
      partNumber: 'Part Number',
      supplier: 'Supplier',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      leadTime: 'Lead Time',
      riskFactors: 'Risk Factors',
      suggestedReplacement: 'Suggested Replacement',
      compatible: 'compatible',
      totalSavings: 'total savings',
      addToRFQSingle: 'Add to RFQ',
      
      // Actions
      exportRisk: 'Export Risk Report',
      exportReplacements: 'Export with Replacements',
      applyReplacements: 'Apply All Suggested Replacements',
      itemsSelected: 'items selected',
      addToRFQ: 'Add to RFQ',
      quickRFQCreation: 'Quick RFQ Creation',
      selectComponentsRFQ: 'Select components above to quickly create an RFQ for quotes and alternatives.',
      
      // Risk alerts
      highRiskDetected: 'High Risk Components Detected',
      highRiskDescription: 'components require immediate attention due to EOL or supply chain issues.',
      addAllHighRisk: 'Add All High Risk to RFQ',
      
      // Cost analysis
      costImpact: 'Cost Impact',
      riskAnalysis: 'Risk Analysis',
      bomCostScenarios: 'BOM Cost Scenarios',
      originalParts: 'Original Parts',
      selectedAlternatives: 'Selected Alternatives',
      cheapestViable: 'Cheapest Viable',
      currentBOMCost: 'Current BOM Cost',
      withAlternatives: 'With Alternatives',
      estimatedSaving: 'Estimated saving',
      perBuild: 'per build',
      cheapestViableOption: 'Cheapest Viable Option',
      maximumPotentialSaving: 'Maximum potential saving',
      riskDistribution: 'Risk Distribution',
      riskSummary: 'Risk Summary',
      exportOptions: 'Export Options',
      costImpactReport: 'Cost Impact Report',
      bomWithAlternatives: 'BOM with Alternatives',
      costAnalysisData: 'Cost Analysis Data',
    },
    
    // RFQ Manager
    rfq: {
      title: 'RFQ Manager',
      subtitle: 'Create and manage Request for Quotation documents with suppliers',
      createNewRFQ: 'Create New RFQ',
      list: 'RFQ List',
      createNew: 'Create New',
      
      // Filters
      searchPlaceholder: 'Search RFQs by title, ID, or supplier...',
      statusFilter: 'Filter by Status',
      supplierFilter: 'Filter by Supplier',
      allStatus: 'All Status',
      allSuppliers: 'All Suppliers',
      
      // Status
      draft: 'Draft',
      sent: 'Sent',
      pending: 'Pending',
      answered: 'Answered',
      closed: 'Closed',
      
      // Stats
      totalRFQs: 'Total RFQs',
      totalValue: 'Total Value',
      
      // Table columns
      rfqId: 'RFQ ID',
      titleHeader: 'Title',
      status: 'Status',
      suppliersHeader: 'Suppliers',
      responses: 'Responses',
      needBy: 'Need By',
      lastActivity: 'Last Activity',
      actions: 'Actions',
      items: 'items',
      
      // Form
      'title.label': 'RFQ Title',
      titlePlaceholder: 'Enter descriptive title for this RFQ...',
      needByDate: 'Need By Date',
      uploadBOMFile: 'Upload BOM File',
      dropBOMHere: 'Drop your BOM file here',
      dragDropBOM: 'Drag & drop your BOM file here, or click to browse',
      supportedFormats: 'Supports CSV, XLS, XLSX formats',
      addItem: 'Add Item',
      partNumber: 'Part Number',
      manufacturer: 'Manufacturer',
      description: 'Description',
      quantity: 'Quantity',
      targetPrice: 'Target Price',
      notes: 'Notes',
      additionalSpecs: 'Additional specifications, requirements, or special instructions...',
      
      // Actions
      create: 'Create RFQ',
      cart: 'RFQ Cart',
      created: 'Created',
      qty: 'Qty',
      target: 'Target',
      editDetails: 'Edit Details',
      clearAll: 'Clear All',
      itemRemoved: 'Item removed from RFQ',
      createdSuccessfully: 'RFQ created successfully',
      
      // From BOM
      fromBOMAnalyzer: 'From BOM Analyzer',
      reviewCustomize: 'Review and customize {count} components from your BOM analysis',
    },
    
    // RFQ Detail
    rfqDetail: {
      backToRFQs: 'Back to RFQs',
      exportSummary: 'Export Summary',
      sendToMoreSuppliers: 'Send to More Suppliers',
      rfqDetails: 'RFQ Details',
      totalItems: 'Total Items',
      estValue: 'Est. Value',
      needBy: 'Need By',
      notSpecified: 'Not specified',
      suppliers: 'Suppliers',
      notes: 'Notes',
      requestedItems: 'Requested Items',
      qty: 'Qty',
      target: 'Target',
      quotationSummary: 'Quotation Summary',
      validUntil: 'Valid until',
      terms: 'Terms',
      qaThread: 'Q&A Thread',
      all: 'All',
      supplier: 'Supplier',
      quotationDetails: 'Quotation Details',
      leadTime: 'Lead Time',
      stock: 'Stock',
      alternativeSuggested: 'Alternative suggested',
      askQuestion: 'Ask a question or request clarification...',
      
      // Sample content keys
      q1ProductionComponents: 'Q1 Production Components',
      q1ProductionNotes: 'Q1生産ランに必要なコンポーネント。表示された数量に対する最良の価格を提供してください。',
      thankYouRFQ: 'Thank you for your RFQ. We have reviewed your requirements and prepared a competitive quotation.',
      confirmLeadTime: 'Can you confirm the lead time for {partNumber}? Our production schedule is tight.',
      stockAvailable: 'Yes, we have {stock} units of {partNumber} in stock. Lead time is confirmed at {leadTime}.',
      competitiveQuotation: 'We are pleased to provide a competitive quotation for your requirements.',
      volumePricing: 'Volume pricing available for 5K+ quantities',
      specialPricing: 'Special pricing for quantities over 1K',
      allItemsInStock: 'All items in stock and ready to ship. Volume discounts available.',
      freeShipping: 'Free shipping on orders over $500. Extended warranty available.',
    },
    
    // Component Detail
    component: {
      overview: 'Overview',
      specs: 'Specs',
      supply: 'Supply',
      eolInsights: 'EOL Insights',
      alternatives: 'Alternatives',
      documents: 'Documents',
      basicInfo: 'Basic Information',
      partNumber: 'Part Number',
      manufacturer: 'Manufacturer',
      category: 'Category',
      releaseYear: 'Release Year',
      longevityProgram: 'Longevity Program',
      riskAssessment: 'Risk Assessment',
      eolPrediction: 'EOL Prediction',
      leadTime: 'Lead Time',
      priceRange: 'Price Range',
      stock: 'Stock',
      units: 'units',
      technicalSpecs: 'Technical Specifications',
      packagePhysical: 'Package & Physical',
      componentPackage: 'Package',
      pinCount: 'Pin Count',
      temperatureRange: 'Temperature Range',
      electrical: 'Electrical',
      voltage: 'Voltage',
      current: 'Current',
      power: 'Power',
      performance: 'Performance',
      frequencyCpu: 'Frequency/CPU',
      memory: 'Memory',
      processNode: 'Process Node',
      leadTimeTrend: 'Lead Time Trend',
      priceTrend: 'Price Trend',
      supplyChain: 'Supply Chain Information',
      currentLeadTime: 'Current Lead Time',
      availableStock: 'Available Stock',
      approvedDistributors: 'Approved Distributors',
      
      // Documents section
      datasheetDocumentation: 'Datasheet & Documentation',
      officialDatasheet: 'Official Datasheet (Rev 5)',
      completeTechnicalSpecs: 'Complete technical specifications',
      applicationNotes: 'Application Notes',
      designGuidelines: 'Design guidelines and examples',
      productRoadmap: 'Product Roadmap',
      futureProductPlans: 'Future product plans and migration path',
      pcnPdnDocuments: 'PCN/PDN Documents',
      officialChangeNotification: 'Official change notification',
      documentsSourced: 'All documents are sourced directly from manufacturer websites and official distributor channels. Links are verified and updated regularly to ensure data integrity.',
      graphLayer: 'Graph Layer',
      aiEolAssistant: 'AI EOL Assistant',
      leadTimePriceTrends: 'Lead Time & Price Trends',
      stockLevelsOverTime: 'Stock Levels Over Time',
      eolIntelligenceAssistant: 'EOL Intelligence Assistant',
      online: 'Online',
      askEolQuestions: 'Ask questions about EOL status, alternatives, and migration strategies',
    },
    
    // Cross Reference
    crossRef: {
      title: 'Cross-Reference Analysis',
      subtitle: 'Detailed comparison of {count} components',
      specification: 'Specification',
      original: 'Original',
      alternative: 'Alternative',
      showOnlyDifferences: 'Show only differences',
      match: 'Match',
      partial: 'Partial',
      mismatch: 'Mismatch',
      compatibility: 'Compatibility',
      addSelectedToBOM: 'Add Selected to BOM',
      exportExcel: 'Export Excel',
      exportPDF: 'Export PDF',
      explainDifferences: 'Explain Differences',
      packageMechanical: 'Package & Mechanical',
      electricalCharacteristics: 'Electrical Characteristics',
      memoryPerformance: 'Memory & Performance',
      interfacesPeripherals: 'Interfaces & Peripherals',
      environmental: 'Environmental',
      supplyCost: 'Supply & Cost',
      lifecycleSupply: 'Lifecycle & Supply',
      priceDisclaimer: 'Price Disclaimer',
      priceDisclaimerText: 'Prices shown are indicative and may vary by region, quantity, and supplier. Use RFQ for official quotes.',
    },
    
    // Reasoning
    reasoning: {
      summaryTab: 'Summary',
      compatibilityTab: 'Compat',
      supplyTab: 'Supply',
      eolReasoningTab: 'EOL',
      risksTab: 'Risks',
      implementationTab: 'Impl',
      sourcesTab: 'Sources',
      copySummary: 'Copy Summary',
      exportPDF: 'Export PDF',
      addToBOM: 'Add to BOM',
      askAI: 'Ask AI',
      keyTakeaways: 'Key Takeaways',
      replacement: 'replacement',
      compatibilityWith: 'compatibility with original part',
      minorFirmwareAdjustments: 'Minor firmware adjustments needed',
      adcRegisterMapping: 'ADC register mapping differences require code updates',
      betterAvailability: 'Better availability and lead time',
      vsOriginal: 'vs original',
      weeks: 'weeks',
      unitsInStock: 'units in stock',
      eolRisk: 'EOL Risk',
      stableWithLongevity: 'Stable signals with longevity commitment',
      mixedSignals: 'Mixed signals - monitor closely',
      multipleRiskFactors: 'Multiple risk factors detected',
      recommendation: 'Recommendation',
      useAsDropIn: 'Use as drop-in replacement',
      useWithVerification: 'Use with verification testing',
      evaluateCarefully: 'Evaluate carefully for your application',
      excellentDropIn: 'Excellent drop-in candidate with minimal risk',
      goodAlternative: 'Good alternative with manageable changes',
      considerBackup: 'Consider as backup option or for new designs',
      compatibilityBreakdown: 'Compatibility Breakdown',
      technicalMatchAnalysis: 'Technical Match Analysis',
      scoredMatrix: 'Weighted scoring matrix based on design requirements',
      weight: 'weight',
      pass: 'Pass',
      partial: 'Partial',
      fail: 'Fail',
      requirement: 'Requirement',
      alternative: 'Alternative',
      assessment: 'Assessment',
      
      // Criterion names
      packageFootprintPinout: 'Package/Footprint/Pinout',
      electricalLimits: 'Electrical Limits',
      timingPerformance: 'Timing/Performance',
      protocolsInterfaces: 'Protocols/Interfaces',
      thermalEnvironment: 'Thermal Environment',
      mechanical: 'Mechanical',
      regulatoryQuality: 'Regulatory/Quality',
      firmwareDriverImpact: 'Firmware/Driver Impact',
      formFitFunction: 'Form/Fit/Function',
      
      // Criterion comments
      identicalFootprint: 'Identical footprint and pinout',
      slightlyLowerCurrent: 'Slightly lower current consumption',
      higherPerformance: 'Higher performance than required',
      allRequiredInterfaces: 'All required interfaces present',
      identicalTemperature: 'Identical temperature range',
      samePackageDimensions: 'Same package dimensions',
      meetsRegulatory: 'Meets all regulatory requirements',
      minorRegisterDifferences: 'Minor register differences in ADC',
      sameFunctionalCategory: 'Same functional category',
      
      // Supply info
      lifecycleStatus: 'Lifecycle Status',
      status: 'Status',
      lastUpdated: 'Last Updated',
      longevityProgram: 'Longevity Program',
      year: 'year',
      supplyChain: 'Supply Chain',
      moq: 'MOQ',
      pcs: 'pcs',
      stockLevel: 'Stock Level',
      approvedDistributors: 'Approved Distributors',
      inStock: 'In Stock',
      
      // EOL signals
      activeStatus: 'Active status confirmed',
      stableManufacturing: 'Stable manufacturing process',
      marketDemand: 'Strong market demand',
      officialCommitment: 'Official longevity commitment',
      priceStability: 'Price stability indicators',
      
      // Risks
      impact: 'Impact',
      mitigation: 'Mitigation',
      
      // Implementation
      implementationGuide: 'Implementation Guide',
      pcbCompatibility: 'PCB Compatibility',
      solderLandPattern: 'Solder land pattern matches exactly',
      verifyDecoupling: 'Verify decoupling capacitor placement',
      noPcbChanges: 'No PCB changes required',
      firmwareChanges: 'Firmware Changes Required',
      updateAdcInit: 'Update ADC initialization registers',
      verifyClockConfig: 'Verify clock configuration settings',
      testPeripherals: 'Test all peripheral functions',
      estimatedEffort: 'Estimated effort: 0.5-1 day',
      validationChecklist: 'Validation Checklist',
      powerConsumption: 'Verify power consumption within budget',
      thermalTesting: 'Perform thermal testing under load',
      communicationInterfaces: 'Test all communication interfaces',
      adcAccuracy: 'Validate ADC accuracy and linearity',
      usbOtgFunctionality: 'Verify USB OTG functionality',
      
      // Sources
      citationsSources: 'Citations & Sources',
      needsVerification: 'Needs Verification',
      lastAccessed: 'Last accessed',
      sourceVerification: 'Source Verification',
      sourceVerificationText: 'Some sources require verification. Please validate critical information with official manufacturer documentation.',
      
      // EOL assessment
      overallEolAssessment: 'Overall EOL Assessment',
      strongStability: 'Strong stability indicators with official longevity commitment through 2034',
      mixedSignalsDetected: 'Mixed signals detected - recommend monitoring and preparing alternatives',
      multipleRiskFactorsPresent: 'Multiple risk factors present - plan migration within 12-18 months',
    },
    
    // Common
    common: {
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      more: 'more',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
    },

    // Macnica Expert Contact
    macnicaExpert: {
      title: 'Contact Macnica Expert',
      subtitle: 'Get human expert assistance for your inquiry',
      expertSupport: 'Expert Support',
      responseTime: 'Response within 24 hours',
      yourQuestion: 'Your Original Question',
      aiResponse: 'AI Assistant\'s Response',
      truncated: '... (truncated)',
      fullName: 'Full Name',
      company: 'Company',
      email: 'Email Address',
      additionalDetails: 'Additional Details',
      detailsPlaceholder: 'Please describe what was missing or unclear in the AI response, or provide additional context for your inquiry...',
      namePlaceholder: 'Your full name',
      companyPlaceholder: 'Your company name',
      emailPlaceholder: 'your.email@company.com',
      cancel: 'Cancel',
      send: 'Send to Macnica',
      sending: 'Sending...',
      successTitle: 'Request Submitted Successfully',
      successMessage: 'Your inquiry has been sent. A Macnica expert will follow up shortly.',
      errorTitle: 'Unable to Send Request',
      tryAgain: 'Try Again',
      privacyNotice: 'Privacy Notice:',
      privacyText: 'Your inquiry will be sent to Macnica\'s expert support team.',
      urgentMatters: 'For urgent matters, you can also contact us directly at',
      requiredField: '*',
    },

    // Compare Parts
    compareParts: {
      title: 'Compare Parts',
      subtitle: 'Compare 2-4 components side by side to make informed decisions',
      exportCSV: 'Export CSV',
      exportPDF: 'Export PDF',
      selectedParts: 'Selected Parts',
      clearAll: 'Clear All',
      noPartsSelected: 'No parts selected for comparison',
      searchAndAdd: 'Search and add parts below to start comparing',
      primary: 'Primary',
      setPrimary: 'Set Primary',
      addPartsToCompare: 'Add Parts to Compare',
      searchPlaceholder: 'Search by MPN, manufacturer, or description...',
      add: 'Add',
      aiAnalysis: 'AI Analysis',
      
      // Tab names
      tabs: {
        overview: 'Overview',
        package: 'Package',
        specifications: 'Specifications',
        supply: 'Supply Chain',
        compliance: 'Compliance',
        longevity: 'Longevity',
      },
      
      // Table headers
      headers: {
        property: 'Property',
        manufacturer: 'Manufacturer',
        description: 'Description',
        category: 'Category',
        lifecycle: 'Lifecycle',
        riskLevel: 'Risk Level',
        packageType: 'Package Type',
        leadTime: 'Lead Time',
        price: 'Price',
        stock: 'Stock',
        rohs: 'RoHS Compliant',
        reach: 'REACH Compliant',
        conflictFree: 'Conflict Free',
        expectedEol: 'Expected EOL',
        supportYears: 'Support Years',
        replacementStatus: 'Replacement Status',
        specification: 'Specification',
      },
      
      // Values
      values: {
        active: 'Active',
        nrnd: 'NRND',
        obsolete: 'Obsolete',
        yes: 'Yes',
        no: 'No',
        weeks: 'weeks',
        years: 'years',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical',
      },
      
      // AI Analysis text
      analysis: {
        betterLeadTime: 'has the best lead time',
        longestSupport: 'offers the longest support',
        mostCostEffective: 'is most cost-effective',
        lowestRisk: 'has the lowest supply risk',
      },
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      settings: 'Settings',
      markAllAsRead: 'Mark All as Read',
      noNotifications: 'No notifications',
      alertTypes: 'Alert Types',
      deliveryMethods: 'Delivery Methods',

      // Alert type labels
      eolAnnouncements: 'EOL Announcements',
      eolAnnouncementsDesc: 'Get notified when parts are discontinued',
      leadTimeChanges: 'Lead Time Changes',
      leadTimeChangesDesc: 'Alert when lead times exceed threshold',
      priceIncreases: 'Price Increases',
      priceIncreasesDesc: 'Monitor price changes above threshold',
      lowStock: 'Low Stock',
      lowStockDesc: 'Inventory level alerts',
      pcnPdnDocuments: 'PCN/PDN Documents',
      pcnPdnDocumentsDesc: 'Product change notifications',
      supplierNews: 'Supplier News',
      supplierNewsDesc: 'Updates from followed suppliers',

      // Delivery methods
      inAppNotifications: 'In-App Notifications',
      inAppNotificationsDesc: 'Show notifications within the application',
      emailAlerts: 'Email Alerts',
      emailAlertsDesc: 'Send notifications via email',
      weeklyDigest: 'Weekly Digest',
      weeklyDigestDesc: 'Weekly summary of all notifications',
    },
  },
  ja: {
    // Navigation
    nav: {
      home: 'ホーム',
      partFinder: 'パーツファインダー',
      compareParts: '部品比較',
      bomAnalyzer: 'BOM分析',
      rfqManager: 'RFQ管理',
      aiAssistant: 'AIアシスタント',
    },
    
    // Layout
    layout: {
      searchPlaceholder: '部品、サプライヤー、ドキュメントを検索...',
    },
    
    // Home page
    home: {
      title: 'コンポーネント・インテリジェンス・ダッシュボード',
      subtitle: 'コンポーネントライフサイクル、サプライチェーンリスク、市場インテリジェンスのリアルタイム洞察',
      breakingNews: '速報ニュース',
      newProducts: '新製品',
      columnsInsights: 'コラム・洞察',
      loadMore: 'さらに記事を読む',
      seeAll: 'すべてのコラムを見る',
      
      // Search states
      searchingComponents: 'コンポーネント検索中...',
      searchFailed: '検索に失敗しました。再試行してください。',
      whatComponentLookingFor: 'どのコンポーネントをお探しですか？',
      trySearchingBy: '部品番号、メーカー、または説明で検索してみてください',
      noSuggestionsFound: '提案が見つかりません。',
      suggestions: '提案',
      
      // Categories
      categories: 'カテゴリ',
      activeComponents: 'アクティブコンポーネント',
      passiveComponents: 'パッシブコンポーネント',
      connectors: 'コネクタ',
      electromechanical: '電気機械',
      
      // Manufacturers
      manufacturers: 'メーカー',
      
      // Lifecycle
      lifecycleStatus: 'ライフサイクルステータス',
      active: 'アクティブ',
      currentlyInProduction: '現在生産中',
      nrnd: 'NRND',
      notRecommendedNewDesigns: '新しい設計には推奨されません',
      ltb: 'LTB',
      lastTimeBuyOpportunity: 'ラストタイムバイの機会',
      obsolete: '廃止',
      noLongerAvailable: '利用できません',
      
      // Quick actions
      findAlternatives: '代替品を検索',
      analyzeBOMRisk: 'BOMリスクを分析',
      
      // Recent searches and favorites
      recentSearches: '最近の検索',
      favoriteComponents: 'お気に入りコンポーネント',
      
      // Sidebar
      quickTools: 'クイックツール',
      bomUpload: 'BOMアップロード',
      aiExpert: 'AI専門家',
      needHelp: 'サポートが必要ですか？',
      needHelpDescription: 'コンポーネント選択、クロスリファレンス、サプライチェーン分析のサポートを受けられます。',
      contactSupport: 'サポートに連絡',
    },
    
    // Stats
    stats: {
      activeEOL: 'アクティブEOL',
      leadTimeIncrease: 'リードタイム増加',
      newProducts: '新製品',
      supplyChainHealth: 'サプライチェーン健全性',
    },
    
    // AI Assistant
    ai: {
      title: 'AIアシスタント',
      subtitle: 'コンポーネント、サプライチェーン、市場動向に関するインテリジェントな洞察を取得',
      componentIntelligenceAssistant: 'コンポーネント・インテリジェンス・アシスタント',
      welcome: 'こんにちは！私はコンポーネント・インテリジェンス・アシスタントです。部品分析、EOL洞察、クロスリファレンス、サプライチェーンリスクについてお手伝いできます。今日はどのようにお手伝いしましょうか？',
      thinking: '分析中...',
      inputPlaceholder: '部品、リスク、代替品、市場動向について質問してください...',
      chatHistory: 'チャット履歴',
      suggestedQuerie: '推奨クエリ',
      marketInsights: '市場洞察',
      assistantResponse: 'AIアシスタント応答',
      generated: 'AI生成',
      wasThisHelpful: 'これは役に立ちましたか？',
      helpful: 'はい',
      notHelpful: 'いいえ',
      needMoreHelp: 'さらにサポートが必要ですか？',
      aiLimitedContext: '私たちのAIは複雑な技術的決定に対して限られたコンテキストを持っています。マクニカの専門家がより深い洞察を提供できます。',
      contactMacnicaExpert: 'マクニカ専門家に連絡',
      thankYouFeedback: 'フィードバックをありがとうございます！',
      
      // Quick actions
      quickActions: {
        partSearch: '部品検索',
        riskAnalysis: 'リスク分析',
        marketTrends: '市場動向',
        searchAlternatives: 'STM32F407VGT6の代替品を検索',
        analyzeRisks: '私のBOMのサプライチェーンリスクを分析',
        marketTrendsFor: '電源管理ICの市場動向を表示',
      },
      
      // Suggested queries
      suggestedQueries: {
        findAlternatives: '95%以上の互換性を持つSTM32F407VGT6の代替品を検索',
        supplyRisks: '自動車用MCUの現在のサプライチェーンリスクは何ですか？',
        compareLeadTimes: 'TIとSTマイクロコントローラーのリードタイムを比較',
        capacitorSuppliers: 'どのコンデンササプライヤーが最も安定した価格設定を持っていますか？',
        pinCompatible: 'LPC4088FET208のピン互換代替品を表示',
      },
      
      // Market insights
      insights: {
        criticalEOL: '重要なEOL',
        criticalEOLDesc: 'コンポーネントがラストタイムバイフェーズに入る',
        leadTimes: 'リードタイム',
        leadTimesDesc: '半導体カテゴリ全体の平均増加',
        newIntelligence: '新しいインテリジェンス',
        newIntelligenceDesc: '今週公開された市場インテリジェンスレポート',
      },
      
      // Component recommendations
      recommendations: {
        recommendedAlternatives: '推奨代替品',
        compatibility: '互換性',
        compatible: '互換',
        lowRisk: '低リスク',
        mediumRisk: '中リスク',
        highRisk: '高リスク',
        stock: '在庫',
        advantages: '利点',
        considerations: '考慮事項',
        save: '保存',
        details: '詳細',
        
        // Component-specific translations
        components: {
          'STM32F405VGT6': {
            reason: '同じファミリー、軽微な性能差でピン互換',
            advantages: [
              'ドロップイン代替品',
              '低消費電力',
              'より良い可用性'
            ],
            considerations: [
              'わずかに低いクロック速度',
              '周辺機能の削減'
            ]
          },
          'LPC4088FET208': {
            reason: '類似の性能特性を持つARM Cortex-M4',
            advantages: [
              'より短いリードタイム',
              '良好な在庫可用性',
              '競争力のある価格'
            ],
            considerations: [
              '異なる周辺機能セット',
              'パッケージサイズの違い',
              'ツールチェーンの移行が必要'
            ]
          },
          'TM4C1294NCPDT': {
            reason: '統合イーサネット付き高性能MCU',
            advantages: [
              '内蔵イーサネットPHY',
              '優れた可用性',
              '強力なエコシステムサポート'
            ],
            considerations: [
              '異なるアーキテクチャ',
              'コード移植が必要',
              '学習曲線'
            ]
          },
          'SAMV71Q21B': {
            reason: 'より高い性能を提供するARM Cortex-M7',
            advantages: [
              '優れた性能',
              '高度なセキュリティ機能',
              '良好な長期サポート'
            ],
            considerations: [
              'より高い消費電力',
              'シンプルなアプリケーションには過剰',
              '価格プレミアム'
            ]
          },
          'EFM32GG11B820F2048GL192': {
            reason: '大容量メモリ付き超低消費電力MCU',
            advantages: [
              '優れた電力効率',
              '大容量メモリオプション',
              '良好な可用性'
            ],
            considerations: [
              '低い性能',
              '異なる開発ツール',
              '限定的なエコシステム'
            ]
          },
          'ATSAMD51P20A': {
            reason: '浮動小数点ユニット付きARM Cortex-M4F',
            advantages: [
              'コスト効率',
              '良好な性能/価格比',
              'メーカーコミュニティサポート'
            ],
            considerations: [
              '異なるピンレイアウト',
              '限定的な産業用温度範囲',
              '小さなエコシステム'
            ]
          },
          'S32K344NHT1VPBST': {
            reason: '安全機能付き自動車グレードMCU',
            advantages: [
              '自動車認定',
              '高度な安全機能',
              '長期可用性'
            ],
            considerations: [
              'より高いコスト',
              '自動車フォーカスは過剰かもしれない',
              '複雑な認定プロセス'
            ]
          },
          'XMC4700F144K2048': {
            reason: 'モーター制御機能付き産業用MCU',
            advantages: [
              '優れたモーター制御',
              '産業用温度範囲',
              '良好なドキュメント'
            ],
            considerations: [
              'モーター制御に特化',
              '限定的な汎用アピール',
              '小さなコミュニティ'
            ]
          },
          'ESP32-S3-WROOM-1': {
            reason: '統合WiFiとBluetooth付きデュアルコアMCU',
            advantages: [
              '内蔵ワイヤレス',
              '非常にコスト効率',
              '優れた可用性'
            ],
            considerations: [
              '異なるアーキテクチャ',
              'ワイヤレス用の消費電力',
              '民生用グレードフォーカス'
            ]
          },
          'nRF52840-QIAA': {
            reason: 'ARM Cortex-M4付きBluetooth 5.0 SoC',
            advantages: [
              '高度なBluetooth機能',
              '低消費電力設計',
              '強力なワイヤレスエコシステム'
            ],
            considerations: [
              'ワイヤレス中心設計',
              '限定的な汎用I/O',
              '異なる開発アプローチ'
            ]
          }
        }
      },
    },
    
    // Part Finder
    partfinder: {
      title: 'パーツファインダー（高度）',
      subtitle: '詳細な互換性分析による相互参照と代替品の検索',
      searchFilters: '検索・フィルター',
      enterPartNumber: '代替品を検索する部品番号を入力...',
      searchAlternatives: '代替品を検索',
      uploadBOM: 'BOMアップロード',
      bomBatch: 'BOMバッチ処理',
      dropBOMFile: 'BOMファイルをここにドロップ',
      uploadBOMBatch: 'BOMファイルをここにドラッグ＆ドロップするか、クリックして参照\nCSV、XLS、XLSX形式をサポート',
      advancedFilters: '高度なフィルター',
      compatibility: '互換性',
      packageFootprint: 'パッケージ/フットプリント一致',
      pinoutCompatible: 'ピン配置互換',
      aecQualified: 'AEC-Q認定',
      electricalRanges: '電気的範囲',
      voltageRange: '電圧範囲',
      temperatureRange: '温度範囲',
      supplyChain: 'サプライチェーン',
      maxMOQ: '最大MOQ',
      maxLeadTime: '最大リードタイム',
      presetsActions: 'プリセット・アクション',
      loadPreset: 'プリセット読み込み',
      automotiveGrade: '自動車グレード',
      industrialTemp: '産業用温度',
      consumerElectronics: '民生用電子機器',
      save: '保存',
      export: 'エクスポート',
      alternativesFound: '代替品が見つかりました',
      foundAlternatives: '見つかった',
      alternativesFor: 'の代替品',
      selectedForComparison: '比較対象として選択',
      compareSelected: '選択した項目を比較',
      exportResults: '結果をエクスポート',
      addSelectedToBOM: '選択した項目をBOMに追加',
      backToSearch: '検索に戻る',
      backToHome: 'ホームに戻る',
      
      // Table columns
      partNumber: '部品番号',
      manufacturer: 'メーカー',
      price: '価格',
      leadTime: 'リードタイム',
      stock: '在庫',
      risk: 'リスク',
      actions: 'アクション',
      showReasoning: '理由',
      
      // Comparison
      comparison: '比較',
      compareSelectedParts: '選択した部品を比較',
    },
    
    // BOM Analyzer
    bom: {
      title: 'BOM分析',
      subtitle: 'サプライチェーンリスクとコスト最適化の機会について部品表を分析',
      uploadBOMFile: '最近のBOMプロジェクト',
      uploadTitle: 'BOMファイルをアップロード',
      dragDropBOM: 'BOMファイルをここにドラッグ＆ドロップするか、クリックして参照',
      uploadSupports: 'CSV、XLS、XLSX形式をサポート',
      processingBOM: 'BOM処理中...',
      askAI: 'AIに質問',

      totalItems: '合計アイテム',
      criticalRisk: '重大リスク',
      highRisk: '高リスク',
      mediumRisk: '中リスク',
      riskScore: 'リスクスコア',

      risk: 'リスク',
      refDes: '参照番号',
      partNumber: '部品番号',
      supplier: 'サプライヤー',
      qty: '数量',
      unitPrice: '単価',
      leadTime: 'リードタイム',
      riskFactors: 'リスク要因',
      suggestedReplacement: '推奨代替品',
      compatible: '互換',
      totalSavings: '総節約額',
      addToRFQSingle: 'RFQに追加',

      exportRisk: 'リスクレポートをエクスポート',
      exportReplacements: '代替品付きでエクスポート',
      applyReplacements: 'すべての推奨代替品を適用',
      itemsSelected: '選択されたアイテム',
      addToRFQ: 'RFQに追加',
      quickRFQCreation: 'クイックRFQ作成',
      selectComponentsRFQ: '上記のコンポーネントを選択して、見積もりと代替品のためのRFQを迅速に作成します。',

      highRiskDetected: '高リスクコンポーネントを検出',
      highRiskDescription: 'コンポーネントは、EOLまたはサプライチェーンの問題により即座の注意が必要です。',
      addAllHighRisk: 'すべての高リスクをRFQに追加',

      costImpact: 'コスト影響',
      riskAnalysis: 'リスク分析',
      bomCostScenarios: 'BOMコストシナリオ',
      originalParts: 'オリジナル部品',
      selectedAlternatives: '選択された代替品',
      cheapestViable: '最も安い実行可能',
      currentBOMCost: '現在のBOMコスト',
      withAlternatives: '代替品付き',
      estimatedSaving: '推定節約額',
      perBuild: 'ビルドあたり',
      cheapestViableOption: '最も安い実行可能オプション',
      maximumPotentialSaving: '最大潜在的節約額',
      riskDistribution: 'リスク分布',
      riskSummary: 'リスク概要',
      exportOptions: 'エクスポートオプション',
      costImpactReport: 'コスト影響レポート',
      bomWithAlternatives: '代替品付きBOM',
      costAnalysisData: 'コスト分析データ',
    },

    rfq: {
      title: 'RFQ管理',
      subtitle: 'サプライヤーとのRFQドキュメントを作成・管理',
      createNewRFQ: '新しいRFQを作成',
      list: 'RFQリスト',
      createNew: '新規作成',

      searchPlaceholder: 'タイトル、ID、サプライヤーでRFQを検索...',
      statusFilter: 'ステータスでフィルター',
      supplierFilter: 'サプライヤーでフィルター',
      allStatus: 'すべてのステータス',
      allSuppliers: 'すべてのサプライヤー',

      draft: '下書き',
      sent: '送信済み',
      pending: '保留中',
      answered: '回答済み',
      closed: '終了',

      totalRFQs: '合計RFQ',
      totalValue: '総額',

      rfqId: 'RFQ ID',
      titleHeader: 'タイトル',
      status: 'ステータス',
      suppliersHeader: 'サプライヤー',
      responses: '応答',
      needBy: '必要日',
      lastActivity: '最終活動',
      actions: 'アクション',
      items: 'アイテム',

      'title.label': 'RFQタイトル',
      titlePlaceholder: 'このRFQの説明的なタイトルを入力...',
      needByDate: '必要日',
      uploadBOMFile: 'BOMファイルをアップロード',
      dropBOMHere: 'BOMファイルをここにドロップ',
      dragDropBOM: 'BOMファイルをここにドラッグ＆ドロップするか、クリックして参照',
      supportedFormats: 'CSV、XLS、XLSX形式をサポート',
      addItem: 'アイテムを追加',
      partNumber: '部品番号',
      manufacturer: 'メーカー',
      description: '説明',
      quantity: '数量',
      targetPrice: '目標価格',
      notes: '注記',
      additionalSpecs: '追加仕様、要件、特別な指示...',

      create: 'RFQを作成',
      cart: 'RFQカート',
      created: '作成済み',
      qty: '数量',
      target: '目標',
      editDetails: '詳細を編集',
      clearAll: 'すべてクリア',
      itemRemoved: 'アイテムがRFQから削除されました',
      createdSuccessfully: 'RFQが正常に作成されました',

      fromBOMAnalyzer: 'BOM分析から',
      reviewCustomize: 'BOM分析から{count}コンポーネントを確認およびカスタマイズ',
    },

    rfqDetail: {
      backToRFQs: 'RFQに戻る',
      exportSummary: '概要をエクスポート',
      sendToMoreSuppliers: 'より多くのサプライヤーに送信',
      rfqDetails: 'RFQ詳細',
      totalItems: '合計アイテム',
      estValue: '推定額',
      needBy: '必要日',
      notSpecified: '未指定',
      suppliers: 'サプライヤー',
      notes: '注記',
      requestedItems: '要求されたアイテム',
      qty: '数量',
      target: '目標',
      quotationSummary: '見積もり概要',
      validUntil: '有効期限',
      terms: '条件',
      qaThread: 'Q&Aスレッド',
      all: 'すべて',
      supplier: 'サプライヤー',
      quotationDetails: '見積もり詳細',
      leadTime: 'リードタイム',
      stock: '在庫',
      alternativeSuggested: '代替品提案',
      askQuestion: '質問または説明を求めてください...',

      q1ProductionComponents: 'Q1生産コンポーネント',
      q1ProductionNotes: 'Q1生産ランに必要なコンポーネント。表示された数量に対する最良の価格を提供してください。',
      thankYouRFQ: 'RFQをありがとうございます。要件を確認し、競争力のある見積もりを準備しました。',
      confirmLeadTime: '{partNumber}のリードタイムを確認できますか？生産スケジュールがタイトです。',
      stockAvailable: 'はい、{partNumber}の{stock}ユニットの在庫があります。リードタイムは{leadTime}で確認されています。',
      competitiveQuotation: '要件に対する競争力のある見積もりを提供いたします。',
      volumePricing: '5K+数量でボリューム価格が利用可能',
      specialPricing: '1K以上の数量で特別価格',
      allItemsInStock: 'すべてのアイテムが在庫があり、出荷準備ができています。ボリューム割引が利用可能です。',
      freeShipping: '$500以上の注文で送料無料。延長保証が利用可能です。',
    },

    component: {
      overview: '概要',
      specs: '仕様',
      supply: 'サプライ',
      eolInsights: 'EOL洞察',
      alternatives: '代替品',
      documents: 'ドキュメント',
      basicInfo: '基本情報',
      partNumber: '部品番号',
      manufacturer: 'メーカー',
      category: 'カテゴリ',
      releaseYear: 'リリース年',
      longevityProgram: '長寿命プログラム',
      riskAssessment: 'リスク評価',
      eolPrediction: 'EOL予測',
      leadTime: 'リードタイム',
      priceRange: '価格帯',
      stock: '在庫',
      units: 'ユニット',
      technicalSpecs: '技術仕様',
      packagePhysical: 'パッケージ・物理',
      componentPackage: 'パッケージ',
      pinCount: 'ピン数',
      temperatureRange: '温度範囲',
      electrical: '電気的',
      voltage: '電圧',
      current: '電流',
      power: '電力',
      performance: 'パフォーマンス',
      frequencyCpu: '周波数/CPU',
      memory: 'メモリ',
      processNode: 'プロセスノード',
      leadTimeTrend: 'リードタイム推移',
      priceTrend: '価格推移',
      supplyChain: 'サプライチェーン情報',
      currentLeadTime: '現在のリードタイム',
      availableStock: '利用可能在庫',
      approvedDistributors: '承認された販売店',

      datasheetDocumentation: 'データシート・ドキュメント',
      officialDatasheet: '公式データシート（Rev 5）',
      completeTechnicalSpecs: '完全な技術仕様',
      applicationNotes: 'アプリケーションノート',
      designGuidelines: '設計ガイドラインと例',
      productRoadmap: '製品ロードマップ',
      futureProductPlans: '将来の製品計画と移行パス',
      pcnPdnDocuments: 'PCN/PDNドキュメント',
      officialChangeNotification: '公式変更通知',
      documentsSourced: 'すべてのドキュメントはメーカーのウェブサイトおよび公式販売店チャネルから直接調達されます。リンクは定期的に検証および更新され、データの整合性を確保します。',
      graphLayer: 'グラフレイヤー',
      aiEolAssistant: 'AI EOLアシスタント',
      leadTimePriceTrends: 'リードタイムと価格の推移',
      stockLevelsOverTime: '経時的な在庫レベル',
      eolIntelligenceAssistant: 'EOLインテリジェンスアシスタント',
      online: 'オンライン',
      askEolQuestions: 'EOLステータス、代替品、移行戦略について質問する',
    },

    crossRef: {
      title: 'クロスリファレンス分析',
      subtitle: '{count}コンポーネントの詳細比較',
      specification: '仕様',
      original: 'オリジナル',
      alternative: '代替品',
      showOnlyDifferences: '違いのみ表示',
      match: '一致',
      partial: '部分的',
      mismatch: '不一致',
      compatibility: '互換性',
      addSelectedToBOM: '選択した項目をBOMに追加',
      exportExcel: 'Excelエクスポート',
      exportPDF: 'PDFエクスポート',
      explainDifferences: '違いを説明',
      packageMechanical: 'パッケージ・機械的',
      electricalCharacteristics: '電気的特性',
      memoryPerformance: 'メモリ・パフォーマンス',
      interfacesPeripherals: 'インターフェース・周辺機器',
      environmental: '環境',
      supplyCost: 'サプライ・コスト',
      lifecycleSupply: 'ライフサイクル・サプライ',
      priceDisclaimer: '価格に関する免責事項',
      priceDisclaimerText: '表示される価格は参考であり、地域、数量、サプライヤーによって異なる場合があります。公式見積もりにはRFQを使用してください。',
    },

    reasoning: {
      summaryTab: '概要',
      compatibilityTab: '互換性',
      supplyTab: 'サプライ',
      eolReasoningTab: 'EOL',
      risksTab: 'リスク',
      implementationTab: '実装',
      sourcesTab: 'ソース',
      copySummary: '概要をコピー',
      exportPDF: 'PDFエクスポート',
      addToBOM: 'BOMに追加',
      askAI: 'AIに質問',
      keyTakeaways: '主なポイント',
      replacement: '代替品',
      compatibilityWith: 'オリジナル部品との互換性',
      minorFirmwareAdjustments: '軽微なファームウェア調整が必要',
      adcRegisterMapping: 'ADCレジスタマッピングの違いによりコード更新が必要',
      betterAvailability: 'より良い可用性とリードタイム',
      vsOriginal: 'オリジナルと比較',
      weeks: '週',
      unitsInStock: '在庫ユニット',
      eolRisk: 'EOLリスク',
      stableWithLongevity: '長寿命コミットメントで安定',
      mixedSignals: '混合シグナル - 注意深く監視',
      multipleRiskFactors: '複数のリスク要因を検出',
      recommendation: '推奨',
      useAsDropIn: 'ドロップイン代替品として使用',
      useWithVerification: '検証テストとともに使用',
      evaluateCarefully: 'アプリケーションに対して慎重に評価',
      excellentDropIn: '最小限のリスクで優れたドロップイン候補',
      goodAlternative: '管理可能な変更を伴う良い代替品',
      considerBackup: 'バックアップオプションまたは新しい設計として検討',
      compatibilityBreakdown: '互換性内訳',
      technicalMatchAnalysis: '技術的マッチ分析',
      scoredMatrix: '設計要件に基づく加重スコアリングマトリックス',
      weight: '重量',
      pass: '合格',
      partial: '部分的',
      fail: '不合格',
      requirement: '要件',
      alternative: '代替品',
      assessment: '評価',

      packageFootprintPinout: 'パッケージ/フットプリント/ピン配置',
      electricalLimits: '電気的限界',
      timingPerformance: 'タイミング/パフォーマンス',
      protocolsInterfaces: 'プロトコル/インターフェース',
      thermalEnvironment: '熱環境',
      mechanical: '機械的',
      regulatoryQuality: '規制/品質',
      firmwareDriverImpact: 'ファームウェア/ドライバー影響',
      formFitFunction: 'フォーム/フィット/機能',

      identicalFootprint: '同一フットプリントとピン配置',
      slightlyLowerCurrent: 'わずかに低い電流消費',
      higherPerformance: '要求より高いパフォーマンス',
      allRequiredInterfaces: 'すべての必要なインターフェースが存在',
      identicalTemperature: '同一温度範囲',
      samePackageDimensions: '同じパッケージ寸法',
      meetsRegulatory: 'すべての規制要件を満たす',
      minorRegisterDifferences: 'ADCの軽微なレジスタの違い',
      sameFunctionalCategory: '同じ機能カテゴリ',

      lifecycleStatus: 'ライフサイクルステータス',
      status: 'ステータス',
      lastUpdated: '最終更新',
      longevityProgram: '長寿命プログラム',
      year: '年',
      supplyChain: 'サプライチェーン',
      moq: 'MOQ',
      pcs: '個',
      stockLevel: '在庫レベル',
      approvedDistributors: '承認された販売店',
      inStock: '在庫あり',

      activeStatus: 'アクティブステータス確認',
      stableManufacturing: '安定した製造プロセス',
      marketDemand: '強力な市場需要',
      officialCommitment: '公式長寿命コミットメント',
      priceStability: '価格安定性指標',

      impact: '影響',
      mitigation: '軽減',

      implementationGuide: '実装ガイド',
      pcbCompatibility: 'PCB互換性',
      solderLandPattern: 'はんだランドパターンが正確に一致',
      verifyDecoupling: 'デカップリングコンデンサの配置を確認',
      noPcbChanges: 'PCB変更は不要',
      firmwareChanges: 'ファームウェア変更が必要',
      updateAdcInit: 'ADC初期化レジスタを更新',
      verifyClockConfig: 'クロック設定を確認',
      testPeripherals: 'すべての周辺機能をテスト',
      estimatedEffort: '推定労力：0.5〜1日',
      validationChecklist: '検証チェックリスト',
      powerConsumption: '予算内の消費電力を確認',
      thermalTesting: '負荷時の熱テストを実施',
      communicationInterfaces: 'すべての通信インターフェースをテスト',
      adcAccuracy: 'ADC精度と線形性を検証',
      usbOtgFunctionality: 'USB OTG機能を確認',

      citationsSources: '引用・ソース',
      needsVerification: '検証が必要',
      lastAccessed: '最終アクセス',
      sourceVerification: 'ソース検証',
      sourceVerificationText: '一部のソースは検証が必要です。重要な情報は公式メーカードキュメントで検証してください。',

      overallEolAssessment: '全体的なEOL評価',
      strongStability: '2034年までの公式長寿命コミットメントで強力な安定性指標',
      mixedSignalsDetected: '混合シグナルを検出 - 監視と代替品の準備を推奨',
      multipleRiskFactorsPresent: '複数のリスク要因が存在 - 12〜18ヶ月以内に移行を計画',
      
      // Risk descriptions
      adcRegisterMappingDifferences: 'ADCレジスタマッピングの違い',
      longerLeadTimeThanOriginal: 'オリジナルより長いリードタイム',
      higherPerformanceMayAffectPowerConsumption: '高いパフォーマンスが消費電力に影響する可能性',
      
      // Risk impacts
      minorFirmwareChangesRequired: '軽微なファームウェア変更が必要',
      productionSchedulingImpact: '生産スケジュールへの影響',
      slightIncreaseInPowerDraw: 'わずかな消費電力の増加',
      
      // Risk mitigations
      updateAdcInitializationCode: 'ADC初期化コードを更新（〜0.5日の労力）',
      orderEarlyOrMaintainBufferStock: '早期注文またはバッファ在庫の維持',
      verifyPowerBudgetAndThermalDesign: '電力予算と熱設計を検証',
    },

    common: {
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      edit: '編集',
      view: '表示',
      download: 'ダウンロード',
      upload: 'アップロード',
      search: '検索',
      filter: 'フィルター',
      sort: '並べ替え',
      more: 'もっと',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      warning: '警告',
      info: '情報',
    },

    // Macnica Expert Contact
    macnicaExpert: {
      title: 'マクニカ専門家に連絡',
      subtitle: 'お問い合わせについて専門家の支援を受ける',
      expertSupport: '専門家サポート',
      responseTime: '24時間以内に返信',
      yourQuestion: '元の質問',
      aiResponse: 'AIアシスタントの応答',
      truncated: '...（省略）',
      fullName: '氏名',
      company: '会社名',
      email: 'メールアドレス',
      additionalDetails: '追加詳細',
      detailsPlaceholder: 'AI応答で不足していた点や不明確な点、またはお問い合わせに関する追加のコンテキストを説明してください...',
      namePlaceholder: 'お名前',
      companyPlaceholder: '会社名',
      emailPlaceholder: 'your.email@company.com',
      cancel: 'キャンセル',
      send: 'マクニカに送信',
      sending: '送信中...',
      successTitle: 'リクエストが正常に送信されました',
      successMessage: 'お問い合わせが送信されました。マクニカの専門家がすぐにフォローアップします。',
      errorTitle: 'リクエストを送信できませんでした',
      tryAgain: '再試行',
      privacyNotice: 'プライバシーに関する通知：',
      privacyText: 'お問い合わせはマクニカの専門家サポートチームに送信されます。',
      urgentMatters: '緊急の場合は、直接お問い合わせください：',
      requiredField: '*',
    },

    // Compare Parts
    compareParts: {
      title: '部品比較',
      subtitle: '2〜4個のコンポーネントを並べて比較し、情報に基づいた決定を行う',
      exportCSV: 'CSVエクスポート',
      exportPDF: 'PDFエクスポート',
      selectedParts: '選択された部品',
      clearAll: 'すべてクリア',
      noPartsSelected: '比較用の部品が選択されていません',
      searchAndAdd: '下記で部品を検索・追加して比較を開始',
      primary: 'プライマリ',
      setPrimary: 'プライマリに設定',
      addPartsToCompare: '比較する部品を追加',
      searchPlaceholder: 'MPN、メーカー、または説明で検索...',
      add: '追加',
      aiAnalysis: 'AI分析',
      
      // Tab names
      tabs: {
        overview: '概要',
        package: 'パッケージ',
        specifications: '仕様',
        supply: 'サプライチェーン',
        compliance: 'コンプライアンス',
        longevity: '長寿命',
      },
      
      // Table headers
      headers: {
        property: 'プロパティ',
        manufacturer: 'メーカー',
        description: '説明',
        category: 'カテゴリ',
        lifecycle: 'ライフサイクル',
        riskLevel: 'リスクレベル',
        packageType: 'パッケージタイプ',
        leadTime: 'リードタイム',
        price: '価格',
        stock: '在庫',
        rohs: 'RoHS準拠',
        reach: 'REACH準拠',
        conflictFree: 'コンフリクトフリー',
        expectedEol: '予想EOL',
        supportYears: 'サポート年数',
        replacementStatus: '代替品ステータス',
        specification: '仕様',
      },
      
      // Values
      values: {
        active: 'アクティブ',
        nrnd: 'NRND',
        obsolete: '廃止',
        yes: 'はい',
        no: 'いいえ',
        weeks: '週',
        years: '年',
        low: '低',
        medium: '中',
        high: '高',
        critical: '重大',
      },
      
      // AI Analysis text
      analysis: {
        betterLeadTime: 'が最適なリードタイムを持っています',
        longestSupport: 'が最長のサポートを提供します',
        mostCostEffective: 'が最もコスト効果的です',
        lowestRisk: 'が最低のサプライリスクを持っています',
      },
    },

    // Notifications
    notifications: {
      title: '通知',
      settings: '設定',
      markAllAsRead: 'すべて既読にする',
      noNotifications: '通知はありません',
      alertTypes: 'アラートタイプ',
      deliveryMethods: '配信方法',

      // Alert type labels
      eolAnnouncements: 'EOL発表',
      eolAnnouncementsDesc: '部品の製造中止時に通知を受け取る',
      leadTimeChanges: 'リードタイム変更',
      leadTimeChangesDesc: 'リードタイムがしきい値を超えた際にアラート',
      priceIncreases: '価格上昇',
      priceIncreasesDesc: 'しきい値を超える価格変更を監視',
      lowStock: '在庫不足',
      lowStockDesc: '在庫レベルアラート',
      pcnPdnDocuments: 'PCN/PDNドキュメント',
      pcnPdnDocumentsDesc: '製品変更通知',
      supplierNews: 'サプライヤーニュース',
      supplierNewsDesc: 'フォローしているサプライヤーからの更新',

      // Delivery methods
      inAppNotifications: 'アプリ内通知',
      inAppNotificationsDesc: 'アプリケーション内で通知を表示',
      emailAlerts: 'メールアラート',
      emailAlertsDesc: 'メールで通知を送信',
      weeklyDigest: '週次ダイジェスト',
      weeklyDigestDesc: 'すべての通知の週次サマリー',
    },
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || `{${paramKey}}`;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
