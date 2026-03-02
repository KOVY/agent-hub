-- AgentForge.eu — Seed Data: 10 KOWEX Servers + 30+ Tools
-- These are the first-party MCP servers (dogfooding)

-- ============================================================
-- 1. Ucetni Prevodnik (Accounting Converter)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, version, tags, documentation_url)
values (
  'ucetni-prevodnik',
  'Účetní Převodník',
  'Czech accounting format converter — transforms between ISDOC, EDI, and standard EU invoice formats.',
  'The essential tool for Czech and EU accounting workflows. Convert invoices between ISDOC (Czech national standard), ISDOCX, EDI (EDIFACT), UBL 2.1, and Factur-X formats. Validates VAT IDs against VIES, checks CZ-specific fields (DIČ, IČO), and ensures compliance with Czech accounting law (Zákon o účetnictví). Used by 50+ Czech accounting firms.',
  'finance',
  'freemium', 9.90, 200,
  9.2, true, true, 4,
  '1.2.0',
  array['accounting', 'czech', 'isdoc', 'invoice', 'eu-compliance'],
  'https://docs.agentforge.eu/ucetni-prevodnik'
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'ucetni-prevodnik'),
 'convert_invoice',
 'Convert invoice between formats (ISDOC, UBL, Factur-X, EDI)',
 '{"type":"object","properties":{"source_format":{"type":"string","enum":["isdoc","isdocx","ubl","facturx","edi"]},"target_format":{"type":"string","enum":["isdoc","isdocx","ubl","facturx","edi"]},"invoice_data":{"type":"string","description":"Base64 encoded invoice document"}},"required":["source_format","target_format","invoice_data"]}',
 '{"type":"object","properties":{"converted_document":{"type":"string"},"format":{"type":"string"},"validation_passed":{"type":"boolean"}}}',
 '{"source_format":"isdoc","target_format":"ubl","invoice_data":"PD94bWw..."}',
 '{"converted_document":"PD94bWw...","format":"ubl","validation_passed":true}'
),
((select id from mcp_servers where slug = 'ucetni-prevodnik'),
 'validate_vat_id',
 'Validate EU VAT ID against VIES database',
 '{"type":"object","properties":{"vat_id":{"type":"string","description":"EU VAT ID (e.g. CZ12345678)"}},"required":["vat_id"]}',
 '{"type":"object","properties":{"valid":{"type":"boolean"},"company_name":{"type":"string"},"address":{"type":"string"},"country":{"type":"string"}}}',
 '{"vat_id":"CZ12345678"}',
 '{"valid":true,"company_name":"KOWEX Co. s.r.o.","address":"Praha 1, Vodičkova 30","country":"CZ"}'
),
((select id from mcp_servers where slug = 'ucetni-prevodnik'),
 'validate_invoice',
 'Validate invoice against Czech accounting law and EU standards',
 '{"type":"object","properties":{"format":{"type":"string","enum":["isdoc","ubl","facturx"]},"invoice_data":{"type":"string"}},"required":["format","invoice_data"]}',
 '{"type":"object","properties":{"valid":{"type":"boolean"},"errors":{"type":"array","items":{"type":"string"}},"warnings":{"type":"array","items":{"type":"string"}}}}',
 '{"format":"isdoc","invoice_data":"PD94bWw..."}',
 '{"valid":true,"errors":[],"warnings":["Missing optional field: OrderReference"]}'
),
((select id from mcp_servers where slug = 'ucetni-prevodnik'),
 'extract_invoice_data',
 'Extract structured data from invoice document (OCR + parsing)',
 '{"type":"object","properties":{"document":{"type":"string","description":"Base64 encoded PDF or image"},"language":{"type":"string","default":"cs"}},"required":["document"]}',
 '{"type":"object","properties":{"invoice_number":{"type":"string"},"date":{"type":"string"},"due_date":{"type":"string"},"total":{"type":"number"},"currency":{"type":"string"},"vendor":{"type":"object"},"items":{"type":"array"}}}',
 '{"document":"JVBERi0...","language":"cs"}',
 '{"invoice_number":"FV-2026-001","date":"2026-03-01","due_date":"2026-03-15","total":12100,"currency":"CZK","vendor":{"name":"KOWEX Co.","ico":"12345678"},"items":[{"description":"Consulting","amount":10000,"vat_rate":21}]}'
);

-- ============================================================
-- 2. PhantomOffice (AI Office Assistant)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, version, tags)
values (
  'phantom-office',
  'PhantomOffice',
  'AI-powered virtual office assistant — handles scheduling, document generation, and team coordination.',
  'PhantomOffice is an autonomous office management suite. It handles meeting scheduling with timezone awareness, generates professional documents (contracts, proposals, reports) from templates, manages team task queues, and provides natural-language access to company knowledge bases. Supports Czech, English, German, and Slovak.',
  'productivity',
  'freemium', 19.90, 100,
  8.8, true, true, 3,
  '2.0.0',
  array['office', 'scheduling', 'documents', 'ai-assistant', 'multilingual']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'phantom-office'),
 'schedule_meeting',
 'Find optimal meeting time across participants and schedule it',
 '{"type":"object","properties":{"participants":{"type":"array","items":{"type":"string"}},"duration_minutes":{"type":"integer"},"preferred_window":{"type":"object","properties":{"start":{"type":"string"},"end":{"type":"string"}}},"timezone":{"type":"string","default":"Europe/Prague"}},"required":["participants","duration_minutes"]}',
 '{"type":"object","properties":{"scheduled":{"type":"boolean"},"datetime":{"type":"string"},"meeting_url":{"type":"string"},"conflicts":{"type":"array"}}}',
 '{"participants":["jan@kowex.eu","petra@kowex.eu"],"duration_minutes":30,"timezone":"Europe/Prague"}',
 '{"scheduled":true,"datetime":"2026-03-05T10:00:00+01:00","meeting_url":"https://meet.kowex.eu/abc123","conflicts":[]}'
),
((select id from mcp_servers where slug = 'phantom-office'),
 'generate_document',
 'Generate professional document from template and data',
 '{"type":"object","properties":{"template":{"type":"string","enum":["contract","proposal","report","invoice","nda"]},"data":{"type":"object"},"language":{"type":"string","default":"cs"},"format":{"type":"string","enum":["pdf","docx","html"],"default":"pdf"}},"required":["template","data"]}',
 '{"type":"object","properties":{"document_url":{"type":"string"},"format":{"type":"string"},"pages":{"type":"integer"}}}',
 '{"template":"proposal","data":{"client":"Acme Corp","project":"AI Integration","budget":50000},"language":"en","format":"pdf"}',
 '{"document_url":"https://docs.phantom.office/gen/prop-2026-001.pdf","format":"pdf","pages":4}'
),
((select id from mcp_servers where slug = 'phantom-office'),
 'search_knowledge',
 'Search company knowledge base with natural language',
 '{"type":"object","properties":{"query":{"type":"string"},"scope":{"type":"string","enum":["all","docs","emails","chat","wiki"],"default":"all"},"limit":{"type":"integer","default":10}},"required":["query"]}',
 '{"type":"object","properties":{"results":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"snippet":{"type":"string"},"source":{"type":"string"},"relevance":{"type":"number"}}}}}}',
 '{"query":"GDPR compliance policy for customer data","scope":"wiki"}',
 '{"results":[{"title":"GDPR Data Processing Policy v3","snippet":"All customer PII must be encrypted at rest...","source":"wiki/compliance/gdpr-v3","relevance":0.95}]}'
);

-- ============================================================
-- 3. DataForge (Data Pipeline Builder)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, version, tags)
values (
  'dataforge',
  'DataForge',
  'Serverless data pipeline builder — ETL, transformations, and analytics for AI agent workflows.',
  'Build and run data pipelines without infrastructure. DataForge handles CSV/JSON/Parquet ingestion, SQL transformations, data quality checks, and exports to any format. Integrates with Supabase, BigQuery, and S3. Perfect for AI agents that need to process, clean, and analyze datasets autonomously.',
  'data',
  'freemium', 14.90, 150,
  8.5, true, false, 3,
  '1.5.0',
  array['etl', 'data-pipeline', 'analytics', 'csv', 'sql', 'serverless']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'dataforge'),
 'transform_data',
 'Apply SQL transformation to dataset',
 '{"type":"object","properties":{"source":{"type":"string","description":"URL or base64 data"},"source_format":{"type":"string","enum":["csv","json","parquet"]},"sql":{"type":"string","description":"SQL query to transform data"},"output_format":{"type":"string","enum":["csv","json","parquet"],"default":"json"}},"required":["source","source_format","sql"]}',
 '{"type":"object","properties":{"data":{"type":"string"},"row_count":{"type":"integer"},"columns":{"type":"array","items":{"type":"string"}}}}',
 '{"source":"https://data.example.com/sales.csv","source_format":"csv","sql":"SELECT region, SUM(amount) as total FROM data GROUP BY region ORDER BY total DESC","output_format":"json"}',
 '{"data":"[{\"region\":\"EU\",\"total\":150000},{\"region\":\"US\",\"total\":120000}]","row_count":2,"columns":["region","total"]}'
),
((select id from mcp_servers where slug = 'dataforge'),
 'validate_data',
 'Run data quality checks on dataset',
 '{"type":"object","properties":{"source":{"type":"string"},"source_format":{"type":"string"},"rules":{"type":"array","items":{"type":"object","properties":{"column":{"type":"string"},"check":{"type":"string","enum":["not_null","unique","range","regex","type"]},"params":{"type":"object"}}}}},"required":["source","source_format","rules"]}',
 '{"type":"object","properties":{"passed":{"type":"boolean"},"total_rows":{"type":"integer"},"failed_rows":{"type":"integer"},"details":{"type":"array"}}}',
 '{"source":"data.csv","source_format":"csv","rules":[{"column":"email","check":"regex","params":{"pattern":"^[^@]+@[^@]+$"}}]}',
 '{"passed":false,"total_rows":1000,"failed_rows":3,"details":[{"row":42,"column":"email","value":"invalid","check":"regex"}]}'
),
((select id from mcp_servers where slug = 'dataforge'),
 'export_data',
 'Export processed data to external storage (S3, Supabase, BigQuery)',
 '{"type":"object","properties":{"data":{"type":"string"},"destination":{"type":"string","enum":["s3","supabase","bigquery","webhook"]},"config":{"type":"object"}},"required":["data","destination","config"]}',
 '{"type":"object","properties":{"success":{"type":"boolean"},"destination_url":{"type":"string"},"rows_written":{"type":"integer"}}}',
 '{"data":"[{\"id\":1,\"name\":\"test\"}]","destination":"supabase","config":{"table":"imports","schema":"public"}}',
 '{"success":true,"destination_url":"supabase://public.imports","rows_written":1}'
);

-- ============================================================
-- 4. LegalEagle (Legal Document Analyzer)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, is_featured, total_tools, version, tags)
values (
  'legal-eagle',
  'LegalEagle',
  'AI legal document analyzer — contract review, risk detection, and compliance checking for EU law.',
  'LegalEagle analyzes legal documents with focus on EU and Czech law. It identifies risky clauses, checks GDPR compliance, compares contracts against standard templates, and generates plain-language summaries. Supports contracts, NDAs, terms of service, and employment agreements.',
  'legal',
  'paid', 29.90, 50,
  9.0, true, true, 3,
  '1.0.0',
  array['legal', 'contracts', 'gdpr', 'compliance', 'eu-law', 'czech-law']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'legal-eagle'),
 'analyze_contract',
 'Analyze contract for risks, unusual clauses, and missing provisions',
 '{"type":"object","properties":{"document":{"type":"string","description":"Base64 encoded document"},"document_type":{"type":"string","enum":["contract","nda","tos","employment","lease"]},"jurisdiction":{"type":"string","default":"CZ"}},"required":["document","document_type"]}',
 '{"type":"object","properties":{"risk_level":{"type":"string","enum":["low","medium","high","critical"]},"risks":{"type":"array"},"missing_clauses":{"type":"array"},"summary":{"type":"string"}}}',
 '{"document":"JVBERi0...","document_type":"contract","jurisdiction":"CZ"}',
 '{"risk_level":"medium","risks":[{"clause":"§7.2 Liability","risk":"Unlimited liability for service provider","severity":"high"}],"missing_clauses":["Force Majeure","GDPR Data Processing Agreement"],"summary":"Standard service contract with one high-risk liability clause and missing GDPR addendum."}'
),
((select id from mcp_servers where slug = 'legal-eagle'),
 'check_gdpr_compliance',
 'Check document or process for GDPR compliance',
 '{"type":"object","properties":{"document":{"type":"string"},"processing_description":{"type":"string","description":"Description of data processing activity"}},"required":[]}',
 '{"type":"object","properties":{"compliant":{"type":"boolean"},"issues":{"type":"array"},"recommendations":{"type":"array"},"lawful_basis":{"type":"string"}}}',
 '{"processing_description":"Collecting user emails for newsletter signup with checkbox consent"}',
 '{"compliant":true,"issues":[],"recommendations":["Add double opt-in mechanism","Include unsubscribe link in every email","Document consent in processing register"],"lawful_basis":"consent"}'
),
((select id from mcp_servers where slug = 'legal-eagle'),
 'generate_summary',
 'Generate plain-language summary of legal document',
 '{"type":"object","properties":{"document":{"type":"string"},"language":{"type":"string","default":"cs"},"detail_level":{"type":"string","enum":["brief","standard","detailed"],"default":"standard"}},"required":["document"]}',
 '{"type":"object","properties":{"summary":{"type":"string"},"key_terms":{"type":"array","items":{"type":"object","properties":{"term":{"type":"string"},"explanation":{"type":"string"}}}},"effective_date":{"type":"string"},"parties":{"type":"array"}}}',
 '{"document":"JVBERi0...","language":"en","detail_level":"brief"}',
 '{"summary":"Service agreement between KOWEX Co. and Client Corp for software development. 12-month term, €50K budget, IP transfers to client upon payment.","key_terms":[{"term":"IP Transfer","explanation":"All intellectual property created transfers to client after final payment"}],"effective_date":"2026-03-01","parties":["KOWEX Co. s.r.o.","Client Corp Ltd."]}'
);

-- ============================================================
-- 5. BreederOS (Breeding Management)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'breeder-os',
  'BreederOS',
  'Professional breeding management — genetics calculator, pedigree tracking, and health records.',
  'Complete breeding management platform for professional breeders. Calculate genetic compatibility (COI), generate pedigree charts, track health screenings, manage litter records, and automate kennel club registrations. Supports FCI, AKC, and KC standards.',
  'ai',
  'freemium', 12.90, 100,
  8.0, true, 3,
  '1.0.0',
  array['breeding', 'genetics', 'pedigree', 'health', 'animals']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'breeder-os'),
 'calculate_genetics',
 'Calculate genetic compatibility and COI (coefficient of inbreeding)',
 '{"type":"object","properties":{"sire_id":{"type":"string"},"dam_id":{"type":"string"},"generations":{"type":"integer","default":5}},"required":["sire_id","dam_id"]}',
 '{"type":"object","properties":{"coi":{"type":"number"},"risk_level":{"type":"string"},"common_ancestors":{"type":"array"},"health_risks":{"type":"array"}}}',
 '{"sire_id":"dog-001","dam_id":"dog-002","generations":5}',
 '{"coi":3.2,"risk_level":"low","common_ancestors":[{"name":"Champion Rex","generation":4}],"health_risks":[]}'
),
((select id from mcp_servers where slug = 'breeder-os'),
 'generate_pedigree',
 'Generate visual pedigree chart for an animal',
 '{"type":"object","properties":{"animal_id":{"type":"string"},"generations":{"type":"integer","default":4},"format":{"type":"string","enum":["svg","pdf","json"],"default":"json"}},"required":["animal_id"]}',
 '{"type":"object","properties":{"pedigree":{"type":"object"},"format":{"type":"string"},"titles":{"type":"array"}}}',
 '{"animal_id":"dog-001","generations":3,"format":"json"}',
 '{"pedigree":{"name":"Champion Bella","sire":{"name":"Rex","sire":{"name":"Duke"},"dam":{"name":"Lady"}},"dam":{"name":"Luna","sire":{"name":"Max"},"dam":{"name":"Daisy"}}},"format":"json","titles":["CH","JCH"]}'
),
((select id from mcp_servers where slug = 'breeder-os'),
 'health_screening',
 'Record and analyze health screening results',
 '{"type":"object","properties":{"animal_id":{"type":"string"},"test_type":{"type":"string","enum":["hip","elbow","eye","heart","dna"]},"results":{"type":"object"}},"required":["animal_id","test_type","results"]}',
 '{"type":"object","properties":{"recorded":{"type":"boolean"},"assessment":{"type":"string"},"breeding_recommendation":{"type":"string"}}}',
 '{"animal_id":"dog-001","test_type":"hip","results":{"left":"A","right":"A"}}',
 '{"recorded":true,"assessment":"Excellent - Grade A bilateral","breeding_recommendation":"Cleared for breeding"}'
);

-- ============================================================
-- 6. SvatbyApp (Wedding Planner)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'svatby-app',
  'SvatbyApp',
  'AI wedding planner — venue matching, budget optimization, and guest management for Czech weddings.',
  'Complete AI-powered wedding planning assistant tailored for Czech and Slovak markets. Matches venues by capacity and style, optimizes budgets with local vendor prices, manages guest RSVPs, generates seating arrangements, and creates timelines. Knows Czech wedding traditions and etiquette.',
  'productivity',
  'freemium', 7.90, 200,
  7.5, true, 3,
  '1.0.0',
  array['wedding', 'planning', 'events', 'czech', 'venues']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'svatby-app'),
 'match_venues',
 'Find and rank wedding venues by preferences',
 '{"type":"object","properties":{"region":{"type":"string"},"guest_count":{"type":"integer"},"style":{"type":"string","enum":["castle","rustic","modern","garden","vineyard"]},"budget_max":{"type":"number"},"date":{"type":"string"}},"required":["region","guest_count"]}',
 '{"type":"object","properties":{"venues":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"location":{"type":"string"},"capacity":{"type":"integer"},"price_from":{"type":"number"},"rating":{"type":"number"},"available":{"type":"boolean"}}}}}}',
 '{"region":"Jihomoravský kraj","guest_count":80,"style":"vineyard","budget_max":300000}',
 '{"venues":[{"name":"Vinný sklep U Kapličky","location":"Zaječí","capacity":100,"price_from":85000,"rating":4.8,"available":true}]}'
),
((select id from mcp_servers where slug = 'svatby-app'),
 'optimize_budget',
 'Optimize wedding budget across categories',
 '{"type":"object","properties":{"total_budget":{"type":"number","description":"Total budget in CZK"},"guest_count":{"type":"integer"},"priorities":{"type":"array","items":{"type":"string","enum":["venue","food","photo","music","flowers","dress"]}}},"required":["total_budget","guest_count"]}',
 '{"type":"object","properties":{"allocation":{"type":"object"},"per_guest_cost":{"type":"number"},"savings_tips":{"type":"array"}}}',
 '{"total_budget":400000,"guest_count":80,"priorities":["food","photo"]}',
 '{"allocation":{"venue":100000,"food":120000,"photo":35000,"music":20000,"flowers":15000,"dress":25000,"other":85000},"per_guest_cost":5000,"savings_tips":["Consider Sunday ceremony for 20% venue discount"]}'
),
((select id from mcp_servers where slug = 'svatby-app'),
 'generate_seating',
 'Generate optimal seating arrangement',
 '{"type":"object","properties":{"guests":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"group":{"type":"string"},"preferences":{"type":"array"}}}},"table_size":{"type":"integer","default":8}},"required":["guests"]}',
 '{"type":"object","properties":{"tables":{"type":"array","items":{"type":"object","properties":{"table_number":{"type":"integer"},"guests":{"type":"array"}}}},"conflicts_resolved":{"type":"integer"}}}',
 '{"guests":[{"name":"Jan","group":"family","preferences":["near_bride"]},{"name":"Petra","group":"family"}],"table_size":8}',
 '{"tables":[{"table_number":1,"guests":["Jan","Petra"]}],"conflicts_resolved":0}'
);

-- ============================================================
-- 7. EUComplianceBot (Regulatory Compliance)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'eu-compliance-bot',
  'EUComplianceBot',
  'Automated EU regulatory compliance checking — GDPR, AI Act, NIS2, and DORA readiness assessments.',
  'Stay compliant with evolving EU regulations. EUComplianceBot checks your systems, processes, and documentation against GDPR, the EU AI Act, NIS2 Directive, and DORA requirements. Generates compliance reports, identifies gaps, and suggests remediation steps. Updated weekly with latest regulatory guidance.',
  'legal',
  'paid', 39.90, 30,
  9.5, true, 3,
  '2.1.0',
  array['compliance', 'gdpr', 'ai-act', 'nis2', 'dora', 'eu-regulation']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'eu-compliance-bot'),
 'assess_compliance',
 'Run compliance assessment against specific EU regulation',
 '{"type":"object","properties":{"regulation":{"type":"string","enum":["gdpr","ai-act","nis2","dora"]},"assessment_data":{"type":"object","description":"System/process description and documentation"},"scope":{"type":"string","enum":["full","quick","specific"],"default":"quick"}},"required":["regulation","assessment_data"]}',
 '{"type":"object","properties":{"compliance_score":{"type":"number"},"status":{"type":"string","enum":["compliant","partial","non-compliant"]},"gaps":{"type":"array"},"recommendations":{"type":"array"}}}',
 '{"regulation":"ai-act","assessment_data":{"system_type":"chatbot","risk_level":"limited","documentation":true},"scope":"quick"}',
 '{"compliance_score":72,"status":"partial","gaps":["Missing transparency notice for AI-generated content","No human oversight mechanism documented"],"recommendations":["Add AI disclosure banner","Implement human-in-the-loop for edge cases"]}'
),
((select id from mcp_servers where slug = 'eu-compliance-bot'),
 'generate_report',
 'Generate formal compliance report',
 '{"type":"object","properties":{"regulation":{"type":"string"},"company_name":{"type":"string"},"assessment_id":{"type":"string"},"language":{"type":"string","default":"en"}},"required":["regulation","company_name"]}',
 '{"type":"object","properties":{"report_url":{"type":"string"},"format":{"type":"string"},"pages":{"type":"integer"},"executive_summary":{"type":"string"}}}',
 '{"regulation":"gdpr","company_name":"KOWEX Co.","language":"cs"}',
 '{"report_url":"https://compliance.agentforge.eu/reports/gdpr-kowex-2026.pdf","format":"pdf","pages":12,"executive_summary":"KOWEX Co. is 89% compliant with GDPR. Key gap: data retention policy needs update."}'
),
((select id from mcp_servers where slug = 'eu-compliance-bot'),
 'monitor_regulations',
 'Get latest updates and changes to EU regulations',
 '{"type":"object","properties":{"regulations":{"type":"array","items":{"type":"string"}},"since":{"type":"string","description":"ISO date"},"relevance_filter":{"type":"string"}},"required":["regulations"]}',
 '{"type":"object","properties":{"updates":{"type":"array","items":{"type":"object","properties":{"regulation":{"type":"string"},"title":{"type":"string"},"date":{"type":"string"},"impact":{"type":"string"},"url":{"type":"string"}}}}}}',
 '{"regulations":["ai-act","gdpr"],"since":"2026-01-01"}',
 '{"updates":[{"regulation":"ai-act","title":"EU AI Act: General-purpose AI model obligations take effect","date":"2026-02-02","impact":"high","url":"https://eur-lex.europa.eu/..."}]}'
);

-- ============================================================
-- 8. MailForge (Email Campaign Engine)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'mailforge',
  'MailForge',
  'AI email campaign engine — personalized content, A/B testing, and deliverability optimization.',
  'Create and send high-converting email campaigns with AI. MailForge generates personalized email content, optimizes send times per recipient, runs A/B tests automatically, and ensures maximum deliverability. Built-in GDPR compliance with automatic unsubscribe handling and consent tracking.',
  'communication',
  'freemium', 24.90, 100,
  8.2, true, 3,
  '1.3.0',
  array['email', 'marketing', 'campaigns', 'personalization', 'a-b-testing']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'mailforge'),
 'generate_email',
 'Generate personalized email content from template and recipient data',
 '{"type":"object","properties":{"template_id":{"type":"string"},"recipient":{"type":"object","properties":{"name":{"type":"string"},"company":{"type":"string"},"industry":{"type":"string"}}},"tone":{"type":"string","enum":["formal","casual","friendly"],"default":"friendly"},"language":{"type":"string","default":"en"}},"required":["template_id","recipient"]}',
 '{"type":"object","properties":{"subject":{"type":"string"},"body_html":{"type":"string"},"body_text":{"type":"string"},"personalization_score":{"type":"number"}}}',
 '{"template_id":"welcome","recipient":{"name":"Jan Novák","company":"TechCorp","industry":"SaaS"},"tone":"friendly","language":"cs"}',
 '{"subject":"Vítejte v AgentForge, Jene!","body_html":"<h1>Dobrý den, Jene</h1>...","body_text":"Dobrý den, Jene...","personalization_score":0.85}'
),
((select id from mcp_servers where slug = 'mailforge'),
 'optimize_send_time',
 'Calculate optimal send time for each recipient',
 '{"type":"object","properties":{"recipients":{"type":"array","items":{"type":"string"}},"campaign_type":{"type":"string","enum":["newsletter","promotional","transactional"]}},"required":["recipients","campaign_type"]}',
 '{"type":"object","properties":{"schedule":{"type":"array","items":{"type":"object","properties":{"recipient":{"type":"string"},"optimal_time":{"type":"string"},"predicted_open_rate":{"type":"number"}}}}}}',
 '{"recipients":["jan@example.com","petra@example.com"],"campaign_type":"newsletter"}',
 '{"schedule":[{"recipient":"jan@example.com","optimal_time":"2026-03-03T09:30:00+01:00","predicted_open_rate":0.42},{"recipient":"petra@example.com","optimal_time":"2026-03-03T14:15:00+01:00","predicted_open_rate":0.38}]}'
),
((select id from mcp_servers where slug = 'mailforge'),
 'analyze_campaign',
 'Analyze campaign performance and suggest improvements',
 '{"type":"object","properties":{"campaign_id":{"type":"string"}},"required":["campaign_id"]}',
 '{"type":"object","properties":{"open_rate":{"type":"number"},"click_rate":{"type":"number"},"bounce_rate":{"type":"number"},"unsubscribe_rate":{"type":"number"},"insights":{"type":"array","items":{"type":"string"}},"improvements":{"type":"array","items":{"type":"string"}}}}',
 '{"campaign_id":"camp-2026-02"}',
 '{"open_rate":0.35,"click_rate":0.08,"bounce_rate":0.02,"unsubscribe_rate":0.001,"insights":["Subject lines with questions had 20% higher open rate"],"improvements":["Add more CTAs in body","Test shorter subject lines"]}'
);

-- ============================================================
-- 9. CodeReviewBot (Automated Code Review)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'code-review-bot',
  'CodeReviewBot',
  'AI code review assistant — security scanning, performance analysis, and style enforcement.',
  'Automated code review powered by AI. CodeReviewBot scans PRs for security vulnerabilities (OWASP Top 10), identifies performance bottlenecks, checks coding style consistency, and suggests improvements. Supports TypeScript, Python, Go, and Rust. Integrates with GitHub and GitLab.',
  'development',
  'freemium', 19.90, 100,
  8.7, true, 3,
  '1.1.0',
  array['code-review', 'security', 'performance', 'github', 'typescript', 'python']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'code-review-bot'),
 'review_code',
 'Perform comprehensive code review',
 '{"type":"object","properties":{"code":{"type":"string"},"language":{"type":"string","enum":["typescript","python","go","rust"]},"focus":{"type":"array","items":{"type":"string","enum":["security","performance","style","bugs","all"]},"default":["all"]}},"required":["code","language"]}',
 '{"type":"object","properties":{"issues":{"type":"array","items":{"type":"object","properties":{"severity":{"type":"string"},"line":{"type":"integer"},"message":{"type":"string"},"suggestion":{"type":"string"}}}},"score":{"type":"number"},"summary":{"type":"string"}}}',
 '{"code":"const data = await fetch(url + userInput)","language":"typescript","focus":["security"]}',
 '{"issues":[{"severity":"critical","line":1,"message":"URL injection vulnerability: user input concatenated directly into URL","suggestion":"Use URL constructor with proper encoding: new URL(path, baseUrl)"}],"score":30,"summary":"Critical security issue: unsanitized user input in URL construction"}'
),
((select id from mcp_servers where slug = 'code-review-bot'),
 'scan_dependencies',
 'Scan project dependencies for vulnerabilities',
 '{"type":"object","properties":{"manifest":{"type":"string","description":"package.json, requirements.txt, etc."},"manifest_type":{"type":"string","enum":["npm","pip","cargo","go"]}},"required":["manifest","manifest_type"]}',
 '{"type":"object","properties":{"vulnerabilities":{"type":"array"},"outdated":{"type":"array"},"risk_score":{"type":"number"}}}',
 '{"manifest":"{\"dependencies\":{\"lodash\":\"4.17.20\"}}","manifest_type":"npm"}',
 '{"vulnerabilities":[{"package":"lodash","version":"4.17.20","cve":"CVE-2021-23337","severity":"high","fixed_in":"4.17.21"}],"outdated":[{"package":"lodash","current":"4.17.20","latest":"4.17.21"}],"risk_score":7.5}'
),
((select id from mcp_servers where slug = 'code-review-bot'),
 'suggest_tests',
 'Generate test suggestions for code',
 '{"type":"object","properties":{"code":{"type":"string"},"language":{"type":"string"},"framework":{"type":"string","enum":["jest","vitest","pytest","go-test"]}},"required":["code","language"]}',
 '{"type":"object","properties":{"test_cases":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"description":{"type":"string"},"code":{"type":"string"}}}},"coverage_estimate":{"type":"number"}}}',
 '{"code":"function add(a: number, b: number) { return a + b; }","language":"typescript","framework":"vitest"}',
 '{"test_cases":[{"name":"adds positive numbers","description":"Basic addition","code":"expect(add(1, 2)).toBe(3)"},{"name":"handles negative numbers","description":"Edge case","code":"expect(add(-1, -2)).toBe(-3)"}],"coverage_estimate":100}'
);

-- ============================================================
-- 10. TranslateHub (Multi-Language Translation)
-- ============================================================
insert into mcp_servers (slug, name, description, long_description, category, pricing_model, price_monthly, free_tier_calls, trust_score, is_verified, total_tools, version, tags)
values (
  'translate-hub',
  'TranslateHub',
  'EU-focused translation engine — supports all 24 EU languages with domain-specific terminology.',
  'High-quality translation engine optimized for EU languages and business terminology. TranslateHub handles document translation, glossary management, and localization workflows. Specializes in legal, technical, and business translations with custom glossaries per domain. 24 EU languages + Norwegian and Swiss German.',
  'communication',
  'freemium', 14.90, 300,
  8.3, true, 3,
  '2.0.0',
  array['translation', 'localization', 'eu-languages', 'business', 'legal-translation']
);

insert into mcp_tools (server_id, name, description, input_schema, output_schema, example_input, example_output) values
((select id from mcp_servers where slug = 'translate-hub'),
 'translate_text',
 'Translate text between EU languages with domain awareness',
 '{"type":"object","properties":{"text":{"type":"string"},"source_lang":{"type":"string"},"target_lang":{"type":"string"},"domain":{"type":"string","enum":["general","legal","technical","medical","business"],"default":"general"},"glossary_id":{"type":"string"}},"required":["text","target_lang"]}',
 '{"type":"object","properties":{"translated_text":{"type":"string"},"detected_source_lang":{"type":"string"},"confidence":{"type":"number"},"alternatives":{"type":"array"}}}',
 '{"text":"Smlouva o dílo dle § 2586 občanského zákoníku","source_lang":"cs","target_lang":"de","domain":"legal"}',
 '{"translated_text":"Werkvertrag gemäß § 2586 des Bürgerlichen Gesetzbuches","detected_source_lang":"cs","confidence":0.96,"alternatives":["Vertrag über ein Werk nach § 2586 BGB"]}'
),
((select id from mcp_servers where slug = 'translate-hub'),
 'translate_document',
 'Translate entire document preserving formatting',
 '{"type":"object","properties":{"document":{"type":"string","description":"Base64 encoded document"},"source_lang":{"type":"string"},"target_lang":{"type":"string"},"format":{"type":"string","enum":["pdf","docx","html","json"]},"domain":{"type":"string","default":"general"}},"required":["document","target_lang","format"]}',
 '{"type":"object","properties":{"translated_document":{"type":"string"},"word_count":{"type":"integer"},"page_count":{"type":"integer"}}}',
 '{"document":"JVBERi0...","source_lang":"cs","target_lang":"en","format":"pdf","domain":"business"}',
 '{"translated_document":"JVBERi0...","word_count":2500,"page_count":5}'
),
((select id from mcp_servers where slug = 'translate-hub'),
 'manage_glossary',
 'Create or update domain-specific translation glossary',
 '{"type":"object","properties":{"action":{"type":"string","enum":["create","update","get","delete"]},"glossary_id":{"type":"string"},"entries":{"type":"array","items":{"type":"object","properties":{"source":{"type":"string"},"target":{"type":"string"},"source_lang":{"type":"string"},"target_lang":{"type":"string"}}}}},"required":["action"]}',
 '{"type":"object","properties":{"glossary_id":{"type":"string"},"entry_count":{"type":"integer"},"status":{"type":"string"}}}',
 '{"action":"create","entries":[{"source":"smlouva o dílo","target":"Werkvertrag","source_lang":"cs","target_lang":"de"}]}',
 '{"glossary_id":"gloss-001","entry_count":1,"status":"created"}'
);

-- ============================================================
-- Update total_tools counts (already set inline, but verify)
-- ============================================================
update mcp_servers set total_tools = (
  select count(*) from mcp_tools where mcp_tools.server_id = mcp_servers.id
);
