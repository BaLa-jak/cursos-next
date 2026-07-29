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

const PASARELAS_PAGO = ["stripe", "paypal", "mercadopago", "manual"] as const;
const MARCAS_TARJETA = [
  "visa",
  "mastercard",
  "amex",
  "carnet",
  "oxxo",
] as const;

const baseColumns = {
  id: uuid().primaryKey().defaultRandom(),
  creado: timestamp({ withTimezone: true, mode: "date" }).defaultNow(),
  modificado: timestamp({ withTimezone: true, mode: "date" }).defaultNow(),
  eliminado: timestamp({ withTimezone: true, mode: "date" }),
};

export const usuario = pgTable(
  "Usuario",
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
    metodoPagoDefaultId: uuid(),
    ultimoLogin: timestamp({ withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("usuario_email_unico_activo")
      .on(table.email)
      .where(sql`${table.eliminado} IS NULL`),
    uniqueIndex("usuario_proveedor_oauth_unico")
      .on(table.proveedorOAuth, table.proveedorOAuthId)
      .where(sql`${table.proveedorOAuth} IS NOT NULL`),
    index("usuario_ultimo_login_idx").on(table.ultimoLogin),
  ],
);

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

export const cursoSubcategoria = pgTable(
  "CursoSubcategoria",
  {
    ...baseColumns,
    nombre: text(),
    slug: text(),
    descripcion: text(),
    cursoCategoriaId: uuid().references(() => cursoCategoria.id, {
      onDelete: "restrict",
    }),
    orden: integer().default(0),
  },
  (table) => [
    uniqueIndex("curso_subcategoria_slug_categoria_unico")
      .on(table.cursoCategoriaId, table.slug)
      .where(sql`${table.eliminado} IS NULL`),
    index("curso_subcategoria_categoria_idx").on(table.cursoCategoriaId),
  ],
);

export const curso = pgTable(
  "Curso",
  {
    ...baseColumns,
    slug: text(),
    titulo: text(),
    descripcion: text(),
    descripcionCorta: text(),
    imagenPortadaUrl: text(),
    precioCentavos: integer().default(0),
    precioActualCentavos: integer(),
    moneda: text().default("MXN"),
    publicado: boolean().default(false),
    calificacion: numeric({ precision: 2, scale: 1 }).default("0.0"),
    numeroResenas: integer().default(0),
    numeroEstudiantes: integer().default(0),
    duracionMinutos: integer().default(0),
    nivel: nivelCursoEnum().default("principiante"),
    idioma: text().default("es"),
    maestroId: uuid().references(() => maestro.id, { onDelete: "restrict" }),
    cursoSubcategoriaId: uuid().references(() => cursoSubcategoria.id, {
      onDelete: "restrict",
    }),
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

export const resena = pgTable(
  "Resena",
  {
    ...baseColumns,
    idusuario: uuid().references(() => usuario.id, { onDelete: "cascade" }),
    idcurso: uuid().references(() => curso.id, { onDelete: "cascade" }),
    calificacion: integer(),
    comentario: text(),
    aprobado: boolean().default(true),
  },
  (table) => [
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

export const matricula = pgTable(
  "Matricula",
  {
    ...baseColumns,
    idusuario: uuid().references(() => usuario.id, { onDelete: "cascade" }),
    idcurso: uuid().references(() => curso.id, { onDelete: "restrict" }),
    precioPagadoCentavos: integer(),
    moneda: text().default("MXN"),
    progreso: numeric({ precision: 5, scale: 2 }).default("0.00"),
    completado: boolean().default(false),
    fechaCompletado: timestamp({ withTimezone: true, mode: "date" }),
    certificadoUrl: text(),
    estado: estadoMatriculaEnum().default("activa"),
  },
  (table) => [
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


export const leccion = pgTable(
  "Leccion",
  {
    ...baseColumns,
    idcurso: uuid().references(() => curso.id, { onDelete: "cascade" }),
    titulo: text(),
    descripcion: text(),
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

export const metodoPago = pgTable(
  "MetodoPago",
  {
    ...baseColumns,
    idusuario: uuid().references(() => usuario.id, { onDelete: "cascade" }),
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

export const pago = pgTable(
  "Pago",
  {
    ...baseColumns,
    idusuario: uuid().references(() => usuario.id, { onDelete: "restrict" }),
    idcurso: uuid().references(() => curso.id, { onDelete: "restrict" }),
    idmatricula: uuid().references(() => matricula.id, {
      onDelete: "set null",
    }),
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

export const usuarioMetodoPagoFk = foreignKey({
  columns: [usuario.metodoPagoDefaultId],
  foreignColumns: [metodoPago.id],
  name: "usuario_metodo_pago_default_fk",
}).onDelete("set null");

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
