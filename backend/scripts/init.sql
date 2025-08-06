\c genetic_variants;

-- This Script is auto generated

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS variants (
    id SERIAL PRIMARY KEY,
    gene VARCHAR(100) NOT NULL,
    variant_type VARCHAR(10) NOT NULL CHECK (variant_type IN ('SNV', 'INDEL', 'CNV', 'SV')),
    clinical_significance VARCHAR(20) NOT NULL CHECK (clinical_significance IN ('Pathogenic', 'Likely_Pathogenic', 'VUS', 'Likely_Benign', 'Benign')),
    chromosome VARCHAR(10),
    position BIGINT,
    reference_allele VARCHAR(50),
    alternate_allele VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gene ON variants(gene);
CREATE INDEX IF NOT EXISTS idx_variant_type ON variants(variant_type);
CREATE INDEX IF NOT EXISTS idx_clinical_significance ON variants(clinical_significance);
CREATE INDEX IF NOT EXISTS idx_chromosome_position ON variants(chromosome, position);

-- Insert sample data
INSERT INTO variants (gene, variant_type, clinical_significance, chromosome, position, reference_allele, alternate_allele, description) VALUES
('BRAF', 'SNV', 'Pathogenic', '7', 140453136, 'A', 'T', 'BRAF V600E mutation - common in melanoma'),
('KRAS', 'SNV', 'Pathogenic', '12', 25398284, 'C', 'T', 'KRAS G12D mutation - common in colorectal cancer'),
('TP53', 'SNV', 'Pathogenic', '17', 7577120, 'G', 'C', 'TP53 R273C mutation - tumor suppressor'),
('BRCA1', 'INDEL', 'Likely_Pathogenic', '17', 43057051, 'AT', 'A', 'BRCA1 frameshift mutation'),
('APC', 'CNV', 'VUS', '5', 112101482, 'G', 'G', 'APC copy number variation')
ON CONFLICT (id) DO NOTHING;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_variants_updated_at 
    BEFORE UPDATE ON variants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE genetic_variants TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres; 