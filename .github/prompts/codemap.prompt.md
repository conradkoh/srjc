---
mode: agent
---

# Codemap Meta Rules

## Definition

A codemap is an index that shows a map to all relevant files for a given feature. It serves as the single source of truth for understanding how a feature is implemented across the codebase.

## File Requirements

1. **Location**: All codemaps MUST be stored in `$projectroot/codemaps/` folder
2. **Naming**: Filename MUST follow pattern `$featurename.codemap.md`
3. **Format**: MUST be markdown format with structured sections
4. **Template**: MUST follow structure defined in `codemaps/templates/template.codemap.md`

## File Locations

- **Template**: `codemaps/templates/template.codemap.md` - Use this template when creating new codemaps
- **Existing Codemaps**: `codemaps/` directory - Review existing codemaps for reference and patterns

## Required Sections

1. **Title**: Concise feature title describing the flow
2. **Description**: Brief explanation of what the flow accomplishes and its purpose
3. **Sequence Diagram**: High-level flow showing function calls between layers
4. **Frontend Files**: ALL frontend files with clear subsection grouping
5. **Backend Files**: ALL backend files with clear subsection grouping
6. **Contracts**: ALL communication protocols between frontend and backend

## Required Details

### Function Interfaces

- Prefer TypeScript types or interfaces to describe function contracts
- Format examples: `functionName(params: ParamType): ReturnType`
- Naming: Use the actual exported names from the codebase when available
- Only introduce documentation-only types when no exported type exists, and label them clearly as such
- Apply to: functions across relevant layers (frontend, backend, usecases, utilities) when it improves clarity

### Sequence Diagram

- **MUST include**: PlantUML sequence diagram showing function call flow
- **MUST show**: Function names with interface types: `functionName(params: IParam): IReturn`
- **MUST demonstrate**: How components across layers interact
- **Format**: Use PlantUML syntax with descriptive comments explaining the flow

### URL Parameters

- **MUST document**: ALL URL parameters being read from routes
- **MUST document**: ALL search parameters being processed
- **Format**: List parameter name and describe its purpose
- **Apply to**: ALL route files that read dynamic segments or query parameters

### Interface Standardization

- **MUST use**: TypeScript interfaces even for non-TypeScript implementations
- **Purpose**: Provide precision in expressing intent and tie related components together
- **Naming**: Consistent `I[Name]` convention across all interfaces
- **Scope**: ALL data structures, parameters, and return types

## Scope Guidelines

- **Single Flow**: Each codemap MUST represent exactly one user flow or feature workflow
- **Focused**: NEVER mix multiple unrelated features in one codemap
- **Complete**: MUST include ALL files necessary for the specific flow to function
- **Minimal**: SHOULD exclude files not directly related to the flow

## Language Standards

- **MUST**: Mandatory requirements, non-negotiable
- **SHOULD**: Recommended best practices
- **MAY**: Optional features or alternatives
- **NEVER**: Prohibited actions or patterns

## Writing Style

- **Low verbosity**: Use concise, precise language
- **High clarity**: Each statement MUST be unambiguous
- **Action-oriented**: Focus on what to do, not background theory
- **Structured**: Use consistent formatting and organization

## Primary Interactions

### 1. Plan

**Purpose**: Create or modify codemap before implementing changes

**Decision Logic**: MUST determine scenario before proceeding:

- **New Feature**: Feature does not exist in codebase → Create new codemap using template
- **Existing Feature**: Feature already implemented → Check for existing codemap
  - If codemap exists: Update existing codemap first, then apply changes
  - If no codemap exists: Prompt user to generate codemap from existing implementation before proceeding

**Template Usage**: MUST use `codemaps/templates/template.codemap.md` as starting point

**Actions for New Feature**:

- Copy template to new codemap file following naming convention
- Define data model and key architectural decisions
- Plan file locations and structure across all application layers
- Identify core files that need creation/modification
- Document function interfaces and data flow between layers

**Actions for Existing Feature (No Codemap)**:

- Analyze existing codebase to identify all files related to the feature
- Document current implementation patterns and data flow
- Create codemap reflecting actual implementation state
- Validate codemap accuracy against current codebase

### 2. Update

**Purpose**: Modify existing codemap for planned changes to existing features

**Prerequisite**: Existing codemap MUST be located and validated first

**Actions**:

- Locate existing codemap in `codemaps/` directory
- Review current codemap state against actual codebase
- Plan modifications to codemap reflecting intended changes
- Update codemap with new file paths, functions, and contracts
- Ensure backward compatibility considerations are documented

### 4. Apply

**Purpose**: Use codemap as source of truth to implement code changes

**Actions**:

- Implement changes to match codemap specifications
- Create missing files as defined in codemap
- Update existing files to conform to contracts
- Ensure all file paths and structures exist as documented

## Validation Rules

1. Every codemap MUST include all required sections as defined in template
2. File paths MUST be accurate and up-to-date relative to project root
3. Contracts MUST match actual implementation with proper TypeScript interfaces
4. Language MUST follow specified standards (MUST/SHOULD/MAY/NEVER)
5. Function interfaces MUST use consistent `I[Name]` naming convention
6. Updates MUST be made when feature files change
7. Sequence diagrams MUST demonstrate complete flow between all layers
