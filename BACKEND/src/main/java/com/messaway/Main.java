package com.messaway;

import com.messaway.controller.CasaController;
import com.messaway.controller.UsuarioCasaController;
import com.messaway.controller.UsuarioController;
import com.messaway.controller.AchievementController;
import com.messaway.controller.InsightController;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        port(4567); // Porta padrão do Spark

        // Habilita CORS para permitir chamadas do frontend
        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
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

        // Mensagem de inicialização
        System.out.println("🚀 Servidor Spark iniciado na porta 4567");
    }
}
