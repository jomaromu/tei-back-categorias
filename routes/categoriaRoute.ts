import { Router, Response, Request } from "express";
import { verificaToken } from "../auth/auth";
import { CategoriaClass } from "../class/categoriaClass";

const categoriaRouter = Router();

categoriaRouter.post(
  "/crearCategoria",
  [verificaToken],
  (req: Request, resp: Response) => {
    const crearCategoria = new CategoriaClass();
    crearCategoria.crearCategoria(req, resp);
  }
);

categoriaRouter.put(
  "/editarCategoriaID",
  [verificaToken],
  (req: Request, resp: Response) => {
    const editarCategoriaID = new CategoriaClass();
    editarCategoriaID.editarCategoriaID(req, resp);
  }
);

categoriaRouter.get(
  "/obtenerTodasCategorias",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerTodasCategorias = new CategoriaClass();
    obtenerTodasCategorias.obtenerTodasCategorias(req, resp);
  }
);

categoriaRouter.delete(
  "/eliminarCategoriaID",
  [verificaToken],
  (req: Request, resp: Response) => {
    const eliminarCategoriaID = new CategoriaClass();
    eliminarCategoriaID.eliminarCategoriaID(req, resp);
  }
);

export default categoriaRouter;
