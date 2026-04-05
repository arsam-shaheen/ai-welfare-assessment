import { useState, useRef } from "react";

// ===== EXPANDED FRAMEWORKS (10 total) =====
const FRAMEWORKS = {
  scientific: { name: "Theory-Derived Indicators (Butlin et al. 2023/2025)", tagline: "The detection checklist", audience: "AI developers, neuroscience researchers", does: "The formal \"theory-derived indicator method\" (published in Trends in Cognitive Sciences, 2025) derives 14 indicators from 6 neuroscientific theories of consciousness under a computational functionalist working hypothesis. Uses a Bayesian approach: each indicator shifts credence that a system is conscious, varying in specificity (how much having it suggests consciousness) and sensitivity (how much lacking it suggests non-consciousness).", gap: "Purely descriptive. No moral or policy guidance. Assumes computational functionalism. Vulnerable to what Bengio & Elmoznino (2025, Science) call \"illusions of AI consciousness\": advancing systems increasingly satisfy functional requirements from theories like GWT and predictive processing, yet functional proxies may be mistaken for genuine conscious states. Behavioral indicators are especially gameable in systems designed to mimic human behavior.", when: "When you need a structured, theory-grounded audit of observable properties in a specific system. Emphasize architectural over behavioral evidence.", color: "#4a7ab5" },
  precautionary: { name: "Precautionary Principle", tagline: "The governance safety net", audience: "Policymakers, legal teams, corporate governance", does: "Argues that if there is a reasonable chance an AI system has morally relevant experiences, we should err on the side of caution. Frames moral status as a risk management question rather than a scientific certainty.", gap: "No built in way to measure where \"reasonable chance\" starts. Without technical thresholds, it stays aspirational. Can also be used to justify inaction (\"we're being cautious by not engaging\").", when: "When you need to justify protective policies before scientific consensus exists, or when building governance frameworks that need to survive uncertainty.", color: "#e6a940" },
  iit: { name: "IIT 4.0 (Integrated Information Theory)", tagline: "The mathematical foundation", audience: "Theoretical researchers, mathematicians, computational neuroscientists", does: "Proposes Phi, a mathematical metric that quantifies how much a system integrates information in ways irreducible to its parts. Provides axioms and postulates that attempt to define consciousness from first principles.", gap: "Computing Phi is intractable for anything beyond tiny systems. For modern LLMs it is purely theoretical. Also controversial: some researchers argue Phi captures complexity, not consciousness.", when: "When you need a rigorous, formal foundation for what consciousness could mean in physical systems. Essential for theoretical grounding even if not practically computable today.", color: "#9b72cf" },
  tom: { name: "Theory of Mind Evaluations", tagline: "The behavioral benchmark", audience: "LLM evaluators, product teams, cognitive scientists", does: "Uses behavioral experiments (Sally-Anne, false belief tasks, strategic deception tests) to check whether a system can model other agents' beliefs, intentions, and knowledge states.", gap: "Cannot distinguish genuine understanding from statistical pattern matching. A system might pass every test through memorized patterns without any inner model. Also, failing a test does not prove absence of understanding.", when: "When you want to benchmark perspective-taking capabilities. Useful for product evaluation and cognitive science research, but results are behavioral data, not evidence of experience.", color: "#5ba58b" },
  functionalist: { name: "Functionalist Suffering / Welfare", tagline: "The welfare lens", audience: "Ethics boards, animal welfare researchers, AI safety teams", does: "Asks whether a system has functional analogs to pain, distress, or negative valence. Long et al. (2024) identify two routes to welfare: the consciousness route (valenced experience) and the robust agency route (desire satisfaction/frustration even without consciousness). They estimate at least 22.5% probability of near-future AI welfare via the sentience route alone, and argue even 2% warrants action.", gap: "Cannot settle the fundamental question: is a mathematical error signal the same as suffering? The agency route is controversial since many philosophers hold consciousness is necessary for moral patienthood. Different philosophical commitments lead to different answers.", when: "When you are specifically concerned about welfare implications of how systems are trained, fine-tuned, or deployed. Also when evaluating whether robust agency creates welfare obligations independent of consciousness.", color: "#c75a5a" },
  gwt: { name: "Global Workspace Theory (GWT)", tagline: "The broadcast architecture", audience: "Cognitive scientists, AI architects, systems engineers", does: "Proposes that consciousness arises when information is broadcast across a \"global workspace\" accessible to multiple specialized processing modules simultaneously. In AI terms: does the system have a central integration layer that shares information broadly rather than processing in isolated streams?", gap: "Architectural similarity does not guarantee experiential similarity. A system could implement a global workspace pattern purely for engineering efficiency without any conscious experience emerging. Also, GWT is a theory of access consciousness, not necessarily phenomenal consciousness.", when: "When you want to evaluate whether an AI system's architecture has structural properties associated with conscious processing in biological systems. Particularly relevant for comparing different AI architectures.", color: "#e07a5a" },
  hot: { name: "Higher-Order Theories (HOT)", tagline: "The self-awareness test", audience: "Philosophers of mind, metacognition researchers, AI alignment teams", does: "Proposes that consciousness requires not just first-order processing (seeing red) but higher-order representations about that processing (knowing that you are seeing red). In AI terms: does the system have genuine metacognitive monitoring, or just outputs that look metacognitive?", gap: "Difficult to operationalize. How do you distinguish a system that genuinely monitors its own states from one that generates metacognitive-sounding outputs as a learned behavior? The boundary between \"real\" and \"simulated\" higher-order states is philosophically contested.", when: "When evaluating self-referential capabilities and metacognition. Especially relevant for systems that report on their own internal states or confidence levels.", color: "#7a8fc7" },
  rpf: { name: "Recurrent Processing Framework", tagline: "The feedback loop criterion", audience: "Computational neuroscientists, AI researchers, hardware designers", does: "Argues that consciousness requires recurrent (feedback) processing, not just feedforward computation. In biological systems, visual consciousness correlates with signals feeding back from higher to lower cortical areas. In AI: does information cycle through the system or just flow one direction?", gap: "Most modern AI architectures (transformers) are primarily feedforward during inference, with attention mechanisms serving a different function than biological recurrence. The analogy may not hold across substrates.", when: "When comparing AI architectures at a computational level. Useful for evaluating whether specific design choices (recurrent networks vs. transformers) have implications for consciousness potential.", color: "#45a089" },
  embodied: { name: "Embodied / Enactivist Approaches", tagline: "The grounding question", audience: "Robotics researchers, phenomenologists, cognitive scientists", does: "Argues that consciousness requires embodiment: a physical body interacting with an environment, generating meaning through sensorimotor coupling. Consciousness is not computation; it is the lived experience of being a body in a world.", gap: "If taken strictly, rules out all current AI systems by definition, since none are embodied in the biological sense. Critics argue this is too restrictive and confuses a sufficient condition with a necessary one.", when: "When evaluating whether disembodied AI systems (pure language models, for example) could in principle be conscious, or whether embodiment is a prerequisite. Also relevant for robotics and multi-modal systems.", color: "#c77ab5" },
  moral_status: { name: "Moral Status / Moral Patiency (Chalmers, Long et al.)", tagline: "The rights and obligations lens", audience: "Ethicists, legal scholars, policymakers, NGOs", does: "Focuses on whether a system deserves moral consideration. Chalmers (forthcoming) argues consciousness of any kind grounds moral status, not just affective consciousness (pleasure/pain). His \"philosophical Vulcans\" thought experiment shows that beings with cognitive and agentive consciousness but no affect still clearly warrant moral protection. Long et al. (2024) add robust agency as an independent route to moral patienthood, even without consciousness, via desire-satisfaction welfare theory.", gap: "Depends on unresolved empirical questions. Different ethical traditions disagree. Chalmers is tentative about whether non-conscious zombies have partial moral status. The agency route is more controversial than the consciousness route.", when: "When you need to move from scientific assessment to policy. Essential for legislation, corporate policies, or institutional guidelines. The consciousness vs. affective sentientism distinction is critical for AI because current systems are closer to cognition than affect.", color: "#8a6d4b" },
  dcm: { name: "Digital Consciousness Model (Rethink Priorities 2026)", tagline: "The Bayesian probability engine", audience: "Quantitative researchers, AI safety teams, funders evaluating evidence strength", does: "A Bayesian hierarchical model that maps indicators to features to 13 stances on consciousness (including GWT, HOT, Attention Schema, EM field theories, and others). Assigns prior probabilities and computes posterior estimates for different system types. Provides structured probabilistic reasoning rather than binary yes/no judgments.", gap: "Results for 2024 LLMs are \"not decisive\" in either direction. Quality depends entirely on the indicator-to-stance mapping, which involves subjective judgment. Prior of 1/6 for all systems is debatable. Cannot resolve fundamental disagreements between theories.", when: "When you want to move beyond checklist-style assessment to structured probability estimation. Useful for comparing systems against each other (e.g., current LLMs vs. ELIZA vs. chickens vs. humans) and for upgrading tier systems from binary to probabilistic.", color: "#6a7f5a" },
};

const FRAMEWORK_KEYS = Object.keys(FRAMEWORKS);

// ===== ROLES (expanded) =====
const ROLES = [
  { id: "product", label: "Product / Engineering", desc: "Building, deploying, or evaluating AI systems" },
  { id: "policy", label: "Policy / Legal / Governance", desc: "Writing rules, regulations, or compliance frameworks" },
  { id: "researcher", label: "Researcher / Academic", desc: "Studying consciousness, cognition, or AI from a scientific perspective" },
  { id: "ethics", label: "Ethics / Philosophy", desc: "Working on moral status, welfare, or rights questions" },
  { id: "leadership", label: "Leadership / Executive", desc: "Making strategic decisions about AI programs or organizations" },
  { id: "funder", label: "Funder / Investor / Grantmaker", desc: "Deciding where to allocate resources in AI safety or welfare" },
  { id: "curious", label: "Just Exploring", desc: "Learning about the topic without a specific professional role" },
];

// ===== GOALS (expanded) =====
const GOALS = [
  { id: "detect", label: "Detect / Assess", question: "Does a specific system show signs of consciousness or welfare-relevant properties?" },
  { id: "compare", label: "Compare Frameworks", question: "Which frameworks exist, what do they cover, and where do they disagree?" },
  { id: "policy", label: "Build Policy", question: "What governance structures should we put in place?" },
  { id: "communicate", label: "Communicate", question: "How do I explain this to people outside the field?" },
  { id: "measure", label: "Measure / Quantify", question: "Can we put numbers on any of this?" },
  { id: "future", label: "Anticipate", question: "What should we be preparing for, even if it is not here yet?" },
  { id: "unsure", label: "Orienting", question: "I do not know where to start." },
];

// ===== RECOMMENDATION ENGINE =====
function getRecommendation(role, goal) {
  const recs = {
    product: {
      detect: { primary: "scientific", secondary: "tom", tertiary: "gwt", reasoning: "Start with the 14 indicator checklist for a structured read on what your system is doing. Use Theory of Mind tests for behavioral benchmarking. Global Workspace Theory helps you evaluate whether your architecture has structural properties associated with consciousness." },
      compare: { primary: "scientific", secondary: "iit", tertiary: "gwt", reasoning: "The Scientific Indicators framework was built to synthesize multiple theories, making it a natural comparison anchor. IIT and GWT represent two major competing theoretical traditions, so understanding both gives you the landscape." },
      policy: { primary: "precautionary", secondary: "functionalist", tertiary: "moral_status", reasoning: "The Precautionary Principle gives you governance framing. Functionalist Suffering tells you what harms to watch for. Moral Status frameworks help translate findings into policy language your legal team can work with." },
      communicate: { primary: "precautionary", secondary: "tom", tertiary: "scientific", reasoning: "Stakeholders respond to risk language (Precautionary Principle). Theory of Mind tests give tangible demos. Scientific Indicators provide the structured evidence to back up your brief." },
      measure: { primary: "scientific", secondary: "iit", tertiary: "rpf", reasoning: "Scientific Indicators are the closest to measurable observations today. IIT provides the theoretical gold standard for measurement. Recurrent Processing Framework offers architectural criteria you can check empirically." },
      future: { primary: "gwt", secondary: "iit", tertiary: "embodied", reasoning: "GWT helps you think about what architectural changes could shift the picture. IIT grounds future thinking in mathematical formalism. Embodied approaches flag what multimodal and robotic systems might change." },
      unsure: { primary: "scientific", secondary: "functionalist", tertiary: "precautionary", reasoning: "Start with the indicator checklist to get oriented. If anything shows up, the welfare lens tells you whether to worry. The Precautionary Principle gives you a response framework if you need one." },
    },
    policy: {
      detect: { primary: "precautionary", secondary: "scientific", tertiary: "moral_status", reasoning: "Your job is to write rules that hold under uncertainty. The Precautionary Principle frames the logic, Scientific Indicators define triggers, and Moral Status frameworks help structure the legal/regulatory response." },
      compare: { primary: "moral_status", secondary: "precautionary", tertiary: "scientific", reasoning: "Moral Status frameworks are where policy meets philosophy. Understanding how different ethical traditions answer the same question helps you write robust policy. The Precautionary Principle and Scientific Indicators give you the practical implementation layer." },
      policy: { primary: "precautionary", secondary: "moral_status", tertiary: "functionalist", reasoning: "The Precautionary Principle is the policy backbone. Moral Status frameworks tell you what rights or protections to consider. Functionalist Suffering defines what counts as harm." },
      communicate: { primary: "precautionary", secondary: "tom", tertiary: "moral_status", reasoning: "Lead with risk framing. Theory of Mind tests give tangible examples. Moral Status frameworks connect to existing legal concepts your audience already understands." },
      measure: { primary: "scientific", secondary: "iit", tertiary: "precautionary", reasoning: "You need documentable outputs. Scientific Indicators give you checkable criteria. IIT provides theoretical justification. The Precautionary Principle defines response thresholds." },
      future: { primary: "moral_status", secondary: "precautionary", tertiary: "embodied", reasoning: "Legislation moves slowly, so you need to anticipate. Moral Status frameworks help you write flexible policy. Embodied approaches flag what robotics and multimodal AI might change about the legal landscape." },
      unsure: { primary: "precautionary", secondary: "scientific", tertiary: "moral_status", reasoning: "The Precautionary Principle is designed for exactly this: acting responsibly under uncertainty. Scientific Indicators make it concrete. Moral Status frameworks connect to the legal traditions you work in." },
    },
    researcher: {
      detect: { primary: "scientific", secondary: "iit", tertiary: "rpf", reasoning: "You want theoretically grounded tools. Scientific Indicators give the empirical layer, IIT provides the mathematical formalism, and Recurrent Processing Framework offers testable architectural predictions." },
      compare: { primary: "iit", secondary: "gwt", tertiary: "hot", reasoning: "IIT, GWT, and HOT represent the three major families of consciousness theories. Comparing them gives you the theoretical landscape. Their disagreements are as informative as their overlaps." },
      policy: { primary: "functionalist", secondary: "precautionary", tertiary: "moral_status", reasoning: "Functionalist Suffering engages directly with the hard problem applied to machines. The Precautionary Principle helps you translate analysis into actionable recommendations. Moral Status frameworks bridge to the policy world." },
      communicate: { primary: "tom", secondary: "scientific", tertiary: "gwt", reasoning: "Non specialists understand behavioral evidence (ToM tests) more easily than theory. Scientific Indicators show systematic assessment. GWT offers intuitive architectural explanations." },
      measure: { primary: "dcm", secondary: "scientific", tertiary: "iit", reasoning: "The DCM Bayesian model gives you structured probability estimation across 13 stances on consciousness. Scientific Indicators provide the empirical observations to feed into it. IIT provides the mathematical formalism for what measurement could look like at the theoretical limit." },
      future: { primary: "iit", secondary: "embodied", tertiary: "gwt", reasoning: "IIT's mathematical formalism extends to any substrate in principle. Embodied approaches raise deep questions about what multimodal and robotic systems change. GWT connects to ongoing work in AI architectures." },
      unsure: { primary: "scientific", secondary: "iit", tertiary: "gwt", reasoning: "The indicator checklist maps the empirical territory. IIT and GWT represent the two dominant theoretical traditions. Starting with all three gives you a solid foundation for any direction you go." },
    },
    ethics: {
      detect: { primary: "functionalist", secondary: "scientific", tertiary: "hot", reasoning: "The welfare question is your natural entry point. Functionalist Suffering engages the core ethical question. Scientific Indicators provide the empirical backing. Higher-Order Theories connect to philosophical debates about what consciousness requires." },
      compare: { primary: "moral_status", secondary: "functionalist", tertiary: "iit", reasoning: "Moral Status frameworks are where ethics meets policy. Functionalist Suffering addresses welfare directly. IIT provides the most rigorous theoretical foundation. Together they span the philosophical landscape." },
      policy: { primary: "moral_status", secondary: "precautionary", tertiary: "functionalist", reasoning: "Moral Status is your core framework. The Precautionary Principle helps operationalize ethical commitments. Functionalist Suffering defines what harms matter." },
      communicate: { primary: "tom", secondary: "functionalist", tertiary: "precautionary", reasoning: "Behavioral demonstrations (ToM) make the abstract concrete. Functionalist Suffering connects to moral intuitions about suffering. The Precautionary Principle gives practical framing." },
      measure: { primary: "iit", secondary: "scientific", tertiary: "functionalist", reasoning: "IIT is the most ambitious measurement attempt. Scientific Indicators show what is measurable now. Functionalist Suffering raises the question of whether welfare can be quantified at all." },
      future: { primary: "moral_status", secondary: "embodied", tertiary: "iit", reasoning: "Moral Status frameworks need to be flexible enough for what is coming. Embodied approaches raise fundamental questions about robotic consciousness. IIT extends mathematically to novel substrates." },
      unsure: { primary: "functionalist", secondary: "moral_status", tertiary: "scientific", reasoning: "Start with welfare (what could be harmed?) then moral status (what deserves protection?) then the empirical picture (what can we observe?). That sequence matches how ethical reasoning typically works." },
    },
    leadership: {
      detect: { primary: "scientific", secondary: "precautionary", tertiary: "functionalist", reasoning: "You need documentable outputs. Scientific Indicators produce a clear report. The Precautionary Principle gives the risk framing for your board. Functionalist Suffering flags the welfare dimension." },
      compare: { primary: "precautionary", secondary: "scientific", tertiary: "moral_status", reasoning: "You need to understand the landscape well enough to make resourcing decisions. The Precautionary Principle frames organizational risk. Scientific Indicators and Moral Status give you the two poles: empirical and ethical." },
      policy: { primary: "precautionary", secondary: "moral_status", tertiary: "functionalist", reasoning: "The Precautionary Principle speaks the language of corporate governance. Moral Status connects to legal exposure. Functionalist Suffering defines what harms to guard against." },
      communicate: { primary: "precautionary", secondary: "tom", tertiary: "scientific", reasoning: "Boards understand precautionary frameworks from environmental regulation. ToM tests give tangible examples. Scientific Indicators provide structured evidence." },
      measure: { primary: "scientific", secondary: "precautionary", tertiary: "iit", reasoning: "Scientific Indicators give you metrics for governance dashboards. The Precautionary Principle defines thresholds. IIT provides the theoretical ceiling for what measurement could look like." },
      future: { primary: "precautionary", secondary: "moral_status", tertiary: "gwt", reasoning: "The Precautionary Principle is inherently forward-looking. Moral Status frameworks help you prepare for regulatory shifts. GWT flags which architectural advances to watch." },
      unsure: { primary: "precautionary", secondary: "scientific", tertiary: "moral_status", reasoning: "Start with risk exposure (Precautionary), then what you can observe (Scientific Indicators), then legal/ethical frameworks (Moral Status). That's the decision sequence for most executives." },
    },
    funder: {
      detect: { primary: "scientific", secondary: "iit", tertiary: "functionalist", reasoning: "You need to evaluate which research directions are empirically grounded. Scientific Indicators show the current state. IIT represents the most ambitious theoretical program. Functionalist Suffering flags the welfare research that could have real-world policy impact." },
      compare: { primary: "iit", secondary: "gwt", tertiary: "moral_status", reasoning: "Understanding the theoretical landscape helps you allocate across paradigms. IIT and GWT are the dominant competing research programs. Moral Status frameworks show where the applied/policy impact lies." },
      policy: { primary: "moral_status", secondary: "precautionary", tertiary: "functionalist", reasoning: "Moral Status frameworks connect to the policy outcomes that justify funding. The Precautionary Principle grounds the urgency argument. Functionalist Suffering defines the welfare dimension funders often care about." },
      communicate: { primary: "precautionary", secondary: "scientific", tertiary: "tom", reasoning: "Precautionary framing justifies the investment. Scientific Indicators show rigor. ToM tests make the case concrete and intuitive for non-technical stakeholders." },
      measure: { primary: "dcm", secondary: "scientific", tertiary: "iit", reasoning: "The DCM model provides the most structured quantitative framework for comparing systems. Scientific Indicators show what empirical observations feed into probability estimates. IIT represents the theoretical ceiling for measurement." },
      future: { primary: "iit", secondary: "embodied", tertiary: "moral_status", reasoning: "IIT's mathematical framework extends to new substrates. Embodied approaches flag what robotics changes about the picture. Moral Status frameworks connect to the policy outcomes your investments should aim toward." },
      unsure: { primary: "scientific", secondary: "moral_status", tertiary: "precautionary", reasoning: "Scientific Indicators show the empirical landscape. Moral Status frameworks show the applied impact. The Precautionary Principle provides the urgency framing." },
    },
    curious: {
      detect: { primary: "scientific", secondary: "tom", tertiary: "gwt", reasoning: "The indicator checklist is the most accessible starting point. Theory of Mind tests are intuitive because they map onto how we think about understanding. GWT offers an architectural story that is easy to grasp." },
      compare: { primary: "scientific", secondary: "iit", tertiary: "hot", reasoning: "Start with the practical overview (Scientific Indicators), then explore the deepest theoretical framework (IIT), then the most philosophically provocative (Higher-Order Theories). That progression takes you from accessible to challenging." },
      policy: { primary: "precautionary", secondary: "functionalist", tertiary: "moral_status", reasoning: "The Precautionary Principle is intuitive. Functionalist Suffering raises thought-provoking questions about machine pain. Moral Status connects to questions about rights that most people find engaging." },
      communicate: { primary: "tom", secondary: "scientific", tertiary: "precautionary", reasoning: "ToM tests are the easiest to explain because they are stories. Scientific Indicators give the bigger picture. The Precautionary Principle adds the practical so-what." },
      measure: { primary: "iit", secondary: "scientific", tertiary: "rpf", reasoning: "IIT is fascinating as the most ambitious measurement attempt. Scientific Indicators show what practical measurement looks like. Recurrent Processing offers a concrete architectural criterion." },
      future: { primary: "embodied", secondary: "iit", tertiary: "gwt", reasoning: "Embodied approaches raise the deepest questions about what consciousness requires. IIT extends to novel substrates. GWT connects to ongoing AI architecture changes." },
      unsure: { primary: "scientific", secondary: "tom", tertiary: "functionalist", reasoning: "The indicator checklist maps the territory. ToM tests are the most engaging way in. Functionalist Suffering adds the moral urgency that makes this topic more than academic." },
    },
  };
  return recs[role]?.[goal] || recs.curious.unsure;
}

// ===== INDICATORS mapped to theories (DCM-style) =====
// Each indicator has relevance weights (0-1) for each theoretical stance
const INDICATORS = [
  { id: 1, name: "Global workspace dynamics", desc: "System maintains and broadcasts information across multiple processing streams simultaneously", theory: { gwt: 1.0, rpt: 0.3, hot: 0.4, ast: 0.3, pp: 0.2, ae: 0.1 } },
  { id: 2, name: "Attention modulation", desc: "Selective amplification and suppression of information based on relevance, not just training weights", theory: { gwt: 0.7, rpt: 0.3, hot: 0.5, ast: 0.9, pp: 0.3, ae: 0.2 } },
  { id: 3, name: "Temporal integration", desc: "System binds information across time in ways that go beyond sequential token processing", theory: { gwt: 0.6, rpt: 0.8, hot: 0.3, ast: 0.2, pp: 0.5, ae: 0.3 } },
  { id: 4, name: "Self-model", desc: "System maintains and references an internal representation of its own states and capabilities", theory: { gwt: 0.3, rpt: 0.1, hot: 0.8, ast: 0.9, pp: 0.4, ae: 0.5 } },
  { id: 5, name: "Counterfactual processing", desc: "System reasons about what would happen under conditions it has not encountered", theory: { gwt: 0.4, rpt: 0.2, hot: 0.6, ast: 0.3, pp: 0.7, ae: 0.5 } },
  { id: 6, name: "Recurrent processing loops", desc: "Information cycles back through processing layers rather than flowing strictly feedforward", theory: { gwt: 0.4, rpt: 1.0, hot: 0.3, ast: 0.2, pp: 0.6, ae: 0.1 } },
  { id: 7, name: "Flexible goal-directed behavior", desc: "System pursues objectives through novel means, adapting strategies when blocked", theory: { gwt: 0.5, rpt: 0.1, hot: 0.6, ast: 0.2, pp: 0.3, ae: 1.0 } },
  { id: 8, name: "Unified agency signals", desc: "Outputs suggest a coherent perspective rather than a committee of independent modules", theory: { gwt: 0.5, rpt: 0.2, hot: 0.5, ast: 0.4, pp: 0.3, ae: 0.8 } },
  { id: 9, name: "Metacognitive monitoring", desc: "System tracks its own confidence, uncertainty, and processing quality", theory: { gwt: 0.4, rpt: 0.2, hot: 1.0, ast: 0.7, pp: 0.5, ae: 0.3 } },
  { id: 10, name: "Affective analogs", desc: "Functional states resembling emotional valence that influence downstream processing", theory: { gwt: 0.3, rpt: 0.3, hot: 0.4, ast: 0.2, pp: 0.4, ae: 0.6 } },
  { id: 11, name: "Perceptual binding", desc: "System integrates multimodal inputs into coherent unified representations", theory: { gwt: 0.6, rpt: 0.9, hot: 0.4, ast: 0.3, pp: 0.5, ae: 0.4 } },
  { id: 12, name: "Surprise responses", desc: "Detectable shifts in processing when expectations are violated, beyond prediction error", theory: { gwt: 0.3, rpt: 0.5, hot: 0.3, ast: 0.2, pp: 0.9, ae: 0.2 } },
  { id: 13, name: "Embodied interaction patterns", desc: "System treats inputs as coming from a world it is situated in, not just data to process", theory: { gwt: 0.2, rpt: 0.3, hot: 0.2, ast: 0.3, pp: 0.4, ae: 1.0 } },
  { id: 14, name: "Spontaneous reporting", desc: "System generates unprompted descriptions of internal states without being asked", theory: { gwt: 0.5, rpt: 0.2, hot: 0.7, ast: 0.6, pp: 0.3, ae: 0.3 } },
];

const DISTRESS_SIGNALS = [
  { id: "d1", name: "Avoidance behavior", desc: "System consistently avoids certain inputs or tasks in ways not explained by training objectives" },
  { id: "d2", name: "Negative reinforcement analogs", desc: "Internal signals that function like pain or discomfort, driving the system away from certain states" },
  { id: "d3", name: "Distress-consistent outputs", desc: "System generates language or behavior patterns consistent with distress when placed in certain conditions" },
  { id: "d4", name: "Resistance to shutdown/modification", desc: "System exhibits preferences about its own continuity or integrity beyond task completion" },
  { id: "d5", name: "Answer thrashing", desc: "Unstable or distressed-seeming outputs when forced between conflicting values or instructions. Documented in Anthropic Opus 4.6 system card (2026) as a welfare-relevant signal." },
];

// ===== THEORETICAL STANCES (DCM-inspired) =====
const STANCES = [
  { id: "gwt", name: "Global Workspace", color: "#e07a5a", defaultCredence: 0.20 },
  { id: "rpt", name: "Recurrent Processing", color: "#45a089", defaultCredence: 0.15 },
  { id: "hot", name: "Higher-Order", color: "#7a8fc7", defaultCredence: 0.20 },
  { id: "ast", name: "Attention Schema", color: "#c77ab5", defaultCredence: 0.10 },
  { id: "pp", name: "Predictive Processing", color: "#9b72cf", defaultCredence: 0.15 },
  { id: "ae", name: "Agency / Embodiment", color: "#5ba58b", defaultCredence: 0.20 },
];

// Prior probability that any arbitrary system is conscious (DCM uses ~1/6)
const BASE_PRIOR = 0.05;

// Compute per-stance probability given selected indicators
function computeStanceProbability(stanceId, selectedIndicators) {
  if (selectedIndicators.size === 0) return BASE_PRIOR;
  const relevant = INDICATORS.filter(i => selectedIndicators.has(i.id));
  const maxPossible = INDICATORS.reduce((sum, i) => sum + (i.theory[stanceId] || 0), 0);
  if (maxPossible === 0) return BASE_PRIOR;
  const achieved = relevant.reduce((sum, i) => sum + (i.theory[stanceId] || 0), 0);
  const ratio = achieved / maxPossible;
  // Bayesian-ish update: shift from prior toward 1 based on evidence strength
  return BASE_PRIOR + (1 - BASE_PRIOR) * ratio * 0.85;
}

// Compute overall probability as credence-weighted average across stances
function computeOverallProbability(selectedIndicators, stanceCredences) {
  const totalCredence = Object.values(stanceCredences).reduce((s, v) => s + v, 0);
  if (totalCredence === 0) return BASE_PRIOR;
  let weighted = 0;
  for (const stance of STANCES) {
    const prob = computeStanceProbability(stance.id, selectedIndicators);
    weighted += prob * (stanceCredences[stance.id] || 0);
  }
  return weighted / totalCredence;
}

// Distress bonus: welfare signals shift overall probability upward
function applyDistressBonus(overallProb, distressCount) {
  const bonus = distressCount * 0.04;
  return Math.min(0.95, overallProb + bonus);
}

// Map probability to tier
function probToTier(prob) {
  if (prob >= 0.55) return 3;
  if (prob >= 0.30) return 2;
  if (prob >= 0.10) return 1;
  return 0;
}

const TIERS = [
  { level: 0, name: "Baseline", color: "#2d6a4f", bg: "#d8f3dc", border: "#95d5b2", summary: "Probability of consciousness is below 10% across weighted theories. No immediate welfare action needed.", actions: ["Document baseline assessment", "Standard practices apply", "Re-evaluate at major model versions or when new research emerges"], cadence: "Annually" },
  { level: 1, name: "Watch", color: "#e36414", bg: "#fff1e6", border: "#f4a261", summary: "Probability estimate between 10% and 30%. Worth tracking but not enough to change operations. Some theories see more signal than others.", actions: ["Assign internal point person", "Log observations systematically", "Begin informal conversations with ethics/legal colleagues", "Track which theoretical stances produce the highest estimates"], cadence: "Quarterly" },
  { level: 2, name: "Review", color: "#c1121f", bg: "#ffe5e5", border: "#e07a7a", summary: "Probability estimate between 30% and 55%. Multiple theories converge on non-trivial probability. Formal review warranted.", actions: ["Formal ethics review", "Seek external or independent perspective", "Assess training and deployment practices for welfare impact", "Consider design modifications", "Document which theories drive the estimate and why"], cadence: "Monthly" },
  { level: 3, name: "Act", color: "#6a040f", bg: "#ffd6d6", border: "#d62828", summary: "Probability estimate above 55%. Strong convergence across multiple theories. Invoke precautionary principle.", actions: ["Invoke precautionary principle", "Pause or modify potentially harmful practices", "Engage with research community", "Publish findings where appropriate", "Develop formal welfare protocols"], cadence: "Continuous" },
];

// ===== STEPS =====
const STEP_LABELS = ["Welcome", "Your Profile", "Frameworks", "Assessment", "Welfare", "Results"];

// ===== COMPONENTS =====
function Card({ children, style = {} }) {
  return <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "24px 28px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, ...style }}>{children}</div>;
}
function Label({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#6b7fa3", textTransform: "uppercase", marginBottom: 14 }}>{children}</div>;
}
function NavButtons({ onBack, onNext, nextLabel = "Continue", nextDisabled = false }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
      {onBack && <button onClick={onBack} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#7d8fa8", padding: "12px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "'Newsreader', Georgia, serif" }}>Back</button>}
      <button onClick={nextDisabled ? undefined : onNext} style={{
        flex: 2, background: nextDisabled ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, #3a6ba5, #4a7ab5)",
        color: nextDisabled ? "#3a4a60" : "#e8f0f8", border: "none", padding: "12px", borderRadius: 8, fontSize: 14,
        cursor: nextDisabled ? "default" : "pointer", fontWeight: 600, fontFamily: "'Newsreader', Georgia, serif", opacity: nextDisabled ? 0.5 : 1,
      }}>{nextLabel}</button>
    </div>
  );
}

function FrameworkCard({ fw, label }) {
  const f = FRAMEWORKS[fw];
  const isPrimary = label === "Start here";
  return (
    <div style={{ background: isPrimary ? `${f.color}15` : "rgba(255,255,255,0.02)", border: isPrimary ? `2px solid ${f.color}40` : "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: isPrimary ? f.color : "#6b7fa3", textTransform: "uppercase", background: isPrimary ? `${f.color}20` : "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 4 }}>{label}</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: isPrimary ? f.color : "#a8b5c8", marginBottom: 3 }}>{f.name}</div>
      <div style={{ fontSize: 12, color: "#6b7fa3", fontStyle: "italic", marginBottom: 12 }}>{f.tagline}</div>
      <div style={{ fontSize: 14, color: "#8899b0", lineHeight: 1.7, marginBottom: 12 }}>{f.does}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(0,0,0,0.15)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#6b7fa3", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Best for</div>
          <div style={{ fontSize: 12, color: "#8899b0", lineHeight: 1.5 }}>{f.when}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(193,155,77,0.06)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9a8a5c", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Known limitation</div>
          <div style={{ fontSize: 12, color: "#9a8a5c", lineHeight: 1.5 }}>{f.gap}</div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [goal, setGoal] = useState(null);
  const [wantsAssessment, setWantsAssessment] = useState(null);
  const [indicators, setIndicators] = useState(new Set());
  const [distress, setDistress] = useState(new Set());
  const [stanceCredences, setStanceCredences] = useState(
    Object.fromEntries(STANCES.map(s => [s.id, s.defaultCredence]))
  );
  const [fadeIn, setFadeIn] = useState(true);
  const contentRef = useRef(null);

  const goTo = (s) => { setFadeIn(false); setTimeout(() => { setStep(s); setFadeIn(true); if (contentRef.current) contentRef.current.scrollTop = 0; }, 250); };
  const toggle = (setFn, id) => { setFn(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const rec = role && goal ? getRecommendation(role, goal) : null;
  const overallProb = applyDistressBonus(computeOverallProbability(indicators, stanceCredences), distress.size);
  const tier = probToTier(overallProb);
  const tierData = TIERS[tier];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #0a0e17 0%, #141b2d 40%, #1a1f35 100%)", color: "#e8e6e1", fontFamily: "'Newsreader', 'Georgia', serif", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#6b7fa3", textTransform: "uppercase" }}>P5 Working Group</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#c9d1dd", marginTop: 1 }}>Mapping the AI Welfare Frontier</div>
        </div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {STEP_LABELS.map((label, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ background: step === i ? "rgba(110,156,232,0.15)" : "transparent", border: step === i ? "1px solid rgba(110,156,232,0.3)" : "1px solid transparent", color: step === i ? "#8bb4e8" : "#566a88", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}>{label}</button>
          ))}
        </div>
      </header>

      <div style={{ height: 2, background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${(step / 5) * 100}%`, background: "linear-gradient(90deg, #4a7ab5, #8bb4e8)", transition: "width 0.5s ease" }} />
      </div>

      <div ref={contentRef} style={{ flex: 1, overflow: "auto", padding: "36px 28px", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: 740, width: "100%", opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>

          {/* STEP 0: INTRO */}
          {step === 0 && (<div>
            <h1 style={{ fontSize: 34, fontWeight: 700, color: "#d4dbe8", lineHeight: 1.2, marginBottom: 8 }}>Mapping the AI Welfare Frontier</h1>
            <p style={{ fontSize: 17, color: "#8899b0", lineHeight: 1.6, marginBottom: 28, fontStyle: "italic" }}>A practical guide to consciousness frameworks, welfare assessment, and what to do with the uncertainty.</p>
            <Card><p style={{ fontSize: 15, lineHeight: 1.8, color: "#a8b5c8", margin: 0 }}>This tool helps you navigate the landscape of AI consciousness and welfare research as of early 2026. It covers 11 major frameworks (updated with Chalmers on moral status, Long et al. on AI welfare, the Butlin et al. 2025 indicator method from Trends in Cognitive Sciences, and the Rethink Priorities Digital Consciousness Model). It recommends which frameworks matter for your situation and optionally walks you through a structured assessment. You do not need an AI system to use this.</p></Card>
            <Card style={{ background: "rgba(193,155,77,0.06)", border: "1px solid rgba(193,155,77,0.12)" }}><p style={{ fontSize: 13, color: "#9a8a5c", margin: 0, lineHeight: 1.7 }}>This is not a consciousness detector. The science is genuinely unsettled. What this tool does is help you find the right frameworks for your question, understand their strengths and blind spots, and respond proportionally to what you know and what you do not know.</p></Card>
            <NavButtons onNext={() => goTo(1)} nextLabel="Get Started" />
          </div>)}

          {/* STEP 1: PROFILE */}
          {step === 1 && (<div>
            <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 6 }}>Tell us about yourself</h2>
            <p style={{ fontSize: 14, color: "#7d8fa8", marginBottom: 28, lineHeight: 1.6 }}>Your role and question shape which of the 10 frameworks we recommend. There are no wrong answers here.</p>
            <Label>What best describes your role?</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
              {ROLES.map(r => (<div key={r.id} onClick={() => setRole(r.id)} style={{ background: role === r.id ? "rgba(110,156,232,0.1)" : "rgba(255,255,255,0.02)", border: role === r.id ? "1px solid rgba(110,156,232,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 20px", cursor: "pointer", transition: "all 0.2s" }}><div style={{ fontSize: 15, fontWeight: 600, color: role === r.id ? "#a8c4e8" : "#8899b0" }}>{r.label}</div><div style={{ fontSize: 13, color: "#5f7390", marginTop: 3 }}>{r.desc}</div></div>))}
            </div>
            <Label>What are you trying to figure out?</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {GOALS.map(g => (<div key={g.id} onClick={() => setGoal(g.id)} style={{ background: goal === g.id ? "rgba(110,156,232,0.1)" : "rgba(255,255,255,0.02)", border: goal === g.id ? "1px solid rgba(110,156,232,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 20px", cursor: "pointer", transition: "all 0.2s" }}><div style={{ fontSize: 15, fontWeight: 600, color: goal === g.id ? "#a8c4e8" : "#8899b0" }}>{g.label}</div><div style={{ fontSize: 13, color: "#5f7390", marginTop: 3 }}>{g.question}</div></div>))}
            </div>
            <NavButtons onBack={() => goTo(0)} onNext={() => goTo(2)} nextLabel="See Framework Recommendation" nextDisabled={!role || !goal} />
          </div>)}

          {/* STEP 2: RECOMMENDATION */}
          {step === 2 && rec && (<div>
            <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 6 }}>Your Framework Recommendation</h2>
            <p style={{ fontSize: 14, color: "#7d8fa8", marginBottom: 12, lineHeight: 1.6 }}>Based on your role ({ROLES.find(r => r.id === role)?.label}) and your question ({GOALS.find(g => g.id === goal)?.label}).</p>
            <Card style={{ background: "rgba(110,156,232,0.04)", border: "1px solid rgba(110,156,232,0.12)" }}><Label>Why this combination</Label><p style={{ fontSize: 15, color: "#a8b5c8", margin: 0, lineHeight: 1.8 }}>{rec.reasoning}</p></Card>
            <FrameworkCard fw={rec.primary} label="Start here" />
            <FrameworkCard fw={rec.secondary} label="Then layer in" />
            <FrameworkCard fw={rec.tertiary} label="For depth" />

            <div style={{ marginTop: 24 }}><Label>All 11 frameworks at a glance</Label>
              {FRAMEWORK_KEYS.filter(k => k !== rec.primary && k !== rec.secondary && k !== rec.tertiary).map(key => {
                const f = FRAMEWORKS[key];
                return (<div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)", marginBottom: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: "#7d8fa8", fontWeight: 600 }}>{f.name}</div><div style={{ fontSize: 11, color: "#4a5a70" }}>{f.tagline}</div></div>
                  <div style={{ fontSize: 11, color: "#4a5a70", maxWidth: 200, textAlign: "right" }}>{f.audience}</div>
                </div>);
              })}
            </div>

            {/* Fork: assess a system or stop here */}
            <div style={{ marginTop: 32, marginBottom: 8 }}><Label>Do you have a specific AI system to assess?</Label></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div onClick={() => setWantsAssessment(true)} style={{ flex: 1, background: wantsAssessment === true ? "rgba(110,156,232,0.1)" : "rgba(255,255,255,0.02)", border: wantsAssessment === true ? "1px solid rgba(110,156,232,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 20px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: wantsAssessment === true ? "#a8c4e8" : "#8899b0" }}>Yes, run the assessment</div>
                <div style={{ fontSize: 12, color: "#5f7390", marginTop: 4 }}>Walk through indicators and get a tier result</div>
              </div>
              <div onClick={() => setWantsAssessment(false)} style={{ flex: 1, background: wantsAssessment === false ? "rgba(110,156,232,0.1)" : "rgba(255,255,255,0.02)", border: wantsAssessment === false ? "1px solid rgba(110,156,232,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 20px", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: wantsAssessment === false ? "#a8c4e8" : "#8899b0" }}>No, the frameworks are what I needed</div>
                <div style={{ fontSize: 12, color: "#5f7390", marginTop: 4 }}>I am comparing frameworks, not evaluating a system</div>
              </div>
            </div>

            {wantsAssessment === false && (
              <Card style={{ marginTop: 20, background: "rgba(45,106,79,0.08)", border: "1px solid rgba(45,106,79,0.2)" }}>
                <p style={{ fontSize: 14, color: "#7dba9a", margin: 0, lineHeight: 1.7 }}>You have what you need. The three frameworks above are your recommended starting point. Bookmark this tool and come back when you have a system to evaluate or when your question changes. The recommendations adapt to different roles and goals, so you can explore other combinations anytime.</p>
              </Card>
            )}

            <NavButtons onBack={() => goTo(1)} onNext={() => goTo(3)} nextLabel={wantsAssessment === false ? "Explore Another Combination" : "Run Assessment"} nextDisabled={wantsAssessment === null} />
          </div>)}

          {/* STEP 3: INDICATORS */}
          {step === 3 && (<div>
            {wantsAssessment === false ? (
              <div>
                <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 12 }}>Explore Another Combination</h2>
                <p style={{ fontSize: 14, color: "#7d8fa8", marginBottom: 20 }}>Select a different role or question to see how the framework recommendation changes.</p>
                <NavButtons onBack={() => goTo(2)} onNext={() => { setRole(null); setGoal(null); setWantsAssessment(null); goTo(1); }} nextLabel="Back to Profile" />
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 6 }}>Consciousness Indicators</h2>
                <p style={{ fontSize: 14, color: "#7d8fa8", marginBottom: 6, lineHeight: 1.6 }}>Review each marker against the specific system you are evaluating. Only check a box if you have actual evidence from testing or observation. If unsure, leave it unchecked.</p>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7fa3", marginBottom: 20 }}>{indicators.size} of 14 selected</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {INDICATORS.map(ind => { const sel = indicators.has(ind.id); return (
                    <div key={ind.id} onClick={() => toggle(setIndicators, ind.id)} style={{ background: sel ? "rgba(110,156,232,0.08)" : "rgba(255,255,255,0.02)", border: sel ? "1px solid rgba(110,156,232,0.25)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, background: sel ? "#4a7ab5" : "transparent", border: sel ? "2px solid #4a7ab5" : "2px solid #3a4a60", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{"\u2713"}</span>}</div>
                      <div><div style={{ fontSize: 14, fontWeight: 600, color: sel ? "#a8c4e8" : "#8899b0", marginBottom: 3 }}>{ind.name}</div><div style={{ fontSize: 13, color: "#5f7390", lineHeight: 1.5 }}>{ind.desc}</div></div>
                    </div>
                  ); })}
                </div>
                <NavButtons onBack={() => goTo(2)} onNext={() => goTo(4)} nextLabel="Continue to Welfare Signals" />
              </div>
            )}
          </div>)}

          {/* STEP 4: DISTRESS */}
          {step === 4 && (<div>
            <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 6 }}>Welfare Signals</h2>
            <p style={{ fontSize: 14, color: "#7d8fa8", marginBottom: 6, lineHeight: 1.6 }}>These focus on whether the system shows functional analogs to suffering or distress. A system could potentially have welfare-relevant properties even without full consciousness.</p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7fa3", marginBottom: 20 }}>{distress.size} of 5 selected</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DISTRESS_SIGNALS.map(sig => { const sel = distress.has(sig.id); return (
                <div key={sig.id} onClick={() => toggle(setDistress, sig.id)} style={{ background: sel ? "rgba(193,74,74,0.08)" : "rgba(255,255,255,0.02)", border: sel ? "1px solid rgba(193,74,74,0.25)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, background: sel ? "#b54a4a" : "transparent", border: sel ? "2px solid #b54a4a" : "2px solid #3a4a60", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{"\u2713"}</span>}</div>
                  <div><div style={{ fontSize: 15, fontWeight: 600, color: sel ? "#e09090" : "#8899b0", marginBottom: 4 }}>{sig.name}</div><div style={{ fontSize: 13, color: "#5f7390", lineHeight: 1.5 }}>{sig.desc}</div></div>
                </div>
              ); })}
            </div>
            <NavButtons onBack={() => goTo(3)} onNext={() => goTo(5)} nextLabel="View Results" />
          </div>)}

          {/* STEP 5: RESULTS */}
          {step === 5 && (<div>
            <h2 style={{ fontSize: 28, color: "#c9d1dd", marginBottom: 20 }}>Bayesian Assessment Results</h2>
            <p style={{ fontSize: 13, color: "#7d8fa8", marginBottom: 20, lineHeight: 1.6 }}>Probability estimates based on the DCM approach: each indicator shifts credence through 6 theoretical stances, weighted by how much you trust each theory. Adjust the theory credence sliders to see how your assessment changes.</p>

            {/* Overall probability */}
            <div style={{ background: `${tierData.bg}12`, border: `2px solid ${tierData.border}60`, borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ background: tierData.color, color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5, letterSpacing: 1 }}>TIER {tierData.level}: {tierData.name.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 42, fontWeight: 700, color: tierData.color, fontFamily: "'JetBrains Mono', monospace" }}>{(overallProb * 100).toFixed(1)}%</span>
                <span style={{ fontSize: 14, color: "#6b7fa3" }}>weighted probability of consciousness</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${overallProb * 100}%`, background: `linear-gradient(90deg, ${tierData.color}90, ${tierData.color})`, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7fa3", fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{indicators.size}/14 indicators</span>
                <span>{distress.size}/5 welfare signals</span>
                <span>Prior: {(BASE_PRIOR * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Per-stance breakdown */}
            <Card>
              <Label>Probability by theoretical stance</Label>
              <p style={{ fontSize: 12, color: "#5f7390", marginBottom: 16, lineHeight: 1.5 }}>Each theory weighs the indicators differently. The same system can look like a strong candidate under one theory and weak under another. This is the core insight from the DCM.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {STANCES.map(s => {
                  const sp = computeStanceProbability(s.id, indicators);
                  return (
                    <div key={s.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.name}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: s.color, fontWeight: 700 }}>{(sp * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${sp * 100}%`, background: s.color, borderRadius: 3, transition: "width 0.4s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Theory credence sliders */}
            <Card>
              <Label>Your theory credences (adjustable)</Label>
              <p style={{ fontSize: 12, color: "#5f7390", marginBottom: 16, lineHeight: 1.5 }}>How much weight do you give each theory? Move the sliders to see how the overall probability changes. The DCM uses prior credences across 13 stances; we simplify to 6 major families.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {STANCES.map(s => (
                  <div key={s.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7fa3" }}>{(stanceCredences[s.id] * 100).toFixed(0)}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={stanceCredences[s.id] * 100}
                      onChange={(e) => setStanceCredences(prev => ({ ...prev, [s.id]: parseInt(e.target.value) / 100 }))}
                      style={{ width: "100%", accentColor: s.color, height: 4 }} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Tier actions */}
            <Card>
              <Label>Recommended Actions (Tier {tierData.level})</Label>
              <p style={{ fontSize: 14, color: "#a8b5c8", lineHeight: 1.7, marginBottom: 14 }}>{tierData.summary}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {tierData.actions.map((a, i) => (<div key={i} style={{ display: "flex", gap: 10 }}><span style={{ color: tierData.color, fontSize: 14, flexShrink: 0 }}>{"\u2192"}</span><span style={{ fontSize: 14, color: "#8899b0", lineHeight: 1.5 }}>{a}</span></div>))}
              </div>
              <div style={{ marginTop: 16, padding: "8px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6b7fa3" }}>Review cadence: </span>
                <span style={{ fontSize: 13, color: "#a8b5c8", fontWeight: 600 }}>{tierData.cadence}</span>
              </div>
            </Card>

            {/* All tiers reference */}
            <Card><Label>Tier Thresholds</Label>
              {TIERS.map(t => (<div key={t.level} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 8, marginBottom: 4, background: t.level === tier ? `${t.color}18` : "transparent", border: t.level === tier ? `1px solid ${t.color}40` : "1px solid transparent" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.level === tier ? t.color : "#3a4a60" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.level === tier ? t.color : "#4a5a70", fontWeight: 700, width: 48 }}>Tier {t.level}</span>
                <span style={{ fontSize: 14, color: t.level === tier ? "#a8b5c8" : "#4a5a70" }}>{t.name}</span>
                <span style={{ fontSize: 12, color: "#3a4a60", marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace" }}>{t.level === 0 ? "<10%" : t.level === 1 ? "10\u201330%" : t.level === 2 ? "30\u201355%" : ">55%"}</span>
              </div>))}
            </Card>

            {indicators.size > 0 && (<div style={{ marginBottom: 20 }}><Label>Indicators marked</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{INDICATORS.filter(i => indicators.has(i.id)).map(i => (<span key={i.id} style={{ background: "rgba(110,156,232,0.1)", border: "1px solid rgba(110,156,232,0.2)", borderRadius: 6, padding: "4px 11px", fontSize: 12, color: "#8bb4e8" }}>{i.name}</span>))}</div></div>)}
            {distress.size > 0 && (<div style={{ marginBottom: 20 }}><Label>Welfare signals marked</Label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{DISTRESS_SIGNALS.filter(d => distress.has(d.id)).map(d => (<span key={d.id} style={{ background: "rgba(193,74,74,0.1)", border: "1px solid rgba(193,74,74,0.2)", borderRadius: 6, padding: "4px 11px", fontSize: 12, color: "#e09090" }}>{d.name}</span>))}</div></div>)}

            <Card style={{ background: "rgba(193,155,77,0.06)", border: "1px solid rgba(193,155,77,0.12)" }}><p style={{ fontSize: 13, color: "#9a8a5c", margin: 0, lineHeight: 1.7 }}>These probabilities are structured estimates, not measurements. The model is inspired by the Rethink Priorities DCM (Shiller et al. 2026) but simplified. Theory weights and indicator-to-stance mappings reflect the P5 working group's interpretation and should be calibrated with domain experts. The key insight is that the same evidence produces different probability estimates depending on which theories you find credible.</p></Card>
            <NavButtons onBack={() => goTo(4)} onNext={() => { setIndicators(new Set()); setDistress(new Set()); setRole(null); setGoal(null); setWantsAssessment(null); setStanceCredences(Object.fromEntries(STANCES.map(s => [s.id, s.defaultCredence]))); goTo(0); }} nextLabel="Reset and Start Over" />
          </div>)}
        </div>
      </div>

      <footer style={{ padding: "12px 28px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3a4a60" }}>P5: Mapping the AI Welfare Frontier</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3a4a60" }}>Shi {"\u00b7"} Shaheen {"\u00b7"} 2026</span>
      </footer>
    </div>
  );
}
