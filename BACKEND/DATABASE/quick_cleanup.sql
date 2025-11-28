-- MessAway One-Line Nuclear Cleanup
-- WARNING: This deletes EVERYTHING! No recovery possible!

-- Option 1: Delete specific MessAway tables
DROP TABLE IF EXISTS CASA_POINTS_LOG, CASA_ACHIEVEMENT, USUARIO_ACHIEVEMENT, ACHIEVEMENT, META_GASTO_USUARIO, GASTO_USUARIO, META_GASTO, GASTO, INSIGHT, TAREFA, CATEGORIA, COMODO, USUARIO_CASA, CONTA_USUARIO, CASA, USUARIO, CONTA CASCADE;

-- Option 2: Delete ALL tables (nuclear option)
-- DO $$ DECLARE table_name TEXT; BEGIN FOR table_name IN SELECT t.table_name FROM information_schema.tables t WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE' LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(table_name) || ' CASCADE'; END LOOP; END $$;