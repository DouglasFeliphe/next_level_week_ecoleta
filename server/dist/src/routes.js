"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var multer_2 = __importDefault(require("../config/multer"));
var PointsController_1 = __importDefault(require("./controllers/PointsController"));
var ItemsController_1 = __importDefault(require("./controllers/ItemsController"));
var itemsController = new ItemsController_1.default();
var pointsController = new PointsController_1.default();
var routes = express_1.default.Router();
var upload = multer_1.default(multer_2.default);
// const upload = multerConfig
// listar todos os itens
routes.get('/items', itemsController.index);
// listar pontos de coleta específicos
routes.get('/points', pointsController.index);
// mostrar ponto de coleta espeçífico
routes.get('/points/:id', pointsController.show);
routes.post('/point', upload.single('image'), pointsController.create);
exports.default = routes;
