"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaClass = void 0;
// Modelo
const categoriaModel_1 = __importDefault(require("../models/categoriaModel"));
class CategoriaClass {
    constructor() { }
    crearCategoria(req, resp) {
        const idCreador = req.usuario._id;
        const nombre = req.body.nombre;
        const nuevaCategoria = new categoriaModel_1.default({
            idCreador: idCreador,
            nombre: nombre,
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
                return resp.json({
                    ok: true,
                    mensaje: "Categoría creada",
                    categoriaDB,
                });
            }
        });
    }
    editarCategoriaID(req, resp) {
        const id = req.get("id");
        const nombre = req.body.nombre;
        // const estadoHeader: string = req.get('estado');
        const estadoBody = req.body.estado;
        // const estado: boolean = castEstado(estadoBody);
        // console.log(estadoBody)
        const query = {
            nombre: nombre,
            estado: estadoBody,
        };
        categoriaModel_1.default.findById(id, (err, categoriaDB) => {
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
            if (!query.estado) {
                query.estado = categoriaDB.estado;
            }
            categoriaModel_1.default.findByIdAndUpdate(id, query, { new: true }, (err, categoriaDB) => {
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
                return resp.json({
                    ok: true,
                    mensaje: "Categoría actualizada",
                    categoriaDB,
                });
            });
        });
    }
    obtenerTodasCategorias(req, resp) {
        const estado = req.get("estado");
        // const estado: boolean = castEstado(estadoHeader);
        categoriaModel_1.default.find({}, (err, categoriasDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err,
                });
            }
            if (categoriasDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron categorías`,
                });
            }
            return resp.json({
                ok: true,
                categoriasDB,
            });
        });
    }
    obtenerCategoriaID(req, resp) {
        const id = req.get("id");
        categoriaModel_1.default.findById(id, (err, categoriaDB) => {
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
            return resp.json({
                ok: true,
                categoriaDB,
            });
        });
    }
    eliminarCategoriaID(req, resp) {
        const id = req.get("id");
        categoriaModel_1.default.findByIdAndDelete(id, {}, (err, categoriaDB) => {
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
            return resp.json({
                ok: true,
                mensaje: "Categoría eliminada",
                categoriaDB,
            });
        });
    }
    obtenerCategoriaCriterio(req, resp) {
        const criterio = req.get("criterio");
        const regExpCrit = new RegExp(criterio, "i");
        categoriaModel_1.default.find({ nombre: regExpCrit }, (err, categoriasDB) => {
            if (err) {
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err,
                });
            }
            if (categoriasDB.length === 0) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontraron categorías`,
                });
            }
            return resp.json({
                ok: true,
                categoriasDB,
            });
        });
    }
}
exports.CategoriaClass = CategoriaClass;
