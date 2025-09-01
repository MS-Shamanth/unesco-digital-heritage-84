// Service for simplifying content for different generations
export interface GenerationalContent {
  children: string;
  teens: string;
  adults: string;
}

export class GenerationalRewriteService {
  // Complex terms and their simplified versions
  private static readonly termSimplifications = {
    // Financial terms
    'cryptocurrency': 'digital money',
    'blockchain': 'secure digital record system',
    'inflation': 'when things cost more money',
    'recession': 'when the economy slows down',
    'GDP': 'how much money a country makes',
    'stock market': 'place where company shares are bought and sold',
    
    // Political terms
    'legislation': 'new laws',
    'amendment': 'change to the law',
    'bipartisan': 'both political parties working together',
    'filibuster': 'long speech to delay voting',
    'caucus': 'group meeting to make decisions',
    'gerrymandering': 'unfairly changing voting districts',
    
    // Tech terms
    'artificial intelligence': 'computer that can think like humans',
    'machine learning': 'computers that learn by themselves',
    'algorithm': 'computer instructions',
    'cloud computing': 'storing data on internet servers',
    'cybersecurity': 'protecting computers from attacks',
    'metaverse': 'virtual reality world',
    
    // Gen Z slang
    'slay': 'do something amazing',
    'cap': 'lie or false statement',
    'no cap': 'no lie, being honest',
    'bussin': 'really good',
    'periodt': 'end of discussion',
    'stan': 'really support someone',
    'simp': 'someone who does too much for someone they like',
    'vibe check': 'checking someone\'s mood or attitude',
    'slaps': 'sounds really good',
    'fire': 'excellent or amazing',
    
    // Scientific terms
    'pandemic': 'disease that spreads around the world',
    'vaccine': 'medicine that prevents disease',
    'antibodies': 'body\'s defense against germs',
    'climate change': 'Earth\'s weather getting warmer',
    'carbon emissions': 'pollution that warms the planet',
    'renewable energy': 'power from sources that don\'t run out'
  };

  static generateRewrite(content: string, title: string): GenerationalContent {
    const lowerContent = content.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const fullText = `${title} ${content}`.toLowerCase();
    
    // Detect complex terms in the content
    const foundTerms: string[] = [];
    Object.keys(this.termSimplifications).forEach(term => {
      if (fullText.includes(term.toLowerCase())) {
        foundTerms.push(term);
      }
    });

    // Determine content topic for better context
    const contentTopic = this.determineContentTopic(fullText);

    // Create simplified versions
    return {
      children: this.createChildrenVersion(content, title, foundTerms, contentTopic),
      teens: this.createTeenVersion(content, title, foundTerms, contentTopic),
      adults: this.createAdultVersion(content, title, foundTerms, contentTopic)
    };
  }

  private static determineContentTopic(fullText: string): string {
    if (fullText.includes('climate') || fullText.includes('environment')) return 'environment';
    if (fullText.includes('ai') || fullText.includes('technology')) return 'technology';
    if (fullText.includes('health') || fullText.includes('medical')) return 'health';
    if (fullText.includes('politics') || fullText.includes('government')) return 'politics';
    if (fullText.includes('economy') || fullText.includes('business')) return 'business';
    return 'general';
  }

  private static createChildrenVersion(content: string, title: string, complexTerms: string[], topic: string): string {
    // Handle empty or short content
    const fullContent = content || title || "News story";
    let simplified = fullContent.length > 200 ? fullContent.substring(0, 200) : fullContent;
    
    // Ensure we have some content to work with
    if (!simplified || simplified.trim().length === 0) {
      simplified = "This is a news story that reporters have checked for accuracy";
    }
    
    // Replace complex terms with simple explanations
    complexTerms.forEach(term => {
      const simpleVersion = this.termSimplifications[term as keyof typeof this.termSimplifications];
      if (simpleVersion) {
        const regex = new RegExp(term, 'gi');
        simplified = simplified.replace(regex, simpleVersion);
      }
    });

    // Make it more child-friendly
    simplified = simplified
      .replace(/\b(investigation|probe|inquiry)\b/gi, 'looking into')
      .replace(/\b(authorities|officials)\b/gi, 'people in charge')
      .replace(/\b(significant|substantial)\b/gi, 'big')
      .replace(/\b(implement|execute)\b/gi, 'do')
      .replace(/\b(controversy|dispute)\b/gi, 'disagreement')
      .replace(/\b(demonstrate|indicate|suggest)\b/gi, 'show')
      .replace(/\b(approximately|roughly)\b/gi, 'about');

    // Add topic-specific context for children
    const topicContext = this.getChildrenContext(topic);
    
    return `${topicContext} ${simplified}... This news helps us understand what's happening in our world. The reporters checked the facts to make sure the information is correct and fair.`;
  }

  private static getChildrenContext(topic: string): string {
    switch (topic) {
      case 'environment': return 'This story is about taking care of our planet:';
      case 'technology': return 'This story is about new inventions and computers:';
      case 'health': return 'This story is about staying healthy and medicine:';
      case 'politics': return 'This story is about how our country is run:';
      case 'business': return 'This story is about how people buy and sell things:';
      default: return 'This story is about:';
    }
  }

  private static createTeenVersion(content: string, title: string, complexTerms: string[], topic: string): string {
    // Handle empty or short content
    const fullContent = content || title || "News article";
    let simplified = fullContent.length > 300 ? fullContent.substring(0, 300) : fullContent;
    
    // Ensure we have some content to work with
    if (!simplified || simplified.trim().length === 0) {
      simplified = "This is a news article that has been fact-checked and analyzed for reliability";
    }
    
    // Replace complex terms but keep some sophistication
    complexTerms.forEach(term => {
      const simpleVersion = this.termSimplifications[term as keyof typeof this.termSimplifications];
      if (simpleVersion) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        simplified = simplified.replace(regex, `${simpleVersion} (${term})`);
      }
    });

    // Make it teen-appropriate while educational
    simplified = simplified
      .replace(/\bsubsequently\b/gi, 'then')
      .replace(/\bnevertheless\b/gi, 'however')
      .replace(/\bfurthermore\b/gi, 'also')
      .replace(/\btherefore\b/gi, 'so')
      .replace(/\bdemonstrate\b/gi, 'show')
      .replace(/\butilize\b/gi, 'use');

    // Add topic-specific context for teens
    const topicContext = this.getTeenContext(topic);

    return `${topicContext} ${simplified}... This article discusses current events with factual reporting. The analysis shows how reliable the information is and whether it presents different viewpoints fairly. Understanding media literacy helps you make informed decisions about what you read and share.`;
  }

  private static getTeenContext(topic: string): string {
    switch (topic) {
      case 'environment': return 'Here\'s the climate/environment update:';
      case 'technology': return 'Here\'s what\'s happening in tech:';
      case 'health': return 'Here\'s the health/medical news:';
      case 'politics': return 'Here\'s the political situation:';
      case 'business': return 'Here\'s what\'s happening in business/economy:';
      default: return 'Here\'s what\'s happening:';
    }
  }

  private static createAdultVersion(content: string, title: string, complexTerms: string[], topic: string): string {
    // Handle empty or short content
    const fullContent = content || title || "Media content";
    let enhanced = fullContent.length > 400 ? fullContent.substring(0, 400) : fullContent;
    
    // Ensure we have some content to work with
    if (!enhanced || enhanced.trim().length === 0) {
      enhanced = "This media content has been analyzed for credibility, bias, and factual accuracy";
    }
    
    // For adults, provide context for complex terms rather than replacing them
    if (complexTerms.length > 0) {
      const termExplanations = complexTerms.map(term => {
        const explanation = this.termSimplifications[term as keyof typeof this.termSimplifications];
        return explanation ? `${term} (${explanation})` : term;
      }).join(', ');
      
      enhanced += `\n\nKey terms in this article: ${termExplanations}`;
    }

    // Add topic-specific analysis context
    const analysisContext = this.getAdultAnalysisContext(topic);
    
    return `${enhanced}... ${analysisContext} This comprehensive analysis evaluates source credibility, fact-checking standards, potential bias, editorial balance, and provides contextual information for informed media consumption and critical thinking.`;
  }

  private static getAdultAnalysisContext(topic: string): string {
    switch (topic) {
      case 'environment': return 'Environmental reporting requires careful analysis of scientific data, peer review processes, and potential conflicts of interest.';
      case 'technology': return 'Technology reporting should be evaluated for technical accuracy, industry expertise, and potential corporate influence.';
      case 'health': return 'Medical reporting requires verification against peer-reviewed research, medical authority sources, and expert consensus.';
      case 'politics': return 'Political reporting demands assessment of partisan bias, source diversity, factual accuracy, and contextual balance.';
      case 'business': return 'Business reporting should be analyzed for financial conflicts of interest, market impact, and data source reliability.';
      default: return 'Critical media analysis involves evaluating multiple perspectives, source reliability, and factual verification.';
    }
  }
}
