import { NovelNode } from "../types";

// Blockchain AI Service - Đăng ký và bảo vệ tác phẩm AI
// Tạo NFT và quản lý bản quyền cho nội dung AI-generated

interface BlockchainConfig {
  enabled: boolean;
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
  contractAddress: string;
  walletAddress: string;
  
  // NFT Configuration
  nft: {
    enabled: boolean;
    marketplace: 'opensea' | 'rarible' | 'foundation';
    royaltyPercentage: number;
    maxSupply: number;
    metadataStandard: 'ERC721' | 'ERC1155';
  };
  
  // Content Protection
  protection: {
    enabled: boolean;
    watermarking: boolean;
    digitalSignature: boolean;
    timestampVerification: boolean;
    plagiarismDetection: boolean;
  };
  
  // Monetization
  monetization: {
    enabled: boolean;
    paymentMethods: ('crypto' | 'fiat' | 'stripe')[];
    pricingModel: 'fixed' | 'auction' | 'subscription';
    revenueSharing: boolean;
  };
  
  // Analytics
  analytics: {
    enabled: boolean;
    trackViews: boolean;
    trackSales: boolean;
    trackOwnership: boolean;
    performanceMetrics: boolean;
  };
}

interface ContentMetadata {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  contentHash: string;
  contentType: 'novel' | 'chapter' | 'section' | 'character';
  wordCount: number;
  genre: string;
  tags: string[];
  aiGenerated: boolean;
  aiProvider: string;
  aiModel: string;
  prompt: string;
}

interface NFTMetadata {
  tokenId: string;
  contractAddress: string;
  owner: string;
  creator: string;
  metadata: ContentMetadata;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  price: string;
  royaltyInfo: {
    recipient: string;
    percentage: number;
  };
}

interface BlockchainTransaction {
  hash: string;
  type: 'mint' | 'transfer' | 'sale' | 'license';
  from: string;
  to: string;
  amount: string;
  timestamp: Date;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface ContentProtection {
  contentId: string;
  protectionType: 'watermark' | 'signature' | 'timestamp' | 'nft';
  protectionData: {
    hash: string;
    signature: string;
    timestamp: Date;
    watermark: string;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
  lastVerified: Date;
}

class BlockchainAIService {
  private config: BlockchainConfig;
  private contentRegistry: Map<string, ContentMetadata> = new Map();
  private nftRegistry: Map<string, NFTMetadata> = new Map();
  private transactionHistory: BlockchainTransaction[] = [];
  private protectionRegistry: Map<string, ContentProtection> = new Map();

  constructor(config?: Partial<BlockchainConfig>) {
    this.config = {
      enabled: false,
      network: 'polygon',
      contractAddress: '',
      walletAddress: '',
      
      // NFT Configuration
      nft: {
        enabled: false,
        marketplace: 'opensea',
        royaltyPercentage: 10,
        maxSupply: 10000,
        metadataStandard: 'ERC721'
      },
      
      // Content Protection
      protection: {
        enabled: true,
        watermarking: true,
        digitalSignature: true,
        timestampVerification: true,
        plagiarismDetection: false
      },
      
      // Monetization
      monetization: {
        enabled: false,
        paymentMethods: ['crypto'],
        pricingModel: 'fixed',
        revenueSharing: false
      },
      
      // Analytics
      analytics: {
        enabled: true,
        trackViews: true,
        trackSales: true,
        trackOwnership: true,
        performanceMetrics: true
      },
      
      ...config
    };
  }

  public async registerContent(
    node: NovelNode,
    author: string,
    aiProvider: string = 'ultimate',
    aiModel: string = 'hybrid',
    prompt: string = ''
  ): Promise<{
    contentId: string;
    contentHash: string;
    transactionHash: string;
    protectionData: ContentProtection;
  }> {
    if (!this.config.enabled) {
      throw new Error('Blockchain AI Service is disabled');
    }

    try {
      // 1. Generate content metadata
      const metadata = await this.generateContentMetadata(node, author, aiProvider, aiModel, prompt);
      
      // 2. Create content hash
      const contentHash = await this.generateContentHash(node.content);
      
      // 3. Apply content protection
      const protectionData = await this.applyContentProtection(metadata.id, node.content, contentHash);
      
      // 4. Register on blockchain
      const transactionHash = await this.registerOnBlockchain(metadata, contentHash);
      
      // 5. Create NFT if enabled
      if (this.config.nft.enabled) {
        await this.mintNFT(metadata, contentHash);
      }
      
      // 6. Save to registries
      this.contentRegistry.set(metadata.id, metadata);
      this.protectionRegistry.set(metadata.id, protectionData);
      
      return {
        contentId: metadata.id,
        contentHash,
        transactionHash,
        protectionData
      };
      
    } catch (error) {
      console.error('Blockchain Registration Error:', error);
      throw error;
    }
  }

  public async mintNFT(
    metadata: ContentMetadata,
    contentHash: string
  ): Promise<NFTMetadata> {
    if (!this.config.nft.enabled) {
      throw new Error('NFT minting is disabled');
    }

    try {
      // Generate token ID
      const tokenId = await this.generateTokenId();
      
      // Create NFT metadata
      const nftMetadata: NFTMetadata = {
        tokenId,
        contractAddress: this.config.contractAddress,
        owner: this.config.walletAddress,
        creator: metadata.author,
        metadata,
        transactionHash: await this.generateTransactionHash(),
        blockNumber: await this.getCurrentBlockNumber(),
        timestamp: new Date(),
        price: '0.1', // Default price in ETH
        royaltyInfo: {
          recipient: metadata.author,
          percentage: this.config.nft.royaltyPercentage
        }
      };
      
      // Mock minting process - in real implementation, this would interact with smart contract
      const mintResult = await this.mockNFTMinting(nftMetadata);
      
      // Save to registry
      this.nftRegistry.set(tokenId, nftMetadata);
      
      // Add to transaction history
      this.addTransaction({
        hash: mintResult.transactionHash,
        type: 'mint',
        from: '0x0000000000000000000000000000000000000000',
        to: this.config.walletAddress,
        amount: '0',
        timestamp: new Date(),
        blockNumber: mintResult.blockNumber,
        gasUsed: '21000',
        gasPrice: '20',
        status: 'confirmed'
      });
      
      return nftMetadata;
      
    } catch (error) {
      console.error('NFT Minting Error:', error);
      throw error;
    }
  }

  public async verifyContent(
    contentId: string,
    content: string
  ): Promise<{
    isValid: boolean;
    verificationResult: ContentProtection;
    ownershipHistory: BlockchainTransaction[];
  }> {
    try {
      // Get protection data
      const protectionData = this.protectionRegistry.get(contentId);
      if (!protectionData) {
        throw new Error('Content protection data not found');
      }
      
      // Verify content hash
      const currentHash = await this.generateContentHash(content);
      const isValid = currentHash === protectionData.protectionData.hash;
      
      // Update verification status
      protectionData.verificationStatus = isValid ? 'verified' : 'failed';
      protectionData.lastVerified = new Date();
      
      // Get ownership history
      const ownershipHistory = this.transactionHistory.filter(
        tx => tx.type === 'transfer' || tx.type === 'sale'
      );
      
      return {
        isValid,
        verificationResult: protectionData,
        ownershipHistory
      };
      
    } catch (error) {
      console.error('Content Verification Error:', error);
      throw error;
    }
  }

  public async transferOwnership(
    tokenId: string,
    from: string,
    to: string
  ): Promise<BlockchainTransaction> {
    try {
      // Get NFT metadata
      const nftMetadata = this.nftRegistry.get(tokenId);
      if (!nftMetadata) {
        throw new Error('NFT not found');
      }
      
      // Verify ownership
      if (nftMetadata.owner !== from) {
        throw new Error('Not the owner of this NFT');
      }
      
      // Create transfer transaction
      const transaction: BlockchainTransaction = {
        hash: await this.generateTransactionHash(),
        type: 'transfer',
        from,
        to,
        amount: '0',
        timestamp: new Date(),
        blockNumber: await this.getCurrentBlockNumber(),
        gasUsed: '21000',
        gasPrice: '20',
        status: 'pending'
      };
      
      // Mock transfer process - in real implementation, this would interact with smart contract
      const transferResult = await this.mockTransfer(transaction);
      
      // Update NFT ownership
      nftMetadata.owner = to;
      nftMetadata.transactionHash = transferResult.transactionHash;
      
      // Update transaction status
      transaction.status = 'confirmed';
      
      // Add to history
      this.addTransaction(transaction);
      
      return transaction;
      
    } catch (error) {
      console.error('Transfer Ownership Error:', error);
      throw error;
    }
  }

  public async getContentAnalytics(
    contentId: string
  ): Promise<{
    views: number;
    sales: number;
    currentOwner: string;
    ownershipHistory: BlockchainTransaction[];
    performanceMetrics: {
      averagePrice: number;
      priceHistory: number[];
      totalRevenue: number;
    };
  }> {
    try {
      // Get content metadata
      const metadata = this.contentRegistry.get(contentId);
      if (!metadata) {
        throw new Error('Content not found');
      }
      
      // Get related NFTs
      const relatedNFTs = Array.from(this.nftRegistry.values())
        .filter(nft => nft.metadata.id === contentId);
      
      // Calculate analytics
      const sales = this.transactionHistory.filter(tx => tx.type === 'sale').length;
      const views = Math.floor(Math.random() * 1000) + 100; // Mock view count
      const currentOwner = relatedNFTs[0]?.owner || metadata.author;
      
      // Calculate performance metrics
      const salesTransactions = this.transactionHistory.filter(tx => tx.type === 'sale');
      const priceHistory = salesTransactions.map(tx => parseFloat(tx.amount));
      const averagePrice = priceHistory.length > 0 
        ? priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length 
        : 0;
      const totalRevenue = priceHistory.reduce((a, b) => a + b, 0);
      
      return {
        views,
        sales,
        currentOwner,
        ownershipHistory: this.transactionHistory,
        performanceMetrics: {
          averagePrice,
          priceHistory,
          totalRevenue
        }
      };
      
    } catch (error) {
      console.error('Content Analytics Error:', error);
      throw error;
    }
  }

  // Private methods
  private async generateContentMetadata(
    node: NovelNode,
    author: string,
    aiProvider: string,
    aiModel: string,
    prompt: string
  ): Promise<ContentMetadata> {
    return {
      id: `content-${node.id}-${Date.now()}`,
      title: node.title,
      author,
      createdAt: new Date(),
      contentHash: await this.generateContentHash(node.content),
      contentType: node.type as any,
      wordCount: node.content.split(/\s+/).length,
      genre: this.detectGenre(node.content),
      tags: this.extractTags(node.content),
      aiGenerated: true,
      aiProvider,
      aiModel,
      prompt
    };
  }

  private async generateContentHash(content: string): Promise<string> {
    // Mock hash generation - in real implementation, use crypto library
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async applyContentProtection(
    contentId: string,
    content: string,
    contentHash: string
  ): Promise<ContentProtection> {
    const protectionTypes: ('watermark' | 'signature' | 'timestamp' | 'nft')[] = [];
    
    if (this.config.protection.watermarking) {
      protectionTypes.push('watermark');
    }
    
    if (this.config.protection.digitalSignature) {
      protectionTypes.push('signature');
    }
    
    if (this.config.protection.timestampVerification) {
      protectionTypes.push('timestamp');
    }
    
    if (this.config.nft.enabled) {
      protectionTypes.push('nft');
    }
    
    const protectionData: ContentProtection = {
      contentId,
      protectionType: protectionTypes[0] || 'timestamp',
      protectionData: {
        hash: contentHash,
        signature: await this.generateDigitalSignature(content),
        timestamp: new Date(),
        watermark: this.generateWatermark(content)
      },
      verificationStatus: 'pending',
      lastVerified: new Date()
    };
    
    return protectionData;
  }

  private async registerOnBlockchain(
    metadata: ContentMetadata,
    contentHash: string
  ): Promise<string> {
    // Mock blockchain registration - in real implementation, interact with smart contract
    const transactionHash = await this.generateTransactionHash();
    
    // Add to transaction history
    this.addTransaction({
      hash: transactionHash,
      type: 'mint',
      from: '0x0000000000000000000000000000000000000000',
      to: this.config.walletAddress,
      amount: '0',
      timestamp: new Date(),
      blockNumber: await this.getCurrentBlockNumber(),
      gasUsed: '50000',
      gasPrice: '20',
      status: 'confirmed'
    });
    
    return transactionHash;
  }

  private async generateTokenId(): Promise<string> {
    return `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async generateTransactionHash(): Promise<string> {
    return `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;
  }

  private async getCurrentBlockNumber(): Promise<number> {
    // Mock block number - in real implementation, query blockchain
    return Math.floor(Date.now() / 15000); // Approximate block number
  }

  private async mockNFTMinting(nftMetadata: NFTMetadata): Promise<any> {
    // Mock NFT minting process
    return {
      transactionHash: nftMetadata.transactionHash,
      blockNumber: nftMetadata.blockNumber,
      success: true
    };
  }

  private async mockTransfer(transaction: BlockchainTransaction): Promise<any> {
    // Mock transfer process
    return {
      transactionHash: transaction.hash,
      blockNumber: transaction.blockNumber,
      success: true
    };
  }

  private async generateDigitalSignature(content: string): Promise<string> {
    // Mock digital signature - in real implementation, use private key
    return `signature-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateWatermark(content: string): string {
    // Simple watermark generation
    return `© AI-Generated ${new Date().getFullYear()}`;
  }

  private detectGenre(content: string): string {
    const genres = {
      'romance': ['tình yêu', 'yêu', 'tâm hồn', 'cảm xúc'],
      'fantasy': ['phép thuật', 'ma thuật', 'thần tiên', 'rồng'],
      'mystery': ['bí ẩn', 'điều tra', 'manh mối', 'sự thật'],
      'scifi': ['tương lai', 'công nghệ', 'không gian', 'robot'],
      'horror': ['kinh dị', 'sợ hãi', 'ma', 'quỷ']
    };
    
    const contentLower = content.toLowerCase();
    let maxScore = 0;
    let detectedGenre = 'general';
    
    for (const [genre, keywords] of Object.entries(genres)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (contentLower.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedGenre = genre;
      }
    }
    
    return detectedGenre;
  }

  private extractTags(content: string): string[] {
    // Extract keywords as tags
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = ['và', 'của', 'là', 'một', 'có', 'trong', 'cho', 'với'];
    
    return words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10);
  }

  private addTransaction(transaction: BlockchainTransaction): void {
    this.transactionHistory.push(transaction);
    
    // Keep only last 1000 transactions
    if (this.transactionHistory.length > 1000) {
      this.transactionHistory = this.transactionHistory.slice(-1000);
    }
  }

  // Public methods
  public getContentMetadata(contentId: string): ContentMetadata | undefined {
    return this.contentRegistry.get(contentId);
  }

  public getNFTMetadata(tokenId: string): NFTMetadata | undefined {
    return this.nftRegistry.get(tokenId);
  }

  public getTransactionHistory(): BlockchainTransaction[] {
    return this.transactionHistory;
  }

  public getProtectionData(contentId: string): ContentProtection | undefined {
    return this.protectionRegistry.get(contentId);
  }

  public getConfig(): BlockchainConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<BlockchainConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export default BlockchainAIService;
export type { 
  BlockchainConfig, 
  ContentMetadata, 
  NFTMetadata, 
  BlockchainTransaction, 
  ContentProtection 
};
