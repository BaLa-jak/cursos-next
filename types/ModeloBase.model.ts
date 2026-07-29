import type { ColumnDef } from "@tanstack/react-table";
export type ModelColumnsType<T extends ModeloBase = ModeloBase> = ColumnDef<T>;

export interface IModeloBase {
  id?: string;

  creado?: Date;
  modificado?: Date;

  ENDPOINTS: {
    DEFAULT: string;
    [key: string]: string;
  };

  EXPAND: {
    DEFAULT: string;
    [key: string]: string;
  };

  COLUMNS: ModelColumnsType[];
}

export class ModeloBase {
  id?: string;

  creado?: Date;
  modificado?: Date;

  //#region STATICS DEFAULT PARA CRUDS
  static BASE_ROUTE = "/";

  static ENDPOINTS = {
    DEFAULT: "/v1/default.json",
  };

  static EXPAND = {
    DEFAULT: "",
  };

  static fromJson(data: Partial<ModeloBase>) {
    return new ModeloBase(data);
  }

  static fromJsonList(data: Partial<ModeloBase>[]) {
    return data.map((_data) => new ModeloBase(_data));
  }

  static COLUMNS: ModelColumnsType[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
  ];
  //#endregion
  protected constructor(data: Partial<ModeloBase> = {}) {
    Object.assign(this, data);
  }
}
