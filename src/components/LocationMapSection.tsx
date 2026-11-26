import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Bike,
  Bus,
  Car,
  Clock,
  Crosshair,
  Dumbbell,
  ExternalLink,
  Footprints,
  MapPin,
  Navigation,
  ParkingCircle,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

const GYM_TEXT_QUERY = '1420 S Congress Ave, Austin, TX 78704';
// Initial city-level viewport prior to Places API resolution for 1420 S Congress Ave
const INITIAL_CITY_VIEW: google.maps.LatLngLiteral = {
  lat: 30.2672,
  lng: -97.7431,
};

type CommuteTravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

interface ResolvedPlaceInfo {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
}

interface RouteSummary {
  distanceText: string;
  durationText: string;
  mode: CommuteTravelMode;
}

interface AutocompleteOption {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  fullText: string;
  prediction: google.maps.places.PlacePrediction;
}

const TRAVEL_MODE_OPTIONS: {
  id: CommuteTravelMode;
  label: string;
  directionsParam: string;
  icon: typeof Car;
}[] = [
  { id: 'DRIVING', label: 'Drive', directionsParam: 'driving', icon: Car },
  { id: 'WALKING', label: 'Walk', directionsParam: 'walking', icon: Footprints },
  { id: 'BICYCLING', label: 'Bike', directionsParam: 'bicycling', icon: Bike },
  { id: 'TRANSIT', label: 'Transit', directionsParam: 'transit', icon: Bus },
];

const GETTING_THERE_NOTES = [
  {
    title: 'Dedicated Member Parking',
    detail:
      'Free member lot directly behind Suite B off W Monroe St, with overflow evening spaces along South Congress.',
    icon: ParkingCircle,
  },
  {
    title: 'CapMetro Rapid Route 801',
    detail:
      'Steps from the South Congress & Monroe Rapid 801 stop for quick car-free arrival from Downtown or South Austin.',
    icon: Bus,
  },
  {
    title: '24/7 Keycard Courtyard Entry',
    detail:
      'Tap your encrypted mobile keycard beside the covered bike racks at Suite B for instant round-the-clock floor access.',
    icon: Clock,
  },
];

function isQuotaError(err: unknown): boolean {
  if (!err) return false;
  const text =
    typeof err === 'string'
      ? err
      : err instanceof Error
        ? `${err.name} ${err.message}`
        : JSON.stringify(err);
  const upper = text.toUpperCase();
  return (
    upper.includes('RESOURCE_EXHAUSTED') ||
    upper.includes('OVER_QUERY_LIMIT') ||
    upper.includes('QUOTA') ||
    upper.includes('429')
  );
}

function formatDistanceFallback(meters?: number): string {
  if (!meters || meters <= 0) return '—';
  const miles = meters / 1609.344;
  return miles >= 0.2 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`;
}

function formatDurationFallback(millis?: number | null): string {
  if (!millis || millis <= 0) return '—';
  const totalMinutes = Math.max(1, Math.round(millis / 60000));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

interface GymMapCanvasProps {
  gymPlace: ResolvedPlaceInfo | null;
  onGymResolved: (place: ResolvedPlaceInfo) => void;
  originPlace: ResolvedPlaceInfo | null;
  travelMode: CommuteTravelMode;
  onRouteComputed: (summary: RouteSummary | null) => void;
  onRouteError: (message: string | null) => void;
  directionsUrl: string;
}

function GymMapCanvas({
  gymPlace,
  onGymResolved,
  originPlace,
  travelMode,
  onRouteComputed,
  onRouteError,
  directionsUrl,
}: GymMapCanvasProps) {
  const map = useMap();
  const loadingStatus = useApiLoadingStatus();
  const mapsLib = useMapsLibrary('maps');
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const [gymMarkerRef, gymMarker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const resolvedOnceRef = useRef(false);

  // Resolve 1420 S Congress Ave, Austin, TX via Places API (New)
  useEffect(() => {
    if (!placesLib || resolvedOnceRef.current) return;

    let cancelled = false;
    resolvedOnceRef.current = true;

    placesLib.Place.searchByText({
      textQuery: GYM_TEXT_QUERY,
      fields: ['id', 'displayName', 'formattedAddress', 'location'],
      maxResultCount: 1,
    })
      .then(({ places }) => {
        if (cancelled) return;
        const match = places?.[0];
        if (!match?.location) return;

        const resolved: ResolvedPlaceInfo = {
          id: match.id ?? '',
          displayName: match.displayName ?? GYM_INFO.fullName,
          formattedAddress:
            match.formattedAddress ??
            `${GYM_INFO.addressLine1}, ${GYM_INFO.addressLine2}`,
          location: {
            lat: match.location.lat(),
            lng: match.location.lng(),
          },
        };

        onGymResolved(resolved);
        if (map) {
          map.panTo(resolved.location);
          map.setZoom(16);
        }
      })
      .catch((err: unknown) => {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [placesLib, map, onGymResolved]);

  // Ensure map centers smoothly once both map and gymPlace exist
  useEffect(() => {
    if (!map || !gymPlace || originPlace) return;
    map.panTo(gymPlace.location);
    map.setZoom(16);
  }, [map, gymPlace, originPlace]);

  // Compute route between user's chosen origin and Ironwork Barbell using Routes API
  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!map || !mapsLib || !routesLib || !gymPlace || !originPlace) {
      onRouteComputed(null);
      onRouteError(null);
      return;
    }

    let cancelled = false;
    onRouteError(null);

    routesLib.Route.computeRoutes({
      origin: originPlace.location,
      destination: gymPlace.location,
      travelMode,
      fields: ['durationMillis', 'distanceMeters', 'localizedValues', 'path', 'viewport'],
      internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
    })
      .then(({ routes }) => {
        if (cancelled) return;
        const primary = routes?.[0];
        if (!primary) {
          onRouteComputed(null);
          onRouteError('No route found for this travel mode.');
          return;
        }

        if (primary.path && primary.path.length > 0) {
          const line = new mapsLib.Polyline({
            path: primary.path.map((pt) => ({ lat: pt.lat, lng: pt.lng })),
            geodesic: true,
            strokeColor: '#C8FF00',
            strokeOpacity: 0.95,
            strokeWeight: 5,
            map,
          });
          polylineRef.current = line;
        }

        if (primary.viewport) {
          map.fitBounds(primary.viewport, { top: 48, right: 48, bottom: 48, left: 48 });
        }

        onRouteComputed({
          distanceText:
            primary.localizedValues?.distance ??
            formatDistanceFallback(primary.distanceMeters),
          durationText:
            primary.localizedValues?.duration ??
            formatDurationFallback(primary.durationMillis),
          mode: travelMode,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          onRouteError('Map routing quota reached.');
        } else {
          onRouteError('Unable to calculate route from that address.');
        }
        onRouteComputed(null);
      });

    return () => {
      cancelled = true;
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, mapsLib, routesLib, gymPlace, originPlace, travelMode, onRouteComputed, onRouteError]);

  const handleRecenter = useCallback(() => {
    if (!map || !gymPlace) return;
    map.panTo(gymPlace.location);
    map.setZoom(16);
    setInfoOpen(true);
  }, [map, gymPlace]);

  if (
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#121216]">
        <MapPin className="w-8 h-8 text-[#C8FF00] mb-3" aria-hidden="true" />
        <p className="font-display text-xl uppercase text-white mb-1">
          {GYM_INFO.fullName}
        </p>
        <p className="text-sm text-zinc-400 max-w-sm mb-5">
          {GYM_INFO.addressLine1}, {GYM_INFO.addressLine2}. Interactive map preview is
          currently unavailable—open directions directly in Google Maps.
        </p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#C8FF00] text-[#09090B] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#D9FF4D] transition-colors"
        >
          <Navigation className="w-4 h-4" aria-hidden="true" />
          <span>Open in Maps</span>
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        mapId="DEMO_MAP_ID"
        colorScheme="DARK"
        defaultCenter={INITIAL_CITY_VIEW}
        defaultZoom={13}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        {gymPlace && (
          <AdvancedMarker
            ref={gymMarkerRef}
            position={gymPlace.location}
            onClick={() => setInfoOpen((prev) => !prev)}
            title="Ironwork Barbell — 1420 S Congress Ave, Austin, TX"
            zIndex={30}
          >
            {/* Custom Branded Ironwork Barbell Map Marker */}
            <div className="group flex flex-col items-center cursor-pointer select-none -translate-y-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#09090B] border-2 border-[#C8FF00] shadow-[0_8px_24px_rgba(0,0,0,0.75)] transition-transform duration-150 group-hover:scale-105">
                <span className="w-6 h-6 rounded bg-[#C8FF00] text-[#09090B] flex items-center justify-center shrink-0">
                  <Dumbbell className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <div className="text-left leading-none pr-0.5">
                  <span className="block font-display text-xs font-bold tracking-wider text-white uppercase">
                    {GYM_INFO.brand}
                  </span>
                  <span className="block font-mono text-[10px] text-[#C8FF00] tracking-tight">
                    24/7 BARBELL
                  </span>
                </div>
              </div>
              <div
                className="w-3 h-3 bg-[#09090B] border-r-2 border-b-2 border-[#C8FF00] rotate-45 -mt-1.5"
                aria-hidden="true"
              />
            </div>
          </AdvancedMarker>
        )}

        {gymPlace && infoOpen && gymMarker && (
          <InfoWindow
            anchor={gymMarker}
            maxWidth={260}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-zinc-900">
              <p className="font-display text-base font-bold uppercase tracking-tight text-zinc-950">
                {GYM_INFO.fullName}
              </p>
              <p className="text-xs text-zinc-700 mt-1">{gymPlace.formattedAddress}</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-1.5">
                {GYM_INFO.hoursMember}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 underline underline-offset-2 hover:text-zinc-700"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </InfoWindow>
        )}

        {originPlace && (
          <AdvancedMarker
            position={originPlace.location}
            title={`Start: ${originPlace.displayName}`}
            zIndex={20}
          >
            <Pin
              background="#18181B"
              borderColor="#C8FF00"
              glyphColor="#FFFFFF"
              scale={1}
            />
          </AdvancedMarker>
        )}
      </Map>

      {/* Top-right Recenter Pin button */}
      {gymPlace && (
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Center map on Ironwork Barbell"
          className="absolute top-3 right-3 z-10 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#09090B]/92 backdrop-blur-md border border-zinc-700 hover:border-[#C8FF00] text-xs font-medium text-zinc-100 hover:text-[#C8FF00] transition-colors inline-flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Center Pin</span>
        </button>
      )}
    </div>
  );
}

interface CommutePlannerProps {
  gymPlace: ResolvedPlaceInfo | null;
  originPlace: ResolvedPlaceInfo | null;
  onSelectOrigin: (place: ResolvedPlaceInfo | null) => void;
  travelMode: CommuteTravelMode;
  onChangeTravelMode: (mode: CommuteTravelMode) => void;
  routeSummary: RouteSummary | null;
  routeError: string | null;
}

function CommutePlanner({
  gymPlace,
  originPlace,
  onSelectOrigin,
  travelMode,
  onChangeTravelMode,
  routeSummary,
  routeError,
}: CommutePlannerProps) {
  const placesLib = useMapsLibrary('places');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (!placesLib || !query.trim() || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }

    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query.trim(),
          sessionToken: sessionTokenRef.current ?? undefined,
          locationBias: gymPlace
            ? { center: gymPlace.location, radius: 25000 }
            : { center: INITIAL_CITY_VIEW, radius: 25000 },
        });

        const parsed: AutocompleteOption[] = (res.suggestions ?? [])
          .map((item) => item.placePrediction)
          .filter((pred): pred is google.maps.places.PlacePrediction => Boolean(pred))
          .slice(0, 5)
          .map((pred) => ({
            placeId: pred.placeId,
            primaryText: pred.mainText?.text ?? pred.text.text,
            secondaryText: pred.secondaryText?.text ?? '',
            fullText: pred.text.text,
            prediction: pred,
          }));

        setSuggestions(parsed);
        setDropdownOpen(parsed.length > 0);
      } catch (err: unknown) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [placesLib, query, gymPlace]);

  async function handleChooseSuggestion(option: AutocompleteOption) {
    if (!placesLib) return;
    try {
      const place = option.prediction.toPlace();
      await place.fetchFields({
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
      });
      // Reset session token after Place Details fetch per billing best practices
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();

      if (!place.location) return;
      onSelectOrigin({
        id: place.id ?? option.placeId,
        displayName: place.displayName ?? option.primaryText,
        formattedAddress: place.formattedAddress ?? option.fullText,
        location: {
          lat: place.location.lat(),
          lng: place.location.lng(),
        },
      });
      setQuery(option.fullText);
      setDropdownOpen(false);
    } catch (err: unknown) {
      if (isQuotaError(err)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
    }
  }

  function handleClearOrigin() {
    setQuery('');
    setSuggestions([]);
    setDropdownOpen(false);
    onSelectOrigin(null);
  }

  return (
    <div className="pt-5 border-t border-zinc-800 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="commute-origin-input"
          className="text-xs font-mono uppercase tracking-wider text-zinc-400"
        >
          Estimate Your Commute
        </label>
        {originPlace && (
          <button
            type="button"
            onClick={handleClearOrigin}
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear route</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search
          className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="commute-origin-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) {
              onSelectOrigin(null);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setDropdownOpen(true);
          }}
          placeholder="Enter Austin starting address or landmark..."
          autoComplete="off"
          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-lg bg-[#09090B] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00]"
        />

        {dropdownOpen && suggestions.length > 0 && (
          <ul
            role="listbox"
            aria-label="Starting address suggestions"
            className="absolute z-20 left-0 right-0 mt-1.5 rounded-lg bg-[#18181B] border border-zinc-700 shadow-2xl overflow-hidden divide-y divide-zinc-800"
          >
            {suggestions.map((opt) => (
              <li key={opt.placeId}>
                <button
                  type="button"
                  onClick={() => handleChooseSuggestion(opt)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-zinc-800/90 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-semibold text-white truncate">
                    {opt.primaryText}
                  </p>
                  {opt.secondaryText && (
                    <p className="text-[11px] text-zinc-400 truncate">
                      {opt.secondaryText}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Travel Mode Selector */}
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Travel mode">
        {TRAVEL_MODE_OPTIONS.map((mode) => {
          const Icon = mode.icon;
          const active = travelMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChangeTravelMode(mode.id)}
              className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#C8FF00] text-[#09090B] border-[#C8FF00] font-bold'
                  : 'bg-[#09090B] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {isSearching && (
        <p className="text-xs text-zinc-500">Searching Austin locations...</p>
      )}

      {routeSummary && (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-[#09090B] border border-[#C8FF00]/40 px-4 py-3">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Estimated Arrival
            </p>
            <p className="font-mono text-lg font-bold text-[#C8FF00] tabular-nums">
              {routeSummary.durationText}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Route Distance
            </p>
            <p className="font-mono text-sm font-semibold text-white tabular-nums">
              {routeSummary.distanceText}
            </p>
          </div>
        </div>
      )}

      {routeError && (
        <p role="alert" className="text-xs text-amber-300">
          {routeError}
        </p>
      )}
    </div>
  );
}

interface LocationMapSectionProps {
  onBookTrial?: () => void;
}

export function LocationMapSection({ onBookTrial }: LocationMapSectionProps) {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() ?? '';
  const [mapsApiKey, setMapsApiKey] = useState<string>(envKey);
  const [configLoaded, setConfigLoaded] = useState<boolean>(Boolean(envKey));
  const [gymPlace, setGymPlace] = useState<ResolvedPlaceInfo | null>(null);
  const [originPlace, setOriginPlace] = useState<ResolvedPlaceInfo | null>(null);
  const [travelMode, setTravelMode] = useState<CommuteTravelMode>('DRIVING');
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    if (envKey) return;
    let active = true;
    fetch('/api/maps-config')
      .then((res) => (res.ok ? res.json() : { apiKey: '' }))
      .then((data: { apiKey?: string }) => {
        if (!active) return;
        if (data?.apiKey) {
          setMapsApiKey(data.apiKey);
        }
        setConfigLoaded(true);
      })
      .catch(() => {
        if (active) setConfigLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [envKey]);

  const directionsUrl = useMemo(() => {
    const params = new URLSearchParams({
      api: '1',
      destination: gymPlace?.formattedAddress || '1420 S Congress Ave, Austin, TX 78704',
    });

    if (gymPlace?.id) {
      params.set('destination_place_id', gymPlace.id);
    }

    if (originPlace) {
      params.set(
        'origin',
        originPlace.formattedAddress ||
          `${originPlace.location.lat},${originPlace.location.lng}`
      );
      if (originPlace.id) {
        params.set('origin_place_id', originPlace.id);
      }
    }

    const modeOption = TRAVEL_MODE_OPTIONS.find((opt) => opt.id === travelMode);
    if (modeOption) {
      params.set('travelmode', modeOption.directionsParam);
    }

    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }, [gymPlace, originPlace, travelMode]);

  return (
    <section
      id="gym-location"
      aria-labelledby="gym-location-heading"
      className="py-20 sm:py-24 bg-[#09090B] border-t border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#C8FF00] mb-3">
            09 // GYM LOCATION
          </p>
          <h2
            id="gym-location-heading"
            className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white"
          >
            Find Us On South Congress
          </h2>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg leading-relaxed">
            Train minutes from downtown Austin at{' '}
            <span className="text-zinc-200 font-medium">
              1420 S Congress Ave, Austin, TX
            </span>
            —equipped with dedicated member parking, bus rapid access, and 24/7 keycard
            entry.
          </p>
        </div>

        {mapsApiKey ? (
          <APIProvider
            apiKey={mapsApiKey}
            libraries={['places', 'marker', 'routes']}
            language="en"
            region="US"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Interactive Google Map Canvas */}
              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-[#121216] h-[380px] sm:h-[460px] lg:h-[560px]">
                <GymMapCanvas
                  gymPlace={gymPlace}
                  onGymResolved={setGymPlace}
                  originPlace={originPlace}
                  travelMode={travelMode}
                  onRouteComputed={setRouteSummary}
                  onRouteError={setRouteError}
                  directionsUrl={directionsUrl}
                />
              </div>

              {/* Right Panel: Address, Getting There Text Block, Route Estimator & Open in Maps CTA */}
              <div className="lg:col-span-5 rounded-2xl bg-[#121216] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#C8FF00] mb-2">
                      Address & Access
                    </p>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                      {GYM_INFO.fullName} · Austin
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-300">
                      {gymPlace?.formattedAddress ??
                        `${GYM_INFO.addressLine1}, ${GYM_INFO.addressLine2}`}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-zinc-400 tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C8FF00]" aria-hidden="true" />
                        {GYM_INFO.hoursMember}
                      </span>
                      <a
                        href="tel:+15125550194"
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#C8FF00]" aria-hidden="true" />
                        {GYM_INFO.phone}
                      </a>
                    </div>
                  </div>

                  {/* Getting There Text Block */}
                  <div className="pt-5 border-t border-zinc-800">
                    <h4 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-3">
                      Getting There
                    </h4>
                    <div className="space-y-3.5">
                      {GETTING_THERE_NOTES.map((note) => {
                        const Icon = note.icon;
                        return (
                          <div key={note.title} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#09090B] border border-zinc-800 text-[#C8FF00] flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{note.title}</p>
                              <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                                {note.detail}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <CommutePlanner
                    gymPlace={gymPlace}
                    originPlace={originPlace}
                    onSelectOrigin={setOriginPlace}
                    travelMode={travelMode}
                    onChangeTravelMode={setTravelMode}
                    routeSummary={routeSummary}
                    routeError={routeError}
                  />
                </div>

                {/* Mobile-Friendly Directions CTA + Trial Booking */}
                <div className="pt-5 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] flex-1 px-5 py-3 rounded-lg bg-[#C8FF00] text-[#09090B] font-bold text-sm hover:bg-[#D9FF4D] active:scale-[0.98] transition-[background-color,transform] duration-150 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>

                  {onBookTrial && (
                    <button
                      type="button"
                      onClick={onBookTrial}
                      className="min-h-[48px] px-5 py-3 rounded-lg bg-[#09090B] border border-zinc-700 hover:border-[#C8FF00] text-sm font-semibold text-zinc-100 hover:text-[#C8FF00] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Tour & Trial
                    </button>
                  )}
                </div>
              </div>
            </div>
          </APIProvider>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-[#121216] h-[380px] sm:h-[460px] lg:h-[560px] flex flex-col items-center justify-center p-8 text-center">
              <MapPin className="w-8 h-8 text-[#C8FF00] mb-3" aria-hidden="true" />
              <p className="font-display text-xl uppercase text-white mb-1">
                {configLoaded ? 'Interactive Map Ready' : 'Loading Map Configuration...'}
              </p>
              <p className="text-sm text-zinc-400 max-w-sm mb-5">
                {GYM_INFO.addressLine1}, {GYM_INFO.addressLine2}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#C8FF00] text-[#09090B] font-bold text-sm inline-flex items-center gap-2 hover:bg-[#D9FF4D] transition-colors"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
                <span>Open in Maps</span>
              </a>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#121216] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#C8FF00] mb-2">
                    Address & Access
                  </p>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                    {GYM_INFO.fullName} · Austin
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-300">
                    {GYM_INFO.addressLine1}, {GYM_INFO.addressLine2}
                  </p>
                </div>

                <div className="pt-5 border-t border-zinc-800">
                  <h4 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-3">
                    Getting There
                  </h4>
                  <div className="space-y-3.5">
                    {GETTING_THERE_NOTES.map((note) => {
                      const Icon = note.icon;
                      return (
                        <div key={note.title} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#09090B] border border-zinc-800 text-[#C8FF00] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{note.title}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                              {note.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex-1 px-5 py-3 rounded-lg bg-[#C8FF00] text-[#09090B] font-bold text-sm hover:bg-[#D9FF4D] active:scale-[0.98] transition-[background-color,transform] duration-150 inline-flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                {onBookTrial && (
                  <button
                    type="button"
                    onClick={onBookTrial}
                    className="min-h-[48px] px-5 py-3 rounded-lg bg-[#09090B] border border-zinc-700 hover:border-[#C8FF00] text-sm font-semibold text-zinc-100 hover:text-[#C8FF00] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Book Tour & Trial
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
