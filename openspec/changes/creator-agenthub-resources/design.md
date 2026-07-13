## Context

`03-skills-library.png` defines a dense three-region Skills Library. The legacy Creator has separate skills-marketplace and knowledge routes. AgentHub consolidates them under one Resource Library while preserving endpoint semantics.

## Decisions

1. Skills Library is the default tab and preserves search, categories, table selection, and details.
2. Installing a marketplace skill creates a Creator Skill; attaching it to an Agent updates the Agent skills array without dropping existing skills.
3. Knowledge assets stay in the same route with list/create/delete and text/URL document operations.
4. Demo operations stay in component state. Live operations always use API-key and workspace scope.
5. Media and templates remain explicit unavailable states until backend objects exist.

## Risks / Trade-offs

- Marketplace metadata lacks usage/cost fields -> do not invent live numbers.
- Creator Skill installation and Agent attachment are distinct -> expose both actions with clear labels.
- File upload needs a multipart contract -> text and URL are migrated now; file upload remains a completion-audit item.

## Migration Plan

Add the Resource route layout over the placeholder, validate current contracts, verify demo interactions, and preserve the old Creator unchanged for rollback.
