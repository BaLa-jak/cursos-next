CREATE TYPE "estado_maestro" AS ENUM('activo', 'pendiente', 'suspendido');--> statement-breakpoint
CREATE TYPE "estado_matricula" AS ENUM('activa', 'completada', 'cancelada', 'expirada');--> statement-breakpoint
CREATE TYPE "estado_pago" AS ENUM('pendiente', 'completado', 'fallido', 'reembolsado');--> statement-breakpoint
CREATE TYPE "nivel_curso" AS ENUM('principiante', 'intermedio', 'avanzado');--> statement-breakpoint
CREATE TYPE "tipo_leccion" AS ENUM('video', 'texto', 'quiz', 'proyecto');--> statement-breakpoint
CREATE TYPE "tipo_metodo_pago" AS ENUM('tarjeta', 'paypal', 'transferencia');--> statement-breakpoint
CREATE TYPE "tipo_pago" AS ENUM('tarjeta', 'paypal', 'transferencia', 'oxxo');--> statement-breakpoint
CREATE TABLE "Curso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"slug" text,
	"titulo" text,
	"descripcion" text,
	"descripcionCorta" text,
	"imagenPortadaUrl" text,
	"precioCentavos" integer DEFAULT 0,
	"precioActualCentavos" integer,
	"moneda" text DEFAULT 'MXN',
	"publicado" boolean DEFAULT false,
	"calificacion" numeric(2,1) DEFAULT '0.0',
	"numeroResenas" integer DEFAULT 0,
	"numeroEstudiantes" integer DEFAULT 0,
	"duracionMinutos" integer DEFAULT 0,
	"nivel" "nivel_curso" DEFAULT 'principiante'::"nivel_curso",
	"idioma" text DEFAULT 'es',
	"maestroId" uuid,
	"cursoSubcategoriaId" uuid,
	CONSTRAINT "curso_precio_no_negativo" CHECK ("precioCentavos" >= 0 AND ("precioActualCentavos" IS NULL OR "precioActualCentavos" >= 0)),
	CONSTRAINT "curso_calificacion_rango" CHECK ("calificacion" >= 0 AND "calificacion" <= 5)
);
--> statement-breakpoint
CREATE TABLE "CursoCategoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"nombre" text,
	"slug" text,
	"descripcion" text,
	"iconoUrl" text,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "CursoSubcategoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"nombre" text,
	"slug" text,
	"descripcion" text,
	"cursoCategoriaId" uuid,
	"orden" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "Leccion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"idcurso" uuid,
	"titulo" text,
	"descripcion" text,
	"slug" text,
	"orden" integer,
	"duracionSegundos" integer DEFAULT 0,
	"videoUrl" text,
	"contenidoMarkdown" text,
	"tipo" "tipo_leccion" DEFAULT 'video'::"tipo_leccion",
	"publicado" boolean DEFAULT false,
	"esPreview" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "Maestro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"nombre" text,
	"apellido" text,
	"email" text,
	"emailVerificado" boolean DEFAULT false,
	"passwordHash" text,
	"proveedorOAuth" text,
	"proveedorOAuthId" text,
	"avatarUrl" text,
	"biografia" text,
	"especialidad" text,
	"verificado" boolean DEFAULT false,
	"estado" "estado_maestro" DEFAULT 'pendiente'::"estado_maestro",
	"ultimoLogin" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "Matricula" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"idusuario" uuid,
	"idcurso" uuid,
	"precioPagadoCentavos" integer,
	"moneda" text DEFAULT 'MXN',
	"progreso" numeric(5,2) DEFAULT '0.00',
	"completado" boolean DEFAULT false,
	"fechaCompletado" timestamp with time zone,
	"certificadoUrl" text,
	"estado" "estado_matricula" DEFAULT 'activa'::"estado_matricula",
	CONSTRAINT "matricula_progreso_rango" CHECK ("progreso" >= 0 AND "progreso" <= 100)
);
--> statement-breakpoint
CREATE TABLE "MetodoPago" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"idusuario" uuid,
	"tipo" "tipo_metodo_pago",
	"pasarela" varchar,
	"pasarelaMetodoId" text,
	"ultimos4" text,
	"marca" varchar,
	"expiraMes" smallint,
	"expiraAnio" smallint,
	"alias" text,
	"esDefault" boolean DEFAULT false,
	CONSTRAINT "metodo_pago_expira_mes_rango" CHECK ("expiraMes" IS NULL OR ("expiraMes" BETWEEN 1 AND 12))
);
--> statement-breakpoint
CREATE TABLE "Pago" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"idusuario" uuid,
	"idcurso" uuid,
	"idmatricula" uuid,
	"montoCentavos" integer,
	"moneda" text DEFAULT 'MXN',
	"estado" "estado_pago" DEFAULT 'pendiente'::"estado_pago",
	"pasarela" varchar,
	"pasarelaPagoId" text,
	"tipo" "tipo_pago",
	CONSTRAINT "pago_monto_no_negativo" CHECK ("montoCentavos" >= 0)
);
--> statement-breakpoint
CREATE TABLE "Resena" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"idusuario" uuid,
	"idcurso" uuid,
	"calificacion" integer,
	"comentario" text,
	"aprobado" boolean DEFAULT true,
	CONSTRAINT "resena_calificacion_rango" CHECK ("calificacion" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "Usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creado" timestamp with time zone DEFAULT now(),
	"modificado" timestamp with time zone DEFAULT now(),
	"eliminado" timestamp with time zone,
	"nombre" text,
	"apellido" text,
	"email" text,
	"emailVerificado" boolean DEFAULT false,
	"passwordHash" text,
	"proveedorOAuth" text,
	"proveedorOAuthId" text,
	"avatarUrl" text,
	"biografia" text,
	"metodoPagoDefaultId" uuid,
	"ultimoLogin" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "curso_slug_unico_activo" ON "Curso" ("slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_publicado_creado_idx" ON "Curso" ("publicado","creado");--> statement-breakpoint
CREATE INDEX "curso_maestro_idx" ON "Curso" ("maestroId");--> statement-breakpoint
CREATE INDEX "curso_subcategoria_idx" ON "Curso" ("cursoSubcategoriaId");--> statement-breakpoint
CREATE UNIQUE INDEX "curso_categoria_slug_unico_activo" ON "CursoCategoria" ("slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_categoria_orden_idx" ON "CursoCategoria" ("orden");--> statement-breakpoint
CREATE UNIQUE INDEX "curso_subcategoria_slug_categoria_unico" ON "CursoSubcategoria" ("cursoCategoriaId","slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_subcategoria_categoria_idx" ON "CursoSubcategoria" ("cursoCategoriaId");--> statement-breakpoint
CREATE UNIQUE INDEX "leccion_curso_orden_unico" ON "Leccion" ("idcurso","orden") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "leccion_curso_slug_unico" ON "Leccion" ("idcurso","slug") WHERE "slug" IS NOT NULL AND "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "leccion_curso_publicado_idx" ON "Leccion" ("idcurso","publicado");--> statement-breakpoint
CREATE UNIQUE INDEX "maestro_email_unico_activo" ON "Maestro" ("email") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "maestro_proveedor_oauth_unico" ON "Maestro" ("proveedorOAuth","proveedorOAuthId") WHERE "proveedorOAuth" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "maestro_estado_idx" ON "Maestro" ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "matricula_usuario_curso_unico" ON "Matricula" ("idusuario","idcurso") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "matricula_usuario_idx" ON "Matricula" ("idusuario");--> statement-breakpoint
CREATE INDEX "matricula_curso_idx" ON "Matricula" ("idcurso");--> statement-breakpoint
CREATE INDEX "matricula_estado_idx" ON "Matricula" ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "metodo_pago_default_unico_por_usuario" ON "MetodoPago" ("idusuario") WHERE "esDefault" = true AND "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "metodo_pago_usuario_idx" ON "MetodoPago" ("idusuario");--> statement-breakpoint
CREATE INDEX "pago_usuario_creado_idx" ON "Pago" ("idusuario","creado");--> statement-breakpoint
CREATE INDEX "pago_curso_idx" ON "Pago" ("idcurso");--> statement-breakpoint
CREATE INDEX "pago_estado_idx" ON "Pago" ("estado");--> statement-breakpoint
CREATE INDEX "pago_pasarela_pago_id_idx" ON "Pago" ("pasarelaPagoId");--> statement-breakpoint
CREATE UNIQUE INDEX "resena_usuario_curso_unico" ON "Resena" ("idusuario","idcurso") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "resena_curso_idx" ON "Resena" ("idcurso");--> statement-breakpoint
CREATE UNIQUE INDEX "usuario_email_unico_activo" ON "Usuario" ("email") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "usuario_proveedor_oauth_unico" ON "Usuario" ("proveedorOAuth","proveedorOAuthId") WHERE "proveedorOAuth" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "usuario_ultimo_login_idx" ON "Usuario" ("ultimoLogin");--> statement-breakpoint
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_maestroId_Maestro_id_fkey" FOREIGN KEY ("maestroId") REFERENCES "Maestro"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_cursoSubcategoriaId_CursoSubcategoria_id_fkey" FOREIGN KEY ("cursoSubcategoriaId") REFERENCES "CursoSubcategoria"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "CursoSubcategoria" ADD CONSTRAINT "CursoSubcategoria_cursoCategoriaId_CursoCategoria_id_fkey" FOREIGN KEY ("cursoCategoriaId") REFERENCES "CursoCategoria"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_idcurso_Curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "Curso"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_idusuario_Usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "Usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_idcurso_Curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "Curso"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "MetodoPago" ADD CONSTRAINT "MetodoPago_idusuario_Usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "Usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_idusuario_Usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_idcurso_Curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "Curso"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_idmatricula_Matricula_id_fkey" FOREIGN KEY ("idmatricula") REFERENCES "Matricula"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_idusuario_Usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "Usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_idcurso_Curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "Curso"("id") ON DELETE CASCADE;