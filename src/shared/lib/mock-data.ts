export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "María García",
    rating: 5,
    text: "La calidad de impresión es impecable. No puedo creer que esté hecha en PLA, parece una pieza de diseñador de alta gama.",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    rating: 5,
    text: "El diseño 3D permite formas que no encuentras en ninguna otra tienda. Mi lámpara Orion es la favorita de todos los que visitan.",
  },
  {
    id: "3",
    name: "Ana Martínez",
    rating: 4,
    text: "Excelente acabado artesanal. Se nota el cuidado en cada detalle. Además, saber que es producción sostenible me da tranquilidad.",
  },
  {
    id: "4",
    name: "Luis Fernández",
    rating: 5,
    text: "Compré la Arc Minimal y superó mis expectativas. El proceso de diseño 3D permite una precisión increíble.",
  },
  {
    id: "5",
    name: "Sofía López",
    rating: 5,
    text: "Clarté combina tecnología y arte de una forma única. Cada lámpara es literalmente una obra de arte funcional.",
  },
  {
    id: "6",
    name: "Diego Hernández",
    rating: 4,
    text: "El envío fue rápido y la lámpara llegó perfectamente empacada. El PLA es mucho más resistente de lo que esperaba.",
  },
];
