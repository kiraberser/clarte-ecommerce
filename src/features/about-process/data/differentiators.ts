export interface DifferentiatorBlock {
  heading: string;
  body: string;
}

export interface Differentiator {
  slug: string;
  /* Small uppercase category shown at the top of the card */
  label: string;
  /* Card / page title */
  title: string;
  /* One-line summary shown on the card */
  summary: string;
  /* Lead paragraph at the top of the detail page */
  intro: string;
  /* Tailwind gradient classes for the card + page hero background */
  gradient: string;
  /* Whether to show the "renovable" eco badge */
  ecoBadge?: boolean;
  /* Long-form sections explaining the topic */
  blocks: DifferentiatorBlock[];
  /* Short bullet highlights */
  highlights: string[];
}

export const differentiators: Differentiator[] = [
  {
    slug: "diseno-3d",
    label: "Objetivo",
    title: "Diseño 3D",
    summary:
      "Cada lámpara nace como un modelo digital, donde perfeccionamos cada curva hasta lograr la pieza ideal.",
    intro:
      "Todo empieza en la pantalla. Antes de imprimir una sola capa, modelamos cada lámpara en 3D para explorar formas, proporciones y juegos de luz imposibles de lograr con la fabricación tradicional.",
    gradient: "from-forest via-forest/90 to-sage",
    blocks: [
      {
        heading: "Del boceto al modelo",
        body: "Cada idea comienza como un dibujo a mano que luego trasladamos a un modelo paramétrico. Esto nos permite ajustar milímetro a milímetro la curvatura de la pantalla, el grosor de las paredes y la forma en que la luz se filtra a través de la pieza.",
      },
      {
        heading: "Iteración sin desperdicio",
        body: "Probar una variante no cuesta material: ajustamos el modelo digital tantas veces como haga falta hasta que la proporción es perfecta. Solo cuando estamos convencidos del diseño pasamos a la fabricación física.",
      },
      {
        heading: "Geometrías imposibles",
        body: "El diseño 3D nos libera de las limitaciones de los moldes. Podemos crear patrones calados, texturas orgánicas y estructuras huecas que proyectan sombras únicas en tu espacio.",
      },
    ],
    highlights: [
      "Modelado paramétrico de precisión",
      "Iteración digital sin desperdicio de material",
      "Formas y texturas imposibles con moldes tradicionales",
    ],
  },
  {
    slug: "tecnologia-3d",
    label: "Fabricación",
    title: "Tecnología 3D",
    summary:
      "Impresión en PLA con precisión milimétrica, capa por capa, para materializar cada diseño.",
    intro:
      "Una vez perfeccionado el modelo digital, nuestras impresoras dan vida a la pieza capa por capa. La impresión 3D nos permite fabricar bajo demanda, con una precisión que respeta cada detalle del diseño original.",
    gradient: "from-sunset via-sunset/85 to-[hsl(24_60%_38%)]",
    ecoBadge: true,
    blocks: [
      {
        heading: "Precisión capa por capa",
        body: "Cada lámpara se construye depositando finísimas capas de PLA fundido. Este proceso aditivo reproduce con exactitud la geometría del modelo digital, incluyendo los detalles más delicados.",
      },
      {
        heading: "Fabricación bajo demanda",
        body: "No producimos en masa ni acumulamos inventario. Imprimimos cada pieza cuando se necesita, lo que reduce el desperdicio y nos permite ofrecer personalizaciones que la producción industrial no contempla.",
      },
      {
        heading: "Calidad consistente",
        body: "El control digital del proceso garantiza que cada unidad cumpla los mismos estándares. La tecnología asegura la base; las manos artesanas aportan el carácter final.",
      },
    ],
    highlights: [
      "Impresión aditiva de alta precisión",
      "Producción bajo demanda, sin inventario muerto",
      "Calidad consistente en cada pieza",
    ],
  },
  {
    slug: "material-sustentable",
    label: "Material",
    title: "Material Sustentable",
    summary:
      "PLA derivado de recursos renovables y acabado artesanal a mano que hace única cada pieza.",
    intro:
      "Creemos que la belleza no debe costarle al planeta. Por eso fabricamos con PLA, un bioplástico derivado de recursos vegetales renovables, y rematamos cada lámpara con un acabado hecho a mano.",
    gradient: "from-sage via-sage/85 to-forest",
    blocks: [
      {
        heading: "PLA de origen renovable",
        body: "El PLA (ácido poliláctico) se obtiene a partir de recursos vegetales como el maíz, en lugar de derivados del petróleo. Es un material de origen renovable que reduce la huella de carbono de cada pieza.",
      },
      {
        heading: "Acabado artesanal",
        body: "Cuando la impresión termina, empieza el trabajo de las manos. Lijamos, pulimos y damos el acabado final a cada lámpara, otorgándole ese carácter imperfectamente perfecto que ninguna máquina puede replicar.",
      },
      {
        heading: "Hecho para durar",
        body: "Una pieza sostenible también es una pieza que dura. Diseñamos lámparas pensadas para acompañarte durante años, no para ser reemplazadas con la próxima tendencia.",
      },
    ],
    highlights: [
      "Bioplástico PLA de origen vegetal renovable",
      "Acabado pulido a mano, pieza por pieza",
      "Diseño duradero, pensado para acompañarte años",
    ],
  },
];

export function getDifferentiator(slug: string): Differentiator | undefined {
  return differentiators.find((d) => d.slug === slug);
}
