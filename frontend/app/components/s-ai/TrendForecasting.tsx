'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  RefreshCw,
  AlertCircle,
  WifiOff,
  BarChart3,
  Radio,
  Globe,
  MapPin,
  ChevronRight,
  Activity,
  Zap,
  Shield,
  Database
} from 'lucide-react';

// Define types matching backend response
interface ArticleItem {
  title?: string;
  source?: string;
  url?: string;
  published_at?: string;
  [key: string]: unknown;
}

interface TrendItem {
  keyword: string;
  count: number;
  article_count: number;
  sample_titles: string[];
  sources: string[];
  category: string;
}

interface TrendResponse {
  status: string;
  timestamp: string;
  total_articles: number;
  political_articles: number;
  sources: {
    rss: number;
    gdelt: number;
    gnews: number;
    newsapi: number;
  };
  categories: {
    international: number;
    india: number;
    tamilnadu: number;
  };
  trends: {
    international: TrendItem[];
    india: TrendItem[];
    tamilnadu: TrendItem[];
  };
  articles: {
    international: ArticleItem[];
    india: ArticleItem[];
    tamilnadu: ArticleItem[];
  };
}

type DashboardTab = 'tamilnadu' | 'india' | 'international';

const TAB_CONFIG = {
  tamilnadu: { label: 'Tamil Nadu', icon: MapPin, color: 'red' },
  india: { label: 'India', icon: MapPin, color: 'red' },
  international: { label: 'International', icon: Globe, color: 'red' }
} as const;

const STATS_ITEMS = [
  { icon: Activity, label: 'Real-time', value: 'Live' },
  { icon: Zap, label: 'Response', value: '<1s' },
  { icon: Shield, label: 'Secure', value: 'Encrypted' },
  { icon: Database, label: 'Sources', value: '11+' }
];

export default function TrendForecasting() {
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('tamilnadu');
  const [mounted, setMounted] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Mount state for hydration
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Memoized tab data - adapted for backend structure
  const currentTrends = useMemo(() => {
    if (!data || !data.trends) return [];
    return data.trends[activeTab] || [];
  }, [data, activeTab]);

  const tabCount = useMemo(() => {
    if (!data || !data.categories) return 0;
    return data.categories[activeTab] || 0;
  }, [data, activeTab]);

  const fetchTrends = useCallback(async (forceRefresh = false) => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/api/political/trends`;
      if (forceRefresh) {
        url = `${url}?_t=${Date.now()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trends (${response.status})`);
      }
      
      const result = await response.json();
      
      // Handle different response formats from backend
      let responseData = result;
      
      // If response has data wrapper
      if (result.data) {
        responseData = result.data;
      }
      
      // If response has results wrapper
      if (result.results) {
        responseData = {
          ...responseData,
          trends: result.results
        };
      }
      
      // Ensure all required fields exist with defaults
      const formattedData: TrendResponse = {
        status: responseData.status || 'success',
        timestamp: responseData.timestamp || new Date().toISOString(),
        total_articles: responseData.total_articles || 0,
        political_articles: responseData.political_articles || 0,
        sources: {
          rss: responseData.sources?.rss || 0,
          gdelt: responseData.sources?.gdelt || 0,
          gnews: responseData.sources?.gnews || 0,
          newsapi: responseData.sources?.newsapi || 0
        },
        categories: {
          international: responseData.categories?.international || 0,
          india: responseData.categories?.india || 0,
          tamilnadu: responseData.categories?.tamilnadu || 0
        },
        trends: {
          international: responseData.trends?.international || [],
          india: responseData.trends?.india || [],
          tamilnadu: responseData.trends?.tamilnadu || []
        },
        articles: {
          international: responseData.articles?.international || [],
          india: responseData.articles?.india || [],
          tamilnadu: responseData.articles?.tamilnadu || []
        }
      };
      
      setData(formattedData);
      setLastUpdate(new Date(formattedData.timestamp).toLocaleTimeString());
      setLoading(false);
      
    } catch (error) {
      console.error('Trend fetch error:', error);
      setError(`Unable to connect to backend. Please make sure the server is running.`);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [API_BASE]);

  const checkBackendHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/political/health`);
      return response.ok;
    } catch {
      return false;
    }
  }, [API_BASE]);

  // WebSocket connection
  useEffect(() => {
    if (!mounted) return;

    let ws: WebSocket | null = null;
    let connectionTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      try {
        const wsUrl = `${API_BASE.replace('http', 'ws')}/api/political/ws`;
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        connectionTimeout = setTimeout(() => {
          if (ws && ws.readyState !== WebSocket.OPEN) {
            ws.close();
            setWsConnected(false);
            if (reconnectAttempts.current < 3) {
              reconnectAttempts.current++;
              setTimeout(connectWebSocket, 2000 * reconnectAttempts.current);
            }
          }
        }, 5000);

        ws.onopen = () => {
          setWsConnected(true);
          reconnectAttempts.current = 0;
          if (connectionTimeout) clearTimeout(connectionTimeout);
          setLoading(false);
        };
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'trends_update') {
              // Format the update data the same way
              const updateData = message.data;
              if (updateData) {
                const formattedData: TrendResponse = {
                  status: updateData.status || 'success',
                  timestamp: updateData.timestamp || new Date().toISOString(),
                  total_articles: updateData.total_articles || 0,
                  political_articles: updateData.political_articles || 0,
                  sources: {
                    rss: updateData.sources?.rss || 0,
                    gdelt: updateData.sources?.gdelt || 0,
                    gnews: updateData.sources?.gnews || 0,
                    newsapi: updateData.sources?.newsapi || 0
                  },
                  categories: {
                    international: updateData.categories?.international || 0,
                    india: updateData.categories?.india || 0,
                    tamilnadu: updateData.categories?.tamilnadu || 0
                  },
                  trends: {
                    international: updateData.trends?.international || [],
                    india: updateData.trends?.india || [],
                    tamilnadu: updateData.trends?.tamilnadu || []
                  },
                  articles: {
                    international: updateData.articles?.international || [],
                    india: updateData.articles?.india || [],
                    tamilnadu: updateData.articles?.tamilnadu || []
                  }
                };
                setData(formattedData);
                setLastUpdate(new Date(formattedData.timestamp).toLocaleTimeString());
                setLoading(false);
              }
            }
          } catch (err) {
            console.error('WebSocket message error:', err);
          }
        };
        
        ws.onclose = () => {
          setWsConnected(false);
          if (!fetchTimeoutRef.current) {
            fetchTimeoutRef.current = setInterval(() => {
              fetchTrends();
            }, 30000);
          }
        };
        
        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setWsConnected(false);
        if (!fetchTimeoutRef.current) {
          fetchTimeoutRef.current = setInterval(() => {
            fetchTrends();
          }, 30000);
        }
      }
    };

    // Initial fetch
    const init = async () => {
      const isHealthy = await checkBackendHealth();
      if (isHealthy) {
        await fetchTrends();
        connectWebSocket();
      } else {
        setError(`Backend not reachable. Please start the backend server.`);
        setLoading(false);
      }
    };
    
    init();

    return () => {
      if (ws) ws.close();
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (fetchTimeoutRef.current) {
        clearInterval(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [mounted, API_BASE, fetchTrends, checkBackendHealth]);

  if (!mounted) return null;

  // Loading State
  if (loading && !data) {
    return (
      <div className="neuomorphic-card p-6 sm:p-8">
        <div className="h-75 sm:h-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-t-red-500 animate-spin" />
            </div>
            <p className="text-zinc-400 text-sm sm:text-base font-light tracking-wide">Loading intelligence data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !data) {
    return (
      <div className="neuomorphic-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="neuomorphic-icon bg-red-500/20">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">Intelligence Dashboard</h3>
          </div>
          <button
            onClick={() => fetchTrends(true)}
            className="neuomorphic-icon-small text-red-500 hover:text-red-400 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="h-62.5 sm:h-75 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="neuomorphic-icon mx-auto mb-4 bg-red-500/10">
              <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 text-red-400/50" />
            </div>
            <p className="text-zinc-400 text-sm sm:text-base font-light tracking-wide">{error}</p>
            <button
              onClick={() => fetchTrends(true)}
              className="mt-4 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-500 text-white text-sm sm:text-base font-medium hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neuomorphic-card p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="neuomorphic-icon shrink-0">
            <BarChart3 className="w-5 h-5 text-red-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white tracking-tight truncate">
              Political Intelligence
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
              <p className="text-xs sm:text-sm text-zinc-500 font-light tracking-wide">
                Real-time political analysis
              </p>
              <div className="flex items-center gap-1.5">
                {wsConnected ? (
                  <>
                    <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm text-emerald-400 font-light tracking-wide">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                    <span className="text-xs sm:text-sm text-zinc-500 font-light tracking-wide">Polling</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {lastUpdate && (
            <span className="text-xs sm:text-sm text-zinc-500 font-light flex items-center gap-1.5 tracking-wide">
              <span className="hidden xs:inline">{lastUpdate}</span>
            </span>
          )}
          <button
            onClick={() => fetchTrends(true)}
            disabled={isRefreshing}
            className="neuomorphic-icon-small text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {data && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {STATS_ITEMS.map((item, index) => (
              <div key={index} className="neuomorphic-flat p-3 sm:p-4 text-center">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mx-auto mb-1" />
                <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.15em]">{item.label}</p>
                <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Tabs */}
          <div className="flex gap-1 sm:gap-1.5 mb-4 sm:mb-6 neuomorphic-flat p-1.5 sm:p-2">
            {(['tamilnadu', 'india', 'international'] as DashboardTab[]).map((tab) => {
              const config = TAB_CONFIG[tab];
              const Icon = config.icon;
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline tracking-wide">{config.label}</span>
                  <span className="xs:hidden">{config.label.charAt(0)}</span>
                  <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded tracking-wide ${
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {tabCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Trending Topics */}
          <AnimatePresence mode="wait">
            {currentTrends.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <p className="text-xs sm:text-sm font-medium text-white uppercase tracking-[0.15em]">
                    Trending Topics - {TAB_CONFIG[activeTab].label}
                  </p>
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-light tracking-wide">
                    ({currentTrends.length} topics)
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {currentTrends.map((trend, index) => (
                    <motion.div
                      key={trend.keyword || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="neuomorphic-flat p-3 sm:p-4 hover:border-red-500/20 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="text-[10px] sm:text-xs font-medium text-red-500/70 min-w-5 sm:min-w-6 tracking-wide">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-red-500 transition-colors truncate tracking-tight">
                              {trend.keyword}
                            </h4>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <span className="text-[10px] sm:text-xs text-zinc-500 font-light tracking-wide">
                                {trend.article_count} articles
                              </span>
                              <span className="text-[10px] sm:text-xs text-emerald-400 font-light tracking-wide">
                                {trend.count} mentions
                              </span>
                            </div>
                          </div>
                          {trend.sample_titles && trend.sample_titles.length > 0 && (
                            <ul className="mt-2 sm:mt-3 space-y-1">
                              {trend.sample_titles.slice(0, 2).map((title, i) => (
                                <li key={i} className="text-xs sm:text-sm text-zinc-400 font-light truncate pl-6 sm:pl-9 tracking-wide">
                                  {title}
                                </li>
                              ))}
                              {trend.sample_titles.length > 2 && (
                                <li className="text-[10px] sm:text-xs text-zinc-500 font-light pl-6 sm:pl-9 tracking-wide">
                                  +{trend.sample_titles.length - 2} more
                                </li>
                              )}
                            </ul>
                          )}
                          {trend.sources && trend.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3 pl-6 sm:pl-9">
                              {trend.sources.slice(0, 4).map((source) => (
                                <span key={source} className="text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-white/5 text-zinc-500 border border-white/5 font-light uppercase tracking-wide">
                                  {source}
                                </span>
                              ))}
                              {trend.sources.length > 4 && (
                                <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-white/5 text-zinc-500 font-light tracking-wide">
                                  +{trend.sources.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 shrink-0 self-end sm:self-center group-hover:text-red-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="neuomorphic-icon mx-auto mb-3 sm:mb-4 bg-zinc-500/10">
                  <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-zinc-500" />
                </div>
                <p className="text-sm sm:text-base text-zinc-400 font-light tracking-wide">No trends detected</p>
                <p className="text-xs sm:text-sm text-zinc-500 font-light tracking-wide mt-1">Waiting for sufficient data</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <span className="text-[10px] sm:text-sm text-zinc-500 font-light flex items-center gap-2 sm:gap-2.5 tracking-wide">
          <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
          {wsConnected ? 'Live updates every 30 seconds' : 'Polling every 30 seconds'}
        </span>
        {data && (
          <span className="text-[10px] sm:text-sm text-zinc-500 font-light tracking-wide">
            {data.total_articles} total articles · {data.political_articles} political
          </span>
        )}
      </div>
    </div>
  );
}