import { defineRelations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────────────────────
// pgEnum en lugar de varchar: tipado fuerte en TS, validación en DB,
// y las queries EXPLAIN son más legibles. Si en el futuro hay que añadir
// un valor, basta con extender el array y generar una nueva migración.

export const nivelCursoEnum = pgEnum("nivel_curso", [
  "principiante",
  "intermedio",
  "avanzado",
]);

export const estadoMaestroEnum = pgEnum("estado_maestro", [
  "activo",
  "pendiente",
  "suspendido",
]);

export const estadoMatriculaEnum = pgEnum("estado_matricula", [
  "activa",
  "completada",
  "cancelada",
  "expirada",
]);

export const estadoPagoEnum = pgEnum("estado_pago", [
  "pendiente",
  "completado",
  "fallido",
  "reembolsado",
]);

export const tipoPagoEnum = pgEnum("tipo_pago", [
  "tarjeta",
  "paypal",
  "transferencia",
  "oxxo",
]);

export const tipoMetodoPagoEnum = pgEnum("tipo_metodo_pago", [
  "tarjeta",
  "paypal",
  "transferencia",
]);

export const tipoLeccionEnum = pgEnum("tipo_leccion", [
  "video",
  "texto",
  "quiz",
  "proyecto",
]);

// Pasarela y marca de tarjeta quedan como varchar porque el ecosistema
// crece sin control (nuevas pasarelas, redes de tarjetas). En pgEnum
// añadir un valor requiere migración de tipo ALTER TYPE.
const PASARELAS_PAGO = [
  "stripe",
  "paypal",
  "mercadopago",
  "manual",
] as const;
const MARCAS_TARJETA = [
  "visa",
  "mastercard",
  "amex",
  "carnet",
  "oxxo",
] as const;

// ─── Columnas base ──────────────────────────────────────────────────────────
// Regla del proyecto: TODA tabla lleva id uuid, los tres timestamps de
// auditoría y un soft-delete via `eliminado`. `modificado` se mantiene
// al día con un trigger de Postgres (ver migración generada) — así no
// dependemos de que el código de aplicación se acuerde de actualizarlo.

const baseColumns = {
  id: uuid()
    .primaryKey()
    .defaultRandom(),
  creado: timestamp({ withTimezone: true, mode: "date" })
    
    .defaultNow(),
  modificado: timestamp({ withTimezone: true, mode: "date" })
    
    .defaultNow(),
  eliminado: timestamp({ withTimezone: true, mode: "date" }),
};

// ─── usuario ────────────────────────────────────────────────────────────────
// Estudiantes / compradores. Se mantienen como entidad separada del
// `maestro` para poder modelar instructores con cuentas propias que
// quizá no consumen cursos, y para no contaminar la tabla de usuarios
// con campos específicos de publicación (verificado, especialidad…).

export const usuario = pgTable(
  "Usuario",
  {
    ...baseColumns,
    nombre: text(),
    apellido: text(),
    email: text(),
    emailVerificado: boolean().default(false),
    // Hash Argon2/scrypt/lo que elijas. Si el usuario llega solo por
    // OAuth, este campo queda NULL y se usa `proveedorOAuth` en su lugar.
    passwordHash: text(),
    // Para OAuth (Google, GitHub…). Combinación única por pasarela.
    proveedorOAuth: text(),
    proveedorOAuthId: text(),
    avatarUrl: text(),
    biografia: text(),
    // Apunta al método de pago marcado como `esDefault` en su tabla.
    // Queda NULL mientras el usuario no haya guardado una tarjeta.
    metodoPagoDefaultId: uuid(),
    ultimoLogin: timestamp({ withTimezone: true, mode: "date" }),
  },
  (table) => [
    // Email único solo entre filas activas. Si el usuario es soft-deleted
    // (eliminado IS NOT NULL) se libera el email y puede registrarse uno
    // nuevo. Drizzle soporta índices parciales vía `.where()`.
    uniqueIndex("usuario_email_unico_activo")
      .on(table.email)
      .where(sql`${table.eliminado} IS NULL`),
    uniqueIndex("usuario_proveedor_oauth_unico")
      .on(table.proveedorOAuth, table.proveedorOAuthId)
      .where(sql`${table.proveedorOAuth} IS NOT NULL`),
    index("usuario_ultimo_login_idx").on(table.ultimoLogin),
  ],
);

// ─── maestro ────────────────────────────────────────────────────────────────
// Instructor / autor de cursos. Entidad propia con login propio: un
// maestro no tiene por qué ser un `usuario` que compra cursos, y un
// usuario no tiene por qué tener permisos para publicar.

export const maestro = pgTable(
  "Maestro",
  {
    ...baseColumns,
    nombre: text(),
    apellido: text(),
    email: text(),
    emailVerificado: boolean().default(false),
    passwordHash: text(),
    proveedorOAuth: text(),
    proveedorOAuthId: text(),
    avatarUrl: text(),
    biografia: text(),
    especialidad: text(),
    // Pasado por el equipo editorial antes de poder publicar cursos.
    verificado: boolean().default(false),
    estado: estadoMaestroEnum().default("pendiente"),
    ultimoLogin: timestamp({ withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("maestro_email_unico_activo")
      .on(table.email)
      .where(sql`${table.eliminado} IS NULL`),
    uniqueIndex("maestro_proveedor_oauth_unico")
      .on(table.proveedorOAuth, table.proveedorOAuthId)
      .where(sql`${table.proveedorOAuth} IS NOT NULL`),
    index("maestro_estado_idx").on(table.estado),
  ],
);

// ─── curso_categoria ────────────────────────────────────────────────────────
// Categoría de primer nivel (Ingeniería, Diseño, Datos, Producto…).
// PascalCase con prefijo `Curso` — el prefijo deja la puerta abierta a
// otros espacios de clasificación (categorías de instructores, de posts,
// etc.) sin chocar de nombre.

export const cursoCategoria = pgTable(
  "CursoCategoria",
  {
    ...baseColumns,
    nombre: text(),
    slug: text(),
    descripcion: text(),
    iconoUrl: text(),
    orden: integer().default(0),
  },
  (table) => [
    uniqueIndex("curso_categoria_slug_unico_activo")
      .on(table.slug)
      .where(sql`${table.eliminado} IS NULL`),
    index("curso_categoria_orden_idx").on(table.orden),
  ],
);

// ─── curso_subcategoria ─────────────────────────────────────────────────────

export const cursoSubcategoria = pgTable(
  "CursoSubcategoria",
  {
    ...baseColumns,
    nombre: text(),
    slug: text(),
    descripcion: text(),
    cursoCategoriaId: uuid()
      
      .references(() => cursoCategoria.id, { onDelete: "restrict" }),
    orden: integer().default(0),
  },
  (table) => [
    // Slug único dentro de cada categoría. Dos categorías distintas
    // pueden tener subcategorías con el mismo slug.
    uniqueIndex("curso_subcategoria_slug_categoria_unico")
      .on(table.cursoCategoriaId, table.slug)
      .where(sql`${table.eliminado} IS NULL`),
    index("curso_subcategoria_categoria_idx").on(table.cursoCategoriaId),
  ],
);

// ─── curso ──────────────────────────────────────────────────────────────────
// Producto. Lleva campos denormalizados (calificacion, numeroResenas,
// numeroEstudiantes) que se actualizan con triggers al insertar/modificar
// resenas y matriculas — evitan un COUNT/AVG en cada query de catálogo.

export const curso = pgTable(
  "Curso",
  {
    ...baseColumns,
    // El slug va en la URL (/cursos/[slug]), por eso único.
    slug: text(),
    titulo: text(),
    descripcion: text(),
    descripcionCorta: text(),
    imagenPortadaUrl: text(),
    // Dinero siempre en enteros. Un float pierde centavos al sumar.
    precioCentavos: integer().default(0),
    // Precio con descuento (opcional). Si es NULL, el vigente es
    // `precioCentavos`. La UI usa COALESCE(precioActualCentavos, precioCentavos).
    precioActualCentavos: integer(),
    moneda: text().default("MXN"),
    publicado: boolean().default(false),
    // Promedio denormalizado de resenas. 0.0–5.0 con un decimal.
    calificacion: numeric({ precision: 2, scale: 1 }).default("0.0"),
    numeroResenas: integer().default(0),
    numeroEstudiantes: integer().default(0),
    duracionMinutos: integer().default(0),
    nivel: nivelCursoEnum().default("principiante"),
    idioma: text().default("es"),
    maestroId: uuid()
      
      .references(() => maestro.id, { onDelete: "restrict" }),
    cursoSubcategoriaId: uuid()
      
      .references(() => cursoSubcategoria.id, { onDelete: "restrict" }),
  },
  (table) => [
    uniqueIndex("curso_slug_unico_activo")
      .on(table.slug)
      .where(sql`${table.eliminado} IS NULL`),
    index("curso_publicado_creado_idx").on(table.publicado, table.creado),
    index("curso_maestro_idx").on(table.maestroId),
    index("curso_subcategoria_idx").on(table.cursoSubcategoriaId),
    check(
      "curso_precio_no_negativo",
      sql`${table.precioCentavos} >= 0 AND (${table.precioActualCentavos} IS NULL OR ${table.precioActualCentavos} >= 0)`,
    ),
    check(
      "curso_calificacion_rango",
      sql`${table.calificacion} >= 0 AND ${table.calificacion} <= 5`,
    ),
  ],
);

// ─── resena ─────────────────────────────────────────────────────────────────
// Reseña que un usuario deja en un curso. El usuario pidió el campo
// `idusuario` explícito: respetamos el snake_case exacto para que el
// nombre de la columna en Postgres coincida con el de la API esperada.

export const resena = pgTable(
  "Resena",
  {
    ...baseColumns,
    idusuario: uuid()
      
      .references(() => usuario.id, { onDelete: "cascade" }),
    idcurso: uuid()
      
      .references(() => curso.id, { onDelete: "cascade" }),
    calificacion: integer(),
    comentario: text(),
    // Moderación editorial. Las reseñas con aprobado=false no se
    // cuentan en el promedio ni se muestran públicamente.
    aprobado: boolean().default(true),
  },
  (table) => [
    // Un usuario solo puede reseñar un curso una vez.
    uniqueIndex("resena_usuario_curso_unico")
      .on(table.idusuario, table.idcurso)
      .where(sql`${table.eliminado} IS NULL`),
    index("resena_curso_idx").on(table.idcurso),
    check(
      "resena_calificacion_rango",
      sql`${table.calificacion} BETWEEN 1 AND 5`,
    ),
  ],
);

// ─── matricula ──────────────────────────────────────────────────────────────
// Une un usuario con un curso. Es la pieza que da sentido a la plataforma:
// sin matrícula no hay "mis cursos", ni progreso, ni certificados.
// Precio pagado denormalizado: si el curso cambia de precio mañana,
// las matrículas viejas mantienen el histórico.

export const matricula = pgTable(
  "Matricula",
  {
    ...baseColumns,
    idusuario: uuid()
      
      .references(() => usuario.id, { onDelete: "cascade" }),
    idcurso: uuid()
      
      .references(() => curso.id, { onDelete: "restrict" }),
    precioPagadoCentavos: integer(),
    moneda: text().default("MXN"),
    progreso: numeric({ precision: 5, scale: 2 }).default("0.00"),
    completado: boolean().default(false),
    fechaCompletado: timestamp({ withTimezone: true, mode: "date" }),
    certificadoUrl: text(),
    estado: estadoMatriculaEnum().default("activa"),
  },
  (table) => [
    // Una sola matrícula activa por (usuario, curso). Borrar y volver
    // a comprar requiere cancelar la anterior, no duplicar filas.
    uniqueIndex("matricula_usuario_curso_unico")
      .on(table.idusuario, table.idcurso)
      .where(sql`${table.eliminado} IS NULL`),
    index("matricula_usuario_idx").on(table.idusuario),
    index("matricula_curso_idx").on(table.idcurso),
    index("matricula_estado_idx").on(table.estado),
    check(
      "matricula_progreso_rango",
      sql`${table.progreso} >= 0 AND ${table.progreso} <= 100`,
    ),
  ],
);

// ─── leccion ────────────────────────────────────────────────────────────────
// Contenido dentro de un curso. `orden` es la posición secuencial y
// se mantiene único por curso para que la UI pueda iterar sin ORDER BY
// inconsistente. `esPreview` permite mostrar la primera lección sin
// matrícula — el truco clásico de Udemy para captar estudiantes.

export const leccion = pgTable(
  "Leccion",
  {
    ...baseColumns,
    idcurso: uuid()
      
      .references(() => curso.id, { onDelete: "cascade" }),
    titulo: text(),
    descripcion: text(),
    // Slug opcional para URLs amigables (/cursos/[slug]/lecciones/[leccionSlug]).
    // Si es NULL, se accede por id.
    slug: text(),
    orden: integer(),
    duracionSegundos: integer().default(0),
    videoUrl: text(),
    contenidoMarkdown: text(),
    tipo: tipoLeccionEnum().default("video"),
    publicado: boolean().default(false),
    esPreview: boolean().default(false),
  },
  (table) => [
    uniqueIndex("leccion_curso_orden_unico")
      .on(table.idcurso, table.orden)
      .where(sql`${table.eliminado} IS NULL`),
    uniqueIndex("leccion_curso_slug_unico")
      .on(table.idcurso, table.slug)
      .where(sql`${table.slug} IS NOT NULL AND ${table.eliminado} IS NULL`),
    index("leccion_curso_publicado_idx").on(table.idcurso, table.publicado),
  ],
);

// ─── metodo_pago ────────────────────────────────────────────────────────────
// Métodos de pago guardados del usuario (tarjeta tokenizada, PayPal…).
// NUNCA almacenamos PAN aquí — solo el `pasarelaMetodoId` que es un
// token opaco que vive en Stripe/PayPal/etc. Los últimos 4 dígitos y
// la marca son solo para mostrar en la UI.

export const metodoPago = pgTable(
  "MetodoPago",
  {
    ...baseColumns,
    idusuario: uuid()
      
      .references(() => usuario.id, { onDelete: "cascade" }),
    tipo: tipoMetodoPagoEnum(),
    pasarela: varchar({ enum: PASARELAS_PAGO }),
    pasarelaMetodoId: text(),
    ultimos4: text(),
    marca: varchar({ enum: MARCAS_TARJETA }),
    expiraMes: smallint(),
    expiraAnio: smallint(),
    alias: text(),
    esDefault: boolean().default(false),
  },
  (table) => [
    // Solo un método default por usuario. Partial unique index: ignora
    // filas que NO son default, y filas soft-deleted.
    uniqueIndex("metodo_pago_default_unico_por_usuario")
      .on(table.idusuario)
      .where(sql`${table.esDefault} = true AND ${table.eliminado} IS NULL`),
    index("metodo_pago_usuario_idx").on(table.idusuario),
    check(
      "metodo_pago_expira_mes_rango",
      sql`${table.expiraMes} IS NULL OR (${table.expiraMes} BETWEEN 1 AND 12)`,
    ),
  ],
);

// ─── pago ───────────────────────────────────────────────────────────────────
// Evento de cobro. Se crea uno por cada transacción (incluso fallida o
// reembolsada) — es el libro contable. El `idmatricula` se rellena
// cuando el pago corresponde a una matrícula nueva; queda NULL para
// pagos que no generen matrícula (renovaciones,礼品…).

export const pago = pgTable(
  "Pago",
  {
    ...baseColumns,
    idusuario: uuid().references(() => usuario.id, { onDelete: "restrict" }),
    idcurso: uuid().references(() => curso.id, { onDelete: "restrict" }),
    idmatricula: uuid().references(() => matricula.id, { onDelete: "set null" }),
    montoCentavos: integer(),
    moneda: text().default("MXN"),
    estado: estadoPagoEnum().default("pendiente"),
    pasarela: varchar({ enum: PASARELAS_PAGO }),
    pasarelaPagoId: text(),
    tipo: tipoPagoEnum(),
  },
  (table) => [
    index("pago_usuario_creado_idx").on(table.idusuario, table.creado),
    index("pago_curso_idx").on(table.idcurso),
    index("pago_estado_idx").on(table.estado),
    index("pago_pasarela_pago_id_idx").on(table.pasarelaPagoId),
    check("pago_monto_no_negativo", sql`${table.montoCentavos} >= 0`),
  ],
);

// ─── FK cruzada: usuario.metodoPagoDefaultId → metodoPago.id ────────────────
// Definida aparte porque cruza dos tablas y Drizzle no permite declararla
// inline en la columna (sería forward-reference circular). La migración
// generada la crea como ALTER TABLE.

export const usuarioMetodoPagoFk = foreignKey({
  columns: [usuario.metodoPagoDefaultId],
  foreignColumns: [metodoPago.id],
  name: "usuario_metodo_pago_default_fk",
}).onDelete("set null");

// ─── Schema export + Relations (Drizzle 1.0-rc V2 API) ─────────────────────
// `defineRelations` es la API pública de relaciones en Drizzle 1.0-rc;
// la antigua función `relations()` ahora vive en `_relations` (inestable).
// Pasamos el schema completo como primer argumento para que `r` (el
// builder) tenga acceso a TODAS las columnas de TODAS las tablas y
// podamos cruzar FKs sin colisión de nombres.

export const schema = {
  usuario,
  maestro,
  cursoCategoria,
  cursoSubcategoria,
  curso,
  resena,
  matricula,
  leccion,
  metodoPago,
  pago,
};

export const relations = defineRelations(schema, (r) => ({
  usuario: {
    resenas: r.many.resena(),
    matriculas: r.many.matricula(),
    metodosPago: r.many.metodoPago(),
    pagos: r.many.pago(),
    // FK inversa al método de pago marcado como default. Necesita
    // alias porque `metodoPago` ya tiene una relación `usuario` (la
    // del dueño), y sin alias el grafo no sabría cuál usar.
    metodoPagoDefault: r.one.metodoPago({
      from: r.usuario.metodoPagoDefaultId,
      to: r.metodoPago.id,
      alias: "metodo_pago_default",
    }),
  },
  maestro: {
    cursos: r.many.curso(),
  },
  curso: {
    maestro: r.one.maestro({
      from: r.curso.maestroId,
      to: r.maestro.id,
    }),
    subcategoria: r.one.cursoSubcategoria({
      from: r.curso.cursoSubcategoriaId,
      to: r.cursoSubcategoria.id,
    }),
    resenas: r.many.resena(),
    matriculas: r.many.matricula(),
    lecciones: r.many.leccion(),
    pagos: r.many.pago(),
  },
  cursoCategoria: {
    subcategorias: r.many.cursoSubcategoria(),
  },
  cursoSubcategoria: {
    categoria: r.one.cursoCategoria({
      from: r.cursoSubcategoria.cursoCategoriaId,
      to: r.cursoCategoria.id,
    }),
    cursos: r.many.curso(),
  },
  resena: {
    usuario: r.one.usuario({
      from: r.resena.idusuario,
      to: r.usuario.id,
    }),
    curso: r.one.curso({
      from: r.resena.idcurso,
      to: r.curso.id,
    }),
  },
  matricula: {
    usuario: r.one.usuario({
      from: r.matricula.idusuario,
      to: r.usuario.id,
    }),
    curso: r.one.curso({
      from: r.matricula.idcurso,
      to: r.curso.id,
    }),
    pagos: r.many.pago(),
  },
  leccion: {
    curso: r.one.curso({
      from: r.leccion.idcurso,
      to: r.curso.id,
    }),
  },
  metodoPago: {
    usuario: r.one.usuario({
      from: r.metodoPago.idusuario,
      to: r.usuario.id,
    }),
  },
  pago: {
    usuario: r.one.usuario({
      from: r.pago.idusuario,
      to: r.usuario.id,
    }),
    curso: r.one.curso({
      from: r.pago.idcurso,
      to: r.curso.id,
    }),
    matricula: r.one.matricula({
      from: r.pago.idmatricula,
      to: r.matricula.id,
    }),
  },
}));

// ─── Tipos inferidos ────────────────────────────────────────────────────────
// No los dupliques a mano en types/. Salen del schema con $inferSelect /
// $inferInsert — son la única fuente de verdad.

export type Usuario = typeof usuario.$inferSelect;
export type NuevoUsuario = typeof usuario.$inferInsert;
export type Maestro = typeof maestro.$inferSelect;
export type NuevoMaestro = typeof maestro.$inferInsert;
export type Curso = typeof curso.$inferSelect;
export type NuevoCurso = typeof curso.$inferInsert;
export type CursoCategoria = typeof cursoCategoria.$inferSelect;
export type NuevaCursoCategoria = typeof cursoCategoria.$inferInsert;
export type CursoSubcategoria = typeof cursoSubcategoria.$inferSelect;
export type NuevaCursoSubcategoria = typeof cursoSubcategoria.$inferInsert;
export type Resena = typeof resena.$inferSelect;
export type NuevaResena = typeof resena.$inferInsert;
export type Matricula = typeof matricula.$inferSelect;
export type NuevaMatricula = typeof matricula.$inferInsert;
export type Leccion = typeof leccion.$inferSelect;
export type NuevaLeccion = typeof leccion.$inferInsert;
export type MetodoPago = typeof metodoPago.$inferSelect;
export type NuevoMetodoPago = typeof metodoPago.$inferInsert;
export type Pago = typeof pago.$inferSelect;
export type NuevoPago = typeof pago.$inferInsert;