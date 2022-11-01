"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaClass = void 0;
const mongoose = require("mongoose");
const server_1 = __importDefault(require("./server"));
// Modelo
const categoriaModel_1 = __importDefault(require("../models/categoriaModel"));
class CategoriaClass {
    constructor() { }
    crearCategoria(req, resp) {
        const idCreador = new mongoose.Types.ObjectId(req.usuario._id);
        const foranea = new mongoose.Types.ObjectId(req.body.foranea);
        const nombre = req.body.nombre;
        const estado = req.body.estado;
        const nuevaCategoria = new categoriaModel_1.default({
            idCreador,
            foranea,
            nombre,
            estado,
        });
        nuevaCategoria.save((err, categoriaDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err,
                });
            }
            else {
                const server = server_1.default.instance;
                server.io.emit("cargar-categorias", {
                    ok: true,
                });
                return resp.json({
                    ok: true,
                    mensaje: "Categoría creada",
                    categoriaDB,
                });
            }
        });
    }
    editarCategoriaID(req, resp) {
        const _id = new mongoose.Types.ObjectId(req.body.id);
        const foranea = new mongoose.Types.ObjectId(req.body.foranea);
        const nombre = req.body.nombre;
        const estado = req.body.estado;
        const query = {
            nombre,
            estado,
        };
        categoriaModel_1.default.findOne({ _id, foranea }, (err, categoriaDB) => {
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
            categoriaModel_1.default.findOneAndUpdate({ _id, foranea }, query, { new: true }, (err, categoriaDB) => {
                if (err) {
                    return resp.json({
                        ok: false,
                        mensaje: `Error interno`,
                        err,
                    });
                }
                else {
                    const server = server_1.default.instance;
                    server.io.emit("cargar-categorias", {
                        ok: true,
                    });
                    return resp.json({
                        ok: true,
                        mensaje: "Categoría actualizada",
                        categoriaDB,
                    });
                }
            });
        });
    }
    obtenerTodasCategorias(req, resp) {
        const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
        categoriaModel_1.default
            .find({ foranea })
            .populate("idCreador")
            .exec((err, categoriasDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err,
                });
            }
            else {
                return resp.json({
                    ok: true,
                    categoriasDB,
                });
            }
        });
    }
    eliminarCategoriaID(req, resp) {
        const _id = new mongoose.Types.ObjectId(req.get("id"));
        const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
        categoriaModel_1.default.findOneAndDelete({ _id, foranea }, {}, (err, categoriaDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err,
                });
            }
            else {
                const server = server_1.default.instance;
                server.io.emit("cargar-categorias", {
                    ok: true,
                });
                return resp.json({
                    ok: true,
                    mensaje: "Categoría eliminada",
                    categoriaDB,
                });
            }
        });
    }
}
exports.CategoriaClass = CategoriaClass;
