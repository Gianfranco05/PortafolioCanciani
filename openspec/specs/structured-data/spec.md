# structured-data Specification

## Purpose
TBD - created by archiving change nivel3-arquitectura. Update Purpose after archive.
## Requirements
### Requirement: JSON-LD structured data
The system SHALL include Schema.org structured data in JSON-LD format within the `<head>` of the HTML document to enhance SEO.

#### Scenario: Search engine crawler
- **WHEN** a search engine crawler fetches the page
- **THEN** the HTML SHALL contain a `<script type="application/ld+json">` block with Person schema

#### Scenario: Structured data fields
- **WHEN** the JSON-LD block is parsed
- **THEN** it SHALL include: name, jobTitle, description, url, sameAs (GitHub, LinkedIn, Instagram), knowsAbout (technical skills), address (Mendoza, Argentina)

