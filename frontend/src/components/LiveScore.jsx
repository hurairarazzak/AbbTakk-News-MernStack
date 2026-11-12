import React, { useEffect, useState } from "react";

const API_KEY = "8929c4d6-09a3-49f6-9276-de9c6c340b95";
const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;

const MATCH_TYPE = "odi"; // "odi" | "t20" | "test"
const POLL_MS = 10 * 60 * 1000; // 10 min = max ~144 calls/day per open tab, see note below
const CACHE_KEY = "live-cricket-cache-v1";

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

const writeCache = (match) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ match, time: Date.now() }));
  } catch {}
};

// Module-level, so React StrictMode's double effect doesn't fire two requests
let inFlight = null;

const fetchMatch = async () => {
  const res = await fetch(API_URL);
  const json = await res.json();

  // CricAPI reports limit/key problems as status:"failure", often with HTTP 200
  if (!res.ok || json.status === "failure") {
    throw new Error(json.reason || `API Error: ${res.status}`);
  }

  console.log("CRICAPI RESPONSE:", json); // check the real shape here

  const matches = json.data || [];
  const ofType = matches.filter(
    (m) => String(m.matchType || "").toLowerCase() === MATCH_TYPE
  );

  // Prefer a live match, then fall back to the most recent one of that type
  return (
    ofType.find((m) => m.matchStarted && !m.matchEnded) || ofType[0] || null
  );
};

const getScore = (match, teamName) =>
  (match.score || []).find((s) =>
    String(s.inning || "").toLowerCase().includes(teamName.toLowerCase())
  );

const TeamScore = ({ name, img, score }) => (
  <div className="flex flex-col items-center w-full md:w-1/3">
    {img && (
      <img src={img} alt={name} className="w-12 h-9 mb-2 object-contain border" />
    )}
    <p className="font-semibold">{name}</p>
    <p className="text-xl font-bold text-gray-800">
      {score ? `${score.r}/${score.w}` : "Yet to bat"}
    </p>
    <p className="text-xs text-gray-500">{score?.o ? `(${score.o} ov)` : ""}</p>
  </div>
);

const Box = ({ title, children }) => (
  <div className="bg-white border border-red-600 rounded-2xl p-6 max-w-4xl mx-auto mt-10 text-center shadow-lg">
    <h2 className="text-xl font-bold text-red-600">{title}</h2>
    <div className="text-sm text-gray-600 mt-2">{children}</div>
  </div>
);

const LiveScore = () => {
  const cached = readCache();
  const [match, setMatch] = useState(cached?.match || null);
  const [updatedAt, setUpdatedAt] = useState(cached ? new Date(cached.time) : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    let cancelled = false;

    const load = async () => {
      // Skip the request if cached data is still fresh
      const c = readCache();
      if (c && Date.now() - c.time < POLL_MS) {
        setLoading(false);
        return;
      }

      try {
        inFlight = inFlight || fetchMatch().finally(() => (inFlight = null));
        const m = await inFlight;
        if (cancelled) return;
        writeCache(m);
        setMatch(m);
        setUpdatedAt(new Date());
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        clearInterval(timer); // don't keep hitting a blocked key
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const start = () => {
      load();
      timer = setInterval(load, POLL_MS);
    };

    const onVisibility = () => {
      clearInterval(timer);
      if (!document.hidden) start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (loading) return <Box title="Live Scores">Loading...</Box>;
  if (!match && error) return <Box title="Unable to Load Live Scores">{error}</Box>;
  if (!match)
    return <Box title="Live Scores">No {MATCH_TYPE.toUpperCase()} match available right now.</Box>;

  const [t1, t2] = match.teams || [];
  const info = (name) => (match.teamInfo || []).find((t) => t.name === name);
  const isLive = match.matchStarted && !match.matchEnded;

  return (
    <div className="bg-white border border-red-600 rounded-2xl p-6 max-w-4xl mx-auto mt-10 shadow-lg">
      <h2 className="text-center text-xl md:text-2xl font-bold text-red-600 mb-4">
        {t1} vs {t2}
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <TeamScore name={t1} img={info(t1)?.img} score={getScore(match, t1)} />

        <div className="text-center w-full md:w-1/3 border-t md:border-t-0 md:border-x border-gray-300 py-3 md:py-0">
          <span
            className={`inline-flex items-center text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
              isLive ? "bg-red-600" : "bg-gray-500"
            }`}
          >
            {isLive ? "● Live" : match.matchEnded ? "Completed" : "Upcoming"}
          </span>
          <p className="text-sm font-medium text-gray-700">{match.status}</p>
          <p className="text-xs text-gray-400 mt-1">{match.venue}</p>
          <p className="text-xs text-gray-400 mt-1">
            {match.matchType?.toUpperCase()} Match
          </p>
          {updatedAt && (
            <p className="text-xs text-gray-400 mt-2">
              Updated: {updatedAt.toLocaleTimeString()}
              {error && " (delayed)"}
            </p>
          )}
        </div>

        <TeamScore name={t2} img={info(t2)?.img} score={getScore(match, t2)} />
      </div>
    </div>
  );
};

export default LiveScore;