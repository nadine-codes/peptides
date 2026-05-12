import type { CategorySlug, IntelReport, PeptideReport } from "./types";
import { CATEGORY_BY_SLUG } from "./peptides";

// Curated, hackathon-quality fallback intelligence.
// Used when APIFY_TOKEN or ANTHROPIC_API_KEY are absent, or when live calls fail.
// All language is educational / landscape-analytical. No medical advice.

const SHARED_DISCLAIMER_NOTE = "Anecdotal public discussion — not a clinical finding.";

function fatLoss(): PeptideReport[] {
  return [
    {
      name: "Tirzepatide",
      aka: ["Mounjaro", "Zepbound"],
      signal_strength: "High",
      discussion_velocity: "+248%",
      velocity_pct: 248,
      consensus_score: "Strong",
      sentiment: "Positive",
      research_activity: "Rising",
      risk_level: "Moderate",
      trending: true,
      overview:
        "A dual GIP/GLP-1 receptor agonist that has dominated metabolic-health discourse over the last 18 months. Public conversation centers on appetite reduction and rapid weight loss; research literature focuses on glycemic control and cardiometabolic endpoints.",
      research_themes: [
        "Dual incretin (GIP + GLP-1) mechanism in published trial literature",
        "Cardiometabolic endpoints in SURPASS and SURMOUNT trial discussion",
        "Weight-regain patterns after discontinuation widely covered in research summaries",
        "Gastrointestinal tolerability profile recurs across clinical reviews",
      ],
      public_sentiment: {
        summary:
          "Anecdotal public discussion is broadly positive on appetite suppression and weight loss but increasingly cautious about plateau, regain, and GI side effects.",
        pros: [
          "Strong appetite reduction reported across long discussion threads",
          "Sustained weight loss over multi-month windows widely described",
          "Improved 'food noise' a frequent qualitative theme",
          "Many users describe better adherence than with prior interventions",
        ],
        concerns: [
          "Nausea, fatigue, and constipation in early weeks recurring",
          "Cost and insurance access dominate negative threads",
          "Weight regain after stopping discussed extensively",
          "Compounded sourcing concerns flagged in recent threads",
        ],
        common_questions: [
          "How long to stay on after reaching target weight?",
          "How to manage GI side effects during titration?",
          "Differences between branded and compounded sources?",
          "Interaction with strength training and protein intake?",
        ],
      },
      market_snapshot: {
        price_range: "$200–$1,300 / month mentioned across vendor and telehealth pages",
        availability: "Branded supply constraints easing; compounded variants widely advertised",
        market_activity: "Telehealth ad spend visibly elevated",
        vendor_frequency: "High — appears in nearly every peptide-vendor catalog",
        telehealth_visibility: "Very high — featured product on most metabolic-health platforms",
      },
      claim_consensus: [
        { claim: "Reduces appetite", consensus: "Strong", note: "Consistent across research and discussion" },
        { claim: "Produces clinically significant weight loss", consensus: "Strong" },
        { claim: "Improves glycemic markers", consensus: "Strong", note: "Primary research endpoint" },
        { claim: "Preserves lean mass during loss", consensus: "Mixed", note: "Discussion claims exceed published evidence" },
        { claim: "Long-term cardiovascular benefit", consensus: "Mixed", note: "Active area of trial discussion" },
        { claim: "Improves sleep quality", consensus: "Anecdotal" },
      ],
      conflicting_claims: [
        {
          topic: "Lean-mass preservation",
          research: "Trial literature reports lean-mass loss alongside fat-mass loss; protein intake and resistance training are emphasized as mitigators.",
          marketing: "Some compounded-vendor pages frame the compound as 'muscle-sparing'.",
          note: "Vendor framing exceeds current research consensus.",
        },
        {
          topic: "Long-term safety",
          research: "Multi-year data is still maturing; ongoing trials referenced.",
          marketing: "Telehealth marketing implies long-horizon safety with limited caveats.",
        },
      ],
      risk_flags: [
        { label: "GI tolerability", detail: "Nausea and constipation are the most-discussed early adverse events.", severity: "watch" },
        { label: "Compounded sourcing", detail: "Quality, sterility, and labeling concerns flagged in recent discussion.", severity: "concern" },
        { label: "Discontinuation regain", detail: "Regain after stopping is widely discussed and supported by trial extensions.", severity: "watch" },
        { label: "Cost / access volatility", detail: "Insurance and supply discussions dominate negative threads.", severity: "info" },
      ],
      sources: [
        { title: "SURMOUNT-1: tirzepatide for chronic weight management", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038", tier: "research", snippet: "Pivotal trial discussion." },
        { title: "FDA label — tirzepatide", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/217806s000lbl.pdf", tier: "educational", snippet: "Regulatory labeling and indications." },
        { title: "r/tirzepatidecompound — long-running discussion thread", url: "https://www.reddit.com/r/tirzepatidecompound/", tier: "anecdotal", snippet: "Active community discussion of compounded variants." },
        { title: "Compounded GLP-1 telehealth landing page", url: "https://example-telehealth.com/glp-1", tier: "telehealth", snippet: "Marketed as 'metabolic reset' program." },
        { title: "Peptide vendor product page", url: "https://example-vendor.com/tirzepatide", tier: "vendor", snippet: "Vendor catalog listing." },
      ],
    },
    {
      name: "Semaglutide",
      aka: ["Ozempic", "Wegovy"],
      signal_strength: "High",
      discussion_velocity: "+132%",
      velocity_pct: 132,
      consensus_score: "Strong",
      sentiment: "Mixed",
      research_activity: "Stable",
      risk_level: "Moderate",
      trending: true,
      overview:
        "A GLP-1 receptor agonist with extensive trial literature and broad public visibility. Discussion has matured: early enthusiasm has given way to nuanced threads about GI side effects, plateau, and post-discontinuation regain.",
      research_themes: [
        "Glycemic control endpoints in T2D trial literature",
        "Cardiovascular outcome trial coverage (SELECT)",
        "Body-composition discussion (fat vs. lean loss)",
        "Gastric emptying and nausea mechanism discussion",
      ],
      public_sentiment: {
        summary:
          "Anecdotal public discussion remains mixed — strong satisfaction on appetite control offset by frustration over GI side effects, cost, and regain.",
        pros: [
          "Consistent appetite reduction described",
          "Reduced 'food noise' commonly mentioned",
          "Sustained loss for many users over 6–12 months",
        ],
        concerns: [
          "Nausea, reflux, and constipation recurring",
          "Plateau discussions increasingly common",
          "Regain after stopping a major theme",
          "Brand-vs-compound debate active",
        ],
        common_questions: [
          "Optimal titration cadence?",
          "When to escalate to a dual-agonist alternative?",
          "How to support nutrition during reduced intake?",
        ],
      },
      market_snapshot: {
        price_range: "$150–$1,000 / month mentioned across vendor and telehealth pages",
        availability: "Branded supply largely normalized; compounded variants common",
        market_activity: "High but stabilizing relative to 2024 peak",
        vendor_frequency: "Very high",
        telehealth_visibility: "Very high",
      },
      claim_consensus: [
        { claim: "Reduces appetite", consensus: "Strong" },
        { claim: "Improves glycemic markers", consensus: "Strong" },
        { claim: "Cardiovascular benefit in eligible populations", consensus: "Strong", note: "SELECT trial discussion" },
        { claim: "Preserves lean mass", consensus: "Mixed" },
        { claim: "Improves sleep apnea outcomes", consensus: "Mixed" },
      ],
      conflicting_claims: [
        {
          topic: "Body composition outcomes",
          research: "Trial literature reports both fat and lean-mass loss; resistance training and protein highlighted as mitigators.",
          marketing: "Some marketing frames it as a fat-only loss tool.",
        },
      ],
      risk_flags: [
        { label: "GI tolerability", detail: "Most-discussed adverse events; titration schedule matters.", severity: "watch" },
        { label: "Lean-mass loss", detail: "Discussed in research and increasingly in public threads.", severity: "watch" },
        { label: "Discontinuation regain", detail: "Widely documented in trial extensions and public reports.", severity: "watch" },
      ],
      sources: [
        { title: "SELECT trial — semaglutide and cardiovascular outcomes", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2307563", tier: "research", snippet: "CV outcomes data." },
        { title: "FDA label — semaglutide", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/215256s000lbl.pdf", tier: "educational" },
        { title: "r/Semaglutide community discussion", url: "https://www.reddit.com/r/Semaglutide/", tier: "anecdotal" },
        { title: "GLP-1 telehealth landing page", url: "https://example-telehealth.com/semaglutide", tier: "telehealth" },
      ],
    },
    {
      name: "Retatrutide",
      aka: ["LY3437943"],
      signal_strength: "Emerging",
      discussion_velocity: "+412%",
      velocity_pct: 412,
      consensus_score: "Weak",
      sentiment: "Mixed",
      research_activity: "Rising",
      risk_level: "Uncertain",
      trending: true,
      overview:
        "A triple-receptor agonist (GIP/GLP-1/glucagon) in active phase-3 trials. Public discussion is fast-rising but extrapolates from early-phase data; vendor mentions are starting to appear despite the compound being investigational.",
      research_themes: [
        "Triple-receptor mechanism (incretin + glucagon)",
        "Phase-2 weight-loss magnitude widely covered",
        "Energy-expenditure pathway discussion",
        "Open questions on long-term safety profile",
      ],
      public_sentiment: {
        summary:
          "Anecdotal public discussion is excited but speculative — much of it forecasts trial results rather than reports lived experience.",
        pros: [
          "High loss magnitudes from phase-2 widely cited",
          "Mechanism perceived as 'next-generation'",
        ],
        concerns: [
          "Investigational status often glossed over",
          "Compounded sourcing of an unapproved drug raises quality concerns",
          "Cardiovascular and long-term data not yet available",
        ],
        common_questions: [
          "Approval timeline?",
          "How does it compare with tirzepatide on side-effect profile?",
        ],
      },
      market_snapshot: {
        price_range: "Limited vendor pricing; mostly speculative mentions",
        availability: "Investigational — unapproved",
        market_activity: "Low but rising",
        vendor_frequency: "Low — only fringe vendor catalogs reference it",
        telehealth_visibility: "Low",
      },
      claim_consensus: [
        { claim: "Produces large weight loss in phase-2 trials", consensus: "Strong" },
        { claim: "Long-term safety established", consensus: "Weak", note: "Trials ongoing" },
        { claim: "Suitable as a current treatment option", consensus: "Weak", note: "Not approved" },
      ],
      conflicting_claims: [
        {
          topic: "Availability framing",
          research: "Phase-3 trials in progress; not approved.",
          marketing: "Some fringe vendor mentions imply availability.",
          note: "Marketing risks misrepresenting investigational status.",
        },
      ],
      risk_flags: [
        { label: "Investigational compound", detail: "Not approved; phase-3 trials ongoing.", severity: "concern" },
        { label: "Sourcing quality", detail: "Compounded sources of an unapproved drug carry meaningful purity uncertainty.", severity: "concern" },
        { label: "Data extrapolation", detail: "Public discussion frequently extrapolates beyond reported endpoints.", severity: "watch" },
      ],
      sources: [
        { title: "Phase-2 retatrutide trial summary", url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972", tier: "research" },
        { title: "ClinicalTrials.gov — retatrutide phase-3 program", url: "https://clinicaltrials.gov/search?term=retatrutide", tier: "educational" },
        { title: "r/PeptideShootingRange — retatrutide thread", url: "https://www.reddit.com/r/Peptides/", tier: "anecdotal" },
      ],
    },
    genericPeptide("Tesofensine", {
      signal_strength: "Emerging",
      velocity_pct: 168,
      consensus: "Weak",
      sentiment: "Cautious",
      research: "Rising",
      risk: "Uncertain",
      summary:
        "A monoamine reuptake inhibitor with phase-2 weight-loss data and recently renewed phase-3 activity. Public discussion has accelerated alongside renewed trial interest, but availability and regulatory status remain limited.",
      themes: [
        "Monoamine reuptake mechanism (DA/NE/5-HT)",
        "Phase-2 weight-loss magnitude widely cited",
        "Cardiovascular signal flagged in earlier trial summaries",
      ],
      pros: ["Notable phase-2 weight-loss magnitudes cited", "Mechanism distinct from incretin agonists"],
      concerns: [
        "Earlier trial summaries flagged a cardiovascular signal",
        "Investigational status frequently glossed over in vendor mentions",
        "Sourcing quality concerns common",
      ],
      consensus_rows: [
        { claim: "Phase-2 weight-loss magnitude", consensus: "Strong" },
        { claim: "Cardiovascular safety", consensus: "Mixed", note: "Earlier signal under continued evaluation" },
        { claim: "Suitable as a current treatment option", consensus: "Weak", note: "Regulatory status varies by region" },
      ],
      conflicts: [
        {
          topic: "Regulatory framing",
          research: "Investigational in most regions; renewed phase-3 activity.",
          marketing: "Some fringe vendor pages imply broader availability.",
        },
      ],
      risks: [
        { label: "Cardiovascular signal", detail: "Earlier trial summaries flagged a cardiovascular signal under continued review.", severity: "concern" },
        { label: "Sourcing quality", detail: "Compounded sources of an investigational drug carry meaningful purity uncertainty.", severity: "concern" },
      ],
    }),
    {
      name: "AOD-9604",
      signal_strength: "Medium",
      discussion_velocity: "+38%",
      velocity_pct: 38,
      consensus_score: "Weak",
      sentiment: "Divided",
      research_activity: "Stable",
      risk_level: "Uncertain",
      trending: false,
      overview:
        "A modified fragment of human growth hormone marketed historically as a fat-loss compound. Research evidence has not consistently supported the strong fat-loss claims found on vendor pages.",
      research_themes: [
        "hGH C-terminal fragment mechanism",
        "Mixed clinical-trial outcomes summarized in review literature",
        "Limited recent peer-reviewed activity",
      ],
      public_sentiment: {
        summary: "Anecdotal public discussion is split — some report subjective benefit, many report no measurable change.",
        pros: ["Mild appetite-modulation reports", "Few side-effect mentions"],
        concerns: [
          "Lack of measurable change frequently reported",
          "Cost-to-benefit perceived as poor",
          "Vendor framing seen as overhyped",
        ],
        common_questions: ["Does it work without GH?", "Is it worth stacking with anything?"],
      },
      market_snapshot: {
        price_range: "$60–$160 / vial mentioned",
        availability: "Common in research-chemical catalogs",
        market_activity: "Stable, low-trend",
        vendor_frequency: "Medium",
        telehealth_visibility: "Low",
      },
      claim_consensus: [
        { claim: "Promotes fat loss", consensus: "Weak", note: "Mixed clinical evidence" },
        { claim: "Boosts metabolism", consensus: "Anecdotal" },
        { claim: "Safe long-term use", consensus: "Weak", note: "Limited long-term data" },
      ],
      conflicting_claims: [
        {
          topic: "Fat-loss efficacy",
          research: "Clinical evidence is inconsistent and modest at best.",
          marketing: "Vendor pages frequently describe it as a strong fat-loss compound.",
        },
      ],
      risk_flags: [
        { label: "Efficacy uncertainty", detail: "Research literature does not consistently support strong fat-loss claims.", severity: "watch" },
        { label: "Vendor framing", detail: "Marketing language often exceeds available evidence.", severity: "watch" },
      ],
      sources: [
        { title: "AOD-9604 review article", url: "https://pubmed.ncbi.nlm.nih.gov/", tier: "research" },
        { title: "r/Peptides — AOD discussion", url: "https://www.reddit.com/r/Peptides/", tier: "anecdotal" },
      ],
    },
  ];
}

function recovery(): PeptideReport[] {
  return [
    {
      name: "BPC-157",
      aka: ["Body Protective Compound 157"],
      signal_strength: "High",
      discussion_velocity: "+186%",
      velocity_pct: 186,
      consensus_score: "Mixed",
      sentiment: "Positive",
      research_activity: "Stable",
      risk_level: "Uncertain",
      trending: true,
      overview:
        "A 15-amino-acid sequence derived from human gastric juice. Pre-clinical (animal) literature is extensive; human trial data is limited. Public discussion treats it as a generalized recovery aid; vendor pages mirror that framing.",
      research_themes: [
        "Pre-clinical tendon and ligament repair models",
        "GI mucosal healing in animal studies",
        "Limited peer-reviewed human trial data",
        "Mechanism discussions involving angiogenesis and growth-factor signaling",
      ],
      public_sentiment: {
        summary: "Anecdotal public discussion is heavily positive on injury recovery; concerns center on regulatory status and long-term safety unknowns.",
        pros: [
          "Subjective tendon and joint recovery widely described",
          "GI relief commonly reported",
          "Few short-term side-effect mentions",
        ],
        concerns: [
          "Lack of human trial data frequently raised",
          "Sourcing and purity concerns recurrent",
          "Regulatory ambiguity discussed",
        ],
        common_questions: [
          "Subcutaneous vs. local injection?",
          "Oral vs. injectable bioavailability?",
          "Stacking with TB-500?",
        ],
      },
      market_snapshot: {
        price_range: "$30–$120 / vial commonly mentioned",
        availability: "Widely available via research-chemical and peptide vendors",
        market_activity: "High and steady",
        vendor_frequency: "Very high",
        telehealth_visibility: "Medium — appearing more frequently on recovery-focused clinics",
      },
      claim_consensus: [
        { claim: "Accelerates tendon recovery", consensus: "Mixed", note: "Strong pre-clinical, limited human" },
        { claim: "Soothes GI inflammation", consensus: "Mixed" },
        { claim: "Heals systemic injuries when injected anywhere", consensus: "Anecdotal" },
        { claim: "Safe long-term", consensus: "Weak", note: "Long-term human data sparse" },
      ],
      conflicting_claims: [
        {
          topic: "Human-applicability",
          research: "Most evidence is animal-model based; human trials are sparse.",
          marketing: "Vendor and telehealth pages frequently extrapolate to human outcomes without that caveat.",
        },
      ],
      risk_flags: [
        { label: "Limited human data", detail: "Most efficacy claims rest on pre-clinical animal models.", severity: "watch" },
        { label: "Regulatory status", detail: "Status varies by jurisdiction and is under active review.", severity: "watch" },
        { label: "Sourcing quality", detail: "Purity and label accuracy concerns recur in discussion.", severity: "concern" },
      ],
      sources: [
        { title: "BPC-157 mechanism review (animal models)", url: "https://pubmed.ncbi.nlm.nih.gov/29282232/", tier: "research" },
        { title: "r/Peptides — BPC-157 megathread", url: "https://www.reddit.com/r/Peptides/", tier: "anecdotal" },
        { title: "Peptide vendor BPC-157 catalog", url: "https://example-vendor.com/bpc-157", tier: "vendor" },
        { title: "Recovery-clinic BPC-157 service page", url: "https://example-telehealth.com/bpc-157", tier: "telehealth" },
      ],
    },
    {
      name: "TB-500",
      aka: ["Thymosin Beta-4 fragment"],
      signal_strength: "Medium",
      discussion_velocity: "+74%",
      velocity_pct: 74,
      consensus_score: "Weak",
      sentiment: "Mixed",
      research_activity: "Stable",
      risk_level: "Uncertain",
      trending: false,
      overview:
        "A synthetic fragment associated with thymosin-β4 signaling. Most evidence comes from animal studies; human trial data is limited. Frequently stacked in discussion with BPC-157.",
      research_themes: [
        "Thymosin-β4 actin-binding mechanism",
        "Pre-clinical tissue repair and angiogenesis models",
        "Limited human evidence",
      ],
      public_sentiment: {
        summary: "Anecdotal public discussion is mixed — some report meaningful subjective recovery; others report no observable change.",
        pros: ["Reported subjective recovery", "Few acute side-effect mentions"],
        concerns: ["Cost relative to alternatives", "Sparse human evidence", "Variable batch quality concerns"],
        common_questions: ["Is it interchangeable with TB-4?", "Stacking with BPC-157?", "Loading vs. maintenance schedules?"],
      },
      market_snapshot: {
        price_range: "$40–$150 / vial mentioned",
        availability: "Common in peptide-vendor catalogs",
        market_activity: "Steady",
        vendor_frequency: "High",
        telehealth_visibility: "Low",
      },
      claim_consensus: [
        { claim: "Accelerates soft-tissue recovery", consensus: "Weak" },
        { claim: "Improves cardiovascular tissue repair", consensus: "Anecdotal" },
        { claim: "Synergistic with BPC-157", consensus: "Anecdotal" },
      ],
      conflicting_claims: [
        {
          topic: "Generalized 'systemic healing' framing",
          research: "Mechanism research is narrower than discussion implies.",
          marketing: "Vendor pages often imply broad systemic effects.",
        },
      ],
      risk_flags: [
        { label: "Sparse human data", detail: "Pre-clinical evidence dominates the literature.", severity: "watch" },
        { label: "Sourcing variability", detail: "Batch quality and authenticity concerns recur.", severity: "watch" },
      ],
      sources: [
        { title: "Thymosin β4 review", url: "https://pubmed.ncbi.nlm.nih.gov/23320803/", tier: "research" },
        { title: "r/Peptides — TB-500 thread", url: "https://www.reddit.com/r/Peptides/", tier: "anecdotal" },
      ],
    },
    {
      name: "GHK-Cu",
      aka: ["Copper peptide"],
      signal_strength: "Medium",
      discussion_velocity: "+52%",
      velocity_pct: 52,
      consensus_score: "Mixed",
      sentiment: "Positive",
      research_activity: "Stable",
      risk_level: "Low",
      trending: false,
      overview:
        "A copper-binding tripeptide widely studied for skin and wound-healing applications. Discussion in recovery contexts is more speculative than the cosmetic-research literature it builds on.",
      research_themes: [
        "Wound healing and dermal collagen synthesis (cosmetic literature)",
        "Anti-inflammatory mechanism discussion",
        "Limited evidence outside dermatological contexts",
      ],
      public_sentiment: {
        summary: "Anecdotal public discussion is positive on skin and hair effects; recovery-context claims are more speculative.",
        pros: ["Skin texture improvements widely reported", "Few side-effect mentions"],
        concerns: ["Recovery-context claims sparse in research", "Topical vs. injectable framing inconsistent"],
        common_questions: ["Topical or injection?", "Stacking with BPC-157 or TB-500?"],
      },
      market_snapshot: {
        price_range: "$25–$90 / vial mentioned",
        availability: "Widely available across peptide and cosmetic vendors",
        market_activity: "Steady",
        vendor_frequency: "High",
        telehealth_visibility: "Low",
      },
      claim_consensus: [
        { claim: "Supports wound healing (dermal context)", consensus: "Strong", note: "Cosmetic-research evidence" },
        { claim: "Anti-inflammatory effects", consensus: "Mixed" },
        { claim: "Generalized recovery acceleration", consensus: "Weak" },
      ],
      conflicting_claims: [
        {
          topic: "Out-of-context efficacy",
          research: "Strong evidence in cosmetic and dermal-wound contexts.",
          marketing: "Recovery-clinic pages extend claims into systemic recovery contexts.",
        },
      ],
      risk_flags: [
        { label: "Context drift", detail: "Strong cosmetic evidence is often extrapolated to broader claims.", severity: "watch" },
      ],
      sources: [
        { title: "GHK-Cu in skin regeneration — review", url: "https://pubmed.ncbi.nlm.nih.gov/26713342/", tier: "research" },
        { title: "Peptide vendor GHK-Cu page", url: "https://example-vendor.com/ghk-cu", tier: "vendor" },
      ],
    },
    {
      name: "Pentadeca Arginate",
      aka: ["PDA"],
      signal_strength: "Emerging",
      discussion_velocity: "+295%",
      velocity_pct: 295,
      consensus_score: "Weak",
      sentiment: "Cautious",
      research_activity: "Rising",
      risk_level: "Uncertain",
      trending: true,
      overview:
        "A relatively new compound positioned as a successor to BPC-157 in vendor and telehealth marketing. Independent research literature is sparse; nearly all current claims come from vendor and clinic pages.",
      research_themes: [
        "Limited peer-reviewed human studies",
        "Stability and arginate-salt chemistry discussion",
        "Marketing-led narrative dominates the discourse",
      ],
      public_sentiment: {
        summary: "Anecdotal public discussion is cautious and skeptical — many threads question whether the compound has independent evidence.",
        pros: ["Vendor narrative emphasizes improved stability"],
        concerns: ["Lack of peer-reviewed human data", "Marketing-driven framing", "Skepticism about 'next-generation' framing"],
        common_questions: ["Is there any independent research?", "How does it differ chemically from BPC-157?"],
      },
      market_snapshot: {
        price_range: "$60–$180 / vial mentioned",
        availability: "Increasingly common in recovery-clinic catalogs",
        market_activity: "Rising fast in marketing channels",
        vendor_frequency: "Medium and growing",
        telehealth_visibility: "Medium and growing",
      },
      claim_consensus: [
        { claim: "Improved stability vs. BPC-157", consensus: "Weak", note: "Vendor-led claim" },
        { claim: "Equivalent or superior recovery effect", consensus: "Anecdotal" },
        { claim: "Established safety profile", consensus: "Weak" },
      ],
      conflicting_claims: [
        {
          topic: "'Next-generation' framing",
          research: "Independent research is sparse.",
          marketing: "Telehealth and vendor pages position it as a clear upgrade with limited evidence.",
        },
      ],
      risk_flags: [
        { label: "Marketing-led narrative", detail: "Most claims originate from vendors rather than independent research.", severity: "concern" },
        { label: "Sourcing maturity", detail: "Newer compound with less established quality benchmarks.", severity: "watch" },
      ],
      sources: [
        { title: "Recovery-clinic PDA page", url: "https://example-telehealth.com/pda", tier: "telehealth" },
        { title: "Peptide vendor PDA listing", url: "https://example-vendor.com/pda", tier: "vendor" },
        { title: "r/Peptides — PDA skepticism thread", url: "https://www.reddit.com/r/Peptides/", tier: "anecdotal" },
      ],
    },
  ];
}

function longevity(): PeptideReport[] {
  return [
    genericPeptide("Epitalon", {
      signal_strength: "Medium",
      velocity_pct: 86,
      consensus: "Weak",
      sentiment: "Cautious",
      research: "Stable",
      risk: "Uncertain",
      summary:
        "A short tetrapeptide associated with telomere and pineal-function discussion. Independent peer-reviewed literature outside a small group of researchers is limited.",
      themes: [
        "Telomere-related mechanism discussion",
        "Pineal-function research from a narrow author cluster",
        "Long-cycle protocol culture in vendor messaging",
      ],
      pros: ["Subjective sleep quality often mentioned"],
      concerns: ["Independent research outside a narrow cluster is limited", "Long-term human data sparse"],
      consensus_rows: [
        { claim: "Telomere-length effects", consensus: "Weak", note: "Limited independent replication" },
        { claim: "Sleep quality improvements", consensus: "Anecdotal" },
        { claim: "Anti-aging marker improvements", consensus: "Weak" },
      ],
      conflicts: [
        {
          topic: "Anti-aging framing",
          research: "Independent literature is limited.",
          marketing: "Vendor pages routinely use 'anti-aging' framing.",
        },
      ],
      risks: [
        { label: "Replication gap", detail: "Most research originates from a narrow author cluster.", severity: "watch" },
        { label: "Long-term data", detail: "Long-horizon human safety data is sparse.", severity: "watch" },
      ],
    }),
    genericPeptide("Thymalin", {
      signal_strength: "Emerging",
      velocity_pct: 142,
      consensus: "Weak",
      sentiment: "Mixed",
      research: "Rising",
      risk: "Uncertain",
      summary:
        "A thymus-derived peptide preparation discussed in immune-aging contexts, with most published work originating from a small research community.",
      themes: ["Immune-senescence discussion", "Geriatric population research from narrow source set"],
      pros: ["Subjective immune-resilience reports"],
      concerns: ["Limited Western-publication coverage", "Quality and sourcing variability"],
      consensus_rows: [
        { claim: "Immune-aging modulation", consensus: "Weak" },
        { claim: "General longevity effect", consensus: "Anecdotal" },
      ],
      conflicts: [
        { topic: "'Longevity' framing", research: "Mechanism work is narrower than longevity claims imply.", marketing: "Vendor pages use broad longevity language." },
      ],
      risks: [
        { label: "Narrow evidence base", detail: "Most published evidence comes from a small research community.", severity: "watch" },
      ],
    }),
    genericPeptide("GHK-Cu", {
      signal_strength: "Medium",
      velocity_pct: 38,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "Re-appears in longevity discourse for gene-expression and skin-aging research. Strongest evidence remains in dermatological contexts.",
      themes: ["Dermal collagen synthesis literature", "Gene-expression discussion in aging contexts"],
      pros: ["Dermal benefits widely reported"],
      concerns: ["Longevity-context claims are speculative"],
      consensus_rows: [
        { claim: "Skin and hair improvements", consensus: "Strong" },
        { claim: "Systemic anti-aging effects", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Systemic anti-aging framing", research: "Strong dermal evidence.", marketing: "Vendor pages extend claims to systemic aging." },
      ],
      risks: [
        { label: "Context drift", detail: "Strong cosmetic evidence is often re-applied to systemic claims.", severity: "watch" },
      ],
    }),
    genericPeptide("Humanin", {
      signal_strength: "Emerging",
      velocity_pct: 220,
      consensus: "Weak",
      sentiment: "Cautious",
      research: "Rising",
      risk: "Uncertain",
      summary:
        "A mitochondrial-derived peptide actively studied in metabolic-aging research. Public discussion outpaces clinical maturity.",
      themes: ["Mitochondrial-derived peptide research", "Metabolic-aging mechanism discussion"],
      pros: ["Active research signal"],
      concerns: ["Public claims often outpace clinical readiness", "Sparse human data"],
      consensus_rows: [
        { claim: "Mitochondrial-aging mechanism research", consensus: "Strong" },
        { claim: "Therapeutic applicability today", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Therapeutic readiness", research: "Mechanism research is real; therapeutic translation is early.", marketing: "Vendor mentions imply readiness." },
      ],
      risks: [
        { label: "Translational gap", detail: "Public claims frequently outpace clinical maturity.", severity: "watch" },
      ],
    }),
  ];
}

function sleep(): PeptideReport[] {
  return [
    genericPeptide("DSIP", {
      signal_strength: "Medium",
      velocity_pct: 64,
      consensus: "Weak",
      sentiment: "Mixed",
      research: "Stable",
      risk: "Uncertain",
      summary:
        "Delta Sleep-Inducing Peptide. Discussed in sleep-architecture contexts; mainstream clinical evidence is older and limited.",
      themes: ["Sleep-architecture mechanism discussion", "Older clinical literature, limited recent activity"],
      pros: ["Subjective deeper-sleep reports"],
      concerns: ["Inconsistent effects", "Sparse modern human trials"],
      consensus_rows: [
        { claim: "Modulates sleep architecture", consensus: "Mixed" },
        { claim: "Reliable sleep-aid effect", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Reliability framing", research: "Mixed clinical results.", marketing: "Vendor pages frame it as a consistent sleep aid." },
      ],
      risks: [{ label: "Inconsistent response", detail: "Subjective effects vary widely across users.", severity: "watch" }],
    }),
    genericPeptide("Selank", {
      signal_strength: "Medium",
      velocity_pct: 92,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "An analog of tuftsin discussed primarily in anxiolytic and cognitive-tone contexts; sleep claims are secondary.",
      themes: ["Anxiolytic-mechanism research", "Russian-origin clinical literature"],
      pros: ["Subjective calm and sleep onset reports"],
      concerns: ["Russian-origin trials less familiar to Western audiences"],
      consensus_rows: [
        { claim: "Anxiolytic effect", consensus: "Mixed" },
        { claim: "Direct sleep aid", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "'Sleep aid' framing", research: "Primary research is anxiolytic.", marketing: "Some vendor pages frame it primarily as a sleep aid." },
      ],
      risks: [{ label: "Indirect sleep mechanism", detail: "Sleep effects are typically downstream of anxiolytic effects.", severity: "info" }],
    }),
    genericPeptide("Epitalon", {
      signal_strength: "Medium",
      velocity_pct: 56,
      consensus: "Weak",
      sentiment: "Cautious",
      research: "Stable",
      risk: "Uncertain",
      summary: "Discussed in pineal-function and sleep-onset contexts; independent peer-reviewed evidence is limited.",
      themes: ["Pineal-function discussion", "Long cycle culture in vendor messaging"],
      pros: ["Subjective sleep onset reports"],
      concerns: ["Independent replication limited"],
      consensus_rows: [
        { claim: "Sleep-onset improvement", consensus: "Anecdotal" },
        { claim: "Pineal-function modulation", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Sleep efficacy", research: "Limited independent evidence.", marketing: "Vendor pages frame it as a reliable sleep aid." },
      ],
      risks: [{ label: "Replication gap", detail: "Most research from a narrow cluster.", severity: "watch" }],
    }),
  ];
}

function muscleRetention(): PeptideReport[] {
  return [
    genericPeptide("Ipamorelin", {
      signal_strength: "High",
      velocity_pct: 116,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Moderate",
      summary:
        "A selective ghrelin-receptor agonist often paired with CJC-1295 in discussion. Public conversation focuses on lean-mass support and recovery; published trials are modest in scope.",
      themes: ["Ghrelin-receptor selectivity", "GH-pulsatile-release mechanism", "CJC-1295 stacking culture"],
      pros: ["Subjective recovery and sleep reports", "Cleaner side-effect profile vs. older GHRPs reported"],
      concerns: ["Long-term human data limited", "Lean-mass claims often exceed evidence"],
      consensus_rows: [
        { claim: "Triggers GH pulse", consensus: "Strong" },
        { claim: "Lean-mass increase in healthy adults", consensus: "Mixed" },
        { claim: "Recovery improvements", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "Body-composition framing", research: "Modest clinical effect sizes.", marketing: "Vendor pages emphasize muscle-building outcomes." },
      ],
      risks: [
        { label: "GH-axis modulation", detail: "Long-term GH-axis effects in healthy adults are not well characterized.", severity: "watch" },
      ],
    }),
    genericPeptide("CJC-1295", {
      signal_strength: "High",
      velocity_pct: 102,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Moderate",
      summary:
        "A GHRH analog typically discussed alongside Ipamorelin. Trial literature on the original DAC variant exists; the no-DAC variant is supported mostly by anecdotal use.",
      themes: ["GHRH-analog mechanism", "DAC vs. no-DAC distinction in discussion", "Stacking culture with Ipamorelin"],
      pros: ["Subjective recovery and sleep reports"],
      concerns: ["DAC vs. no-DAC confusion in discussion", "Long-term GH-axis effects unclear"],
      consensus_rows: [
        { claim: "Increases GH/IGF-1 levels", consensus: "Strong", note: "DAC variant" },
        { claim: "Increases muscle mass in healthy adults", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "DAC vs. no-DAC framing", research: "Different pharmacokinetics; trial data primarily for DAC variant.", marketing: "Vendor pages often blur the distinction." },
      ],
      risks: [
        { label: "GH-axis modulation", detail: "Sustained GH-axis stimulation in healthy adults is not well characterized.", severity: "watch" },
      ],
    }),
    genericPeptide("Tesamorelin", {
      signal_strength: "Medium",
      velocity_pct: 44,
      consensus: "Strong",
      sentiment: "Mixed",
      research: "Stable",
      risk: "Moderate",
      summary:
        "An FDA-approved GHRH analog originally indicated for HIV-associated visceral adiposity. Off-label discussion has expanded into general body-composition contexts.",
      themes: ["Visceral-adiposity research literature", "Off-label discussion expansion"],
      pros: ["Strong indication-specific evidence"],
      concerns: ["Off-label extrapolation", "Cost"],
      consensus_rows: [
        { claim: "Reduces visceral adipose tissue (HIV-associated)", consensus: "Strong" },
        { claim: "Body-composition effects in healthy adults", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "Off-label framing", research: "Strong evidence is indication-specific.", marketing: "Telehealth pages often extend claims to general body-composition use." },
      ],
      risks: [
        { label: "Off-label extrapolation", detail: "Strong indication-specific evidence is often re-framed for broader use.", severity: "watch" },
      ],
    }),
    genericPeptide("Sermorelin", {
      signal_strength: "Medium",
      velocity_pct: 28,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "A GHRH analog with a long history in clinical pediatric use; recently revived in adult anti-aging telehealth marketing.",
      themes: ["Pediatric clinical history", "Adult anti-aging telehealth revival"],
      pros: ["Familiar safety footprint"],
      concerns: ["Modest effect sizes in adults"],
      consensus_rows: [
        { claim: "Stimulates endogenous GH release", consensus: "Strong" },
        { claim: "Body-composition effects in healthy adults", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "Anti-aging framing", research: "Pediatric evidence is established; adult anti-aging evidence is modest.", marketing: "Telehealth pages emphasize anti-aging outcomes." },
      ],
      risks: [
        { label: "Modest effect sizes", detail: "Adult body-composition effects are typically modest in trials.", severity: "info" },
      ],
    }),
  ];
}

function cognitive(): PeptideReport[] {
  return [
    genericPeptide("Semax", {
      signal_strength: "Medium",
      velocity_pct: 124,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "An ACTH-fragment analog with Russian-origin clinical research. Western peer-reviewed coverage is limited; public discussion is enthusiastic.",
      themes: ["BDNF/NGF expression discussion", "Russian-origin clinical literature", "Stroke-rehabilitation research"],
      pros: ["Subjective focus and motivation reports"],
      concerns: ["Russian-origin trials less familiar to Western audiences", "Intranasal sourcing variability"],
      consensus_rows: [
        { claim: "Cognitive enhancement in healthy adults", consensus: "Mixed" },
        { claim: "Stroke-rehabilitation utility", consensus: "Mixed", note: "Russian clinical context" },
      ],
      conflicts: [
        { topic: "'Smart drug' framing", research: "Most clinical research is rehabilitation-focused.", marketing: "Vendor pages use general 'cognitive enhancer' framing." },
      ],
      risks: [
        { label: "Sourcing variability", detail: "Intranasal preparations vary in concentration and purity.", severity: "watch" },
      ],
    }),
    genericPeptide("Selank", {
      signal_strength: "Medium",
      velocity_pct: 88,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "A heptapeptide analog of tuftsin with anxiolytic-leaning research. Cognitive-performance framing is more downstream than direct.",
      themes: ["Anxiolytic mechanism research", "Russian-origin clinical literature"],
      pros: ["Subjective calm-focus reports"],
      concerns: ["Indirect cognitive mechanism", "Sourcing variability"],
      consensus_rows: [
        { claim: "Anxiolytic effect", consensus: "Mixed" },
        { claim: "Direct cognitive enhancement", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Cognitive framing", research: "Primary mechanism is anxiolytic.", marketing: "Vendor pages emphasize cognitive enhancement directly." },
      ],
      risks: [{ label: "Indirect mechanism", detail: "Cognitive effects appear to be downstream of anxiolytic action.", severity: "info" }],
    }),
    genericPeptide("Cerebrolysin", {
      signal_strength: "Medium",
      velocity_pct: 62,
      consensus: "Mixed",
      sentiment: "Cautious",
      research: "Stable",
      risk: "Moderate",
      summary:
        "A peptide preparation derived from porcine brain tissue, studied in stroke and dementia rehabilitation. Healthy-adult use is off-label and largely anecdotal.",
      themes: ["Stroke and dementia rehabilitation literature", "Porcine-origin preparation"],
      pros: ["Established rehabilitation-context evidence"],
      concerns: ["Healthy-adult use is off-label", "Cost and access"],
      consensus_rows: [
        { claim: "Rehabilitation utility (stroke / dementia)", consensus: "Mixed" },
        { claim: "Cognitive enhancement in healthy adults", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Off-label cognitive use", research: "Evidence is rehabilitation-context.", marketing: "Vendor pages frame it as a healthy-adult cognitive enhancer." },
      ],
      risks: [
        { label: "Off-label extrapolation", detail: "Rehabilitation evidence is often re-framed for general cognitive use.", severity: "watch" },
      ],
    }),
    genericPeptide("Dihexa", {
      signal_strength: "Emerging",
      velocity_pct: 188,
      consensus: "Weak",
      sentiment: "Cautious",
      research: "Stable",
      risk: "Uncertain",
      summary:
        "A small-molecule angiotensin-IV analog with strong pre-clinical synaptogenesis findings. Human evidence is essentially absent; community discussion is speculative.",
      themes: ["Pre-clinical synaptogenesis findings", "Hepatocyte growth factor pathway", "Limited human data"],
      pros: ["Striking pre-clinical mechanism"],
      concerns: ["Human data essentially absent", "Sourcing quality concerns"],
      consensus_rows: [
        { claim: "Synaptogenesis (pre-clinical)", consensus: "Strong" },
        { claim: "Cognitive enhancement in humans", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Translational readiness", research: "Pre-clinical only.", marketing: "Vendor pages imply human applicability." },
      ],
      risks: [
        { label: "Translational gap", detail: "Pre-clinical findings have not been validated in human trials.", severity: "concern" },
      ],
    }),
  ];
}

function skinHealth(): PeptideReport[] {
  return [
    genericPeptide("GHK-Cu", {
      signal_strength: "High",
      velocity_pct: 92,
      consensus: "Strong",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "Among the most researched cosmetic peptides; strong evidence base for collagen synthesis, wound healing, and dermal repair.",
      themes: ["Collagen synthesis literature", "Wound healing trials", "Hair follicle research"],
      pros: ["Skin texture improvements widely reported", "Cosmetic-research backing"],
      concerns: ["Sourcing variability in non-cosmetic preparations"],
      consensus_rows: [
        { claim: "Stimulates dermal collagen synthesis", consensus: "Strong" },
        { claim: "Supports wound healing", consensus: "Strong" },
        { claim: "Hair-growth support", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "Topical vs. injectable framing", research: "Most cosmetic evidence is topical.", marketing: "Some vendors emphasize injectable use without context." },
      ],
      risks: [{ label: "Application context", detail: "Strong topical evidence is sometimes extended to other routes.", severity: "info" }],
    }),
    genericPeptide("Matrixyl", {
      signal_strength: "Medium",
      velocity_pct: 18,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "A palmitoyl-pentapeptide widely used in cosmetic formulations. Evidence supports collagen-stimulation effects in topical use.",
      themes: ["Cosmetic palmitoyl-peptide research", "Topical anti-aging formulations"],
      pros: ["Established topical evidence"],
      concerns: ["Effect sizes are modest"],
      consensus_rows: [
        { claim: "Topical collagen-stimulation", consensus: "Strong" },
        { claim: "Visible wrinkle reduction", consensus: "Mixed" },
      ],
      conflicts: [
        { topic: "Effect-size framing", research: "Modest measurable effects.", marketing: "Cosmetic marketing often implies strong visible change." },
      ],
      risks: [{ label: "Effect-size mismatch", detail: "Marketing claims often exceed measured effects.", severity: "info" }],
    }),
    genericPeptide("Argireline", {
      signal_strength: "Medium",
      velocity_pct: 22,
      consensus: "Mixed",
      sentiment: "Positive",
      research: "Stable",
      risk: "Low",
      summary:
        "Often marketed as a 'topical Botox alternative.' Cosmetic literature shows modest topical effects on expression-line depth.",
      themes: ["Acetyl-hexapeptide cosmetic research", "Expression-line depth studies"],
      pros: ["Topical, low side-effect profile"],
      concerns: ["'Topical Botox' framing exceeds actual effect size"],
      consensus_rows: [
        { claim: "Modest expression-line depth reduction", consensus: "Mixed" },
        { claim: "'Topical Botox' equivalence", consensus: "Weak" },
      ],
      conflicts: [
        { topic: "Botox-equivalence framing", research: "Modest cosmetic effect.", marketing: "Cosmetic copy frames it as a topical Botox alternative." },
      ],
      risks: [{ label: "Marketing exaggeration", detail: "Cosmetic copy regularly exceeds research effect sizes.", severity: "info" }],
    }),
    genericPeptide("BPC-157", {
      signal_strength: "Medium",
      velocity_pct: 64,
      consensus: "Weak",
      sentiment: "Mixed",
      research: "Stable",
      risk: "Uncertain",
      summary:
        "Appears in skin-context discussion despite the bulk of evidence being GI and connective-tissue focused. Skin-context claims are largely speculative.",
      themes: ["GI and tendon-repair pre-clinical literature", "Skin-context claims as discussion drift"],
      pros: ["Generalized recovery anecdotes"],
      concerns: ["Skin-context evidence is essentially absent"],
      consensus_rows: [
        { claim: "Skin-healing effects in humans", consensus: "Anecdotal" },
      ],
      conflicts: [
        { topic: "Skin-context framing", research: "Most evidence is GI/tendon-focused (animal models).", marketing: "Some clinics extend claims to skin context." },
      ],
      risks: [{ label: "Context drift", detail: "Skin-context claims rest on broader generalizations.", severity: "watch" }],
    }),
  ];
}

// --- generic builder ---
interface GenericInput {
  signal_strength: "High" | "Medium" | "Emerging";
  velocity_pct: number;
  consensus: "Strong" | "Mixed" | "Weak" | "Anecdotal";
  sentiment: "Positive" | "Mixed" | "Divided" | "Cautious";
  research: "Rising" | "Stable" | "Declining";
  risk: "Low" | "Moderate" | "Elevated" | "Uncertain";
  summary: string;
  themes: string[];
  pros: string[];
  concerns: string[];
  consensus_rows: Array<{ claim: string; consensus: "Strong" | "Mixed" | "Weak" | "Anecdotal"; note?: string }>;
  conflicts: Array<{ topic: string; research: string; marketing: string; note?: string }>;
  risks: Array<{ label: string; detail: string; severity: "info" | "watch" | "concern" }>;
}

function genericPeptide(name: string, g: GenericInput): PeptideReport {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    name,
    signal_strength: g.signal_strength,
    discussion_velocity: `+${g.velocity_pct}%`,
    velocity_pct: g.velocity_pct,
    consensus_score: g.consensus,
    sentiment: g.sentiment,
    research_activity: g.research,
    risk_level: g.risk,
    trending: g.velocity_pct >= 100,
    overview: g.summary,
    research_themes: g.themes,
    public_sentiment: {
      summary: `Anecdotal public discussion: ${g.summary.split(".")[0]}.`,
      pros: g.pros,
      concerns: g.concerns,
      common_questions: [
        `What does the strongest research on ${name} actually show?`,
        `How is ${name} sourced and what quality concerns exist?`,
        `How does ${name} compare with adjacent compounds?`,
      ],
    },
    market_snapshot: {
      price_range: priceForSignal(g.signal_strength),
      availability: g.signal_strength === "Emerging" ? "Limited; mostly research-chemical channels" : "Widely available across peptide vendors",
      market_activity: g.research === "Rising" ? "Rising marketing visibility" : "Stable market presence",
      vendor_frequency: g.signal_strength === "High" ? "Very high" : g.signal_strength === "Medium" ? "High" : "Medium",
      telehealth_visibility: g.signal_strength === "High" ? "High" : "Medium",
    },
    claim_consensus: g.consensus_rows,
    conflicting_claims: g.conflicts,
    risk_flags: g.risks,
    sources: [
      { title: `${name} — review article`, url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(name)}`, tier: "research", snippet: "Published literature search." },
      { title: `r/Peptides — ${name} discussion`, url: `https://www.reddit.com/r/Peptides/search/?q=${encodeURIComponent(name)}`, tier: "anecdotal" },
      { title: `Peptide vendor ${name} listing`, url: `https://example-vendor.com/${slug}`, tier: "vendor" },
      { title: `Recovery-clinic ${name} page`, url: `https://example-telehealth.com/${slug}`, tier: "telehealth" },
    ],
  };
}

function priceForSignal(s: "High" | "Medium" | "Emerging"): string {
  switch (s) {
    case "High":
      return "$80–$320 / vial mentioned";
    case "Medium":
      return "$40–$160 / vial mentioned";
    case "Emerging":
      return "$60–$220 / vial mentioned";
  }
}

const REPORTS_BY_CATEGORY: Record<CategorySlug, () => PeptideReport[]> = {
  "fat-loss": fatLoss,
  recovery: recovery,
  longevity: longevity,
  sleep: sleep,
  "muscle-retention": muscleRetention,
  "cognitive-performance": cognitive,
  "skin-health": skinHealth,
};

export function getFallbackReport(category: CategorySlug, mode: "live" | "demo" = "demo"): IntelReport {
  const cat = CATEGORY_BY_SLUG[category];
  return {
    category,
    category_label: cat.label,
    generated_at: new Date().toISOString(),
    mode,
    peptides: REPORTS_BY_CATEGORY[category](),
  };
}

export function getFallbackPeptide(category: CategorySlug, peptideName: string): PeptideReport | null {
  const report = getFallbackReport(category);
  const target = peptideName.toLowerCase();
  return (
    report.peptides.find(
      (p) =>
        p.name.toLowerCase() === target ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === target ||
        (p.aka || []).some((a) => a.toLowerCase() === target),
    ) || null
  );
}
