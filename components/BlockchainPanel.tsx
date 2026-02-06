import React, { useState, useEffect } from 'react';
import { Shield, Globe, DollarSign, Clock, TrendingUp, Download, Upload, Eye, Lock, Settings } from 'lucide-react';
import BlockchainAIService from '../services/blockchainAIService';
import { NovelNode } from '../types';

interface BlockchainPanelProps {
  node?: NovelNode;
  author?: string;
  onContentRegistered?: (result: any) => void;
}

const BlockchainPanel: React.FC<BlockchainPanelProps> = ({ 
  node, 
  author = 'default-author',
  onContentRegistered 
}) => {
  const [config, setConfig] = useState({
    enabled: true,
    network: 'polygon',
    contractAddress: '',
    walletAddress: '',
    nft: {
      enabled: false,
      marketplace: 'opensea',
      royaltyPercentage: 10,
      maxSupply: 10000,
      metadataStandard: 'ERC721'
    },
    protection: {
      enabled: true,
      watermarking: true,
      digitalSignature: true,
      timestampVerification: true,
      plagiarismDetection: false
    },
    monetization: {
      enabled: false,
      paymentMethods: ['crypto'],
      pricingModel: 'fixed',
      revenueSharing: false
    },
    analytics: {
      enabled: true,
      trackViews: true,
      trackSales: true,
      trackOwnership: true,
      performanceMetrics: true
    }
  });

  const [service, setService] = useState<BlockchainAIService | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredContent, setRegisteredContent] = useState<any>(null);
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'register' | 'nft' | 'analytics'>('config');

  useEffect(() => {
    const blockchainService = new BlockchainAIService(config);
    setService(blockchainService);
  }, []);

  const handleRegisterContent = async () => {
    if (!service || !node) return;

    setIsRegistering(true);
    try {
      const result = await service.registerContent(node, author);
      setRegisteredContent(result);
      onContentRegistered?.(result);
    } catch (error) {
      console.error('Content registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleMintNFT = async () => {
    if (!service || !registeredContent) return;

    try {
      const nftResult = await service.mintNFT(
        service.getContentMetadata(registeredContent.contentId)!,
        registeredContent.contentHash
      );
      setNftMetadata(nftResult);
    } catch (error) {
      console.error('NFT minting failed:', error);
    }
  };

  const loadAnalytics = async () => {
    if (!service || !registeredContent) return;

    try {
      const analyticsData = await service.getContentAnalytics(registeredContent.contentId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config };
    const keys = key.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
    
    if (service) {
      service.updateConfig(newConfig);
    }
  };

  const renderConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Blockchain Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Network</label>
              <select
                value={config.network}
                onChange={(e) => updateConfig('network', e.target.value)}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Contract Address</label>
              <input
                type="text"
                value={config.contractAddress}
                onChange={(e) => updateConfig('contractAddress', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                placeholder="0x..."
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Wallet Address</label>
              <input
                type="text"
                value={config.walletAddress}
                onChange={(e) => updateConfig('walletAddress', e.target.value)}
                className="w-full px-2 py-1 border rounded"
                placeholder="0x..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Content Protection</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Enable Protection</span>
              <button
                onClick={() => updateConfig('protection.enabled', !config.protection.enabled)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.protection.enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.protection.enabled ? 'On' : 'Off'}
              </button>
            </div>

            {config.protection.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <span>Watermarking</span>
                  <button
                    onClick={() => updateConfig('protection.watermarking', !config.protection.watermarking)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      config.protection.watermarking
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {config.protection.watermarking ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Digital Signature</span>
                  <button
                    onClick={() => updateConfig('protection.digitalSignature', !config.protection.digitalSignature)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      config.protection.digitalSignature
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {config.protection.digitalSignature ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span>Timestamp Verification</span>
                  <button
                    onClick={() => updateConfig('protection.timestampVerification', !config.protection.timestampVerification)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      config.protection.timestampVerification
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {config.protection.timestampVerification ? 'On' : 'Off'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">NFT Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable NFT</span>
              <button
                onClick={() => updateConfig('nft.enabled', !config.nft.enabled)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.nft.enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.nft.enabled ? 'On' : 'Off'}
              </button>
            </div>

            {config.nft.enabled && (
              <>
                <div>
                  <label className="text-sm text-gray-600">Marketplace</label>
                  <select
                    value={config.nft.marketplace}
                    onChange={(e) => updateConfig('nft.marketplace', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="opensea">OpenSea</option>
                    <option value="rarible">Rarible</option>
                    <option value="foundation">Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Royalty Percentage</label>
                  <input
                    type="number"
                    value={config.nft.royaltyPercentage}
                    onChange={(e) => updateConfig('nft.royaltyPercentage', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Max Supply</label>
                  <input
                    type="number"
                    value={config.nft.maxSupply}
                    onChange={(e) => updateConfig('nft.maxSupply', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                    min="1"
                    max="100000"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Monetization</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable Monetization</span>
              <button
                onClick={() => updateConfig('monetization.enabled', !config.monetization.enabled)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.monetization.enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.monetization.enabled ? 'On' : 'Off'}
              </button>
            </div>

            {config.monetization.enabled && (
              <>
                <div>
                  <label className="text-sm text-gray-600">Pricing Model</label>
                  <select
                    value={config.monetization.pricingModel}
                    onChange={(e) => updateConfig('monetization.pricingModel', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="auction">Auction</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Payment Methods</label>
                  <div className="space-y-2">
                    {['crypto', 'fiat', 'stripe'].map((method) => (
                      <label key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.monetization.paymentMethods.includes(method)}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...config.monetization.paymentMethods, method]
                              : config.monetization.paymentMethods.filter(m => m !== method);
                            updateConfig('monetization.paymentMethods', methods);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Content Registration</h3>
        
        {node ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">Content Preview</h4>
              <p className="text-sm text-gray-600 mb-2">Title: {node.title}</p>
              <p className="text-sm text-gray-600 mb-2">Type: {node.type}</p>
              <p className="text-sm text-gray-600 mb-2">Length: {node.content.length} characters</p>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-700">{node.content.slice(0, 200)}...</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Author: {author}</p>
                <p className="text-sm text-gray-600">Network: {config.network}</p>
              </div>
              <button
                onClick={handleRegisterContent}
                disabled={isRegistering}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>{isRegistering ? 'Registering...' : 'Register Content'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No content selected for registration.</p>
            <p className="text-sm text-gray-500 mt-2">Select a node to register it on the blockchain.</p>
          </div>
        )}
      </div>

      {registeredContent && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Registration Result</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Content ID:</span>
              <span className="font-medium text-sm">{registeredContent.contentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Content Hash:</span>
              <span className="font-medium text-sm font-mono">{registeredContent.contentHash.slice(0, 10)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction Hash:</span>
              <span className="font-medium text-sm font-mono">{registeredContent.transactionHash.slice(0, 10)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Verification Status:</span>
              <span className="font-medium text-green-600">{registeredContent.protectionData.verificationStatus}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => navigator.clipboard.writeText(registeredContent.contentId)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Copy ID
            </button>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
              View on Explorer
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderNFT = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">NFT Management</h3>
        
        {registeredContent ? (
          <div className="space-y-4">
            {!nftMetadata ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No NFT minted for this content yet.</p>
                <button
                  onClick={handleMintNFT}
                  disabled={!config.nft.enabled}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Mint NFT</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded">
                  <h4 className="font-medium mb-3">NFT Metadata</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Token ID:</p>
                      <p className="font-medium">{nftMetadata.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contract:</p>
                      <p className="font-medium text-sm font-mono">{nftMetadata.contractAddress.slice(0, 10)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Owner:</p>
                      <p className="font-medium text-sm font-mono">{nftMetadata.owner.slice(0, 10)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price:</p>
                      <p className="font-medium">{nftMetadata.price} ETH</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Royalty:</p>
                      <p className="font-medium">{nftMetadata.royaltyInfo.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created:</p>
                      <p className="font-medium">{new Date(nftMetadata.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>View on {config.nft.marketplace}</span>
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>List for Sale</span>
                  </button>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>Download Metadata</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No content registered yet.</p>
            <p className="text-sm text-gray-500 mt-2">Register content first to create NFTs.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Content Analytics</h3>
          <button
            onClick={loadAnalytics}
            disabled={!registeredContent}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
        
        {analytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.views}</p>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.sales}</p>
                <p className="text-sm text-gray-600">Sales</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.performanceMetrics.averagePrice.toFixed(3)} ETH</p>
                <p className="text-sm text-gray-600">Avg Price</p>
              </div>
              
              <div className="text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.currentOwner.slice(0, 6)}...</p>
                <p className="text-sm text-gray-600">Current Owner</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue:</p>
                  <p className="font-medium">{analytics.performanceMetrics.totalRevenue.toFixed(3)} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price History:</p>
                  <div className="flex space-x-1">
                    {analytics.performanceMetrics.priceHistory.slice(-5).map((price: number, index: number) => (
                      <div key={index} className="bg-blue-200 h-4 w-8 rounded" style={{ height: `${price * 100}px` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No analytics available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Register content and enable analytics to see insights.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold">Blockchain AI</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Network:</span>
            <span className="font-medium capitalize">{config.network}</span>
          </div>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'register', label: 'Register', icon: Shield },
            { id: 'nft', label: 'NFT', icon: Globe },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'config' && renderConfig()}
        {activeTab === 'register' && renderRegister()}
        {activeTab === 'nft' && renderNFT()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default BlockchainPanel;
