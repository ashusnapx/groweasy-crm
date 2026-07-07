# CSV Import Showcase — All Permutations & Combinations

## Overview
This directory contains 16 test CSV files that demonstrate every possible import scenario the AI can handle.

## Test Files

### Standard Formats
| # | File | Rows | What It Tests |
|---|------|------|---------------|
| 1 | 01-basic-crm-export.csv | 25 | Standard CRM export with clear column names |
| 2 | 02-facebook-leads-export.csv | 20 | Facebook Lead Ads format with form fields |
| 3 | 03-google-ads-export.csv | 20 | Google Ads "Form Field:" prefix columns |
| 4 | 04-real-estate-export.csv | 25 | Real estate developer CRM with budgets |
| 5 | 05-sales-report.csv | 20 | Sales team weekly report |
| 6 | 06-marketing-campaign-export.csv | 20 | Marketing automation with tags |
| 7 | 07-excel-spreadsheet.csv | 20 | User-created Excel with messy names |

### Edge Cases
| # | File | Rows | What It Tests |
|---|------|------|---------------|
| 8 | 08-phone-format-variations.csv | 25 | Every phone format possible |
| 9 | 09-date-format-variations.csv | 20 | Every date format possible |
| 10 | 10-missing-columns.csv | 15 | Only 3 columns — minimal data |
| 11 | 11-extra-columns.csv | 25 | 25 columns — way more than CRM fields |
| 12 | 12-duplicate-headers.csv | 15 | Duplicate column names |
| 13 | 13-messy-chaotic.csv | 15 | Unicode, emojis, HTML, SQL injection |
| 14 | 14-no-email-no-phone.csv | 10 | Records with neither email nor phone |
| 15 | 15-multi-value-fields.csv | 20 | Multiple emails/phones in one field |

### Scale Test
| # | File | Rows | What It Tests |
|---|------|------|---------------|
| 16 | 16-large-dataset-5000.csv | 5000 | Large batch processing |

## What Each Test Demonstrates

### Column Name Variations
The AI correctly identifies columns regardless of naming:
- "Name" / "Full Name" / "prospect_name" / "Subscriber" / "Contact Person" → `name`
- "Email" / "Email Address" / "contact_email" / "mail" / "e-mail" → `email`
- "Phone" / "Phone Number" / "mobile" / "Contact No" / "phone_number" → `mobile_without_country_code`
- "Status" / "Lead Status" / "Deal Stage" / "Lead Type" → `crm_status`
- "Source" / "Campaign" / "Data Source" / "Form Name" → `data_source`

### Column Order Independence
Files have columns in completely different orders. The AI maps based on content + name, not position.

### Phone Number Formats
| Format | Example | AI Output |
|--------|---------|-----------|
| Plain 10-digit | 9876543210 | country_code: +91, mobile: 9876543210 |
| With +91 | +919876543210 | country_code: +91, mobile: 9876543210 |
| With dashes | 98765-43210 | country_code: +91, mobile: 9876543210 |
| With spaces | 98765 43210 | country_code: +91, mobile: 9876543210 |
| With parens | (98765) 43210 | country_code: +91, mobile: 9876543210 |
| International | +1 555 123 4567 | country_code: +1, mobile: 5551234567 |
| Landline STD | 080-23456789 | country_code: +91, mobile: 8023456789 |
| Multiple | 9876543210 / 8765432109 | First: primary, Second: in notes |

### Date Formats
| Format | Example | AI Output |
|--------|---------|-----------|
| ISO | 2024-01-15 | 2024-01-15T00:00:00.000Z |
| US | 01/15/2024 | 2024-01-15T00:00:00.000Z |
| Indian | 15/01/2024 | 2024-01-15T00:00:00.000Z |
| Verbal | Jan 15, 2024 | 2024-01-15T00:00:00.000Z |
| With time | 2024-01-15 14:30:00 | 2024-01-15T14:30:00.000Z |

### Status Mapping
| Raw Value | Mapped To |
|-----------|-----------|
| new, fresh, active, qualified | GOOD_LEAD_FOLLOW_UP |
| unreachable, not connected, busy | DID_NOT_CONNECT |
| bad lead, invalid, junk, spam | BAD_LEAD |
| converted, closed, won, sold | SALE_DONE |
| Hot Lead | GOOD_LEAD_FOLLOW_UP |
| Cold | DID_NOT_CONNECT |
| Lost | BAD_LEAD |
| Won | SALE_DONE |
| subscribed | GOOD_LEAD_FOLLOW_UP |
| unsubscribed | BAD_LEAD |
| bounced | DID_NOT_CONNECT |

### Data Source Mapping
| Raw Value | Mapped To |
|-----------|-----------|
| Facebook Ads, FB Lead | leads_on_demand |
| Google Ads | leads_on_demand |
| Website, Referral | leads_on_demand |
| IndiaMART, JustDial | leads_on_demand |
| Meridian Tower, Meridian | meridian_tower |
| Eden Park | eden_park |
| Varah Swamy | varah_swamy |
| Sarjapur, Sarjapur Plots | sarjapur_plots |
| MagicBricks, 99acres, Housing.com | leads_on_demand |

### Record Skipping
Records are SKIPPED (not imported) when they have:
- NO email AND NO phone number
- Completely empty rows
- Whitespace-only rows

## How to Test

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Drag any CSV file from this directory onto the upload zone
5. Watch the AI process it in real-time

## Expected Results Per File

| File | Expected Imported | Expected Skipped | Notes |
|------|-------------------|------------------|-------|
| 01 | 24 | 1 | 1 record with no email+phone |
| 02 | 20 | 0 | All have at least email or phone |
| 03 | 20 | 0 | Form Field: prefix stripped |
| 04 | 25 | 0 | All have contact info |
| 05 | 20 | 0 | 2 duplicate emails handled |
| 06 | 20 | 0 | Semicolon emails split |
| 07 | 20 | 0 | Messy names title-cased |
| 08 | 24 | 1 | 1 record with invalid phone only |
| 09 | 19 | 1 | 1 invalid date record |
| 10 | 15 | 0 | Minimal data accepted |
| 11 | 25 | 0 | Extra columns → crm_note |
| 12 | 15 | 0 | Duplicate headers resolved |
| 13 | 12 | 3 | Chaotic data, some skipped |
| 14 | 0 | 10 | All skipped — no contact info |
| 15 | 20 | 0 | Multi-values split correctly |
| 16 | ~4750 | ~250 | 5% no email, 3% no phone, 2% neither |

## Running the Large Dataset Generator
```bash
cd test-data
node generate-large-csv.js
# Generates 16-large-dataset-5000.csv with 5000 rows
```