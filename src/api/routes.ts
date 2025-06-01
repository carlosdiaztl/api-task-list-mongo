import { Router } from "express";
import { UserModel } from "./v1/users/infrastructure/model/user.model";
import { TaskModel } from "./v1/task/infrastructure/model/task.model";
import { taskRoutes } from "./v1/task/infrastructure/routes/task.routes";


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
routes.use("/task", taskRoutes);
export default routes;