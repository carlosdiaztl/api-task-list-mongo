import { Router } from "express";
import { UserModel } from "./v1/users/infrastructure/model/user.model";


const routes = Router();

routes.get("/", (req, res) => {
    res.send("Hello World!");
});
routes.get("/db", async (req, res) => {
    try {
    const users =await UserModel.find().select("-password -__v").lean();
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al conectar con la base de datos.");
    }
});
export default routes;