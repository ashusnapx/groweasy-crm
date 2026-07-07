"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CRM_FIELDS } from "@/lib/constants";
import type { ParsedCSV } from "@/types";

interface ColumnMapperProps {
  csv: ParsedCSV;
  mappings?: Record<string, string>;
}

function guessMapping(sourceCol: string): string | null {
  const lower = sourceCol.toLowerCase().replace(/[\s_-]+/g, "");
  
  const patterns: Record<string, string[]> = {
    name: ["name", "fullname", "full_name", "contactname", "contact_name", "firstname", "first_name", "lastname", "last_name"],
    email: ["email", "emailaddress", "email_address", "mail"],
    mobile_without_country_code: ["mobile", "phone", "phonenumber", "phone_number", "contactnumber", "contact_number", "mobile_number"],
    company: ["company", "organization", "org", "business", "companyname", "company_name"],
    city: ["city", "town", "locationcity", "location_city"],
    state: ["state", "province", "region"],
    country: ["country", "nation", "countryname", "country_name"],
    created_at: ["createdat", "created_at", "date", "createddate", "created_date", "importdate"],
    lead_owner: ["leadowner", "lead_owner", "owner", "assignedto", "assigned_to"],
    crm_status: ["status", "leadstatus", "lead_status", "crmstatus", "crm_status"],
    crm_note: ["note", "notes", "crmnote", "crm_note", "comment", "comments"],
    data_source: ["datasource", "data_source", "source", "origin"],
    possession_time: ["possessiontime", "possession_time", "possession"],
    description: ["description", "desc", "details", "notes"],
  };

  for (const [field, keywords] of Object.entries(patterns)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return field;
      }
    }
  }
  return null;
}

export function ColumnMapper({ csv, mappings }: ColumnMapperProps) {
  const detectedMappings = useMemo(() => {
    if (mappings) return mappings;
    
    const result: Record<string, string> = {};
    csv.headers.forEach((header) => {
      const mapped = guessMapping(header);
      if (mapped) {
        result[header] = mapped;
      }
    });
    return result;
  }, [csv.headers, mappings]);

  const mappedCount = Object.keys(detectedMappings).length;
  const unmappedCount = csv.headers.length - mappedCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-graphite">Column Mappings</h3>
        <div className="flex items-center gap-2">
          <Badge variant="success">{mappedCount} mapped</Badge>
          {unmappedCount > 0 && (
            <Badge variant="warning">{unmappedCount} unmapped</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {csv.headers.map((header) => {
          const mappedField = detectedMappings[header];
          const crmField = CRM_FIELDS.find((f) => f.key === mappedField);

          return (
            <Card key={header} className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-graphite truncate">{header}</p>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={mappedField ? "#0075de" : "#757575"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                {crmField ? (
                  <Badge variant="info">{crmField.label}</Badge>
                ) : (
                  <Badge variant="default">No match</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
