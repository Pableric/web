const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hasGsap = typeof window.gsap !== "undefined";

const gridLines = `
  <path class="grid" d="M70 130H930 M70 190H930 M70 250H930 M70 310H930 M70 370H930 M70 430H930" />
  <path class="grid" d="M140 90V455 M260 90V455 M380 90V455 M500 90V455 M620 90V455 M740 90V455 M860 90V455" />
`;

const sceneFrame = (candidate, content) => `
  <div class="scene scene-${candidate.id}" data-scene="${candidate.id}" role="img" aria-label="${candidate.title}: ${candidate.note}">
    <div class="scene-top"><span>Concept data / not approved</span><span>${candidate.top}</span></div>
    ${content}
    <div class="scene-bottom"><span>${candidate.bottom}</span><span>SofL / ${candidate.id}</span></div>
  </div>
`;

const latticeDots = Array.from({ length: 54 }, (_, index) => {
  const column = index % 9;
  const row = Math.floor(index / 9);
  const x = 100 + column * 58 + (row % 2) * 16;
  const y = 135 + row * 50;
  const targetX = 470 + column * 10;
  const targetY = 180 + ((index * 37) % 170);
  return `<circle class="lattice-dot" cx="${x}" cy="${y}" r="3" data-x="${targetX - x}" data-y="${targetY - y}" />`;
}).join("");

const matrixCells = Array.from({ length: 72 }, (_, index) => {
  const column = index % 12;
  const row = Math.floor(index / 12);
  return `<rect class="matrix-cell" x="${82 + column * 38}" y="${135 + row * 44}" width="24" height="24" rx="2" data-column="${column}" />`;
}).join("");

const qmcDots = Array.from({ length: 72 }, (_, index) => {
  const x = 80 + ((index * 83) % 590);
  const y = 115 + ((index * 137) % 300);
  return `<circle class="qmc-dot" cx="${x}" cy="${y}" r="${index % 5 === 0 ? 3.2 : 2}" />`;
}).join("");

const candidates = [
  {
    id: "01",
    title: "Convergence Gate",
    tag: "Recommended / execution",
    top: "Monte Carlo states → result",
    bottom: "Matched workload / lower is better",
    note: "Many numerical states collapse into one direct, unmistakable performance result.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="lane-lines">
          <path class="faint draw" pathLength="1" d="M70 170H510" />
          <path class="faint draw" pathLength="1" d="M70 220H510" />
          <path class="faint draw" pathLength="1" d="M70 270H510" />
          <path class="faint draw" pathLength="1" d="M70 320H510" />
          <path class="faint draw" pathLength="1" d="M70 370H510" />
        </g>
        <g class="gate">
          <path class="line" d="M500 120V420 M520 120V420" />
          <path class="faint" d="M475 120H545 M475 420H545" />
        </g>
        <g class="mc-points">
          <circle class="mc-point" cx="110" cy="170" r="4" data-x="390" data-y="100" />
          <circle class="mc-point" cx="205" cy="170" r="2.5" data-x="295" data-y="100" />
          <circle class="mc-point" cx="325" cy="170" r="3" data-x="175" data-y="100" />
          <circle class="mc-point" cx="135" cy="220" r="3" data-x="365" data-y="50" />
          <circle class="mc-point" cx="260" cy="220" r="4" data-x="240" data-y="50" />
          <circle class="mc-point" cx="390" cy="220" r="2.5" data-x="110" data-y="50" />
          <circle class="mc-point" cx="95" cy="270" r="3" data-x="405" data-y="0" />
          <circle class="mc-point" cx="235" cy="270" r="2.5" data-x="265" data-y="0" />
          <circle class="mc-point" cx="365" cy="270" r="4" data-x="135" data-y="0" />
          <circle class="mc-point" cx="145" cy="320" r="4" data-x="355" data-y="-50" />
          <circle class="mc-point" cx="280" cy="320" r="3" data-x="220" data-y="-50" />
          <circle class="mc-point" cx="410" cy="320" r="2.5" data-x="90" data-y="-50" />
          <circle class="mc-point" cx="105" cy="370" r="2.5" data-x="395" data-y="-100" />
          <circle class="mc-point" cx="230" cy="370" r="4" data-x="270" data-y="-100" />
          <circle class="mc-point" cx="350" cy="370" r="3" data-x="150" data-y="-100" />
        </g>
        <path class="strong draw output-line" pathLength="1" d="M520 270H930" />
        <circle class="dot output-dot" cx="930" cy="270" r="7" />
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
    `,
  },
  {
    id: "02",
    title: "Matched Race",
    tag: "Comparison / direct",
    top: "Same CPU / contract / output",
    bottom: "Relative execution time",
    note: "A literal two-lane race makes the comparison legible before any explanation.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <path class="faint finish-line" d="M900 105V425" />
        <path class="strong race-baseline" d="M100 215H900" />
        <path class="strong race-sofl" d="M100 330H900" />
        <circle class="dot race-dot race-dot-a" cx="900" cy="215" r="7" />
        <circle class="dot race-dot race-dot-b" cx="128" cy="330" r="7" />
        <text class="race-label" x="100" y="195" font-size="13">COMMERCIAL BASELINE</text>
        <text class="race-label" x="100" y="310" font-size="13">SOFL</text>
        <text class="race-value" x="900" y="195" text-anchor="end" font-size="13">1× TIME</text>
        <text class="race-value" x="900" y="310" text-anchor="end" font-size="13">1/28 TIME</text>
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
    `,
  },
  {
    id: "03",
    title: "Path Cloud",
    tag: "Monte Carlo / paths",
    top: "4,096 simulated paths",
    bottom: "Estimate converges at terminal state",
    note: "A controlled fan of sample paths tightens into a single price estimate.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <path class="fill-soft confidence-band" d="M90 250 C220 115 330 185 455 170 C560 160 640 205 720 244 L720 300 C620 286 550 315 450 300 C330 285 220 385 90 286Z" />
        <g class="cloud-paths">
          <path class="faint draw" pathLength="1" d="M90 270 C180 170 250 210 335 160 S535 230 720 258" />
          <path class="faint draw" pathLength="1" d="M90 270 C190 360 260 250 360 330 S560 245 720 266" />
          <path class="faint draw" pathLength="1" d="M90 270 C170 240 275 125 380 220 S570 300 720 270" />
          <path class="faint draw" pathLength="1" d="M90 270 C180 310 285 390 390 285 S585 220 720 276" />
          <path class="line draw" pathLength="1" d="M90 270 C200 205 280 270 385 242 S580 268 720 270" />
          <path class="faint draw" pathLength="1" d="M90 270 C210 120 305 330 410 190 S590 320 720 280" />
          <path class="faint draw" pathLength="1" d="M90 270 C205 390 320 145 425 350 S610 180 720 272" />
        </g>
        <path class="strong draw mean-path" pathLength="1" d="M90 270 C260 258 430 275 720 271" />
        <circle class="dot terminal-dot" cx="720" cy="271" r="7" />
      </svg>
      <div class="scene-readout"><strong>8.4921</strong><span>Converged price / sample</span></div>
    `,
  },
  {
    id: "04",
    title: "Structured Lattice",
    tag: "Recommended / QMC",
    top: "Low-discrepancy point field",
    bottom: "Structure in / financial result out",
    note: "A QMC-inspired field reorganizes into a disciplined result without exposing implementation.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="lattice">${latticeDots}</g>
        <path class="line draw lattice-axis" pathLength="1" d="M560 110V420" />
        <path class="strong draw lattice-output" pathLength="1" d="M560 270H930" />
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
      <div class="data-chip" style="left:7%;bottom:14%"><span>4,096 points</span><span>N = 64</span></div>
    `,
  },
  {
    id: "05",
    title: "Sample Ladder",
    tag: "Scale / convergence",
    top: "Fixed QMC sampling ladder",
    bottom: "More samples / stable estimate",
    note: "Four sampling levels build in sequence while the estimate visibly settles.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="sample-steps">
          <rect class="fill-mid sample-step" x="430" y="360" width="100" height="55" />
          <rect class="fill-mid sample-step" x="545" y="315" width="100" height="100" />
          <rect class="fill-mid sample-step" x="660" y="245" width="100" height="170" />
          <rect class="fill-mid sample-step" x="775" y="135" width="100" height="280" />
          <text x="480" y="442" text-anchor="middle" font-size="12">64</text>
          <text x="595" y="442" text-anchor="middle" font-size="12">256</text>
          <text x="710" y="442" text-anchor="middle" font-size="12">1,024</text>
          <text x="825" y="442" text-anchor="middle" font-size="12">4,096</text>
        </g>
        <path class="line draw" pathLength="1" d="M430 210 C555 185 680 205 875 195" />
        <circle class="dot sample-dot" cx="875" cy="195" r="6" />
      </svg>
      <div class="scene-readout"><strong>4,096</strong><span>Paths / N64 workload</span></div>
    `,
  },
  {
    id: "06",
    title: "Ratio Cut",
    tag: "Typography / impact",
    top: "Matched relative performance",
    bottom: "One number / no detour",
    note: "Kinetic typography dominates; a moving cut-line exposes the comparison beneath it.",
    visual: `
      <div class="scene-watermark">FASTER</div>
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <path class="strong draw ratio-cut" pathLength="1" d="M75 355H925" />
        <path class="faint" d="M75 380H925" />
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
      <p class="metric-label" style="left:50%;top:73%;transform:translateX(-50%)">Matched commercial baseline / sample</p>
    `,
  },
  {
    id: "07",
    title: "Matrix Collapse",
    tag: "Numerical / compression",
    top: "Numerical state matrix",
    bottom: "Price + sensitivities",
    note: "A dense computation field collapses cleanly into a compact financial output.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="matrix-cells">${matrixCells}</g>
        <path class="strong draw matrix-output" pathLength="1" d="M555 270H915" />
        <circle class="dot matrix-dot" cx="915" cy="270" r="7" />
      </svg>
      <div class="scene-readout"><strong>03</strong><span>Price / Delta / Vega</span></div>
    `,
  },
  {
    id: "08",
    title: "Payoff Geometry",
    tag: "Recommended / finance",
    top: "Terminal states / payoff",
    bottom: "Paths × contract → price",
    note: "Monte Carlo terminal points meet a recognizable payoff line, then resolve to the ratio.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <path class="strong draw payoff-line" pathLength="1" d="M90 390H250 L590 125" />
        <path class="faint draw payoff-axis" pathLength="1" d="M90 115V390H620" />
        <g class="payoff-points">
          <circle class="payoff-dot" cx="135" cy="375" r="4" />
          <circle class="payoff-dot" cx="185" cy="386" r="3" />
          <circle class="payoff-dot" cx="225" cy="368" r="4" />
          <circle class="payoff-dot" cx="280" cy="350" r="3" />
          <circle class="payoff-dot" cx="315" cy="322" r="4" />
          <circle class="payoff-dot" cx="355" cy="305" r="3" />
          <circle class="payoff-dot" cx="400" cy="260" r="4" />
          <circle class="payoff-dot" cx="448" cy="238" r="3" />
          <circle class="payoff-dot" cx="500" cy="193" r="4" />
          <circle class="payoff-dot" cx="555" cy="158" r="3" />
        </g>
        <text x="105" y="105" font-size="11">PAYOFF</text>
        <text x="565" y="415" font-size="11">TERMINAL STATE</text>
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
    `,
  },
  {
    id: "09",
    title: "Confidence Lock",
    tag: "Validation / precision",
    top: "Estimate and confidence interval",
    bottom: "Uncertainty closes / value remains",
    note: "A wide interval locks onto a stable result—calm, numerical and credibility-forward.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="confidence-bracket">
          <path class="strong" d="M120 255H660" />
          <path class="strong" d="M120 225V285 M660 225V285" />
          <circle class="dot confidence-mid" cx="390" cy="255" r="7" />
        </g>
        <path class="faint draw" pathLength="1" d="M120 340 C250 315 330 360 455 325 S620 348 700 330" />
      </svg>
      <div class="scene-readout"><strong>8.4921</strong><span>Reference estimate / sample</span></div>
      <div class="data-chip" style="left:12%;bottom:17%"><span>95% interval</span><span>independent reference</span></div>
    `,
  },
  {
    id: "10",
    title: "Greeks Pulse",
    tag: "Risk / outputs",
    top: "Price is the first output",
    bottom: "Delta / Vega / Rho",
    note: "Three sensitivity signals travel in parallel and arrive as one compact risk result.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="greek-waves">
          <path class="strong draw" pathLength="1" d="M80 175 C165 90 245 260 330 175 S500 260 585 175" />
          <path class="line draw" pathLength="1" d="M80 270 C165 210 245 330 330 270 S500 330 585 270" />
          <path class="faint draw" pathLength="1" d="M80 365 C165 325 245 405 330 365 S500 405 585 365" />
        </g>
        <text x="95" y="150" font-size="11">DELTA</text>
        <text x="95" y="245" font-size="11">VEGA</text>
        <text x="95" y="340" font-size="11">RHO</text>
        <path class="strong draw" pathLength="1" d="M585 175 L650 270 L585 365" />
      </svg>
      <div class="hero-metric"><strong>03</strong><small>outputs</small></div>
      <p class="metric-label" style="right:8%;top:70%">Risk outputs / one request</p>
    `,
  },
  {
    id: "11",
    title: "Barrier Monitor",
    tag: "Path-dependent / contract",
    top: "Discrete barrier monitoring",
    bottom: "Path state retained / result reduced",
    note: "Paths approach and cross a barrier; hit states are isolated without turning into a trading chart.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <path class="strong draw barrier-line" pathLength="1" d="M75 165H930" />
        <text x="82" y="150" font-size="11">BARRIER</text>
        <g class="barrier-paths">
          <path class="faint draw" pathLength="1" d="M80 380 L155 340 L230 355 L305 290 L380 315 L455 250 L530 278 L605 215 L680 242 L755 205" />
          <path class="line draw" pathLength="1" d="M80 390 L155 360 L230 285 L305 310 L380 245 L455 205 L530 145 L605 190 L680 135 L755 160" />
          <path class="faint draw" pathLength="1" d="M80 350 L155 325 L230 300 L305 245 L380 275 L455 230 L530 205 L605 235 L680 190 L755 210" />
          <path class="faint draw" pathLength="1" d="M80 400 L155 385 L230 330 L305 350 L380 295 L455 320 L530 270 L605 305 L680 255 L755 290" />
        </g>
        <g class="barrier-hits">
          <circle class="barrier-hit" cx="530" cy="145" r="8" />
          <circle class="barrier-hit" cx="680" cy="135" r="8" />
        </g>
      </svg>
      <div class="scene-readout"><strong>3,812</strong><span>Surviving paths / sample</span></div>
    `,
  },
  {
    id: "12",
    title: "Bridge Refinement",
    tag: "Path construction / abstract",
    top: "Recursive fixing refinement",
    bottom: "64 fixing dates / one path state",
    note: "A Brownian-bridge-inspired sequence adds midpoints progressively, showing structure without internals.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="bridge-segments">
          <path class="strong draw" pathLength="1" d="M80 350L550 145" />
          <path class="line draw" pathLength="1" d="M80 350L315 205L550 145" />
          <path class="line draw" pathLength="1" d="M80 350L198 300L315 205L433 275L550 145" />
          <path class="faint draw" pathLength="1" d="M80 350L139 315L198 300L257 245L315 205L374 235L433 275L492 185L550 145" />
        </g>
        <g class="bridge-nodes">
          <circle class="bridge-node" cx="80" cy="350" r="5" />
          <circle class="bridge-node" cx="198" cy="300" r="5" />
          <circle class="bridge-node" cx="315" cy="205" r="6" />
          <circle class="bridge-node" cx="433" cy="275" r="5" />
          <circle class="bridge-node" cx="550" cy="145" r="5" />
        </g>
      </svg>
      <div class="scene-readout"><strong>64</strong><span>Fixing dates / N64</span></div>
    `,
  },
  {
    id: "13",
    title: "Relative Time Dial",
    tag: "Ratio / instrument",
    top: "Relative lifecycle boundary",
    bottom: "1 / 28 of baseline time",
    note: "A precision-instrument dial makes the ratio feel measured rather than marketed.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        <g class="dial" transform="translate(500 270) rotate(-90)">
          <circle class="faint" cx="0" cy="0" r="165" />
          <circle class="line dial-ring draw" pathLength="1" cx="0" cy="0" r="165" />
          <circle class="faint" cx="0" cy="0" r="125" />
          <circle class="strong dial-value draw" pathLength="1" cx="0" cy="0" r="125" />
        </g>
        <g class="dial-ticks">
          <path class="faint" d="M500 83V106 M500 434V457 M313 270H336 M664 270H687" />
        </g>
      </svg>
      <div class="hero-metric"><strong>1/28</strong></div>
      <p class="metric-label" style="left:50%;top:72%;transform:translateX(-50%)">Relative time / matched sample</p>
    `,
  },
  {
    id: "14",
    title: "Reference Odometer",
    tag: "Python comparison / impact",
    top: "Reference implementation comparison",
    bottom: "Illustrative ratio / evidence required",
    note: "An odometer-style count lands on the largest comparison while restrained ticks retain technical character.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="odometer-ticks">
          <path class="faint" d="M90 120V145 M150 120V135 M210 120V145 M270 120V135 M330 120V145 M390 120V135 M450 120V145 M510 120V135 M570 120V145 M630 120V135 M690 120V145 M750 120V135 M810 120V145 M870 120V135" />
          <path class="faint" d="M90 390V415 M150 400V415 M210 390V415 M270 400V415 M330 390V415 M390 400V415 M450 390V415 M510 400V415 M570 390V415 M630 400V415 M690 390V415 M750 400V415 M810 390V415 M870 400V415" />
        </g>
      </svg>
      <div class="hero-metric"><strong>3,000</strong><small>×</small></div>
      <p class="metric-label" style="left:50%;top:72%;transform:translateX(-50%)">vs reference Python / placeholder</p>
    `,
  },
  {
    id: "15",
    title: "Error Compression",
    tag: "Accuracy / comparison",
    top: "Observed absolute error",
    bottom: "Qualified contract / case-specific",
    note: "The plain and GeoCV errors compress into a single ~20× accuracy statement.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="error-bars">
          <text x="90" y="185" font-size="12">PLAIN</text>
          <rect class="fill-mid error-bar error-a" x="90" y="205" width="560" height="24" />
          <text x="670" y="224" font-size="12">0.0234</text>
          <text x="90" y="300" font-size="12">GEOCV</text>
          <rect class="fill-mid error-bar error-b" x="90" y="320" width="28" height="24" />
          <text x="138" y="339" font-size="12">0.00113</text>
        </g>
      </svg>
      <div class="scene-readout"><strong>~20×</strong><span>Lower observed error / sample</span></div>
    `,
  },
  {
    id: "16",
    title: "Strike Surface",
    tag: "Multi-strike / workload",
    top: "One state / multiple strikes",
    bottom: "Surface sampled in parallel",
    note: "A restrained wire surface suggests multi-strike breadth without resembling a market-price chart.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="surface-lines">
          <path class="faint draw" pathLength="1" d="M90 365 C210 295 350 295 570 350" />
          <path class="faint draw" pathLength="1" d="M90 325 C210 250 350 250 570 310" />
          <path class="line draw" pathLength="1" d="M90 285 C210 205 350 205 570 270" />
          <path class="faint draw" pathLength="1" d="M90 245 C210 160 350 160 570 230" />
          <path class="faint draw" pathLength="1" d="M90 205 C210 115 350 115 570 190" />
          <path class="faint draw" pathLength="1" d="M120 190L120 350 M215 140L215 300 M310 125L310 285 M405 145L405 300 M500 175L500 330" />
        </g>
      </svg>
      <div class="scene-readout"><strong>16</strong><span>Strikes / one evaluation</span></div>
    `,
  },
  {
    id: "17",
    title: "State Pipeline",
    tag: "Recommended / product",
    top: "Shared execution foundation",
    bottom: "Price / Delta / Vega / Rho",
    note: "Inputs pass through one compact execution node and fan into real financial outputs.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="pipeline-inputs">
          <circle class="pipeline-node" cx="110" cy="170" r="8" />
          <circle class="pipeline-node" cx="110" cy="235" r="8" />
          <circle class="pipeline-node" cx="110" cy="300" r="8" />
          <circle class="pipeline-node" cx="110" cy="365" r="8" />
        </g>
        <g class="pipeline-lines">
          <path class="faint draw" pathLength="1" d="M110 170L420 270 M110 235L420 270 M110 300L420 270 M110 365L420 270" />
          <rect class="fill-mid pipeline-core" x="400" y="215" width="105" height="110" rx="4" />
          <path class="line draw" pathLength="1" d="M505 270L640 150 M505 270L640 230 M505 270L640 310 M505 270L640 390" />
        </g>
        <g class="pipeline-outputs">
          <text x="660" y="155" font-size="13">PRICE</text>
          <text x="660" y="235" font-size="13">DELTA</text>
          <text x="660" y="315" font-size="13">VEGA</text>
          <text x="660" y="395" font-size="13">RHO</text>
        </g>
      </svg>
      <div class="hero-metric"><strong>01</strong><small>core</small></div>
    `,
  },
  {
    id: "18",
    title: "Baseline Cut",
    tag: "Comparison / minimal",
    top: "Same lifecycle boundary",
    bottom: "The shorter line is the story",
    note: "The simplest direct comparison: one full baseline, one 1/28-length SofL line.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <text x="460" y="190" font-size="12">COMMERCIAL BASELINE</text>
        <path class="strong baseline-cut-a" d="M460 215H910" />
        <circle class="dot baseline-dot-a" cx="910" cy="215" r="6" />
        <text x="460" y="310" font-size="12">SOFL</text>
        <path class="strong baseline-cut-b" d="M460 335H910" />
        <circle class="dot baseline-dot-b" cx="476" cy="335" r="6" />
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
    `,
  },
  {
    id: "19",
    title: "Low-Discrepancy Field",
    tag: "QMC / spatial",
    top: "Structured sampling field",
    bottom: "4,096 paths / deterministic identity",
    note: "A disciplined point field locks into a clean spatial rhythm, then yields the sample count.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        ${gridLines}
        <g class="qmc-field">${qmcDots}</g>
        <path class="strong draw qmc-divider" pathLength="1" d="M700 100V430" />
      </svg>
      <div class="hero-metric"><strong>4,096</strong></div>
      <p class="metric-label" style="right:8%;top:67%">Fixed QMC paths</p>
    `,
  },
  {
    id: "20",
    title: "Precision Type",
    tag: "Recommended / editorial",
    top: "Matched performance",
    bottom: "Measured substance / editorial restraint",
    note: "The most Oimachi-adjacent option: an elegant numeral reveal with only two measured rules.",
    visual: `
      <svg viewBox="0 0 1000 518" aria-hidden="true">
        <path class="faint draw precision-rule" pathLength="1" d="M80 165H920" />
        <path class="strong draw precision-rule" pathLength="1" d="M80 375H920" />
        <circle class="dot precision-dot" cx="920" cy="375" r="7" />
      </svg>
      <div class="hero-metric"><strong>28</strong><small>×</small></div>
      <p class="metric-label" style="left:8%;top:70%">Faster / matched sample</p>
    `,
  },
];

const grid = document.querySelector("[data-candidate-grid]");
const timelines = new WeakMap();
const visibleScenes = new Set();
let motionPaused = false;

const cardMarkup = (candidate) => `
  <article class="candidate-card" id="candidate-${candidate.id}" data-candidate="${candidate.id}">
    <header class="card-heading">
      <span class="card-index">${candidate.id}</span>
      <h3>${candidate.title}</h3>
      <span class="card-tag">${candidate.tag}</span>
    </header>
    ${sceneFrame(candidate, candidate.visual)}
    <div class="card-meta">
      <p>${candidate.note}</p>
      <div class="card-actions">
        <button type="button" data-replay="${candidate.id}">Replay</button>
        <button type="button" data-focus="${candidate.id}">View large ↗</button>
      </div>
    </div>
  </article>
`;

if (grid) {
  grid.innerHTML = candidates.map(cardMarkup).join("");
}

if (window.location.hash.startsWith("#candidate-")) {
  window.requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ block: "start" });
  });
}

function setDrawState(elements) {
  window.gsap.set(elements, { strokeDasharray: 1, strokeDashoffset: 1 });
}

function animateMetric(timeline, metric, at = 1.25) {
  if (!metric) return;
  window.gsap.set(metric, {
    autoAlpha: 0,
    y: 55,
    clipPath: "inset(100% 0 0 0)",
  });
  timeline.to(
    metric,
    {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      duration: 0.72,
      ease: "expo.out",
    },
    at,
  );
}

function createTimeline(scene) {
  if (!hasGsap || reducedMotion.matches) return null;

  const { gsap } = window;
  const id = scene.dataset.scene;
  const topBottom = scene.querySelectorAll(".scene-top span, .scene-bottom span");
  const metric = scene.querySelector(".hero-metric");
  const readout = scene.querySelector(".scene-readout");
  const chips = scene.querySelectorAll(".data-chip, .metric-label");
  const drawPaths = scene.querySelectorAll(".draw");
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

  gsap.set(topBottom, { autoAlpha: 0, y: -4 });
  gsap.set(chips, { autoAlpha: 0, y: 5 });
  if (readout) gsap.set(readout, { autoAlpha: 0, y: 14 });
  setDrawState(drawPaths);

  timeline
    .to(topBottom, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.035 }, 0)
    .to(chips, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05 }, 1.85);

  switch (id) {
    case "01": {
      const points = scene.querySelectorAll(".mc-point");
      const gate = scene.querySelector(".gate");
      const outputDot = scene.querySelector(".output-dot");
      gsap.set(points, { autoAlpha: 0, x: -60 });
      gsap.set(gate, { autoAlpha: 0, scaleY: 0.15, transformOrigin: "center" });
      gsap.set(outputDot, { autoAlpha: 0, scale: 0, transformOrigin: "center" });
      timeline
        .to(gate, { autoAlpha: 0.75, scaleY: 1, duration: 0.45 }, 0.12)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.65, stagger: 0.025 }, 0.18)
        .to(points, {
          autoAlpha: 0.9,
          x: (_, point) => Number(point.dataset.x),
          y: (_, point) => Number(point.dataset.y),
          duration: 0.95,
          stagger: 0.025,
          ease: "power3.in",
        }, 0.48)
        .to(points, { autoAlpha: 0, duration: 0.14 }, 1.38)
        .to(outputDot, { autoAlpha: 0.8, scale: 1, duration: 0.22 }, 1.58);
      animateMetric(timeline, metric, 1.38);
      break;
    }
    case "02": {
      const baseline = scene.querySelector(".race-baseline");
      const sofl = scene.querySelector(".race-sofl");
      const dots = scene.querySelectorAll(".race-dot");
      const labels = scene.querySelectorAll(".race-label, .race-value");
      gsap.set([baseline, sofl], { scaleX: 0, transformOrigin: "left" });
      gsap.set(dots, { autoAlpha: 0, scale: 0 });
      gsap.set(labels, { autoAlpha: 0, y: 6 });
      timeline
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 }, 0.18)
        .to(sofl, { scaleX: 0.035, duration: 0.24 }, 0.48)
        .to(dots[1], { autoAlpha: 1, scale: 1, duration: 0.18 }, 0.65)
        .to(baseline, { scaleX: 1, duration: 1.05, ease: "power2.inOut" }, 0.52)
        .to(dots[0], { autoAlpha: 1, scale: 1, duration: 0.2 }, 1.42);
      animateMetric(timeline, metric, 1.15);
      break;
    }
    case "03": {
      const band = scene.querySelector(".confidence-band");
      const dot = scene.querySelector(".terminal-dot");
      gsap.set(band, { autoAlpha: 0, scaleY: 0.15, transformOrigin: "center" });
      gsap.set(dot, { autoAlpha: 0, scale: 0 });
      timeline
        .to(band, { autoAlpha: 1, scaleY: 1, duration: 0.55 }, 0.15)
        .to(drawPaths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.06, ease: "power2.inOut" }, 0.22)
        .to(band, { scaleY: 0.14, autoAlpha: 0.4, duration: 0.65, ease: "expo.inOut" }, 1.28)
        .to(dot, { autoAlpha: 1, scale: 1, duration: 0.22 }, 1.73)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.48 }, 1.58);
      break;
    }
    case "04": {
      const dots = scene.querySelectorAll(".lattice-dot");
      gsap.set(dots, { autoAlpha: 0, scale: 0, transformOrigin: "center" });
      timeline
        .to(dots, { autoAlpha: 0.75, scale: 1, duration: 0.38, stagger: { each: 0.012, from: "random" } }, 0.2)
        .to(dots, {
          x: (_, dot) => Number(dot.dataset.x),
          y: (_, dot) => Number(dot.dataset.y),
          duration: 0.78,
          stagger: 0.006,
          ease: "expo.inOut",
        }, 0.88)
        .to(dots, { autoAlpha: 0.12, duration: 0.25 }, 1.57)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.55, stagger: 0.12 }, 1.32);
      animateMetric(timeline, metric, 1.45);
      break;
    }
    case "05": {
      const steps = scene.querySelectorAll(".sample-step");
      const labels = scene.querySelectorAll(".sample-steps text");
      const dot = scene.querySelector(".sample-dot");
      gsap.set(steps, { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(labels, { autoAlpha: 0, y: 5 });
      gsap.set(dot, { autoAlpha: 0, scale: 0 });
      timeline
        .to(steps, { scaleY: 1, duration: 0.5, stagger: 0.13, ease: "expo.out" }, 0.2)
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.13 }, 0.36)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.9 }, 0.82)
        .to(dot, { autoAlpha: 1, scale: 1, duration: 0.22 }, 1.62)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.48 }, 1.28);
      break;
    }
    case "06": {
      const watermark = scene.querySelector(".scene-watermark");
      gsap.set(watermark, { autoAlpha: 0, x: 80 });
      timeline
        .to(watermark, { autoAlpha: 1, x: 0, duration: 0.75 }, 0.18)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.75 }, 0.35)
        .to(watermark, { autoAlpha: 0.45, x: -25, duration: 0.5 }, 1.2);
      animateMetric(timeline, metric, 0.72);
      break;
    }
    case "07": {
      const cells = scene.querySelectorAll(".matrix-cell");
      const dot = scene.querySelector(".matrix-dot");
      gsap.set(cells, { autoAlpha: 0, scale: 0.2, transformOrigin: "center" });
      gsap.set(dot, { autoAlpha: 0, scale: 0 });
      timeline
        .to(cells, { autoAlpha: 0.55, scale: 1, duration: 0.32, stagger: { each: 0.008, grid: [6, 12], from: "start" } }, 0.15)
        .to(cells, { x: (_, cell) => 455 - Number(cell.getAttribute("x")), y: (_, cell) => 258 - Number(cell.getAttribute("y")), scale: 0.08, duration: 0.75, stagger: 0.004, ease: "expo.inOut" }, 0.88)
        .to(cells, { autoAlpha: 0, duration: 0.12 }, 1.54)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.55 }, 1.32)
        .to(dot, { autoAlpha: 1, scale: 1, duration: 0.2 }, 1.77)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.48 }, 1.5);
      break;
    }
    case "08": {
      const dots = scene.querySelectorAll(".payoff-dot");
      gsap.set(dots, { autoAlpha: 0, y: 60, scale: 0 });
      timeline
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.85, stagger: 0.1 }, 0.18)
        .to(dots, { autoAlpha: 0.85, y: 0, scale: 1, duration: 0.45, stagger: 0.05 }, 0.62);
      animateMetric(timeline, metric, 1.25);
      break;
    }
    case "09": {
      const bracket = scene.querySelector(".confidence-bracket");
      const middle = scene.querySelector(".confidence-mid");
      gsap.set(bracket, { autoAlpha: 0, scaleX: 1.65, transformOrigin: "center" });
      gsap.set(middle, { scale: 0, transformOrigin: "center" });
      timeline
        .to(bracket, { autoAlpha: 1, duration: 0.25 }, 0.15)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.75 }, 0.28)
        .to(bracket, { scaleX: 0.26, duration: 0.9, ease: "expo.inOut" }, 0.78)
        .to(middle, { scale: 1, duration: 0.2 }, 1.5)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.48 }, 1.38);
      break;
    }
    case "10": {
      const labels = scene.querySelectorAll("svg text");
      gsap.set(labels, { autoAlpha: 0, x: -8 });
      timeline
        .to(labels, { autoAlpha: 0.8, x: 0, duration: 0.3, stagger: 0.09 }, 0.18)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.13, ease: "power2.inOut" }, 0.34);
      animateMetric(timeline, metric, 1.28);
      break;
    }
    case "11": {
      const hits = scene.querySelectorAll(".barrier-hit");
      gsap.set(hits, { autoAlpha: 0, scale: 0, transformOrigin: "center" });
      timeline
        .to(drawPaths, { strokeDashoffset: 0, duration: 1.05, stagger: 0.11, ease: "power2.inOut" }, 0.18)
        .to(hits, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.18 }, 1.15)
        .to(hits, { scale: 1.8, autoAlpha: 0.2, duration: 0.42, stagger: 0.18 }, 1.42)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.48);
      break;
    }
    case "12": {
      const nodes = scene.querySelectorAll(".bridge-node");
      gsap.set(nodes, { autoAlpha: 0, scale: 0 });
      timeline
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.68, stagger: 0.2, ease: "power2.inOut" }, 0.18)
        .to(nodes, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: { each: 0.08, from: "center" } }, 1.08)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.38);
      break;
    }
    case "13": {
      const dial = scene.querySelector(".dial");
      const ring = scene.querySelector(".dial-ring");
      const value = scene.querySelector(".dial-value");
      setDrawState([ring, value]);
      gsap.set(dial, { rotation: -120, transformOrigin: "500px 270px" });
      timeline
        .to(dial, { rotation: -90, duration: 0.8, ease: "expo.out" }, 0.18)
        .to(ring, { strokeDashoffset: 0, duration: 1.15, ease: "power2.inOut" }, 0.2)
        .to(value, { strokeDashoffset: 0.965, duration: 0.75, ease: "power3.out" }, 0.75);
      animateMetric(timeline, metric, 1.05);
      break;
    }
    case "14": {
      const ticks = scene.querySelector(".odometer-ticks");
      gsap.set(ticks, { autoAlpha: 0, scaleX: 0.4, transformOrigin: "center" });
      timeline.to(ticks, { autoAlpha: 1, scaleX: 1, duration: 0.65 }, 0.18);
      animateMetric(timeline, metric, 0.45);
      break;
    }
    case "15": {
      const bars = scene.querySelectorAll(".error-bar");
      const labels = scene.querySelectorAll(".error-bars text");
      gsap.set(bars, { scaleX: 0, transformOrigin: "left" });
      gsap.set(labels, { autoAlpha: 0, y: 5 });
      timeline
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, 0.18)
        .to(bars[0], { scaleX: 1, duration: 0.78 }, 0.38)
        .to(bars[1], { scaleX: 1, duration: 0.28 }, 0.78)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.48 }, 1.2);
      break;
    }
    case "16": {
      timeline
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.8, stagger: 0.07, ease: "power2.inOut" }, 0.18)
        .to(readout, { autoAlpha: 1, y: 0, duration: 0.45 }, 1.22);
      break;
    }
    case "17": {
      const nodes = scene.querySelectorAll(".pipeline-node");
      const core = scene.querySelector(".pipeline-core");
      const outputs = scene.querySelectorAll(".pipeline-outputs text");
      gsap.set(nodes, { autoAlpha: 0, scale: 0 });
      gsap.set(core, { autoAlpha: 0, scale: 0.4, transformOrigin: "center" });
      gsap.set(outputs, { autoAlpha: 0, x: -12 });
      timeline
        .to(nodes, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.08 }, 0.16)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08 }, 0.45)
        .to(core, { autoAlpha: 1, scale: 1, duration: 0.4 }, 0.72)
        .to(outputs, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.08 }, 1.18);
      animateMetric(timeline, metric, 1.48);
      break;
    }
    case "18": {
      const baseline = scene.querySelector(".baseline-cut-a");
      const sofl = scene.querySelector(".baseline-cut-b");
      const dots = scene.querySelectorAll(".baseline-dot-a, .baseline-dot-b");
      const labels = scene.querySelectorAll("svg text");
      gsap.set([baseline, sofl], { scaleX: 0, transformOrigin: "left" });
      gsap.set(dots, { autoAlpha: 0, scale: 0 });
      gsap.set(labels, { autoAlpha: 0, y: 5 });
      timeline
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, 0.18)
        .to(baseline, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 0.45)
        .to(sofl, { scaleX: 0.036, duration: 0.22 }, 0.65)
        .to(dots, { autoAlpha: 1, scale: 1, duration: 0.22, stagger: 0.55 }, 0.76);
      animateMetric(timeline, metric, 1.12);
      break;
    }
    case "19": {
      const dots = scene.querySelectorAll(".qmc-dot");
      gsap.set(dots, { autoAlpha: 0, scale: 0 });
      timeline
        .to(dots, { autoAlpha: 0.68, scale: 1, duration: 0.45, stagger: { each: 0.009, from: "random" } }, 0.18)
        .to(dots, { x: (_, dot) => (Number(dot.getAttribute("cy")) % 4) * 5, y: (_, dot) => (Number(dot.getAttribute("cx")) % 5) * -3, duration: 0.65, stagger: 0.004, ease: "expo.inOut" }, 0.88)
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.55 }, 1.18)
        .to(dots, { autoAlpha: 0.18, duration: 0.35 }, 1.45);
      animateMetric(timeline, metric, 1.35);
      break;
    }
    case "20": {
      const dot = scene.querySelector(".precision-dot");
      gsap.set(dot, { autoAlpha: 0, scale: 0 });
      timeline
        .to(drawPaths, { strokeDashoffset: 0, duration: 0.85, stagger: 0.18 }, 0.18)
        .to(dot, { autoAlpha: 1, scale: 1, duration: 0.2 }, 1.0);
      animateMetric(timeline, metric, 0.7);
      break;
    }
    default:
      timeline.to(drawPaths, { strokeDashoffset: 0, duration: 0.8 }, 0.2);
  }

  return timeline;
}

function registerScene(scene) {
  const timeline = createTimeline(scene);
  if (timeline) timelines.set(scene, timeline);
  return timeline;
}

const scenes = [...document.querySelectorAll(".candidate-grid .scene")];

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scene = entry.target;
        let timeline = timelines.get(scene);
        if (entry.isIntersecting) {
          visibleScenes.add(scene);
          if (!timeline) timeline = registerScene(scene);
          if (motionPaused && timeline) {
            timeline.progress(1).pause();
          } else if (timeline) {
            if (scene.dataset.played) timeline.resume();
            else {
              scene.dataset.played = "true";
              timeline.restart();
            }
          }
        } else {
          visibleScenes.delete(scene);
          if (timeline && timeline.progress() < 1) timeline.pause();
        }
      });
    },
    { rootMargin: "120px 0px", threshold: 0.08 },
  );
  scenes.forEach((scene) => observer.observe(scene));
}

document.querySelector("[data-replay-visible]")?.addEventListener("click", () => {
  visibleScenes.forEach((scene) => {
    const timeline = timelines.get(scene) || registerScene(scene);
    timeline?.restart();
  });
});

const motionToggle = document.querySelector("[data-motion-toggle]");
motionToggle?.addEventListener("click", () => {
  motionPaused = !motionPaused;
  motionToggle.setAttribute("aria-pressed", String(motionPaused));
  motionToggle.textContent = motionPaused ? "Resume motion" : "Pause motion";
  visibleScenes.forEach((scene) => {
    const timeline = timelines.get(scene);
    if (!timeline) return;
    if (motionPaused) timeline.pause();
    else if (timeline.progress() < 1) timeline.resume();
  });
});

document.querySelectorAll("[data-replay]").forEach((button) => {
  button.addEventListener("click", () => {
    const scene = button.closest(".candidate-card")?.querySelector(".scene");
    if (!scene) return;
    scene.dataset.played = "true";
    const timeline = timelines.get(scene) || registerScene(scene);
    timeline?.restart();
  });
});

const dialog = document.querySelector("[data-focus-dialog]");
const dialogStage = document.querySelector("[data-focus-stage]");
const dialogIndex = document.querySelector("[data-focus-index]");
const dialogTitle = document.querySelector("[data-focus-title]");
const dialogNote = document.querySelector("[data-focus-note]");
let focusedCandidateIndex = 0;
let focusTimeline = null;

function showCandidate(index) {
  if (!dialog || !dialogStage) return;
  focusedCandidateIndex = (index + candidates.length) % candidates.length;
  const candidate = candidates[focusedCandidateIndex];
  focusTimeline?.kill();
  dialogStage.innerHTML = sceneFrame(candidate, candidate.visual);
  dialogIndex.textContent = `${candidate.id} / 20`;
  dialogTitle.textContent = candidate.title;
  dialogNote.textContent = `${candidate.note} Concept figures only; final copy and numbers require claims review.`;
  const scene = dialogStage.querySelector(".scene");
  focusTimeline = registerScene(scene);
  focusTimeline?.restart();
}

function openCandidate(id) {
  const index = candidates.findIndex((candidate) => candidate.id === id);
  if (index < 0 || !dialog) return;
  showCandidate(index);
  dialog.showModal();
}

document.querySelectorAll("[data-focus]").forEach((button) => {
  button.addEventListener("click", () => openCandidate(button.dataset.focus));
});

document.querySelector("[data-focus-close]")?.addEventListener("click", () => dialog?.close());
document.querySelector("[data-focus-replay]")?.addEventListener("click", () => focusTimeline?.restart());
document.querySelector("[data-focus-prev]")?.addEventListener("click", () => showCandidate(focusedCandidateIndex - 1));
document.querySelector("[data-focus-next]")?.addEventListener("click", () => showCandidate(focusedCandidateIndex + 1));

dialog?.addEventListener("close", () => {
  focusTimeline?.kill();
  focusTimeline = null;
  if (dialogStage) dialogStage.innerHTML = "";
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

window.addEventListener("keydown", (event) => {
  if (!dialog?.open) return;
  if (event.key === "ArrowLeft") showCandidate(focusedCandidateIndex - 1);
  if (event.key === "ArrowRight") showCandidate(focusedCandidateIndex + 1);
});
