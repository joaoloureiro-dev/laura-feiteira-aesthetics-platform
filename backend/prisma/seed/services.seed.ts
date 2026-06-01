/**
 * Initial service catalog for Laura Feiteira Estética.
 *
 * This file contains the real services provided by Laura.
 * We keep seed data separated from the main seed runner to keep the project organized.
 *
 * Prices are stored in cents:
 * 50€ = 5000
 * 35€ = 3500
 *
 * When a price is variable, such as "Desde 50€" or "sujeito a avaliação",
 * we use priceLabel instead of only priceCents.
 */

export type ServiceSeedOption = {
  name: string
  description?: string
  priceCents?: number
  priceLabel?: string
  durationMinutes?: number
}

export type ServiceSeed = {
  name: string
  slug: string
  description?: string
  evaluationRequirement: "OPTIONAL" | "REQUIRED" | "NOT_REQUIRED"
  options: ServiceSeedOption[]
}

export type ServiceCategorySeed = {
  name: string
  slug: string
  description?: string
  services: ServiceSeed[]
}

/**
 * Real initial service catalog.
 *
 * Later, the owner dashboard will allow Laura to edit these services,
 * prices, descriptions and promotions directly from the application.
 */
export const serviceCategoriesSeed: ServiceCategorySeed[] = [
  {
    name: "Tratamentos Faciais",
    slug: "tratamentos-faciais",
    description:
      "Tratamentos focados no cuidado, limpeza, textura, manchas e rejuvenescimento da pele.",
    services: [
      {
        name: "Limpeza de Pele",
        slug: "limpeza-de-pele",
        description:
          "Tratamento facial para limpeza, renovação e melhoria da aparência da pele.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Limpeza de Pele Básica",
            priceCents: 5000,
            durationMinutes: 60,
          },
          {
            name: "Limpeza de Pele Completa",
            priceCents: 6000,
            durationMinutes: 75,
          },
        ],
      },
      {
        name: "Tratamento de Rugas",
        slug: "tratamento-de-rugas",
        description:
          "Tratamento estético indicado para melhorar a aparência de rugas e sinais de envelhecimento.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 4500,
            durationMinutes: 60,
          },
        ],
      },
      {
        name: "Tratamento de Manchas",
        slug: "tratamento-de-manchas",
        description:
          "Tratamento indicado para manchas no rosto ou nas mãos, dependendo da necessidade da cliente.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Rosto",
            priceCents: 5000,
            durationMinutes: 60,
          },
          {
            name: "Mãos",
            priceCents: 4000,
            durationMinutes: 45,
          },
        ],
      },
    ],
  },
  {
    name: "Tratamentos Corporais",
    slug: "tratamentos-corporais",
    description:
      "Tratamentos corporais para gordura localizada, drenagem, flacidez, estrias e recuperação pós-operatória.",
    services: [
      {
        name: "Redução de Gordura Localizada",
        slug: "reducao-de-gordura-localizada",
        description:
          "Combinação de radiofrequência, cavitação e eletroestimulação para cuidado corporal localizado.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            description: "Radiofrequência + Cavitação + Eletroestimulação",
            priceCents: 4000,
            durationMinutes: 60,
          },
        ],
      },
      {
        name: "Criolipólise",
        slug: "criolipolise",
        description:
          "Tratamento corporal indicado para gordura localizada através de tecnologia de frio controlado.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 7500,
            durationMinutes: 75,
          },
        ],
      },
      {
        name: "Protocolo Corporal Completo",
        slug: "protocolo-corporal-completo",
        description:
          "Protocolo completo com duplo congelamento, cavitação e eletroestimulação.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão completa",
            description: "Duplo Congelamento + Cavitação + Eletroestimulação",
            priceCents: 25000,
            durationMinutes: 120,
          },
        ],
      },
      {
        name: "Mesoterapia Corporal + Eletroestimulação",
        slug: "mesoterapia-corporal-eletroestimulacao",
        description:
          "Tratamento corporal combinado com mesoterapia e eletroestimulação.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 4000,
            durationMinutes: 60,
          },
        ],
      },
      {
        name: "Drenagem Linfática",
        slug: "drenagem-linfatica",
        description:
          "Massagem estética indicada para retenção de líquidos, sensação de leveza e bem-estar.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Por zona",
            priceCents: 3500,
            durationMinutes: 45,
          },
          {
            name: "Pack 10 sessões",
            priceCents: 30000,
            durationMinutes: 45,
          },
        ],
      },
      {
        name: "Drenagem Pós-Operatória",
        slug: "drenagem-pos-operatoria",
        description:
          "Drenagem indicada para acompanhamento pós-operatório, conforme avaliação da necessidade da cliente.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Por zona",
            priceCents: 4000,
            durationMinutes: 45,
          },
          {
            name: "Pack 10 sessões",
            priceCents: 37000,
            durationMinutes: 45,
          },
        ],
      },
      {
        name: "Tratamento de Flacidez",
        slug: "tratamento-de-flacidez",
        description:
          "Tratamento indicado para melhorar firmeza e aparência da pele em zonas específicas.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Rosto",
            priceCents: 5000,
            durationMinutes: 60,
          },
          {
            name: "Abdómen",
            priceCents: 6000,
            durationMinutes: 60,
          },
        ],
      },
      {
        name: "Lipo de Papada",
        slug: "lipo-de-papada",
        description:
          "Tratamento estético focado na zona da papada.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 3500,
            durationMinutes: 45,
          },
        ],
      },
      {
        name: "Tratamento de Estrias",
        slug: "tratamento-de-estrias",
        description:
          "Tratamento indicado para melhorar a aparência de estrias.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 4500,
            durationMinutes: 60,
          },
        ],
      },
      {
        name: "Tratamento de Manchas Corporais",
        slug: "tratamento-de-manchas-corporais",
        description:
          "Tratamento de manchas em zonas corporais específicas.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Virilhas",
            priceCents: 3500,
            durationMinutes: 45,
          },
          {
            name: "Axilas",
            priceCents: 3500,
            durationMinutes: 45,
          },
          {
            name: "Joelhos",
            priceCents: 3500,
            durationMinutes: 45,
          },
        ],
      },
    ],
  },
  {
    name: "Remoção de Tatuagens",
    slug: "remocao-de-tatuagens",
    description:
      "Remoção de tatuagens com Laser Nd:YAG, com valor sujeito a avaliação.",
    services: [
      {
        name: "Laser Nd:YAG",
        slug: "laser-nd-yag",
        description:
          "Remoção de tatuagem com valor dependente do tamanho e complexidade.",
        evaluationRequirement: "REQUIRED",
        options: [
          {
            name: "Remoção de tatuagem",
            priceLabel: "Desde 50€",
            durationMinutes: 60,
          },
        ],
      },
    ],
  },
  {
    name: "Depilação a Laser Tripla Onda",
    slug: "depilacao-laser-tripla-onda",
    description:
      "Depilação a laser tripla onda para mulher e homem, com zonas individuais e packs.",
    services: [
      {
        name: "Depilação a Laser Mulher",
        slug: "depilacao-laser-mulher",
        description:
          "Zonas individuais e packs de depilação a laser para mulher.",
        evaluationRequirement: "OPTIONAL",
        options: [
          { name: "Rosto", priceCents: 2000, durationMinutes: 30 },
          { name: "Queixo", priceCents: 1000, durationMinutes: 20 },
          { name: "Buço", priceCents: 1000, durationMinutes: 20 },
          { name: "Axilas", priceCents: 1500, durationMinutes: 20 },
          { name: "Braço Completo", priceCents: 1500, durationMinutes: 40 },
          { name: "Meio Braço", priceCents: 1000, durationMinutes: 30 },
          { name: "Mamilos", priceCents: 1000, durationMinutes: 20 },
          { name: "Abdómen", priceCents: 1500, durationMinutes: 30 },
          { name: "Linha Alba", priceCents: 1000, durationMinutes: 20 },
          { name: "Virilha Total", priceCents: 2000, durationMinutes: 30 },
          { name: "Virilha Cavada", priceCents: 1500, durationMinutes: 30 },
          { name: "Perianal", priceCents: 1000, durationMinutes: 20 },
          { name: "Perna Completa", priceCents: 3000, durationMinutes: 60 },
          { name: "Meia Perna", priceCents: 2000, durationMinutes: 40 },
          { name: "Pack Buço + Queixo", priceCents: 2000, durationMinutes: 30 },
          { name: "Pack Virilhas + Axilas", priceCents: 2500, durationMinutes: 40 },
          { name: "Pack Meia Perna + Axilas", priceCents: 3500, durationMinutes: 60 },
          { name: "Pack Perna Completa + Axilas", priceCents: 4000, durationMinutes: 75 },
          {
            name: "Pack Corpo Todo",
            description: "Pernas Completas + Virilhas + Axilas + Buço",
            priceCents: 5000,
            durationMinutes: 90,
          },
          {
            name: "Pack Corpo Todo + Braços",
            priceCents: 5500,
            durationMinutes: 105,
          },
        ],
      },
      {
        name: "Depilação a Laser Homem",
        slug: "depilacao-laser-homem",
        description:
          "Zonas individuais e packs de depilação a laser para homem.",
        evaluationRequirement: "OPTIONAL",
        options: [
          { name: "Rosto", priceCents: 2500, durationMinutes: 30 },
          { name: "Axilas", priceCents: 2000, durationMinutes: 20 },
          { name: "Peito", priceCents: 2000, durationMinutes: 30 },
          { name: "Abdómen", priceCents: 2000, durationMinutes: 30 },
          { name: "Costas", priceCents: 3000, durationMinutes: 45 },
          { name: "Braço Completo", priceCents: 3500, durationMinutes: 45 },
          { name: "Meio Braço", priceCents: 2500, durationMinutes: 35 },
          { name: "Perna Completa", priceCents: 4000, durationMinutes: 75 },
          { name: "Meia Perna", priceCents: 3000, durationMinutes: 50 },
          { name: "Pack Barba + Axilas", priceCents: 3000, durationMinutes: 45 },
          {
            name: "Pack Abdómen + Peito + Axilas",
            priceCents: 4000,
            durationMinutes: 60,
          },
          {
            name: "Pack Abdómen + Peito + Axilas + Costas",
            priceCents: 5000,
            durationMinutes: 90,
          },
          {
            name: "Pack Abdómen + Peito + Axilas + Pernas Completas",
            priceCents: 5000,
            durationMinutes: 105,
          },
        ],
      },
    ],
  },
  {
    name: "Formações Profissionais",
    slug: "formacoes-profissionais",
    description:
      "Formações profissionais em tratamentos estéticos especializados.",
    services: [
      {
        name: "Formações Profissionais",
        slug: "formacoes-profissionais-estetica",
        description:
          "Formação em Microagulhamento, Jato Plasma, Laser Nd:YAG e Mesoterapia Pressurizada.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Formação",
            description:
              "Microagulhamento, Jato Plasma, Laser Nd:YAG e Mesoterapia Pressurizada",
            priceCents: 35000,
            durationMinutes: 240,
          },
        ],
      },
    ],
  },
  {
    name: "Remoção de Sinais, Verrugas e Sardas",
    slug: "remocao-sinais-verrugas-sardas",
    description:
      "Tratamentos especializados para remoção estética de sinais, verrugas, sardas e pontos.",
    services: [
      {
        name: "Remoção de Sinais e Verrugas",
        slug: "remocao-de-sinais-e-verrugas",
        description:
          "Remoção de sinais e verrugas, com preço para 1 a 3 unidades.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "1 a 3 sinais ou verrugas",
            priceCents: 5000,
            durationMinutes: 45,
          },
        ],
      },
      {
        name: "Remoção de Sardas e Sinais de Pontos",
        slug: "remocao-de-sardas-e-sinais-de-pontos",
        description:
          "Tratamento por zona para remoção estética de sardas e sinais de pontos.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Por zona",
            priceCents: 5000,
            durationMinutes: 45,
          },
        ],
      },
    ],
  },
  {
    name: "Remoção de Sobrancelhas",
    slug: "remocao-de-sobrancelhas",
    description:
      "Tratamento de remoção de sobrancelhas.",
    services: [
      {
        name: "Remoção de Sobrancelhas",
        slug: "remocao-de-sobrancelhas",
        description:
          "Serviço de remoção de sobrancelhas.",
        evaluationRequirement: "OPTIONAL",
        options: [
          {
            name: "Sessão",
            priceCents: 6500,
            durationMinutes: 60,
          },
        ],
      },
    ],
  },
]