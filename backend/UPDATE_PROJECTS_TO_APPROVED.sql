-- Update some projects to 'approved' stage for testing public listing
-- Run this to make projects visible on the main Projects page

UPDATE projects
SET
  workflow_stage = 'approved',
  status = 'active',
  verified = TRUE,
  workflow_completed_at = NOW()
WHERE id IN (5, 7, 9, 11) -- These are "under_verification" projects
LIMIT 4;

-- Check results
SELECT
  id,
  title,
  workflow_stage,
  status,
  verified
FROM projects
WHERE workflow_stage = 'approved';
