/**
 * Editable story content for the scroll scene.
 * Texts are demo copy — replace freely; timings are scroll-progress fractions (0..1).
 */
export interface StoryStep {
  id: string
  /** Scroll progress at which the block starts appearing (0..1). */
  start: number
  /** Scroll progress at which the block is fully gone (0..1). */
  end: number
  eyebrow: string
  title: string
  text: string
  align: 'left' | 'right'
  /** Adds a gentle proximity scroll-snap anchor at this step's sweet spot. */
  snap?: boolean
  variant?: 'message' | 'reviews' | 'final'
  reviews?: Array<{ quote: string; author: string; meta: string }>
  cta?: { label: string; href: string }
}

export const storySteps: StoryStep[] = [
  {
    id: 'intro',
    start: 0.0,
    end: 0.18,
    eyebrow: 'LAVADERO DE ROPA · MONTEVIDEO',
    title: 'La Jefa',
    text: 'Tu ropa, fresca. Tu día, más liviano.',
    align: 'left',
    variant: 'message',
  },
  {
    id: 'detail',
    snap: true,
    start: 0.19,
    end: 0.36,
    eyebrow: 'UN GIRO SUAVE',
    title: 'Burbujas adentro. Aire fresco afuera.',
    text: 'Nos ocupamos de tu ropa para que vos sigas con tu día.',
    align: 'right',
    variant: 'message',
  },
  {
    id: 'proof',
    snap: true,
    start: 0.37,
    end: 0.52,
    eyebrow: 'SIN VUELTAS',
    title: 'Lavamos. Secamos. Vos respirás.',
    text: 'Una pausa para tu ropa, un poco más de tiempo para vos.',
    align: 'left',
    variant: 'message',
  },
  {
    id: 'reviews',
    snap: true,
    start: 0.51,
    end: 0.82,
    eyebrow: '',
    title: '',
    text: '',
    align: 'left',
    variant: 'reviews',
    reviews: [
      {
        quote:
          '«El mejor perfume de todas las lavanderías en tu ropa, y encima doblado y secado a un buen precio. Son los mejores.»',
        author: 'Martín',
        meta: 'Reseña en Google',
      },
      {
        quote:
          '«Soy cliente desde hace 1 año, y todas las semanas dejo algo para lavar. Generalmente me atiende Vanina (una genia) o su madre.»',
        author: 'Camila',
        meta: 'Reseña en Google · 4,2 ★ (14)',
      },
    ],
  },
  {
    id: 'final',
    snap: true,
    start: 0.84,
    end: 1,
    eyebrow: 'LA JEFA',
    title: 'Gracias.',
    text: 'Tu ropa queda en buenas manos.',
    align: 'right',
    variant: 'final',
  },
]
