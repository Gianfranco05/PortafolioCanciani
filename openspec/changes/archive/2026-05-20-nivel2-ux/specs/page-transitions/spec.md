## ADDED Requirements

### Requirement: Animated page transitions
The system SHALL animate the transition between routes using fade + slide vertical (20px) over 300ms.

#### Scenario: Navigate between pages
- **WHEN** user navigates from one route to another
- **THEN** the current page SHALL fade out with a slight upward slide
- **AND THEN** the new page SHALL fade in with a slight upward slide

#### Scenario: Transition does not block navigation
- **WHEN** a page transition is playing
- **THEN** the user SHALL still be able to trigger a new navigation
