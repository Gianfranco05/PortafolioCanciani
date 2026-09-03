# mobile-navigation Specification

## Purpose
TBD - created by archiving change nivel2-ux. Update Purpose after archive.
## Requirements
### Requirement: Mobile responsive navigation
The system SHALL provide a responsive navigation that adapts to mobile viewports by showing a hamburger button that toggles an overlay menu.

#### Scenario: Open mobile menu
- **WHEN** user taps the hamburger button on a mobile device
- **THEN** the navigation links SHALL appear as an overlay with entrance animation

#### Scenario: Close mobile menu by selecting a link
- **WHEN** user taps a navigation link in the mobile menu
- **THEN** the menu SHALL close AND navigate to the selected route

#### Scenario: Close mobile menu by tapping outside
- **WHEN** the mobile menu is open AND user taps the backdrop overlay
- **THEN** the menu SHALL close

#### Scenario: Body scroll lock while menu open
- **WHEN** the mobile menu is open
- **THEN** the body SHALL NOT scroll

#### Scenario: Auto-close on desktop resize
- **WHEN** the mobile menu is open AND the viewport resizes to desktop width
- **THEN** the menu SHALL close automatically

### Requirement: Desktop navigation unchanged
The system SHALL keep the existing inline navigation layout on desktop viewports.

#### Scenario: Desktop nav layout
- **WHEN** the viewport is desktop width
- **THEN** the navigation links SHALL be displayed inline in the navbar

