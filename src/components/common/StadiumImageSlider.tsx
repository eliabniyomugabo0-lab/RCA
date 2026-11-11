import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Pause, 
  Play, 
  MapPin, 
  Sparkles, 
  Camera, 
  X, 
  Wifi, 
  WifiOff, 
  DownloadCloud, 
  Plus, 
  RotateCw, 
  Check, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

export interface StadiumSlide {
  id: string;
  src: string;
  fallbackSrc?: string;
  title: string;
  subtitle: string;
  category: 'ALL' | 'ARCHITECTURAL' | 'MATCHDAY' | 'OPERATIONS' | 'NIGHT_FIXTURE' | 'TRAINING' | 'ONLINE_STREAM';
  description: string;
  badge: string;
  specifications?: string[];
  isOnlineFetched?: boolean;
}

import gcsPavilionImg from '../../assets/images/gcs_pavilion_vaults_1792306844132.jpg';
import gcsMatchdayImg from '../../assets/images/gcs_matchday_action_1792306844646.jpg';
import gcsPitchPrepImg from '../../assets/images/gcs_pitch_preparation_1792306844687.jpg';
import gcsNightImg from '../../assets/images/gcs_floodlight_night_1792306845634.jpg';
import gcsNetsImg from '../../assets/images/gcs_practice_nets_1792306845092.jpg';
import gcsExteriorImg from '../../assets/images/gcs_stadium_exterior_1791894260939.jpg';

export const DEFAULT_STADIUM_SLIDES: StadiumSlide[] = [
  {
    id: 'slide-vaults',
    src: gcsPavilionImg,
    fallbackSrc: gcsPavilionImg,
    title: 'Iconic Parabolic Pavilion Vaults',
    subtitle: 'Signature Three-Shell Thin Concrete Architecture Overlooking Main Oval',
    category: 'ARCHITECTURAL',
    badge: 'Main Pavilion',
    description: 'Designed to mirror the trajectory of a bouncing cricket ball. Built with compressed earth blocks and thin-shell parabolic concrete arches that naturally ventilate spectators.',
    specifications: ['Capacity: 1,500 grandstand seats', 'Thermal Mass earth construction', 'ICC Category 2 Venue Approved']
  },
  {
    id: 'slide-matchday',
    src: gcsMatchdayImg,
    fallbackSrc: gcsMatchdayImg,
    title: 'International Matchday Operations',
    subtitle: 'Rwanda Men & Women National Squad Fixtures & Tournament Play',
    category: 'MATCHDAY',
    badge: 'Tournament Action',
    description: 'World-class turf cricket action during ICC Africa regional qualifiers. Featuring live digital electronic scoreboards and media broadcast galleries.',
    specifications: ['Boundary radius: 68 meters', 'Digital DLS scoreboard', 'Broadcast standard commentary boxes']
  },
  {
    id: 'slide-pitch-prep',
    src: gcsPitchPrepImg,
    fallbackSrc: gcsPitchPrepImg,
    title: 'Precision Turf Pitch Curation',
    subtitle: 'Heavy Motor Roller Compaction & Center Strip Moisture Profiling',
    category: 'OPERATIONS',
    badge: 'Groundskeeping',
    description: 'Head groundskeepers actively consolidating the black cotton clay loam center wicket with multi-ton mechanical rollers to achieve optimal 14-16% match moisture.',
    specifications: ['3 Turf Match Strips', 'Moisture Window: 14.8%', 'Outfield grass cut height: 8mm']
  },
  {
    id: 'slide-floodlight-night',
    src: gcsNightImg,
    fallbackSrc: gcsNightImg,
    title: 'Twilight & Floodlit Night Fixtures',
    subtitle: 'Four 500-Lux LED Mast Towers Illuminating Gahanga Oval',
    category: 'NIGHT_FIXTURE',
    badge: 'Night Fixtures',
    description: 'Spectacular twilight view of Gahanga Cricket Stadium under full tournament illumination, enabling international day-night T20 tournaments and corporate fixtures.',
    specifications: ['4 Mast Towers (32m height)', '500-1000 Lux broadcast rating', 'High-efficiency LED fixtures']
  },
  {
    id: 'slide-practice-nets',
    src: gcsNetsImg,
    fallbackSrc: gcsNetsImg,
    title: 'High-Performance Training Nets',
    subtitle: 'Dedicated Turf & Synthetic Coaching Practice Strips',
    category: 'TRAINING',
    badge: 'Training Complex',
    description: 'Six lane outdoor practice facility equipped with all-weather synthetic surfaces and prepared natural grass strips for intensive batting, bowling, and coaching clinics.',
    specifications: ['6 Enclosed Practice Lanes', 'BOLA bowling machine bays', 'Safety tensile roof netting']
  },
  {
    id: 'slide-exterior',
    src: gcsExteriorImg,
    fallbackSrc: gcsExteriorImg,
    title: 'Grand Entrance & Landscaped Grounds',
    subtitle: 'Sustainable Memorial Pavilion & Kigali Skyline Panorama',
    category: 'ARCHITECTURAL',
    badge: 'Stadium Grounds',
    description: 'Surrounded by indigenous Rwandan flora and rolling hill contours of Kicukiro district. Built as a lasting memorial and beacon for Rwandan cricket development.',
    specifications: ['Site area: 4.5 hectares', 'Solar rainwater harvesting', 'VIP conference & player lounges']
  },
  // Online Internet Stream slides with robust bundled local offline fallbacks
  {
    id: 'slide-online-aerial',
    src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
    fallbackSrc: gcsExteriorImg,
    title: 'Aerial Panorama of Gahanga Oval & Surrounds',
    subtitle: 'Green Outfield & Sweeping Rwandan Hillsides',
    category: 'ONLINE_STREAM',
    badge: 'Online Stream',
    description: 'High-resolution panorama showing the expansive natural boundary and community sports campus at Gahanga, Kicukiro District.',
    specifications: ['4.5 Hectares Surface', 'Indigenous Tree Canopy', 'Subsurface Drainage Grid'],
    isOnlineFetched: true
  },
  {
    id: 'slide-online-match',
    src: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?auto=format&fit=crop&w=1600&q=80',
    fallbackSrc: gcsMatchdayImg,
    title: 'Match Intensity: Rwanda Cricket Federation Fixtures',
    subtitle: 'Fast Pace Bowling & Boundary Defense in Action',
    category: 'ONLINE_STREAM',
    badge: 'Online Stream',
    description: 'Live competitive cricket action representing national teams and regional league encounters on Gahanga center wicket.',
    specifications: ['Leather Cricket Balls (4-Piece Match Grade)', 'ICC Umpires Standing', 'Live Spectator Embankment'],
    isOnlineFetched: true
  },
  {
    id: 'slide-online-turf',
    src: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1600&q=80',
    fallbackSrc: gcsPitchPrepImg,
    title: 'Groundsmanship: Curating Championship Wickets',
    subtitle: 'Laser Level Turf & Precision Strip Irrigation',
    category: 'ONLINE_STREAM',
    badge: 'Online Stream',
    description: 'Behind-the-scenes turf maintenance keeping Gahanga recognized as the premier cricket facility in East Africa.',
    specifications: ['Automated Pop-Up Sprinklers', 'Couch Grass Sward', 'Clay Penetrometer Verified'],
    isOnlineFetched: true
  }
];

export const GCS_STADIUM_SLIDES = DEFAULT_STADIUM_SLIDES;

interface StadiumImageSliderProps {
  slides?: StadiumSlide[];
  autoPlayInterval?: number; // ms, default 6500
  aspectRatio?: 'video' | 'wide' | 'cinema';
  className?: string;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  allowCategoryFilter?: boolean;
  allowOnlineFetch?: boolean;
}

export const StadiumImageSlider: React.FC<StadiumImageSliderProps> = ({
  slides: initialSlides,
  autoPlayInterval = 6500,
  aspectRatio = 'video',
  className = '',
  showThumbnails = true,
  showCaptions = true,
  allowCategoryFilter = true,
  allowOnlineFetch = true
}) => {
  // Load custom fetched slides or default
  const [allSlides, setAllSlides] = useState<StadiumSlide[]>(() => {
    const cached = loadFromStorage<StadiumSlide[]>('gcs_cached_slider_photos', []);
    if (cached && cached.length > 0) {
      // Merge unique slides
      const existingIds = new Set(DEFAULT_STADIUM_SLIDES.map((s) => s.id));
      const customOnes = cached.filter((c) => !existingIds.has(c.id));
      return [...DEFAULT_STADIUM_SLIDES, ...customOnes];
    }
    return DEFAULT_STADIUM_SLIDES;
  });

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  // Custom online image adder modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageSubtitle, setNewImageSubtitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<StadiumSlide['category']>('ONLINE_STREAM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Online / Offline connectivity listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter slides by category
  const filteredSlides = React.useMemo(() => {
    if (activeCategory === 'ALL') return allSlides;
    return allSlides.filter((s) => s.category === activeCategory);
  }, [allSlides, activeCategory]);

  const totalSlides = filteredSlides.length > 0 ? filteredSlides.length : 1;
  const currentSlide = filteredSlides[currentIndex] || filteredSlides[0] || allSlides[0];

  // Reset index if category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || isFullscreen) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, isFullscreen, autoPlayInterval, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  // Safe image error fallback (100% offline resilient)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback?: string) => {
    const target = e.currentTarget;
    if (fallback && target.src !== fallback) {
      target.src = fallback;
    } else if (target.src !== gcsExteriorImg) {
      target.src = gcsExteriorImg;
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add new fetched internet photo with offline caching
  const handleAddInternetPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !newImageTitle.trim()) return;

    const newSlide: StadiumSlide = {
      id: `online-slide-${Date.now()}`,
      src: newImageUrl.trim(),
      fallbackSrc: gcsExteriorImg,
      title: newImageTitle.trim(),
      subtitle: newImageSubtitle.trim() || 'Gahanga Cricket Stadium Kigali · Web Stream',
      category: newImageCategory,
      badge: 'Web Fetch',
      description: 'Image fetched from the internet and cached into local storage for seamless offline access.',
      specifications: ['Source: Web CDN', 'Cached Locally', 'Offline Resilient'],
      isOnlineFetched: true
    };

    const updated = [newSlide, ...allSlides];
    setAllSlides(updated);
    saveToStorage('gcs_cached_slider_photos', updated);

    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageSubtitle('');
    setIsAddModalOpen(false);
    setActiveCategory(newImageCategory);
    setCurrentIndex(0);
    showNotification('New stadium photo added & cached offline!');
  };

  const aspectClasses = {
    video: 'aspect-16/9 sm:aspect-16/9',
    wide: 'aspect-21/9',
    cinema: 'aspect-2/1 sm:aspect-16/7'
  };

  const categories = [
    { id: 'ALL', label: 'All Highlights', count: allSlides.length },
    { id: 'ARCHITECTURAL', label: 'Architecture & Arches', count: allSlides.filter((s) => s.category === 'ARCHITECTURAL').length },
    { id: 'MATCHDAY', label: 'Matchday & Crowds', count: allSlides.filter((s) => s.category === 'MATCHDAY').length },
    { id: 'OPERATIONS', label: 'Pitch Prep & Rollers', count: allSlides.filter((s) => s.category === 'OPERATIONS').length },
    { id: 'NIGHT_FIXTURE', label: 'Night Illumination', count: allSlides.filter((s) => s.category === 'NIGHT_FIXTURE').length },
    { id: 'TRAINING', label: 'Practice Nets', count: allSlides.filter((s) => s.category === 'TRAINING').length },
    { id: 'ONLINE_STREAM', label: 'Online Cloud Stream', count: allSlides.filter((s) => s.category === 'ONLINE_STREAM').length }
  ];

  return (
    <div className={`space-y-3.5 ${className}`} ref={sliderContainerRef}>
      {/* Category Filter Tabs & Online Indicator */}
      {allowCategoryFilter && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Online / Offline status badge */}
            <div 
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${
                isOnline 
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' 
                  : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
              }`}
              title={isOnline ? 'Internet connected: Photos stream from online + local assets' : 'Offline Mode: Serving cached local stadium assets'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Online & Offline Ready</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline Mode (Local Cached)</span>
                </>
              )}
            </div>

            {/* Fetch Online Photos Button */}
            {allowOnlineFetch && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Add & cache a new Gahanga Cricket Stadium photo from the web"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fetch Web Photo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Slider Viewport Container */}
      <div 
        className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image Frame */}
        <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden`}>
          {filteredSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none scale-105'
                }`}
                style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={(e) => handleImageError(e, slide.fallbackSrc)}
                />

                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/35 pointer-events-none" />
              </div>
            );
          })}

          {/* Top Bar Floating Controls */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-teal-300 font-semibold text-xs flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Gahanga, Kigali</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10">
                {currentSlide.badge}
              </span>
              {currentSlide.isOnlineFetched && (
                <span className="px-2 py-0.5 rounded-md bg-teal-500/80 text-white text-[10px] font-bold">
                  WEB CACHED
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-700 p-1 rounded-lg shadow-lg">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                title={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
                aria-label={isPlaying ? 'Pause slider' : 'Play slider'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-teal-400" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer"
                title="View Fullscreen High-Resolution Gallery"
                aria-label="Fullscreen view"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center opacity-85 hover:opacity-100 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Previous stadium image"
          >
            <ChevronLeft className="w-5 h-5 text-teal-400" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center opacity-85 hover:opacity-100 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Next stadium image"
          >
            <ChevronRight className="w-5 h-5 text-teal-400" />
          </button>

          {/* Bottom Caption Overlay */}
          {showCaptions && (
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pointer-events-auto">
              <div className="max-w-3xl space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider font-semibold">
                    Slide {currentIndex + 1} of {totalSlides}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                  {currentSlide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-1 sm:line-clamp-2 leading-relaxed drop-shadow-sm">
                  {currentSlide.subtitle}
                </p>

                {currentSlide.specifications && (
                  <div className="hidden sm:flex items-center gap-2 pt-1.5 flex-wrap">
                    {currentSlide.specifications.map((spec, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-mono text-slate-200 border border-slate-700">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar for Active Slide */}
        <div className="h-1 bg-slate-800 w-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Thumbnail Bar */}
      {showThumbnails && filteredSlides.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {filteredSlides.map((slide, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`group relative rounded-xl overflow-hidden aspect-16/10 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-400 ring-2 ring-teal-400/50 shadow-md scale-98'
                    : 'border-slate-800 hover:border-slate-700 opacity-65 hover:opacity-100'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => handleImageError(e, slide.fallbackSrc)}
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white truncate drop-shadow-md">
                  {slide.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 bg-teal-950 border border-teal-500/50 text-teal-300 text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Online Image Fetch & Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Fetch & Cache Web Photo</h3>
                  <p className="text-xs text-slate-400">Stream Gahanga stadium photos and store for offline use</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInternetPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Image Web URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... (JPG, PNG, WebP)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICC Women's T20 Trophy Presentation at Gahanga"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Operational Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rwanda National Team match celebration in front of the pavilion"
                  value={newImageSubtitle}
                  onChange={(e) => setNewImageSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-teal-500"
                >
                  <option value="ONLINE_STREAM">Online Cloud Stream</option>
                  <option value="MATCHDAY">Matchday & Crowds</option>
                  <option value="ARCHITECTURAL">Architectural & Pavilion</option>
                  <option value="OPERATIONS">Pitch Operations & Rollers</option>
                  <option value="NIGHT_FIXTURE">Night Floodlights</option>
                  <option value="TRAINING">Practice & Academy</option>
                </select>
              </div>

              {newImageUrl && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Image Live Preview:</span>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                    <img 
                      src={newImageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => handleImageError(e, gcsExteriorImg)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Save & Cache Offline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-150">
          {/* Top Fullscreen Controls */}
          <div className="flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-teal-950/80 border border-teal-800/80 text-teal-300 rounded-lg text-xs font-semibold">
                Gahanga Cricket Stadium Gallery
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {totalSlides}
              </span>
              {currentSlide.isOnlineFetched && (
                <span className="text-[10px] bg-teal-600/80 text-white px-2 py-0.5 rounded-full font-mono">
                  Online Cached
                </span>
              )}
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Main Stage Image */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentSlide.src}
              alt={currentSlide.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageError(e, currentSlide.fallbackSrc)}
            />

            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition-colors shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-teal-400" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition-colors shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-teal-400" />
            </button>
          </div>

          {/* Fullscreen Bottom Description Bar */}
          <div className="bg-slate-900/85 border border-slate-800 p-4 rounded-xl text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {currentSlide.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentSlide.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentSlide.specifications?.map((spec, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-950 rounded border border-slate-800 text-[11px] text-teal-300 font-mono">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
