-- Migration: Support multiple casas per conta and admin accounts
-- Date: 2025-10-23

-- 1) Add id_conta to CASA for 1:N (CONTA -> CASA)
ALTER TABLE CASA ADD COLUMN IF NOT EXISTS id_conta INTEGER NULL;

-- 2) Backfill: if your schema previously used CONTA.id_casa, copy that relation to CASA.id_conta
--    This assumes (id_casa) in CONTA pointed to a CASA row and means one casa per conta.
--    Safe to run multiple times due to idempotent update semantics.
UPDATE CASA c
SET id_conta = ct.id_conta
FROM CONTA ct
WHERE ct.id_casa IS NOT NULL
  AND ct.id_casa = c.id_casa
  AND (c.id_conta IS NULL OR c.id_conta <> ct.id_conta);

-- 3) Add foreign key (optional if you prefer to keep it logical-only)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'casa' AND constraint_type = 'FOREIGN KEY' AND constraint_name = 'fk_casa_id_conta'
    ) THEN
        ALTER TABLE CASA
        ADD CONSTRAINT fk_casa_id_conta FOREIGN KEY (id_conta) REFERENCES CONTA(id_conta) ON DELETE SET NULL;
    END IF;
END $$;

-- 4) Add is_admin flag to CONTA for admin accounts
ALTER TABLE CONTA ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 5) (Optional) Create a default admin account for maintenance
--    NOTE: Change email/senha as desired, and only run once in non-prod environments.
-- INSERT INTO CONTA (nome, email, senha, is_admin)
-- VALUES ('Administrador', 'admin@messaway.local', 'admin', TRUE);

-- 6) (Optional) You may consider dropping CONTA.id_casa after verifying the app has migrated.
-- ALTER TABLE CONTA DROP COLUMN id_casa;  -- Only do this when confident.
