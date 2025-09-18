
export const COUNTRIES = [
  "Estados Unidos",
  "China",
  "Alemanha",
  "Brasil",
  "Japão",
  "Reino Unido",
  "França",
  "Itália",
  "Canadá",
  "Coreia do Sul",
  "México",
  "Argentina",
  "Chile",
  "Colômbia",
  "Peru"
] as const;

export type Country = typeof COUNTRIES[number];
