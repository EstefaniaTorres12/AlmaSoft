const PLAN_VISUALS = {
  basico: {
    image: "/img/plan1.png",
    badge: "Inicio protegido",
    accent: "amethyst",
    summary: "Cobertura serena para decisiones esenciales con acompanamiento claro.",
  },
  estandar: {
    image: "/img/plan2.png",
    badge: "Equilibrio familiar",
    accent: "orchid",
    summary: "Una opcion balanceada con servicios pensados para la familia.",
  },
  premium: {
    image: "/img/plan3.png",
    badge: "Atencion preferente",
    accent: "violet",
    summary: "Mayor respaldo, detalles adicionales y experiencia mas completa.",
  },
  vip: {
    image: "/img/3302177.jpg",
    badge: "Cobertura superior",
    accent: "royal",
    summary: "La experiencia mas completa para acompanamiento, ceremonia y gestion.",
  },
  default: {
    image: "/img/logoAS.png",
    badge: "Plan disponible",
    accent: "amethyst",
    summary: "Cobertura disponible para el cliente con presentacion personalizada.",
  },
};

function normalizePlanKey(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getPlanVisual(plan) {
  const nameKey = normalizePlanKey(plan?.plan_nombre);
  return PLAN_VISUALS[nameKey] || PLAN_VISUALS.default;
}

export function getPlanImage(plan) {
  return getPlanVisual(plan).image;
}
