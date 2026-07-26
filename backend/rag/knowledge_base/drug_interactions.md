# Drug Interaction Notes (Demo Data — Not for Clinical Use)

This is placeholder reference content for RAG demonstration purposes only.
A production system must use a licensed, regularly updated drug interaction
database (e.g., First Databank, Lexicomp) — never hardcoded text like this.

## Example Entries
- Ibuprofen + Warfarin: increased bleeding risk, flag for pharmacist review.
- Amoxicillin + oral contraceptives: may reduce contraceptive effectiveness.
- Metformin + contrast dye (for imaging): risk of lactic acidosis, hold
  metformin 48 hours before and after contrast administration.

## Escalation Rule
Any flagged interaction involving a "severe" classification must route to a
licensed pharmacist or physician for review before the AI responds to the
patient — this is enforced by the Triage Agent's human-in-the-loop checkpoint.
