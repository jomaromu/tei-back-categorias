import { Response } from "express";
import { CallbackError } from "mongoose";
const mongoose = require("mongoose");
import Server from "./server";

// Interfaces
import { CategoriaModelInterface } from "../interfaces/categoria";

// Modelo
import categoriaModel from "../models/categoriaModel";

export class CategoriaClass {
  constructor() {}

  crearCategoria(req: any, resp: Response): void {
    const idCreador = new mongoose.Types.ObjectId(req.usuario._id);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const nombre = req.body.nombre;
    const estado: boolean = req.body.estado;

    const nuevaCategoria = new categoriaModel({
      idCreador,
      foranea,
      nombre,
      estado,
    });

    nuevaCategoria.save(
      (err: CallbackError, categoriaDB: CategoriaModelInterface) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        } else {
          const server = Server.instance;
          server.io.emit("cargar-categorias", {
            ok: true,
          });
          return resp.json({
            ok: true,
            mensaje: "Categoría creada",
            categoriaDB,
          });
        }
      }
    );
  }

  editarCategoriaID(req: any, resp: Response): any {
    const _id = new mongoose.Types.ObjectId(req.body.id);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const nombre: string = req.body.nombre;
    const estado: boolean = req.body.estado;

    const query = {
      nombre,
      estado,
    };

    categoriaModel.findOne(
      { _id, foranea },
      (err: CallbackError, categoriaDB: CategoriaModelInterface) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        }

        if (!categoriaDB) {
          return resp.json({
            ok: false,
            mensaje: `No se encontró una categoría con ese ID`,
          });
        }

        if (!query.nombre) {
          query.nombre = categoriaDB.nombre;
        }

        categoriaModel.findOneAndUpdate(
          { _id, foranea },
          query,
          { new: true },
          (err: CallbackError, categoriaDB: any) => {
            if (err) {
              return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err,
              });
            } else {
              const server = Server.instance;
              server.io.emit("cargar-categorias", {
                ok: true,
              });
              return resp.json({
                ok: true,
                mensaje: "Categoría actualizada",
                categoriaDB,
              });
            }
          }
        );
      }
    );
  }

  obtenerTodasCategorias(req: any, resp: Response): void {
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
    categoriaModel
      .find({ foranea })
      .populate("idCreador")
      .exec((err: any, categoriasDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        } else {
          return resp.json({
            ok: true,
            categoriasDB,
          });
        }
      });
  }

  eliminarCategoriaID(req: any, resp: Response): void {
    const _id = new mongoose.Types.ObjectId(req.get("id"));
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));

    categoriaModel.findOneAndDelete(
      { _id, foranea },
      {},
      (err: any, categoriaDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        } else {
          const server = Server.instance;
          server.io.emit("cargar-categorias", {
            ok: true,
          });
          return resp.json({
            ok: true,
            mensaje: "Categoría eliminada",
            categoriaDB,
          });
        }
      }
    );
  }
}
