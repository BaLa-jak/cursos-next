CREATE TYPE "estado_maestro" AS ENUM('activo', 'pendiente', 'suspendido');--> statement-breakpoint
CREATE TYPE "estado_matricula" AS ENUM('activa', 'completada', 'cancelada', 'expirada');--> statement-breakpoint
CREATE TYPE "estado_pago" AS ENUM('pendiente', 'completado', 'fallido', 'reembolsado');--> statement-breakpoint
CREATE TYPE "nivel_curso" AS ENUM('principiante', 'intermedio', 'avanzado');--> statement-breakpoint
CREATE TYPE "tipo_leccion" AS ENUM('video', 'texto', 'quiz', 'proyecto');--> statement-breakpoint
CREATE TYPE "tipo_metodo_pago" AS ENUM('tarjeta', 'paypal', 'transferencia');--> statement-breakpoint
CREATE TYPE "tipo_pago" AS ENUM('tarjeta', 'paypal', 'transferencia', 'oxxo');--> statement-breakpoint
CREATE TABLE "curso" (
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
CREATE TABLE "curso_categoria" (
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
CREATE TABLE "curso_subcategoria" (
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
CREATE TABLE "leccion" (
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
CREATE TABLE "maestro" (
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
CREATE TABLE "matricula" (
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
CREATE TABLE "metodo_pago" (
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
CREATE TABLE "pago" (
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
CREATE TABLE "resena" (
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
CREATE TABLE "usuario" (
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
CREATE UNIQUE INDEX "curso_slug_unico_activo" ON "curso" ("slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_publicado_creado_idx" ON "curso" ("publicado","creado");--> statement-breakpoint
CREATE INDEX "curso_maestro_idx" ON "curso" ("maestroId");--> statement-breakpoint
CREATE INDEX "curso_subcategoria_idx" ON "curso" ("cursoSubcategoriaId");--> statement-breakpoint
CREATE UNIQUE INDEX "curso_categoria_slug_unico_activo" ON "curso_categoria" ("slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_categoria_orden_idx" ON "curso_categoria" ("orden");--> statement-breakpoint
CREATE UNIQUE INDEX "curso_subcategoria_slug_categoria_unico" ON "curso_subcategoria" ("cursoCategoriaId","slug") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "curso_subcategoria_categoria_idx" ON "curso_subcategoria" ("cursoCategoriaId");--> statement-breakpoint
CREATE UNIQUE INDEX "leccion_curso_orden_unico" ON "leccion" ("idcurso","orden") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "leccion_curso_slug_unico" ON "leccion" ("idcurso","slug") WHERE "slug" IS NOT NULL AND "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "leccion_curso_publicado_idx" ON "leccion" ("idcurso","publicado");--> statement-breakpoint
CREATE UNIQUE INDEX "maestro_email_unico_activo" ON "maestro" ("email") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "maestro_proveedor_oauth_unico" ON "maestro" ("proveedorOAuth","proveedorOAuthId") WHERE "proveedorOAuth" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "maestro_estado_idx" ON "maestro" ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "matricula_usuario_curso_unico" ON "matricula" ("idusuario","idcurso") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "matricula_usuario_idx" ON "matricula" ("idusuario");--> statement-breakpoint
CREATE INDEX "matricula_curso_idx" ON "matricula" ("idcurso");--> statement-breakpoint
CREATE INDEX "matricula_estado_idx" ON "matricula" ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "metodo_pago_default_unico_por_usuario" ON "metodo_pago" ("idusuario") WHERE "esDefault" = true AND "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "metodo_pago_usuario_idx" ON "metodo_pago" ("idusuario");--> statement-breakpoint
CREATE INDEX "pago_usuario_creado_idx" ON "pago" ("idusuario","creado");--> statement-breakpoint
CREATE INDEX "pago_curso_idx" ON "pago" ("idcurso");--> statement-breakpoint
CREATE INDEX "pago_estado_idx" ON "pago" ("estado");--> statement-breakpoint
CREATE INDEX "pago_pasarela_pago_id_idx" ON "pago" ("pasarelaPagoId");--> statement-breakpoint
CREATE UNIQUE INDEX "resena_usuario_curso_unico" ON "resena" ("idusuario","idcurso") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE INDEX "resena_curso_idx" ON "resena" ("idcurso");--> statement-breakpoint
CREATE UNIQUE INDEX "usuario_email_unico_activo" ON "usuario" ("email") WHERE "eliminado" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "usuario_proveedor_oauth_unico" ON "usuario" ("proveedorOAuth","proveedorOAuthId") WHERE "proveedorOAuth" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "usuario_ultimo_login_idx" ON "usuario" ("ultimoLogin");--> statement-breakpoint
ALTER TABLE "curso" ADD CONSTRAINT "curso_maestroId_maestro_id_fkey" FOREIGN KEY ("maestroId") REFERENCES "maestro"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "curso" ADD CONSTRAINT "curso_cursoSubcategoriaId_curso_subcategoria_id_fkey" FOREIGN KEY ("cursoSubcategoriaId") REFERENCES "curso_subcategoria"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "curso_subcategoria" ADD CONSTRAINT "curso_subcategoria_cursoCategoriaId_curso_categoria_id_fkey" FOREIGN KEY ("cursoCategoriaId") REFERENCES "curso_categoria"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "leccion" ADD CONSTRAINT "leccion_idcurso_curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "curso"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_idusuario_usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_idcurso_curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "curso"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "metodo_pago" ADD CONSTRAINT "metodo_pago_idusuario_usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pago" ADD CONSTRAINT "pago_idusuario_usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuario"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "pago" ADD CONSTRAINT "pago_idcurso_curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "curso"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "pago" ADD CONSTRAINT "pago_idmatricula_matricula_id_fkey" FOREIGN KEY ("idmatricula") REFERENCES "matricula"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "resena" ADD CONSTRAINT "resena_idusuario_usuario_id_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuario"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resena" ADD CONSTRAINT "resena_idcurso_curso_id_fkey" FOREIGN KEY ("idcurso") REFERENCES "curso"("id") ON DELETE CASCADE;--> statement-breakpoint

-- ─── FK cruzada: usuario.metodoPagoDefaultId → metodo_pago.id ───────────
-- Drizzle no la genera automáticamente (es forward-reference entre dos
-- tablas), así que la añadimos a mano tras crear ambas tablas. ON DELETE
-- SET NULL: si el método de pago se elimina, el usuario deja de tener
-- default (la UI le pedirá que elija otro).
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_metodo_pago_default_fk" FOREIGN KEY ("metodoPagoDefaultId") REFERENCES "metodo_pago"("id") ON DELETE SET NULL;--> statement-breakpoint

-- ─── Trigger: mantener `modificado` al día ────────────────────────────────
-- Una sola función reutilizable; un trigger BEFORE UPDATE por tabla.
-- El trigger SOBREESCRIBE el valor que la app mande, garantizando que
-- `modificado` siempre refleja la última escritura — incluso si alguien
-- hace UPDATE directo desde psql y se olvide del campo. La columna
-- `modificado` es nullable ahora (sin NOT NULL), pero el trigger la
-- rellena siempre; nunca quedará NULL en filas activas.
CREATE OR REPLACE FUNCTION set_modificado() RETURNS TRIGGER AS $$
BEGIN
  NEW."modificado" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER set_modificado_usuario BEFORE UPDATE ON "usuario" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_maestro BEFORE UPDATE ON "maestro" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_curso_categoria BEFORE UPDATE ON "curso_categoria" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_curso_subcategoria BEFORE UPDATE ON "curso_subcategoria" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_curso BEFORE UPDATE ON "curso" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_resena BEFORE UPDATE ON "resena" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_matricula BEFORE UPDATE ON "matricula" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_leccion BEFORE UPDATE ON "leccion" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_metodo_pago BEFORE UPDATE ON "metodo_pago" FOR EACH ROW EXECUTE FUNCTION set_modificado();--> statement-breakpoint
CREATE TRIGGER set_modificado_pago BEFORE UPDATE ON "pago" FOR EACH ROW EXECUTE FUNCTION set_modificado();