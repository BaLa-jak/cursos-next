/**
 * Barrel export para `models/`.
 *
 * Permite `import { Usuario, Curso } from "@/models"` en lugar de tener
 * que importar cada archivo individualmente. Cada modelo sigue siendo
 * importable también desde su path directo (`@/models/Usuario.model`)
 * cuando hace falta cargar solo uno (ej. code-splitting).
 */
export { ModeloBase, type ModelColumnsType } from "./ModeloBase.model";

export { Usuario } from "./Usuario.model";
export { Maestro } from "./Maestro.model";
export { Curso } from "./Curso.model";
export { CursoCategoria } from "./CursoCategoria.model";
export { CursoSubcategoria } from "./CursoSubcategoria.model";
export { Resena } from "./Resena.model";
export { Matricula } from "./Matricula.model";
export { Leccion } from "./Leccion.model";
export { MetodoPago } from "./MetodoPago.model";
export { Pago } from "./Pago.model";
