## ADDED Requirements

### Requirement: Route-level code splitting
The system SHALL load each page's JavaScript bundle on demand instead of loading all pages upfront.

#### Scenario: Initial page load
- **WHEN** user visits the homepage
- **THEN** only the Home page chunk SHALL be downloaded

#### Scenario: Navigate to another route
- **WHEN** user navigates to a route that hasn't been loaded yet
- **THEN** the system SHALL download that route's chunk AND show a loading indicator

#### Scenario: Loading state
- **WHEN** a route chunk is being loaded
- **THEN** the system SHALL display a centered loading spinner
