import { HeartPulse } from "lucide-react";
import MatrixCanvas from "./components/MatrixCanvas";
import LiveClock from "./components/LiveClock";
import MainstreamNews from "./components/MainstreamNews";
import NewsTicker from "./components/NewsTicker";
import PolymarketOdds from "./components/PolymarketOdds";
import TimelineCards from "./components/TimelineCards";
import ViewCounter from "./components/ViewCounter";
import VirusTracker from "./components/VirusTracker";
import WorldMapWidget from "./components/WorldMapWidget";
import {
  activeEvent,
  newsHeadlines,
  topTimeline,
  trackerMarkers,
  verifiedAt,
  worldMapSignals
} from "./data/tracker";
const tickerItems = newsHeadlines.map(
  (item) => `${item.source}: ${item.headline} // ${item.summary}`
);

const priorityTickerItems = [
  "NOTE: This is the ANDES STRAIN. Human-to-human is confirmed with this strain. Waiting for confirmed andes strain from frenchie and Flight Attendant (it's been long enough that we can assume he's got it)",
  "W.H.O BRIEFING TODAY 3PM CEST",
  "A rare form of hantavirus is believed to have spread person-to-person on board a cruise ship. 3 people are dead, 4 more are ill and nearly 150 others are stranded aboard the ship, where they will stay potentially for months until they are cleared to leave.",
  "Spain will host the MV Hondius vessel in the Canary Islands in compliance with International Law and the humanitarian spirit."
];

const worldMapTotals = {
  confirmed: activeEvent.confirmed,
  suspected: activeEvent.suspected,
  contact: worldMapSignals.filter((signal) => signal.status === "contact").length
};

export default function Home() {
  return (
    <>
      <MatrixCanvas />
      <div className="scanline" />
      <div className="cat-peek-link" aria-hidden="true">
        <img
          aria-hidden="true"
          className="cat-peek"
          decoding="async"
          fetchPriority="low"
          height="528"
          loading="lazy"
          src="/cat.webp"
          width="540"
          alt=""
        />
      </div>
      <ViewCounter />
      <header className="site-header">
        <div className="header-left">
          <div className="logo">
            HANTA<span>.</span>BANDORS.ORG
          </div>
        </div>
        <div className="header-right">
          <LiveClock />
        </div>
      </header>

      <NewsTicker items={[...priorityTickerItems, ...tickerItems]} />

      <main className="main-shell">
        <section className="event-grid">
          <VirusTracker event={activeEvent} markers={trackerMarkers} />
        </section>

        <PolymarketOdds />

        <WorldMapWidget signals={worldMapSignals} totals={worldMapTotals} updated={verifiedAt} />

        <section className="top-briefing-grid">
          <section className="panel top-timeline-panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <span className="panel-icon">
                  <HeartPulse size={18} />
                </span>
                <div>
                  <h2>Outbreak Timeline</h2>
                  <p>Chronology of verified outbreak milestones</p>
                </div>
              </div>
              <span className="badge amber">MV HONDIUS</span>
            </div>
            <TimelineCards items={topTimeline} />
            <div className="timeline-image-frame">
              <img
                alt="Outbreak discussion graphic"
                decoding="async"
                fetchPriority="low"
                height="421"
                loading="lazy"
                src="/happening1.webp"
                width="900"
              />
            </div>
          </section>

          <MainstreamNews initialItems={newsHeadlines} />
        </section>

      </main>
    </>
  );
}
