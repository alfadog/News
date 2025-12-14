# Data model

Payload collections mirror the information architecture (Sites, Sections, Channels, Series, Tags) and automation pipeline (Sources, RawItems, Stories, Articles, PromptTemplates, RoutingRules, JobRuns, AuditLogs).

Key relationships:
- **Sites** own **Sections** and **Tags**; **Channels** belong to a Section; **Series** are site-specific.
- **Sources** describe inbound feeds/APIs; **RawItems** belong to a Source and capture raw text/HTML.
- **Stories** group related RawItems and feed trend scoring; **Articles** may link to a Story and to taxonomy entities.
- **PromptTemplates** version AI prompts; **RoutingRules** control site/channel assignments; **JobRuns** and **AuditLogs** capture operational history.

Article status defaults to `review` to enforce editorial oversight. Fingerprints on RawItems allow duplicate detection before automation proceeds.
