package com.messaway;

import com.messaway.controller.CasaController;
import com.messaway.controller.UsuarioCasaController;
import com.messaway.controller.UsuarioController;
import com.messaway.controller.AchievementController;
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
        InsightController.registerRoutes();
    com.messaway.controller.ContaController.registerRoutes();

        // Rotas de Gastos (dual routes for compatibility)
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

        // Mensagem de inicialização
        System.out.println("🚀 Servidor Spark iniciado na porta 4567");
    }
}
