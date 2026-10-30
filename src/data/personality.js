import overview from "@/assets/images/personality-overview.png";
import traitsShot from "@/assets/images/personality-traits.png";
import careerShot from "@/assets/images/personality-career.png";
import growthShot from "@/assets/images/personality-growth.png";
import relationshipsShot from "@/assets/images/personality-relationships.png";

// self-reported 16Personalities result; screenshots are the proof
export const type = { code: "INTJ-T", name: "Architect" };

// pct = strength toward `side`; marker sits on that side of the centre line
export const traits = [
  { left: "Extraverted", right: "Introverted", side: "right", pct: 51 },
  { left: "Intuitive", right: "Observant", side: "left", pct: 63 },
  { left: "Thinking", right: "Feeling", side: "left", pct: 53 },
  { left: "Judging", right: "Prospecting", side: "left", pct: 58 },
  { left: "Assertive", right: "Turbulent", side: "right", pct: 64 },
];

export const areas = [
  {
    name: "Career",
    shot: careerShot,
    strengths: [
      ["Innovative Mindset", "Your ability to see possibilities others overlook often helps you find smarter solutions and effective improvements at work."],
      ["Independent Worker", "Your talent for working productively on your own allows you to manage tasks effectively without the need for constant direction or supervision."],
      ["Conceptual Thinking", "You effortlessly grasp abstract, complex ideas, making you particularly suited to roles that require strategic analysis and long-term planning."],
      ["Continuous Improvement", "You naturally focus on refining work processes and spotting inefficiencies, consistently improving project outcomes wherever you go."],
      ["Objective Judgment", "Your capacity to make impartial decisions based on facts rather than favoritism or personal bias earns respect and trust from your colleagues."],
      ["Reliable Performance", "When entrusted with critical tasks, you consistently deliver precise, high-quality results, making you a valued and dependable asset."],
    ],
    weaknesses: [
      ["Discomfort with Networking", "Your aversion to promoting yourself or making connections can limit career advancement opportunities, hiding your true worth from others."],
      ["Frustration with Constraints", "You chafe at rules or procedures you deem pointless, potentially straining relationships with supervisors or organizational hierarchy."],
      ["Ignoring Social Dynamics", "You tend to neglect office politics and informal social interactions, possibly missing cues or causing unintended misunderstandings."],
      ["Reluctance to Delegate Tasks", "Believing strongly in your own abilities, you often hesitate to entrust responsibilities to others, leading to stress or unnecessary workload."],
      ["Overly Blunt Feedback", "In your pursuit of truth and efficiency, you may deliver criticisms in ways that unintentionally demotivate or upset sensitive colleagues."],
      ["Impatience with Routine", "You often feel restless when assigned tasks that seem repetitive or mundane, leading to occasional lapses in your attention or motivation."],
    ],
  },
  {
    name: "Personal growth",
    shot: growthShot,
    strengths: [
      ["Self-Directed Learning", "You consistently take initiative in exploring new ideas, gaining deep knowledge without waiting for guidance from others."],
      ["Reflective Insight", "You comfortably analyze your own thoughts and emotions, allowing you to make insightful changes to your beliefs and behaviors."],
      ["Openness to Challenging Ideas", "You're drawn toward unconventional ideas and willingly rethink your views if confronted with convincing and rational arguments."],
      ["Self-Disciplined Approach", "You reliably maintain routines and create productive habits, steadily progressing toward your personal objectives."],
      ["Clarity of Purpose", "Your ability to clearly identify what matters most helps you efficiently pursue meaningful goals without distraction."],
      ["Resilient Determination", "Even when faced with setbacks, you retain the resolve necessary to adjust your strategy and persistently continue forward."],
    ],
    weaknesses: [
      ["Avoiding Emotional Exploration", "You sometimes neglect deeper emotional understanding and growth, believing logic and analysis alone are sufficient for self-improvement."],
      ["Hesitant to Seek Support", "Your preference for solving all problems independently makes seeking advice or support challenging, limiting your personal development."],
      ["Too Rigid Expectations", "Strict personal standards can make you overly self-critical and cause unnecessary stress when you inevitably fall short of perfection."],
      ["Reluctant to Celebrate Progress", "Always eyeing the next milestone, you rarely pause to appreciate achievements or reflect positively on how far you've come."],
      ["Discomfort with Ambiguity", "You prefer clarity and predictability, making it difficult to comfortably adapt when life presents ambiguous or uncertain scenarios."],
      ["Neglecting Leisure or Rest", "Your drive for productivity and achievement may sometimes cause you to overlook the importance of rest, relaxation, and sustainable pacing."],
    ],
  },
  {
    name: "Relationships",
    shot: relationshipsShot,
    strengths: [
      ["Authentic Sincerity", "You build trust through your honest and genuine interactions, making your connections deep, real, and stable."],
      ["Insightful Advice", "Friends and partners appreciate your unique wisdom and analytical perspective, especially when facing difficult decisions."],
      ["Quietly Caring", "Even though you avoid dramatic displays of affection, those close to you cherish your subtle yet meaningful gestures of care and thoughtfulness."],
      ["Selective Loyalty", "Once you've established trust with someone, you dedicate unwavering support and steadfast commitment to that person over the long term."],
      ["Respecting Autonomy", "You naturally recognize and encourage others' independence, allowing freedom and personal space that most people truly value."],
      ["Meaningful Conversations", "People who engage with you enjoy stimulating and intellectually enriching discussions that feel worthwhile and rewarding."],
    ],
    weaknesses: [
      ["Insensitive to Emotions", "Your rational nature can lead you to unintentionally overlook or undervalue emotional signals, leaving others feeling unheard or misunderstood."],
      ["Avoiding Social Rituals", "Dislike of small talk or expected social gestures sometimes makes you appear aloof or indifferent to friends and acquaintances."],
      ["Withdrawn under Stress", "When life becomes challenging or confusing, your instinct to isolate yourself may unintentionally distance you from people who care."],
      ["Difficulty Sharing Vulnerabilities", "Your strong preference to appear competent and controlled can prevent authentic sharing of feelings, hindering emotional closeness."],
      ["Critical Communication", "Occasionally harsh or overly direct remarks, though well-intended, might unintentionally wound others, damaging trust or closeness."],
      ["High Relationship Standards", "Your specific criteria for friendship or partnership can lead to lasting dissatisfaction or frustration if your expectations aren't consistently met."],
    ],
  },
];

export const proof = [
  { label: "Result", src: overview },
  { label: "Traits", src: traitsShot },
  ...areas.map(({ name, shot }) => ({ label: name, src: shot })),
];
