# MessAway Database Migration Guide
## From 17-Table Legacy Schema to 8-Table Optimized Schema

### 📊 **Schema Migration Overview**

#### **Table Mappings:**
| **Legacy Tables (17)** | **New Tables (8)** | **Status** |
|------------------------|-------------------|------------|
| `USUARIO` + `CONTA` + `CONTA_USUARIO` | `users` | ✅ Updated |
| `CASA` | `houses` | 🔄 Needs Update |
| `COMODO` + `CATEGORIA` | `rooms` | 🔄 Needs Update |
| `TAREFA` | `tasks` | 🔄 Needs Update |
| `GASTO` + `META_GASTO` + `GASTO_USUARIO` + `META_GASTO_USUARIO` | `expenses` | 🔄 Needs Update |
| `USUARIO_CASA` | `user_houses` | 🔄 Needs Update |
| `ACHIEVEMENT` + `USUARIO_ACHIEVEMENT` + `CASA_ACHIEVEMENT` + `CASA_POINTS_LOG` | `achievements` | 🔄 Needs Update |
| `INSIGHT` | `app_settings` | 🔄 Needs Update |

---

## 🏗️ **Backend Updates Required**

### **1. Controllers to Update:**

#### **UsuarioController.java**
- ✅ **Model Updated**: `UsuarioDAO.java` already updated
- 🔄 **Controller**: Update SQL queries in controller methods
- 🔄 **Routes**: Maintain backward compatibility

**Key Changes:**
```sql
-- OLD: SELECT id_usuario, nome, email FROM USUARIO WHERE...
-- NEW: SELECT id, full_name, email FROM users WHERE...
```

#### **CasaController.java** 
- 🔄 **Table**: `CASA` → `houses`
- 🔄 **Columns**: `id_casa` → `id`, `nome` → `name`
- 🔄 **New**: Add `owner_id`, `settings` JSON field

#### **TarefaController.java**
- 🔄 **Table**: `TAREFA` → `tasks`  
- 🔄 **Joins**: Update complex joins with `COMODO`/`CATEGORIA`
- 🔄 **New**: `status`, `priority`, `metadata` JSON

#### **ContaController.java**
- 🔄 **Migration**: Logic now handled by `users` table
- 🔄 **Routes**: Redirect to user management endpoints

#### **UsuarioCasaController.java**
- 🔄 **Table**: `USUARIO_CASA` → `user_houses`
- 🔄 **Columns**: Add `role`, `nickname`, `points`

### **2. SQL Query Updates:**

#### **User Queries:**
```sql
-- OLD SQL
INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?)
SELECT id_usuario, nome, email FROM USUARIO WHERE id_usuario = ?

-- NEW SQL  
INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)
SELECT id, full_name, email FROM users WHERE id = ?
```

#### **House Queries:**
```sql
-- OLD SQL
SELECT id_casa, nome, descricao FROM CASA WHERE ativo = true

-- NEW SQL
SELECT id, name, description, owner_id, settings FROM houses WHERE active = true
```

#### **Task Queries:**
```sql
-- OLD SQL (Complex Join)
SELECT t.id_tarefa, t.nome, c.nome as comodo, cat.nome as categoria 
FROM TAREFA t 
JOIN COMODO c ON t.id_comodo = c.id_comodo 
JOIN CATEGORIA cat ON t.id_categoria = cat.id_categoria

-- NEW SQL (Simplified)
SELECT t.id, t.title, r.name as room_name, r.category 
FROM tasks t 
JOIN rooms r ON t.room_id = r.id
```

---

## 🎨 **Frontend Updates Required**

### **3. API Endpoint Updates:**

#### **usuarios.js**
```javascript
// OLD: Calls to /usuarios endpoint with USUARIO table structure
// NEW: Update to use new user fields

// OLD
const user = { nome, email, senha }
// NEW  
const user = { full_name: nome, email, password_hash: senha }
```

#### **casas.js**
```javascript
// OLD: { idCasa, nome, descricao }
// NEW: { id, name, description, owner_id, settings }
```

#### **tarefas.js**
```javascript
// OLD: { idTarefa, nome, idComodo, idCategoria }
// NEW: { id, title, room_id, status, priority }
```

### **4. Component Updates:**

#### **Frontend Field Mappings:**
```javascript
// User fields
usuario.nome → user.full_name
usuario.id_usuario → user.id  
usuario.senha → user.password_hash

// House fields  
casa.idCasa → house.id
casa.nome → house.name
casa.pontos → house.total_points

// Task fields
tarefa.idTarefa → task.id
tarefa.nome → task.title
tarefa.concluida → task.status === 'completed'
tarefa.idComodo → task.room_id
```

---

## 🚀 **Migration Steps**

### **Phase 1: Backend Models** ✅ 
- [x] Created new model classes: `User`, `House`, `Room`, `Task`, `UserHouse`
- [x] Updated `UsuarioDAO` with new schema queries
- [x] Added legacy compatibility methods

### **Phase 2: Controllers** 🔄
1. Update `UsuarioController` SQL queries
2. Update `CasaController` for houses table
3. Update `TarefaController` for tasks/rooms join
4. Update `UsuarioCasaController` for user_houses

### **Phase 3: Frontend** 🔄  
1. Update API calls in `/api/` folder
2. Update component field mappings
3. Test all user interactions

### **Phase 4: Testing** ⏳
1. Deploy optimized schema to Azure
2. Run integration tests
3. Validate 50% cost reduction

---

## 🔧 **Backward Compatibility Strategy**

### **Legacy Support:**
- All new model classes include legacy getter/setter methods
- Controllers maintain old endpoint formats during transition
- Frontend gradually migrates to new field names
- Database views can provide legacy table compatibility if needed

### **Migration Rollback:**
- Keep old schema documentation 
- Maintain migration scripts for rollback
- Test rollback procedures before deployment

---

## 📈 **Expected Benefits**

- **53% table reduction**: 17 → 8 tables
- **50% Azure cost savings**: Simplified queries and reduced complexity  
- **Better performance**: Optimized indexes and JSON fields
- **Easier maintenance**: Fewer tables and relationships
- **Modern architecture**: JSON fields for flexible data storage

---

## ✅ **Next Actions**

1. **Complete Controller Updates** (in progress)
2. **Update Frontend API Calls**  
3. **Deploy to Azure Database**
4. **Run Full Integration Tests**
5. **Monitor Performance and Costs**