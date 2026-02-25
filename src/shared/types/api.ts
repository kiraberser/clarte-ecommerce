// ──────────────────────────────────────────────
// Respuestas estándar del backend Django
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

export interface PaginatedData<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ──────────────────────────────────────────────
// Producto (alineado con ProductoListSerializer / ProductoDetailSerializer)
// ──────────────────────────────────────────────

export interface Product {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  precio_oferta: number | null;
  precio_final: number;
  imagen_principal: string;
  categoria: number;
  categoria_nombre: string;
  en_stock: boolean;
  destacado: boolean;
}

interface ProductDimensions {
  alto?: string;
  ancho?: string;
  profundidad?: string;
  peso?: string;
}

export interface ProductDetail extends Product {
  descripcion: string;
  sku: string;
  imagenes: string[];
  categoria_slug: string;
  stock: number;
  dimensiones: ProductDimensions;
  detalles_tecnicos: Record<string, string>;
  materiales: string[];
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────────
// Categoría (alineado con CategoriaSerializer)
// ──────────────────────────────────────────────

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen: string | null;
  orden: number;
  productos_count: number;
}

// ──────────────────────────────────────────────
// Auth (alineado con JWT + UsuarioSerializer)
// ──────────────────────────────────────────────

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  rfc: string;
  direccion_completa: string;
  date_joined: string;
  is_staff: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// ──────────────────────────────────────────────
// Pedidos (alineado con PedidoSerializer / CrearPedidoSerializer)
// ──────────────────────────────────────────────

export interface OrderItem {
  id: number;
  producto: number;
  producto_nombre: string;
  producto_slug: string;
  producto_imagen: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Order {
  id: number;
  numero_pedido: string;
  estado: string;
  subtotal: number;
  descuento_monto: number;
  total: number;
  cupon_codigo: string | null;
  direccion_envio: string;
  ciudad: string;
  estado_envio: string;
  codigo_postal: string;
  metodo_pago: string;
  notas: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderListItem {
  id: number;
  numero_pedido: string;
  estado: string;
  total: number;
  items_count: number;
  created_at: string;
}

export interface CreateOrderData {
  direccion_envio: string;
  ciudad: string;
  estado_envio: string;
  codigo_postal: string;
  notas?: string;
  codigo_cupon?: string;
  items: { producto_id: number; cantidad: number }[];
  // Guest fields (required when unauthenticated):
  guest_nombre?: string;
  guest_email?: string;
  guest_telefono?: string;
}

export interface CuponValidation {
  valido: boolean;
  descuento_monto: number;
  mensaje: string;
}

// ──────────────────────────────────────────────
// Newsletter
// ──────────────────────────────────────────────

export interface NewsletterSubscription {
  id: number;
  email: string;
  created_at: string;
}

// ──────────────────────────────────────────────
// Admin Types
// ──────────────────────────────────────────────

export interface AdminProduct {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: string;
  precio_oferta: string | null;
  precio_final: number;
  sku: string;
  imagen_principal: string;
  imagenes: string[];
  categoria: number;
  categoria_nombre: string;
  categoria_slug: string;
  stock: number;
  en_stock: boolean;
  activo: boolean;
  destacado: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCategory {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen: string | null;
  activo: boolean;
  orden: number;
}

export interface Sale {
  id: number;
  numero_pedido: string;
  usuario_email: string;
  total: number;
  items_count: number;
  fecha_venta: string;
}

export interface SaleItem {
  id: number;
  producto: number | null;
  nombre_producto: string;
  sku: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface SaleItemSnapshot {
  nombre: string;
  sku: string;
  precio_unitario: string;
  cantidad: number;
  subtotal: string;
}

export interface SaleDetail extends Sale {
  usuario: number;
  items_snapshot: SaleItemSnapshot[];
  items: SaleItem[];
}

export interface SalesSummary {
  total_ventas: number;
  cantidad_ventas: number;
  ventas_por_dia: { dia: string; total: number; cantidad: number }[];
  ventas_por_mes: { mes: string; total: number; cantidad: number }[];
  producto_mas_vendido: {
    nombre_producto: string;
    sku: string;
    total_vendido: number;
    ingresos: number;
  } | null;
}

export type ContactEstado = "pendiente" | "leido" | "respondido";

export interface Contact {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
  estado: ContactEstado;
  created_at: string;
}

export interface NewsletterAdmin {
  id: number;
  email: string;
  activo: boolean;
  created_at: string;
}

export interface AdminOrder {
  id: number;
  numero_pedido: string;
  usuario_email: string;
  usuario_nombre: string;
  usuario_telefono: string;
  estado: string;
  subtotal: number;
  total: number;
  direccion_envio: string;
  ciudad: string;
  estado_envio: string;
  codigo_postal: string;
  metodo_pago: string;
  notas: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────────
// Pagos
// ──────────────────────────────────────────────

export interface PaymentResult {
  status: string;
  status_detail: string;
  pago_id: number;
}

export interface CardPaymentData {
  pedido_id: number;
  token: string;
  payment_method_id: string;
  issuer_id: string;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface AdminOrderListItem {
  id: number;
  numero_pedido: string;
  usuario_email: string;
  estado: string;
  total: number;
  items_count: number;
  created_at: string;
}

export interface AdminPayment {
  id: number;
  numero_pedido: string;
  usuario_email: string;
  mercadopago_preference_id: string | null;
  mercadopago_payment_id: string | null;
  estado: string;
  estado_display: string;
  estado_detalle: string;
  monto: number;
  metodo: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AdminCoupon {
  id: number;
  codigo: string;
  nombre: string;
  tipo_descuento: "porcentaje" | "monto_fijo";
  valor_descuento: string;
  minimo_compra: string;
  maximo_usos: number | null;
  usos_actuales: number;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
}

// ──────────────────────────────────────────────
// Reseñas
// ──────────────────────────────────────────────

export interface ProductReview {
  id: number;
  usuario_nombre: string;
  rating: number;
  comentario: string;
  created_at: string;
}

// ──────────────────────────────────────────────
// Lista de Deseos
// ──────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  producto: Product;
  created_at: string;
}
