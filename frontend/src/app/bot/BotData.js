export const BOT_NAME = "MacroBot";

export const botStyles = {
  page: {
    padding: 16,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerRight: {
    display: "flex",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  sub: {
    fontSize: 13,
    opacity: 0.8,
  },
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  messages: {
    flex: 1,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  bubble: {
    maxWidth: "85%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.10)",
    fontSize: 14,
    lineHeight: 1.35,
    whiteSpace: "pre-wrap",
  },
  botBubble: {
    alignSelf: "flex-start",
  },
  userBubble: {
    alignSelf: "flex-end",
  },
  bubbleLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
  },
  options: {
    padding: 12,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    borderTop: "1px solid rgba(0,0,0,0.12)",
  },
  optionBtn: {
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },
  footerHint: {
    fontSize: 12,
    opacity: 0.8,
  },
};


export function getOptionsForNode(node) {

  const root = [
    {
      key: "plan",
      label: "Help me plan meals",
      type: "say",
      reply: "Do you want to plan for today or the week?",
      next: "plan_when",
    },
    {
      key: "recipes",
      label: "Find a recipe",
      type: "say",
      reply: "What kind of recipe do you want?",
      next: "recipes_kind",
    },
    {
      key: "calories",
      label: "Explain calories",
      type: "say",
      reply:
        "Calories are energy. Want help with deficit, maintenance, or surplus?",
      next: "calories_mode",
    },
    {
      key: "goals",
      label: "Set a goal",
      type: "say",
      reply: "What’s your focus?",
      next: "goals_focus",
    },
    {
      key: "nav_calendar",
      label: "Go to Calendar",
      type: "route",
      to: "/calendar",
      reply: "Opening calendar.",
    },
    {
      key: "nav_settings",
      label: "Go to Settings",
      type: "route",
      to: "/settings",
      reply: "Opening settings.",
    },
  ];

  const plan_when = [
    {
      key: "plan_today",
      label: "Today",
      type: "say",
      reply:
        "Keep it simple: aim for 3 meals. Want high-protein or low-calorie?",
      next: "plan_style",
    },
    {
      key: "plan_week",
      label: "This week",
      type: "say",
      reply:
        "Weekly plan works best with repeat meals. Want 2-meal rotation or 3-meal rotation?",
      next: "plan_rotation",
    },
    { key: "back", label: "Back", type: "say", reply: "Going Back.", next: "root" },
  ];

  const plan_style = [
    {
      key: "hp",
      label: "High-protein",
      type: "say",
      reply:
        "Nice. Build around lean protein + carbs + veggies. Want me to send you to recipes?",
      next: "plan_send_to_recipes",
    },
    {
      key: "lc",
      label: "Low-calorie",
      type: "say",
      reply:
        "Low-calorie means volume: veggies + lean protein + light sauces. Want me to send you to recipes?",
      next: "plan_send_to_recipes",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "plan_when" },
  ];

  const plan_send_to_recipes = [
    {
      key: "yes_recipes",
      label: "Yes, recipes",
      type: "say",
      reply: "Ok. Pick a recipe style.",
      next: "recipes_kind",
    },
    {
      key: "no_calendar",
      label: "No, go to calendar",
      type: "route",
      to: "/calendar",
      reply: "Opening calendar so you can plan it out.",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "plan_style" },
  ];

  const plan_rotation = [
    {
      key: "rot2",
      label: "2-meal rotation",
      type: "say",
      reply:
        "Good for consistency. Pick two go-to meals and repeat. Want recipe ideas?",
      next: "recipes_kind",
    },
    {
      key: "rot3",
      label: "3-meal rotation",
      type: "say",
      reply:
        "Solid. Rotate 3 meals to avoid boredom. Want recipe ideas?",
      next: "recipes_kind",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "plan_when" },
  ];

  const recipes_kind = [
    {
      key: "quick",
      label: "Quick meals (15–25 min)",
      type: "say",
      reply:
        "Fetching Quick recipes ... ",
      next: "recipes_fetch",
    },
    {
      key: "hp",
      label: "High-protein",
      type: "say",
      reply:
        "Fetching a high protein recipe...",
      next: "recipes_fetch",
    },
    {
      key: "lc",
      label: "Low-calorie",
      type: "say",
      reply:
        "Fetching a low calorie recipe...",
      next: "recipes_fetch",
    },
    {
      key: "go_feed",
      label: "Go to Feed",
      type: "route",
      to: "/feed",
      reply: "Opening feed.",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "root" },
  ];

  const recipes_fetch = [
    {
      key: "fetch_yes",
      label: "Fetch your recipe",
      type: "action",
      reply:
        "Place holderm make syre to retrieve recipe from API.",
      next: "recipes_after_fetch",
    },
    {
      key: "fetch_no",
      label: "Not now",
      type: "say",
      reply: "No problem. Want to go to the feed or keep browsing options?",
      next: "recipes_after_fetch",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "recipes_kind" },
  ];

  const recipes_after_fetch = [
    {
      key: "to_feed",
      label: "Go to Feed",
      type: "route",
      to: "/feed",
      reply: "Opening feed.",
    },
    {
      key: "to_calendar",
      label: "Go to Calendar",
      type: "route",
      to: "/calendar",
      reply: "Opening calendar.",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "recipes_kind" },
  ];

  const calories_mode = [
    {
      key: "deficit",
      label: "Deficit",
      type: "say",
      reply:
        "Deficit = eating less than you burn. Start with smaller portions + high protein.",
      next: "calories_next",
    },
    {
      key: "maintain",
      label: "Maintenance",
      type: "say",
      reply:
        "Maintenance = stable weight. Keep protein decent and track average intake.",
      next: "calories_next",
    },
    {
      key: "surplus",
      label: "Surplus (gain muscle)",
      type: "say",
      reply:
        "Surplus = eating more than you burn. Add calories slowly so you don’t just gain fat.",
      next: "calories_next",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "root" },
  ];

  const calories_next = [
    {
      key: "to_settings",
      label: "Adjust goals in Settings",
      type: "route",
      to: "/settings",
      reply: "Opening settings so you can update targets.",
    },
    {
      key: "to_calendar",
      label: "Plan it in Calendar",
      type: "route",
      to: "/calendar",
      reply: "Opening calendar.",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "calories_mode" },
  ];

  const goals_focus = [
    {
      key: "lose",
      label: "Lose fat",
      type: "say",
      reply:
        "Lose fat: prioritize protein, steps, and a consistent deficit.",
      next: "goals_next",
    },
    {
      key: "maintain",
      label: "Maintain",
      type: "say",
      reply:
        "Maintain: keep training and keep intake consistent across the week.",
      next: "goals_next",
    },
    {
      key: "gain",
      label: "Gain muscle",
      type: "say",
      reply:
        "Gain muscle: progressive overload + enough protein + small surplus.",
      next: "goals_next",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "root" },
  ];

  const goals_next = [
    {
      key: "settings",
      label: "Go update my settings",
      type: "route",
      to: "/settings",
      reply: "Opening settings.",
    },
    {
      key: "recipes",
      label: "Show me recipes",
      type: "say",
      reply: "Pick a recipe style.",
      next: "recipes_kind",
    },
    { key: "back", label: "Back", type: "say", reply: "Back.", next: "goals_focus" },
  ];

  const table = {
    root,
    plan_when,
    plan_style,
    plan_rotation,
    plan_send_to_recipes,
    recipes_kind,
    recipes_fetch,
    recipes_after_fetch,
    calories_mode,
    calories_next,
    goals_focus,
    goals_next,
  };

  return table[node] ?? root;
}