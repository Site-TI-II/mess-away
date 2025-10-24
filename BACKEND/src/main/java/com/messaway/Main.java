package com.messaway;

import com.messaway.controller.CasaController;
import com.messaway.controller.UsuarioCasaController;
import com.messaway.controller.UsuarioController;
import com.messaway.controller.AchievementController;
import com.messaway.controller.AIController;
import com.messaway.controller.InsightController;
import com.messaway.controller.GastoController;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(4567); // Porta padrão do Spark

        // Habilita CORS para permitir chamadas do frontend
        before((req, res) -> {
            // Only set CORS headers if they aren't already present to avoid duplicates
            if (res.raw().getHeader("Access-Control-Allow-Origin") == null) {
                res.header("Access-Control-Allow-Origin", "*");
            }
            if (res.raw().getHeader("Access-Control-Allow-Methods") == null) {
                res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
            }
            if (res.raw().getHeader("Access-Control-Allow-Headers") == null) {
                res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
            }
        });

        options("/*", (req, res) -> {
            res.status(200);
            return "OK";
        });

        // Registra as rotas da aplicação
        CasaController.registerRoutes();
        UsuarioCasaController.registerRoutes();
        UsuarioController.registerRoutes();
        AchievementController.registerRoutes();
        AIController.registerRoutes();
        InsightController.registerRoutes();
        com.messaway.controller.ContaController.registerRoutes();
        com.messaway.controller.TarefaController.registerRoutes();
        com.messaway.controller.ComodoController.registerRoutes();

    // Rotas de Gastos por Casa (compatibilidade)
        get("/api/casa/:idCasa/gastos", GastoController::getAllGastosByCasa);
        get("/MessAway/casa/:idCasa/gastos", GastoController::getAllGastosByCasa);
        
        post("/api/gastos", GastoController::createGasto);
        post("/MessAway/gastos", GastoController::createGasto);
        
        delete("/api/gastos/:idGasto", GastoController::deleteGasto);
        delete("/MessAway/gastos/:idGasto", GastoController::deleteGasto);
        
        post("/api/casa/meta-gasto", GastoController::setMetaGasto);
        post("/MessAway/casa/meta-gasto", GastoController::setMetaGasto);
        
        get("/api/casa/:idCasa/meta-gasto", GastoController::getMetaGasto);
        get("/MessAway/casa/:idCasa/meta-gasto", GastoController::getMetaGasto);

    // Rotas de Gastos por Usuário (novo gerenciador individual)
    get("/api/usuario/:idUsuario/gastos", GastoController::getAllGastosByUsuario);
    post("/api/gastos/usuario", GastoController::createGastoUsuario);
    delete("/api/gastos/usuario/:idGastoUsuario", GastoController::deleteGastoUsuario);
    post("/api/usuario/meta-gasto", GastoController::setMetaGastoUsuario);
    get("/api/usuario/:idUsuario/meta-gasto", GastoController::getMetaGastoUsuario);

        // Mensagem de inicialização
        awaitInitialization();
        System.out.println("🚀 Servidor Spark iniciado na porta 4567");
        // Mantém a aplicação viva até receber sinal de parada
        awaitStop();
    }
}
