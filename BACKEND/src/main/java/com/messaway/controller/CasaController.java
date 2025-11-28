package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.db.Database;
import com.messaway.model.Casa;
import com.messaway.model.ErrorResponse;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static spark.Spark.*;

class Points {
    public int points;
}

class SimulationResponse {
    public int newTotal;

    public SimulationResponse(int newTotal) {
        this.newTotal = newTotal;
    }
}

public class CasaController {
    public static void registerRoutes() {
        Gson gson = new Gson();

        // Defer CORS header management to Main.java (global before filter).
        // Still respond to OPTIONS preflight requests here if required by specific
        // routes.
        options("/*", (request, response) -> {
            // Let Main.java set the standard CORS headers. For preflight, reply OK.
            response.status(200);
            return "OK";
        });

        // Test endpoint to simulate points for a house
        post("/MessAway/casas/:id/simulate-points", (req, res) -> {
            res.type("application/json");
            try {
                long casaId = Long.parseLong(req.params(":id"));
                var points = gson.fromJson(req.body(), Points.class);

                var achievementDAO = new com.messaway.dao.AchievementDAO();
                int newTotal = achievementDAO.simulatePoints(casaId, points.points);

                res.status(200);
                return gson.toJson(new SimulationResponse(newTotal));
            } catch (Exception e) {
                res.status(500);
                return gson.toJson(new ErrorResponse("Error simulating points: " + e.getMessage()));
            }
        });

        // Set default response content type for this controller's routes
        before((request, response) -> {
            response.type("application/json");
        });

        post("/MessAway/casas", (req, res) -> {
            res.type("application/json");
            try {
                System.out.println("Headers: " + req.headers());
                System.out.println("Body recebido: " + req.body());
                Casa casa = gson.fromJson(req.body(), Casa.class);
                // Optional: bind casa to a Conta if idConta is provided in the JSON body
                Long idContaFromBody = null;
                try {
                    var parsed = com.google.gson.JsonParser.parseString(req.body()).getAsJsonObject();
                    if (parsed.has("idConta") && !parsed.get("idConta").isJsonNull()) {
                        idContaFromBody = parsed.get("idConta").getAsLong();
                    }
                } catch (Exception ignore) {
                }
                System.out.println("Casa objeto: " + gson.toJson(casa));

                try (Connection conn = Database.connect()) {
                    // O idConta é igual ao user_id devido ao schema unificado
                    Long ownerId = idContaFromBody;
                    
                    // Se não tiver idConta, usar um padrão
                    if (ownerId == null) {
                        ownerId = 2L; // User padrão (Test User)
                    }
                    
                    System.out.println("Creating house with owner_id: " + ownerId + " from idConta: " + idContaFromBody);
                    
                    // Insere direto na tabela houses
                    PreparedStatement stmt = conn.prepareStatement(
                            "INSERT INTO houses (name, description, address, owner_id, active, created_at) VALUES (?, ?, ?, ?, true, CURRENT_TIMESTAMP)",
                            Statement.RETURN_GENERATED_KEYS);
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setLong(4, ownerId);

                    System.out.println("Executando query: INSERT INTO CASA (nome, descricao, endereco, ativo) VALUES ('"
                            + casa.getNome() + "', '"
                            + (casa.getDescricao() != null ? casa.getDescricao() : "") + "', '"
                            + (casa.getEndereco() != null ? casa.getEndereco() : "") + "', true)");

                    int affectedRows = stmt.executeUpdate();
                    if (affectedRows == 0) {
                        throw new SQLException("Creating casa failed, no rows affected.");
                    }

                    ResultSet rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        casa.setId(rs.getLong(1));
                        System.out.println("Casa criada com sucesso. ID: " + casa.getId());
                    } else {
                        throw new SQLException("Creating casa failed, no ID obtained.");
                    }

                    res.status(201);
                    return gson.toJson(casa);
                } catch (SQLException e) {
                    System.err.println("Erro ao criar casa no banco: " + e.getMessage());
                    e.printStackTrace(); // Adiciona stack trace completo
                    res.status(500);
                    return gson.toJson(new ErrorResponse("Erro ao criar casa: " + e.getMessage()));
                }
            } catch (Exception e) {
                System.err.println("Erro ao processar requisição: " + e.getMessage());
                e.printStackTrace(); // Adiciona stack trace completo
                res.status(400);
                return gson.toJson(new ErrorResponse("Erro ao processar requisição: " + e.getMessage()));
            }
        });

        get("/MessAway/casas", (req, res) -> {
            List<Casa> casas = new ArrayList<>();
            String contaIdParam = req.queryParams("contaId");
            try (Connection conn = Database.connect()) {
                if (contaIdParam != null && !contaIdParam.isEmpty()) {
                    boolean isAdmin = false;
                    try (PreparedStatement p = conn.prepareStatement("SELECT is_admin FROM CONTA WHERE id_conta = ?")) {
                        p.setInt(1, Integer.parseInt(contaIdParam));
                        try (ResultSet r = p.executeQuery()) {
                            if (r.next())
                                isAdmin = r.getBoolean(1);
                        }
                    }
                    if (isAdmin) {
                        try (PreparedStatement pst = conn
                                .prepareStatement("SELECT * FROM CASA WHERE ativo = true ORDER BY data_criacao DESC")) {
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    } else {
                        try (PreparedStatement pst = conn.prepareStatement(
                                "SELECT * FROM CASA WHERE ativo = true AND id_conta = ? ORDER BY data_criacao DESC")) {
                            pst.setInt(1, Integer.parseInt(contaIdParam));
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    }
                } else {
                    // Sem contaId: retorna lista vazia (segurança - não expor casas de outros)
                    // Retorna array vazio ao invés de todas as casas
                }
            }
            return gson.toJson(casas);
        });

        // Get single casa by id (includes pontos)
        get("/MessAway/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                try (PreparedStatement stmt = conn.prepareStatement("SELECT * FROM CASA WHERE id_casa = ?")) {
                    stmt.setLong(1, id);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                            casa.setDescricao(rs.getString("descricao"));
                            casa.setEndereco(rs.getString("endereco"));
                            casa.setAtivo(rs.getBoolean("ativo"));
                            // pontos column may exist
                            try {
                                casa.setPontos(rs.getInt("pontos"));
                            } catch (SQLException ignore) {
                            }
                            return gson.toJson(casa);
                        } else {
                            res.status(404);
                            return gson.toJson(new ErrorResponse("Casa não encontrada"));
                        }
                    }
                }
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao buscar casa: " + e.getMessage()));
            }
        });

        delete("/MessAway/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                // Soft delete para evitar violação de FK
                try (PreparedStatement stmt = conn
                        .prepareStatement("UPDATE CASA SET ativo = false WHERE id_casa = ?")) {
                    stmt.setLong(1, id);
                    int updated = stmt.executeUpdate();
                    if (updated == 0) {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Casa não encontrada"));
                    }
                }
                res.status(204);
                return "";
            } catch (SQLException e) {
                System.err.println("[CasaController] Erro ao deletar casa (MessAway): " + e.getMessage());
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao deletar casa: " + e.getMessage()));
            }
        });

        // Aliases /api (duplicated handlers for compatibility)
        post("/api/casas", (req, res) -> {
            res.type("application/json");
            try {
                System.out.println("Headers: " + req.headers());
                System.out.println("Body recebido: " + req.body());
                Casa casa = gson.fromJson(req.body(), Casa.class);
                Long idContaFromBody = null;
                try {
                    var parsed = com.google.gson.JsonParser.parseString(req.body()).getAsJsonObject();
                    if (parsed.has("idConta") && !parsed.get("idConta").isJsonNull()) {
                        idContaFromBody = parsed.get("idConta").getAsLong();
                    }
                } catch (Exception ignore) {
                }
                System.out.println("Casa objeto: " + gson.toJson(casa));

                try (Connection conn = Database.connect()) {
                    // O idConta é igual ao user_id devido ao schema unificado
                    Long ownerId = idContaFromBody;
                    
                    // Se não tiver idConta, usar um padrão
                    if (ownerId == null) {
                        ownerId = 2L; // User padrão (Test User)
                    }
                    
                    System.out.println("Creating house with owner_id: " + ownerId + " from idConta: " + idContaFromBody);
                    
                    PreparedStatement stmt = conn.prepareStatement(
                            "INSERT INTO houses (name, description, address, owner_id, active, created_at) VALUES (?, ?, ?, ?, true, CURRENT_TIMESTAMP)",
                            Statement.RETURN_GENERATED_KEYS);
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setLong(4, ownerId);

                    int affectedRows = stmt.executeUpdate();
                    if (affectedRows == 0) {
                        throw new SQLException("Creating casa failed, no rows affected.");
                    }

                    ResultSet rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        casa.setId(rs.getLong(1));
                        System.out.println("Casa criada com sucesso. ID: " + casa.getId());
                    } else {
                        throw new SQLException("Creating casa failed, no ID obtained.");
                    }

                    res.status(201);
                    return gson.toJson(casa);
                } catch (SQLException e) {
                    System.err.println("Erro ao criar casa no banco: " + e.getMessage());
                    e.printStackTrace();
                    res.status(500);
                    return gson.toJson(new ErrorResponse("Erro ao criar casa: " + e.getMessage()));
                }
            } catch (Exception e) {
                System.err.println("Erro ao processar requisição: " + e.getMessage());
                e.printStackTrace();
                res.status(400);
                return gson.toJson(new ErrorResponse("Erro ao processar requisição: " + e.getMessage()));
            }
        });

        get("/api/casas", (req, res) -> {
            List<Casa> casas = new ArrayList<>();
            String contaIdParam = req.queryParams("contaId");
            System.out.println("GET /api/casas - contaId received: " + contaIdParam);
            try (Connection conn = Database.connect()) {
                if (contaIdParam != null && !contaIdParam.isEmpty()) {
                    boolean isAdmin = false;
                    try (PreparedStatement p = conn.prepareStatement("SELECT is_admin FROM CONTA WHERE id_conta = ?")) {
                        p.setInt(1, Integer.parseInt(contaIdParam));
                        try (ResultSet r = p.executeQuery()) {
                            if (r.next())
                                isAdmin = r.getBoolean(1);
                        }
                    }
                    if (isAdmin) {
                        try (PreparedStatement pst = conn
                                .prepareStatement("SELECT * FROM CASA WHERE ativo = true ORDER BY data_criacao DESC")) {
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    } else {
                        try (PreparedStatement pst = conn.prepareStatement(
                                "SELECT * FROM CASA WHERE ativo = true AND id_conta = ? ORDER BY data_criacao DESC")) {
                            pst.setInt(1, Integer.parseInt(contaIdParam));
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    }
                } else {
                    // Sem contaId: retorna lista vazia (segurança - não expor casas de outros)
                    // Retorna array vazio ao invés de todas as casas
                }
            }
            return gson.toJson(casas);
        });

        delete("/api/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                try (PreparedStatement stmt = conn
                        .prepareStatement("UPDATE CASA SET ativo = false WHERE id_casa = ?")) {
                    stmt.setLong(1, id);
                    int updated = stmt.executeUpdate();
                    if (updated == 0) {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Casa não encontrada"));
                    }
                }
                res.status(204);
                return "";
            } catch (SQLException e) {
                System.err.println("[CasaController] Erro ao deletar casa (/api): " + e.getMessage());
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao deletar casa: " + e.getMessage()));
            }
        });

        // GET: Listar usuários de uma casa (dedup por usuário)
        get("/api/casas/:id/usuarios", (req, res) -> {
            res.type("application/json");
            long idCasa = Long.parseLong(req.params(":id"));
            List<Map<String, Object>> usuarios = new ArrayList<>();

            try (Connection conn = Database.connect()) {
                String sql = """
                            SELECT
                                u.id_usuario as idUsuario,
                                u.nome,
                                u.email,
                                MAX(uc.permissao) as permissao
                            FROM USUARIO_CASA uc
                            JOIN USUARIO u ON uc.id_usuario = u.id_usuario
                            WHERE uc.id_casa = ?
                            GROUP BY u.id_usuario, u.nome, u.email
                            ORDER BY u.nome
                        """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    while (rs.next()) {
                        Map<String, Object> usuario = new HashMap<>();
                        usuario.put("idUsuario", rs.getLong("idUsuario"));
                        usuario.put("nome", rs.getString("nome"));
                        usuario.put("email", rs.getString("email"));
                        usuario.put("permissao", rs.getString("permissao"));
                        usuarios.add(usuario);
                    }
                }

                res.status(200);
                return gson.toJson(usuarios);

            } catch (SQLException e) {
                System.err.println("[CasaController] Erro ao listar usuários da casa: " + e.getMessage());
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao listar usuários: " + e.getMessage()));
            }
        });
        post("/api/casas/:id/usuarios", (req, res) -> {
            res.type("application/json");
            try {
                long casaId = Long.parseLong(req.params(":id"));
                var body = gson.fromJson(req.body(), Map.class);

                int idUsuario = ((Double) body.get("idUsuario")).intValue();
                String permissao = (String) body.getOrDefault("permissao", "Membro");

                try (Connection conn = Database.connect()) {
                    // Verificar se já existe
                    String checkSql = "SELECT COUNT(*) FROM USUARIO_CASA WHERE id_casa = ? AND id_usuario = ?";
                    try (PreparedStatement check = conn.prepareStatement(checkSql)) {
                        check.setLong(1, casaId);
                        check.setInt(2, idUsuario);
                        ResultSet rs = check.executeQuery();
                        if (rs.next() && rs.getInt(1) > 0) {
                            res.status(400);
                            return gson.toJson(Map.of("error", "Usuário já está na casa"));
                        }
                    }

                    // Inserir
                    String sql = "INSERT INTO USUARIO_CASA (id_casa, id_usuario, permissao) VALUES (?, ?, ?)";
                    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                        stmt.setLong(1, casaId);
                        stmt.setInt(2, idUsuario);
                        stmt.setString(3, permissao);
                        stmt.executeUpdate();
                    }

                    res.status(201);
                    return gson.toJson(Map.of("success", true, "idUsuario", idUsuario, "permissao", permissao));
                }
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(Map.of("error", e.getMessage()));
            }
        });

        // POST /api/casas/:id/usuarios/create - Criar usuário novo e associar à casa
        post("/api/casas/:id/usuarios/create", (req, res) -> {
            res.type("application/json");
            try {
                long casaId = Long.parseLong(req.params(":id"));
                var body = gson.fromJson(req.body(), Map.class);

                String nome = (String) body.get("nome");
                String email = (String) body.get("email");
                String senha = (String) body.get("senha");
                String permissao = (String) body.getOrDefault("permissao", "Membro");

                if (nome == null || email == null || senha == null) {
                    res.status(400);
                    return gson.toJson(Map.of("error", "Campos obrigatórios: nome, email, senha"));
                }

                try (Connection conn = Database.connect()) {
                    conn.setAutoCommit(false);

                    // Criar usuário
                    String createUserSql = "INSERT INTO USUARIO (nome, email, senha, ativo) VALUES (?, ?, ?, true) RETURNING id_usuario";
                    int newUserId;
                    try (PreparedStatement stmt = conn.prepareStatement(createUserSql)) {
                        stmt.setString(1, nome);
                        stmt.setString(2, email);
                        stmt.setString(3, senha);
                        ResultSet rs = stmt.executeQuery();
                        if (rs.next()) {
                            newUserId = rs.getInt(1);
                        } else {
                            conn.rollback();
                            res.status(500);
                            return gson.toJson(Map.of("error", "Falha ao criar usuário"));
                        }
                    }

                    // Associar à casa
                    String linkSql = "INSERT INTO USUARIO_CASA (id_casa, id_usuario, permissao) VALUES (?, ?, ?)";
                    try (PreparedStatement stmt = conn.prepareStatement(linkSql)) {
                        stmt.setLong(1, casaId);
                        stmt.setInt(2, newUserId);
                        stmt.setString(3, permissao);
                        stmt.executeUpdate();
                    }

                    conn.commit();
                    res.status(201);
                    return gson.toJson(Map.of("success", true, "idUsuario", newUserId, "nome", nome, "email", email));
                }
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(Map.of("error", e.getMessage()));
            }
        });

        // DELETE /api/casas/:idCasa/usuarios/:idUsuario - Remover usuário da casa
        delete("/api/casas/:idCasa/usuarios/:idUsuario", (req, res) -> {
            res.type("application/json");
            try {
                long casaId = Long.parseLong(req.params(":idCasa"));
                int userId = Integer.parseInt(req.params(":idUsuario"));

                try (Connection conn = Database.connect()) {
                    String sql = "DELETE FROM USUARIO_CASA WHERE id_casa = ? AND id_usuario = ?";
                    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                        stmt.setLong(1, casaId);
                        stmt.setInt(2, userId);
                        int affected = stmt.executeUpdate();

                        if (affected > 0) {
                            res.status(200);
                            return gson.toJson(Map.of("success", true));
                        } else {
                            res.status(404);
                            return gson.toJson(Map.of("error", "Associação não encontrada"));
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(Map.of("error", e.getMessage()));
            }
        });
    }
}
