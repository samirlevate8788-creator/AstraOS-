CREATE TABLE IF NOT EXISTS bug_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(160) NOT NULL CHECK (length(trim(title)) BETWEEN 5 AND 160),
    category VARCHAR(32) NOT NULL CHECK (category IN (
        'boot', 'desktop', 'network', 'audio', 'display', 'security', 'office', 'other'
    )),
    description TEXT NOT NULL CHECK (length(trim(description)) BETWEEN 20 AND 10000),
    astraos_version VARCHAR(40) NOT NULL DEFAULT 'unknown',
    boot_mode VARCHAR(16) CHECK (boot_mode IN ('bios', 'uefi', 'vm', 'unknown')),
    hardware_summary VARCHAR(500),
    contact_email VARCHAR(254),
    status VARCHAR(16) NOT NULL DEFAULT 'open' CHECK (status IN (
        'open', 'triaged', 'in_progress', 'resolved', 'closed'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT bug_reports_email_shape CHECK (
        contact_email IS NULL OR contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    )
);

CREATE INDEX IF NOT EXISTS bug_reports_status_created_idx
    ON bug_reports (status, created_at DESC);
