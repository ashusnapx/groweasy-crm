"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SampleFile {
  id: string;
  name: string;
  description: string;
  rows: number;
  category: "standard" | "edge" | "scale";
  tags: string[];
  icon: string;
  highlights: string[];
}

const SAMPLE_FILES: SampleFile[] = [
  { id: "01", name: "01-basic-crm-export.csv", description: "Standard CRM export with clear column names", rows: 25, category: "standard", tags: ["CRM", "Standard"], icon: "📊", highlights: ["Clear column names", "1 record with no email+phone (skipped)", "Mix of all 4 statuses"] },
  { id: "02", name: "02-facebook-leads-export.csv", description: "Facebook Lead Ads export format", rows: 20, category: "standard", tags: ["Facebook", "Ads"], icon: "📘", highlights: ["Whitespace in names", "Phone format variations", "Campaign/Ad Set data"] },
  { id: "03", name: "03-google-ads-export.csv", description: "Google Ads Leads form export", rows: 20, category: "standard", tags: ["Google Ads", "Forms"], icon: "🔍", highlights: ['"Form Field:" prefix in columns', "ALL CAPS emails", "Dashed phone numbers"] },
  { id: "04", name: "04-real-estate-export.csv", description: "Real estate developer CRM export", rows: 25, category: "standard", tags: ["Real Estate", "Property"], icon: "🏠", highlights: ["DD-MM-YYYY dates", "L/Cr budgets", '"Executive" as owner column'] },
  { id: "05", name: "05-sales-report.csv", description: "Sales team weekly report format", rows: 20, category: "standard", tags: ["Sales", "Report"], icon: "📈", highlights: ["MM/DD/YYYY dates", '"Hot Lead"→GOOD_LEAD_FOLLOW_UP', "Duplicate emails handled"] },
  { id: "06", name: "06-marketing-campaign-export.csv", description: "Marketing automation tool export", rows: 20, category: "standard", tags: ["Marketing", "Automation"], icon: "📣", highlights: ["Semicolon-separated emails", "Engagement scores", "Segment mapping"] },
  { id: "07", name: "07-excel-spreadsheet.csv", description: "User-created Excel with messy column names", rows: 20, category: "standard", tags: ["Excel", "Manual"], icon: "📝", highlights: ['Weird names: "Name1", "email!", "Co."', "Trailing spaces", "Lowercase names"] },
  { id: "08", name: "08-phone-format-variations.csv", description: "Every possible phone number format", rows: 25, category: "edge", tags: ["Phones", "Formats"], icon: "📱", highlights: ["+91, dashes, spaces, parens", "International (US/UK)", "Landline STD codes", "Typos"] },
  { id: "09", name: "09-date-format-variations.csv", description: "Every possible date format", rows: 20, category: "edge", tags: ["Dates", "Formats"], icon: "📅", highlights: ["ISO, US, Indian, European", "Verbal dates", "Excel serial numbers", "Invalid dates"] },
  { id: "10", name: "10-missing-columns.csv", description: "Only 3 columns — minimal data", rows: 15, category: "edge", tags: ["Minimal", "Sparse"], icon: "🫙", highlights: ["Only Email, Phone, Status", "No name, company, or city", "AI maps what it can"] },
  { id: "11", name: "11-extra-columns.csv", description: "25 columns — way more than CRM fields", rows: 25, category: "edge", tags: ["Extra", "Overflow"], icon: "📦", highlights: ["Aadhaar, PAN, LinkedIn, Instagram", "Budget, EMIs, Family size", "Extras → crm_note"] },
  { id: "12", name: "12-duplicate-headers.csv", description: "Duplicate column names", rows: 15, category: "edge", tags: ["Duplicates", "Conflict"], icon: "👯", highlights: ["Duplicate Name/Email/Phone", "Backup data in duplicates", "AI resolves conflicts"] },
  { id: "13", name: "13-messy-chaotic.csv", description: "Maximum chaos — unicode, emojis, HTML, SQL injection", rows: 15, category: "edge", tags: ["Chaotic", "Security"], icon: "🌪️", highlights: ["Hindi unicode (राजेश)", "Emojis in data", "HTML injection", "SQL injection attempts"] },
  { id: "14", name: "14-no-email-no-phone.csv", description: "Records with neither email nor phone — all skipped", rows: 10, category: "edge", tags: ["Skipped", "Empty"], icon: "🚫", highlights: ["100% skip rate", "No contact info", "Empty rows", "Whitespace-only rows"] },
  { id: "15", name: "15-multi-value-fields.csv", description: "Multiple values crammed into single fields", rows: 20, category: "edge", tags: ["Multi-value", "Split"], icon: "🔀", highlights: ["Multiple emails (semicolons)", "Multiple phones (commas)", "Embedded contacts in notes"] },
  { id: "16", name: "16-large-dataset-5000.csv", description: "5000 rows — large batch processing test", rows: 5000, category: "scale", tags: ["Scale", "Performance"], icon: "⚡", highlights: ["5000 realistic Indian records", "~5% missing email", "~2% skipped", "Batch processing test"] },
];

const CATEGORIES = [
  { id: "all", label: "All Files", count: SAMPLE_FILES.length },
  { id: "standard", label: "Standard Formats", count: SAMPLE_FILES.filter((f) => f.category === "standard").length },
  { id: "edge", label: "Edge Cases", count: SAMPLE_FILES.filter((f) => f.category === "edge").length },
  { id: "scale", label: "Scale Test", count: SAMPLE_FILES.filter((f) => f.category === "scale").length },
];

interface SampleCsvBrowserProps {
  onSelectFile: (file: File) => void;
}

export function SampleCsvBrowser({ onSelectFile }: SampleCsvBrowserProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredFiles =
    activeCategory === "all"
      ? SAMPLE_FILES
      : SAMPLE_FILES.filter((f) => f.category === activeCategory);

  const handleLoadSample = async (sample: SampleFile) => {
    setLoadingId(sample.id);
    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 200));
    const csv = SAMPLE_CSV_DATA[sample.name] || generateFallback(sample);
    const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([blob], sample.name, { type: "text/csv" });
    onSelectFile(file);
    setLoadingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: "var(--color-ash)" }} />
        <span className="phantom-caption font-medium uppercase tracking-wider" style={{ color: "var(--color-fog)" }}>
          or try a sample
        </span>
        <div className="h-px flex-1" style={{ background: "var(--color-ash)" }} />
      </div>

      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="phantom-pill phantom-caption font-medium whitespace-nowrap transition-all duration-150 px-4 py-2"
            style={{
              background: activeCategory === cat.id ? "var(--color-aubergine)" : "var(--color-paper-white)",
              color: activeCategory === cat.id ? "var(--color-paper-white)" : "var(--color-fog)",
              border: `1px solid ${activeCategory === cat.id ? "var(--color-aubergine)" : "var(--color-ash)"}`,
            }}
          >
            {cat.label}
            <span className="ml-1.5 opacity-60">{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredFiles.map((sample) => (
            <motion.div
              key={sample.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="phantom-card p-4 transition-all duration-150 cursor-pointer group"
                style={{
                  background: "var(--color-paper-white)",
                  border: expandedId === sample.id
                    ? "1px solid var(--color-periwinkle)"
                    : "1px solid var(--color-ash)",
                }}
                onClick={() => setExpandedId(expandedId === sample.id ? null : sample.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sample.icon}</span>
                    <div>
                      <h3 className="phantom-body-sm font-medium" style={{ color: "var(--color-aubergine)" }}>
                        {sample.name.replace(".csv", "")}
                      </h3>
                      <p className="phantom-caption mt-0.5" style={{ color: "var(--color-fog)" }}>
                        {sample.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {sample.tags.map((tag) => (
                    <span
                      key={tag}
                      className="phantom-pill phantom-caption font-medium px-3 py-0.5"
                      style={{ background: "var(--color-bone)", color: "var(--color-fog)" }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="phantom-caption ml-auto" style={{ color: "var(--color-fog)" }}>
                    {sample.rows} rows
                  </span>
                </div>

                <AnimatePresence>
                  {expandedId === sample.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mb-3" style={{ borderTop: "1px solid var(--color-ash)" }}>
                        <p className="phantom-caption font-medium uppercase tracking-wider mb-2" style={{ color: "var(--color-fog)" }}>
                          What this tests
                        </p>
                        <ul className="space-y-1">
                          {sample.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 phantom-caption" style={{ color: "var(--color-aubergine)" }}>
                              <span style={{ color: "var(--color-periwinkle)" }} className="mt-0.5">→</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample(sample);
                  }}
                  disabled={loadingId === sample.id}
                  className="w-full py-2 phantom-caption font-medium phantom-card transition-all duration-150"
                  style={{
                    background: loadingId === sample.id ? "var(--color-bone)" : "var(--color-ghost-lavender)",
                    color: "var(--color-aubergine)",
                    border: "none",
                    cursor: loadingId === sample.id ? "wait" : "pointer",
                  }}
                >
                  {loadingId === sample.id ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Load Sample"
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function generateFallback(sample: SampleFile): string {
  const headers = "Name,Email,Phone,Company,City,Status";
  const rows = [
    "Rajesh Kumar,rajesh@gmail.com,9876543210,TCS,Mumbai,Hot Lead",
    "Priya Sharma,priya@yahoo.com,8765432109,Infosys,Bangalore,New Lead",
    "Amit Patel,amit@outlook.com,7654321098,Wipro,Delhi,Contacted",
  ];
  return [headers, ...rows].join("\n");
}

const SAMPLE_CSV_DATA: Record<string, string> = {
"01-basic-crm-export.csv": `Name,Email,Phone,Company,City,State,Country,Lead Owner,Status,Source,Created Date,Notes
Rajesh Kumar,rajesh.kumar@gmail.com,9876543210,Tata Consultancy Services,Mumbai,Maharashtra,India,Amit Sharma,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-06-15,Interested in enterprise plan
Priya Sharma,priya.s@outlook.com,,Infosys Limited,Bangalore,Karnataka,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,meridian_tower,2025-06-18,Follow up scheduled for next week
Amit Patel,amit.patel@yahoo.com,8765432109,Wipro Technologies,Hyderabad,Telangana,India,Amit Sharma,DID_NOT_CONNECT,eden_park,2025-06-20,Not responding to calls
Sneha Reddy,sneha.reddy@gmail.com,7654321098,HCL Technologies,Chennai,Tamil Nadu,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-06-22,Decision maker confirmed
Vikram Singh,vikram.singh@rediffmail.com,6543210987,Reliance Industries,Pune,Maharashtra,India,Ravi Kumar,BAD_LEAD,meridian_tower,2025-06-25,Budget not approved
Anjali Desai,anjali.d@company.in,,Tech Mahindra,Mumbai,Maharashtra,India,Amit Sharma,DID_NOT_CONNECT,eden_park,2025-06-28,Wrong number
Suresh Menon,,9876123456,Godrej Properties,Bangalore,Karnataka,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-07-01,Via referral from existing client
Kavita Joshi,kavita.joshi@rediffmail.com,8765123456,Infosys Limited,Delhi,Delhi,India,Ravi Kumar,SALE_DONE,meridian_tower,2025-07-03,Contract signed for 50 seats
Manoj Tiwari,manoj.t@gmail.com,7654123456,Cognizant,Chennai,Tamil Nadu,India,Amit Sharma,DID_NOT_CONNECT,eden_park,2025-07-05,Requested callback next month
Deepak Verma,deepak.verma@yahoo.com,,Wipro Technologies,Pune,Maharashtra,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-07-07,Very interested in premium plan
Ritu Agarwal,ritu.a@company.in,6543123456,Larsen & Toubro,Jaipur,Rajasthan,India,Ravi Kumar,SALE_DONE,meridian_tower,2025-07-09,Deal closed 25L annual
Sanjay Kulkarni,sanjay.k@gmail.com,9871234567,TCS,Bangalore,Karnataka,India,Amit Sharma,BAD_LEAD,eden_park,2025-07-11,Went with competitor
Nandini Rao,nandini.rao@outlook.com,,HCL Technologies,Hyderabad,Telangana,India,Neha Gupta,DID_NOT_CONNECT,leads_on_demand,2025-07-13,Email bounced
Rakesh Chandra,rakesh.c@rediffmail.com,8761234567,Infosys Limited,Delhi,Delhi,India,Ravi Kumar,GOOD_LEAD_FOLLOW_UP,meridian_tower,2025-07-15,Technical team evaluation pending
Meena Kumari,meena.k@gmail.com,7651234567,Tech Mahindra,Mumbai,Maharashtra,India,Amit Sharma,DID_NOT_CONNECT,eden_park,2025-07-17,Out of office until August
Arjun Nair,arjun.nair@yahoo.com,6541234567,Wipro Technologies,Kochi,Kerala,India,Neha Gupta,SALE_DONE,leads_on_demand,2025-07-19,Payment received
Pooja Mishra,pooja.m@company.in,,Cognizant,Jaipur,Rajasthan,India,Ravi Kumar,GOOD_LEAD_FOLLOW_UP,meridian_tower,2025-07-21,Competitor pricing comparison
Karthik Subramanian,karthik.s@gmail.com,9870123456,Reliance Industries,Chennai,Tamil Nadu,India,Amit Sharma,BAD_LEAD,eden_park,2025-07-23,Project cancelled
Shalini Pande,shalini.p@outlook.com,8760123456,HCL Technologies,Pune,Maharashtra,India,Neha Gupta,DID_NOT_CONNECT,leads_on_demand,2025-07-25,Wrong department contact
Mohan Das,mohan.das@rediffmail.com,7650123456,Glass Infosystems,Bangalore,Karnataka,India,Ravi Kumar,GOOD_LEAD_FOLLOW_UP,meridian_tower,2025-07-27,High priority lead
Divya Prakash,divya.p@gmail.com,6540123456,ITC Limited,Kolkata,West Bengal,India,Amit Sharma,SALE_DONE,eden_park,2025-07-29,Implementation started
Vivek Malhotra,vivek.m@company.in,,Larsen & Toubro,Delhi,Delhi,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-07-31,Pilot project approved
Ashok Pillai,ashok.p@gmail.com,9869012345,Tata Steel,Chennai,Tamil Nadu,India,Ravi Kumar,DID_NOT_CONNECT,meridian_tower,2025-08-02,Currently using competitor product
Sunita Banerjee,sunita.b@outlook.com,8759012345,Adani Group,Ahmedabad,Gujarat,India,Amit Sharma,BAD_LEAD,eden_park,2025-08-04,Not a decision maker
Ramesh Babu,ramesh.babu@yahoo.com,7649012345,Infosys Limited,Bangalore,Karnataka,India,Neha Gupta,GOOD_LEAD_FOLLOW_UP,leads_on_demand,2025-08-06,Strong interest in analytics module`,

"02-facebook-leads-export.csv": `Full Name,Email Address,Phone Number,Form Name,Ad Set Name,Campaign Name,Ad Name,Created Time,Is Organic
Rajesh Kumar,rajesh.kumar@gmail.com,+91 9876543210,Real Estate Inquiry,Property Seekers 25-45,Lead Gen Campaign,Property Ad 1,2025-07-01 10:23:45,False
Priya Sharma,priya.sharma@outlook.com,9876543211,Property Inquiry,Home Buyers Mumbai,Lead Gen Campaign,Property Ad 2,2025-07-01 11:30:12,False
  Amit Patel  ,amit.patel@yahoo.com,8765432109,Interest Form,Tech Professionals Delhi,Lead Gen Campaign,Tech Ad 1,2025-07-01 14:15:00,False
Sneha Reddy,sneha.reddy@gmail.com,+917654321098,Contact Form,Bangalore Home Seekers,Retargeting Campaign,Retarget Ad 1,2025-07-02 09:45:30,False
Vikram Singh,vikram.singh@rediffmail.com,6543 210 987,Survey Form,Property Investors,Lead Gen Campaign,Investor Ad 1,2025-07-02 13:20:15,False
Anjali Desai,anjali.d@company.in,+91 6543210987,Newsletter Signup,Newsletter Subscribers,Content Campaign,News Ad 1,2025-07-02 16:00:00,True
Suresh Menon,suresh.menon@gmail.com,9876 123 456,Lead Form,Pune Property Seekers,Lead Gen Campaign,Pune Ad 1,2025-07-03 08:30:45,False
Kavita Joshi,kavita.joshi@rediffmail.com,+918765432109,Property Interest,First Time Buyers,Lead Gen Campaign,First Home Ad 1,2025-07-03 11:15:20,False
Manoj Tiwari,manoj.t@gmail.com,7654321098,Contact Form,Delhi NCR Buyers,Retargeting Campaign,Delhi Ad 1,2025-07-03 15:45:00,False
Deepak Verma,deepak.verma@yahoo.com,+91 7654 321 098,Survey Form,Investment Seekers,Lead Gen Campaign,Invest Ad 1,2025-07-04 10:00:30,False
Ritu Agarwal,ritu.agarwal@company.in,6543210987,Lead Form,Jaipur Property Seekers,Content Campaign,Jaipur Ad 1,2025-07-04 12:30:15,False
Sanjay Kulkarni,sanjay.k@gmail.com,+916543210987,Interest Form,Karnataka Buyers,Retargeting Campaign,Karnataka Ad 1,2025-07-04 14:45:00,False
Nandini Rao,nandini.rao@outlook.com,9871 234 567,Newsletter Signup,Luxury Segment,Lead Gen Campaign,Luxury Ad 1,2025-07-05 09:15:45,False
Rakesh Chandra,rakesh.c@rediffmail.com,+91 9871234567,Property Inquiry,NRI Buyers,Content Campaign,NRI Ad 1,2025-07-05 11:00:30,False
Meena Kumari,meena.k@gmail.com,8761234567,Contact Form,Senior Citizen Homes,Lead Gen Campaign,Senior Ad 1,2025-07-05 13:30:15,False
Arjun Nair,arjun.nair@yahoo.com,+918761234567,Lead Form,Kerala Property Seekers,Retargeting Campaign,Kerala Ad 1,2025-07-06 10:30:00,False
Pooja Mishra,pooja.m@company.in,7651 234 567,Survey Form,Young Professionals,Lead Gen Campaign,Young Ad 1,2025-07-06 14:00:45,False
Karthik Subramanian,karthik.s@gmail.com,+91 7651234567,Property Interest,Chennai Buyers,Content Campaign,Chennai Ad 1,2025-07-06 16:30:30,False
Shalini Pande,shalini.p@outlook.com,6541 234 567,Interest Form,Pune Investors,Retargeting Campaign,Pune Invest Ad 1,2025-07-07 09:00:15,False
Mohan Das,mohan.das@rediffmail.com,+916541234567,Newsletter Signup,Real Estate Updates,Lead Gen Campaign,Update Ad 1,2025-07-07 11:45:00,True`,

"03-google-ads-export.csv": `Lead ID,Lead Date,Campaign,Keyword,Match Type,Final URL,Form Field: Email,Form Field: Phone,Form Field: Name,Form Field: Message
1001,2025-07-01,Real Estate Lead Gen,best apartments in bangalore,Broad,https://example.com/leads,RAJESH.KUMAR@GMAIL.COM,9876543210,Rajesh Kumar,Looking for 2 BHK near Whitefield
1002,2025-07-01,Property Campaign,flats for sale sarjapur road,Broad,https://example.com/leads,priya.sharma@outlook.com,+91 8765432109,Priya Sharma,
1003,2025-07-02,Real Estate Lead Gen,villa plots electronic city,Phrase,https://example.com/villa,amit.patel@yahoo.com,8765-432-109,Amit Patel,Need plot with clear title
1004,2025-07-02,Property Campaign,3 bhk apartment whitefield,Exact,https://example.com/leads,  sneha.reddy@gmail.com  ,7654321098,Sneha Reddy,Budget around 80 lakhs
1005,2025-07-03,Real Estate Lead Gen,budget homes hsr layout,Broad,https://example.com/budget,,6543210987,Vikram Singh,Only phone available, call me
1006,2025-07-03,Property Campaign,luxury apartments mumbai,Phrase,https://example.com/luxury,ANJALI.DESAI@COMPANY.IN,+91 6543210987,Anjali Desai,
1007,2025-07-04,Real Estate Lead Gen,commercial plots pune,Exact,https://example.com/commercial,suresh.menon@gmail.com,,Suresh Menon,Interested in commercial land
1008,2025-07-04,Property Campaign,2 bhk ready to move,Broad,https://example.com/leads,KAVITA.JOSHI@REDIFFMAIL.COM,+918765432109,Kavita Joshi,Need possession by December
1009,2025-07-05,Real Estate Lead Gen,independent house chennai,Phrase,https://example.com/villa,manoj.t@gmail.com,7654-321-098,Manoj Tiwari,
1010,2025-07-05,Property Campaign,apartments near metro station,Exact,https://example.com/leads,deepak.verma@yahoo.com,+91 7654321098,Deepak Verma,Preferably near metro connectivity
1011,2025-07-06,Real Estate Lead Gen,affordable housing jaipur,Broad,https://example.com/budget,ritu.agarwal@company.in,6543-210-987,Ritu Agarwal,
1012,2025-07-06,Property Campaign,gated community bangalore,Phrase,https://example.com/leads,sanjay.kulkarni@gmail.com,+916543210987,Sanjay Kulkarni,Already in gated community but want to upgrade
1013,2025-07-07,Real Estate Lead Gen,premium villa plots,Exact,https://example.com/villa,NANDINI.RAO@OUTLOOK.COM,9871-234-567,Nandini Rao,Looking for villa plot in 1 Cr range
1014,2025-07-07,Property Campaign,studio apartment pune,Broad,https://example.com/leads,rakesh.c@rediffmail.com,+91 9871234567,Rakesh Chandra,For investment purpose
1015,2025-07-08,Real Estate Lead Gen,plots near hospital,Phrase,https://example.com/plots,MEENA.K@GMAIL.COM,8761-234-567,Meena Kumari,
1016,2025-07-08,Property Campaign,premium flats delhi,Exact,https://example.com/luxury,arjun.nair@yahoo.com,+918761234567,Arjun Nair,Budget 1.5 Cr for penthouse
1017,2025-07-09,Real Estate Lead Gen,row house nagar,Broad,https://example.com/leads,POOJA.M@COMPANY.IN,7651-234-567,Pooja Mishra,Need row house with parking
1018,2025-07-09,Property Campaign,gated community villa,Phrase,https://example.com/villa,karthik.subramanian@gmail.com,+91 7651234567,Karthik Subramanian,
1019,2025-07-10,Real Estate Lead Gen,commercial office space,Broad,https://example.com/commercial,SHALINI.P@OUTLOOK.COM,+916541234567,Shalini Pande,Need office space for 50 employees
1020,2025-07-10,Property Campaign,investment property india,Exact,https://example.com/leads,mohan.das@rediffmail.com,6541-234-567,Mohan Das,Looking for rental yield property`,

"04-real-estate-export.csv": `Customer Name,Email ID,Contact No,Property Type,Location,Budget Range,Possession Date,Executive,Lead Status,Remarks
Rajesh Kumar,rajesh.kumar@gmail.com,9876543210,2 BHK,Sarjapur Road,45L,30-06-2026,Amit Sharma,New,First time buyer looking for affordable option
Priya Sharma,priya.s@outlook.com,8765432109,3 BHK,Whitefield,65L,15-03-2026,Amit Sharma,Follow Up,Needs bigger space for growing family
Amit Patel,amit.patel@yahoo.com,7654321098,Villa,Electronic City,1.2Cr,30-09-2026,Neha Gupta,New,Luxury segment buyer with specific requirements
Sneha Reddy,sneha.reddy@gmail.com,+91 6543210987,2 BHK,HSR Layout,45L,31-12-2025,Neha Gupta,Booked,Booking confirmed on 15th June
Vikram Singh,,6543210987,Plot,Sarjapur Road,80L,,Amit Sharma,Follow Up,Only phone available, call back
Anjali Desai,anjali.d@company.in,9876123456,3 BHK,Whitefield,65L,31-03-2026,Ravi Kumar,Not Interested,Found cheaper option elsewhere
Suresh Menon,suresh.menon@gmail.com,+91 8765432109,Villa,Electronic City,1.2Cr,30-06-2026,Ravi Kumar,Site Visit Done,Site visit scheduled for Saturday
Kavita Joshi,kavita.joshi@rediffmail.com,7654123456,2 BHK,HSR Layout,45L,31-12-2025,Amit Sharma,Booked,Booking amount paid 2L
Manoj Tiwari,manoj.t@gmail.com,+917654321098,Plot,Sarjapur Road,80L,01-06-2026,Neha Gupta,Follow Up,Comparing with other projects
Deepak Verma,deepak.verma@yahoo.com,6543123456,3 BHK,Whitefield,65L,15-06-2026,Amit Sharma,New,Very interested, wants site visit
Ritu Agarwal,ritu.a@company.in,+91 6543123456,2 BHK,HSR Layout,45L,31-03-2026,Ravi Kumar,Not Interested,Job transfer to another city
Sanjay Kulkarni,sanjay.k@gmail.com,9871234567,Villa,Electronic City,1.2Cr,30-09-2026,Neha Gupta,Site Visit Done,Very impressed with amenities
Nandini Rao,nandini.rao@outlook.com,+91 8761234567,3 BHK,Sarjapur Road,65L,30-06-2026,Amit Sharma,New,NRI buyer looking for investment
Rakesh Chandra,rakesh.c@rediffmail.com,7651234567,Plot,Whitefield,80L,01-12-2026,Ravi Kumar,Follow Up,Wants corner plot specifically
Meena Kumari,meena.k@gmail.com,+917651234567,2 BHK,Electronic City,45L,31-03-2026,Amit Sharma,Not Interested,Waiting for price drop
Arjun Nair,arjun.nair@yahoo.com,6541234567,3 BHK,HSR Layout,65L,15-06-2026,Neha Gupta,Booked,Finalized 3BHK corner unit
Pooja Mishra,pooja.m@company.in,+91 6541234567,Villa,Sarjapur Road,1.2Cr,30-06-2026,Ravi Kumar,New,Premium villa buyer
Karthik Subramanian,karthik.s@gmail.com,9870123456,2 BHK,Whitefield,45L,31-12-2025,Amit Sharma,Site Visit Done,Visited on 20th June, liked layout
Shalini Pande,shalini.p@outlook.com,+91 8760123456,3 BHK,Electronic City,65L,15-03-2026,Neha Gupta,Follow Up,Need 3BHK with study room
Mohan Das,mohan.das@rediffmail.com,7650123456,Plot,HSR Layout,80L,01-06-2026,Ravi Kumar,New,Looking for commercial-cum-residential plot
Divya Prakash,divya.p@gmail.com,+916540123456,2 BHK,Sarjapur Road,45L,31-03-2026,Amit Sharma,Booked,First installment paid
Vivek Malhotra,vivek.m@company.in,9869012345,Villa,Whitefield,1.2Cr,30-09-2026,Neha Gupta,Follow Up,Negotiating final price
Ashok Pillai,ashok.p@gmail.com,+91 8759012345,3 BHK,Electronic City,65L,15-06-2026,Ravi Kumar,Not Interested,Went with Brigade project instead
Sunita Banerjee,sunita.b@outlook.com,7649012345,2 BHK,HSR Layout,45L,31-12-2025,Amit Sharma,New,First meeting scheduled tomorrow
Ramesh Babu,ramesh.babu@yahoo.com,+91 7649012345,Plot,Sarjapur Road,80L,01-12-2026,Neha Gupta,Site Visit Done,Approved location, discussing price`,

"05-sales-report.csv": `Contact Person,Mail,Mobile No,Organization,Region,Territory,Assigned To,Deal Stage,Last Contact,Comments
Rajesh Kumar,rajesh.kumar@gmail.com,9876543210,Tata Consultancy Services,Maharashtra,Mumbai,Amit Sharma,Hot Lead,06/15/2025,Enterprise license discussion in progress
Priya Sharma,priya.sharma@outlook.com,8765432109,Infosys Limited,Karnataka,Bangalore,Amit Sharma,Hot Lead,06/18/2025,PO expected by month end
Amit Patel,amit.patel@yahoo.com,7654321098,Wipro Technologies,Telangana,Hyderabad,Neha Gupta,Cold,06/20/2025,Not responding to follow ups
Sneha Reddy,sneha.reddy@gmail.com,6543210987,HCL Technologies,Tamil Nadu,Chennai,Neha Gupta,Hot Lead,06/22/2025,Decision maker confirmed budget
Vikram Singh,vikram.singh@rediffmail.com,9876123456,Reliance Industries,Maharashtra,Pune,Ravi Kumar,Lost,06/25/2025,Budget constraints, might revisit Q4
Anjali Desai,anjali.d@company.in,7654123456,Tech Mahindra,Maharashtra,Mumbai,Amit Sharma,Cold,06/28/2025,Wrong number provided
Suresh Menon,suresh.menon@gmail.com,+91 8765432109,Godrej Properties,Karnataka,Bangalore,Ravi Kumar,Hot Lead,07/01/2025,Referral from existing client Rajesh
Kavita Joshi,kavita.joshi@rediffmail.com,7650123456,Infosys Limited,Delhi,Delhi,Neha Gupta,Won,07/03/2025,Contract signed for 50 seats annual
Manoj Tiwari,manoj.t@gmail.com,9869012345,Cognizant,Tamil Nadu,Chennai,Amit Sharma,Cold,07/05/2025,Requested callback next month
Deepak Verma,deepak.verma@yahoo.com,8759012345,Wipro Technologies,Maharashtra,Pune,Ravi Kumar,Hot Lead,07/07/2025,Very interested in premium plan
Ritu Agarwal,ritu.agarwal@company.in,7649012345,Larsen & Toubro,Rajasthan,Jaipur,Amit Sharma,Won,07/09/2025,Deal closed 25L annual contract
Sanjay Kulkarni,sanjay.kulkarni@gmail.com,6549012345,TCS,Karnataka,Bangalore,Neha Gupta,Lost,07/11/2025,Went with competitor offering
Nandini Rao,nandini.rao@outlook.com,+91 6541234567,HCL Technologies,Telangana,Hyderabad,Ravi Kumar,Cold,07/13/2025,Email bounced back
Rakesh Chandra,rakesh.c@rediffmail.com,9870123456,Infosys Limited,Delhi,Delhi,Amit Sharma,Hot Lead,07/15/2025,Technical team evaluation pending
Meena Kumari,meena.k@gmail.com,8760123456,Tech Mahindra,Maharashtra,Mumbai,Neha Gupta,Cold,07/17/2025,Out of office until August
Arjun Nair,arjun.nair@yahoo.com,7650123456,Wipro Technologies,Kerala,Kochi,Amit Sharma,Won,07/19/2025,Payment received 18L
Pooja Mishra,pooja.m@company.in,6540123456,Cognizant,Rajasthan,Jaipur,Ravi Kumar,Hot Lead,07/21/2025,Competitor pricing comparison needed
Karthik Subramanian,karthik.s@gmail.com,9869012345,Reliance Industries,Tamil Nadu,Chennai,Amit Sharma,Lost,07/23/2025,Project cancelled by client
Shalini Pande,shalini.p@outlook.com,+91 8759012345,HCL Technologies,Maharashtra,Pune,Neha Gupta,Cold,07/25/2025,Wrong department contact
Mohan Das,mohan.das@rediffmail.com,7649012345,Glass Infosystems,Karnataka,Bangalore,Ravi Kumar,Hot Lead,07/27/2025,High priority lead from CEO reference`,

"06-marketing-campaign-export.csv": `Subscriber,Email,Mobile,Campaign Source,Tags,Opt-in Date,Status,Segment,Last Active,Engagement Score
Rajesh Kumar,rajesh.kumar@gmail.com,9876543210,Facebook Ads,vip; property-interest; sarjapur,2025-06-15,converted,leads_on_demand,2025-07-10,92
Priya Sharma,priya.sharma@outlook.com,8765432109,Google Ads,property-interest; whitefield,2025-06-18,subscribed,meridian_tower,2025-07-08,78
Amit Patel,amit.patel@yahoo.com;amit.patel@work.com,7654321098,Facebook Ads,vip; investment; electronic-city,2025-06-20,subscribed,eden_park,2025-07-05,65
Sneha Reddy,sneha.reddy@gmail.com,6543210987,Website,property-interest; hsr-layout,2025-06-22,converted,leads_on_demand,2025-07-09,88
Vikram Singh,vikram.singh@rediffmail.com,9876123456,Referral,premium; villa; sarjapur,2025-06-25,subscribed,meridian_tower,2025-07-07,45
Anjali Desai,anjali.d@company.in,7654123456,Google Ads,property-interest,2025-06-28,bounced,eden_park,2025-06-28,12
Suresh Menon,suresh.menon@gmail.com,+91 8765432109,Facebook Ads,vip; gated-community; whitefield,2025-07-01,subscribed,leads_on_demand,2025-07-10,82
Kavita Joshi,kavita.joshi@rediffmail.com,8765432109,Website,property-interest; sarjapur,2025-07-03,converted,meridian_tower,2025-07-09,71
Manoj Tiwari,manoj.t@gmail.com,+91 7654321098,Google Ads,investment; plot,2025-07-05,subscribed,eden_park,2025-07-06,34
Deepak Verma,deepak.verma@yahoo.com;deepak.v@company.com,6543210987,Facebook Ads,vip; premium; 3bhk; whitefield,2025-07-07,subscribed,leads_on_demand,2025-07-10,89
Ritu Agarwal,ritu.a@company.in,9871234567,Referral,budget; 2bhk; hsr-layout,2025-07-09,subscribed,meridian_tower,2025-07-08,56
Sanjay Kulkarni,sanjay.kulkarni@gmail.com,+91 8761234567,Google Ads,property-interest; electronic-city,2025-07-11,unsubscribed,eden_park,2025-07-03,23
Nandini Rao,nandini.rao@outlook.com,7651234567,Facebook Ads,vip; nri; investment,2025-07-13,subscribed,leads_on_demand,2025-07-10,74
Rakesh Chandra,rakesh.c@rediffmail.com,6541234567,Website,property-interest; plot; jaipur,2025-07-15,subscribed,meridian_tower,2025-07-09,48
Meena Kumari,meena.k@gmail.com,+91 6540123456,Google Ads,budget; 2bhk,2025-07-17,unsubscribed,eden_park,2025-07-02,19
Arjun Nair,arjun.nair@yahoo.com,9869012345,Referral,premium; villa; kochi,2025-07-19,converted,leads_on_demand,2025-07-10,95
Pooja Mishra,pooja.m@company.in;poorja.m@gmail.com,8759012345,Facebook Ads,property-interest; luxury; 3bhk,2025-07-21,subscribed,meridian_tower,2025-07-08,67
Karthik Subramanian,karthik.s@gmail.com,+91 7649012345,Google Ads,investment; chennai,2025-07-23,subscribed,eden_park,2025-07-07,41
Shalini Pande,shalini.p@outlook.com,7648012346,Facebook Ads,property-interest; sarjapur-road,2025-07-25,subscribed,leads_on_demand,2025-07-10,83
Mohan Das,mohan.das@rediffmail.com,+91 6538012346,Website,vip; gated-community; bangalore,2025-07-27,subscribed,meridian_tower,2025-07-09,76`,

"07-excel-spreadsheet.csv": `Name1,email!,phone_number,Co.,area,Location,country,agent_name,lead_type,comments
Rajesh Kumar,rajesh.kumar@gmail.com,9876543210,Tata Consultancy Services,Mumbai,Maharashtra,India,Amit Sharma,Hot Lead,Very interested in enterprise solution
Priya Sharma,priya.s@outlook.com,8765432109,Infosys Limited,Bangalore,Karnataka,India,Neha Gupta,Follow Up,Scheduled demo for next week
Amit Patel,amit.patel@yahoo.com,7654321098,Wipro Technologies,Hyderabad,Telangana,India,Ravi Kumar,Cold,Not returning calls
Sneha Reddy,sneha.reddy@gmail.com,,HCL Technologies,Chennai,Tamil Nadu,India,Neha Gupta,Hot Lead,Decision maker confirmed
Vikram Singh,vikram.singh@rediffmail.com,6543210987,Reliance Industries,Pune,Maharashtra,India,Amit Sharma,Lost,Budget not approved
Anjali Desai,,9876123456,Tech Mahindra,Mumbai,Maharashtra,India,Ravi Kumar,Cold,Wrong number
Suresh Menon,suresh.menon@gmail.com,8765432109,Godrej Properties,Bangalore,Karnataka,India,Neha Gupta,Hot Lead,Via referral
Kavita Joshi,kavita.joshi@rediffmail.com,+91 7654123456,Infosys Limited,Delhi,Delhi,India,Amit Sharma,Won,Contract signed 50 seats
Manoj Tiwari,manoj.t@gmail.com,6543210987,Cognizant,Chennai,Tamil Nadu,India,Neha Gupta,Cold,Requested callback next month
deepak verma  ,deepak.verma@yahoo.com,9876123456,Wipro Technologies,Pune,Maharashtra,India,Ravi Kumar,Hot Lead,Premium plan inquiry
Ritu Agarwal,ritu.a@company.in,7654123456,Larsen & Toubro,Jaipur,Rajasthan,India,Amit Sharma,Won,Deal closed 25L annual
Sanjay Kulkarni  ,sanjay.kulkarni@gmail.com,8765432109,TCS,Bangalore,Karnataka,India,Neha Gupta,Lost,Went with competitor
Nandini Rao,nandini.rao@outlook.com,+91 6543210987,HCL Technologies,Hyderabad,Telangana,India,Ravi Kumar,Hot Lead,Email valid
Rakesh Chandra  ,rakesh.c@rediffmail.com,7654321097,Infosys Limited,Delhi,Delhi,India,Amit Sharma,Follow Up,Technical evaluation pending
Meena Kumari,meena.k@gmail.com,9876123455,Tech Mahindra,Mumbai,Maharashtra,India,Neha Gupta,Cold,Out of office until August
Arjun Nair,arjun.nair@yahoo.com,,Wipro Technologies,Kochi,Kerala,India,Ravi Kumar,Won,Payment received
Pooja Mishra,pooja.m@company.in,7654123453,Cognizant,Jaipur,Rajasthan,India,Amit Sharma,Hot Lead,Competitor pricing comparison
Karthik Subramanian,karthik.s@gmail.com,(+91) 98765 43210,Reliance Industries,Chennai,Tamil Nadu,India,Neha Gupta,Lost,Project cancelled
Shalini Pande,shalini.p@outlook.com,8765432106,HCL Technologies,Pune,Maharashtra,India,Ravi Kumar,Cold,Wrong department
Mohan Das,mohan.das@rediffmail.com,7654321093,Glass Infosystems,Bangalore,Karnataka,India,Amit Sharma,Hot Lead,CEO reference`,

"08-phone-format-variations.csv": `Name,Email,Phone,Company,City,Status
Aarav Patel,aarav.patel@gmail.com,9876543210,Infosys,Bangalore,Hot Lead
Vikram Singh,vikram.singh@outlook.com,+919876543210,TCS,Delhi,New Lead
Priya Sharma,priya.sharma@yahoo.com,98765-43210,Wipro,Mumbai,Contacted
Anjali Desai,anjali.desai@gmail.com,98765 43210,HCL Technologies,Chennai,Hot Lead
Rohit Verma,rohit.verma@company.in,(98765) 43210,Reliance,Mumbai,Contacted
Sneha Reddy,sneha.reddy@gmail.com,+91 98765 43210,Infosys,Bangalore,New Lead
Manoj Kumar,manoj.kumar@gmail.com,+1 555 123 4567,Google,Hyderabad,New Lead
Kavita Joshi,kavita.joshi@outlook.com,+44 7911 123456,Amazon,London,Contacted
Suresh Nair,suresh.nair@gmail.com,98765,TCS,Delhi,New Lead
Deepak Mehta,deepak.mehta@yahoo.com,9876543210 ext 123,Samsung,Mumbai,Hot Lead
Rajesh Iyer,rajesh.iyer@company.in,080-23456789,Wipro,Bangalore,Contacted
Meena Kumari,meena.kumari@gmail.com,6000012345,Flipkart,Hyderabad,New Lead
Sanjay Gupta,sanjay.gupta@outlook.com,7000012345,Ola,Mumbai,Hot Lead
Neha Agarwal,neha.agarwal@gmail.com,8000012345,Uber,Delhi,Contacted
Prakash Rao,prakash.rao@yahoo.com,9000012345,Zomato,Chennai,New Lead
Sunita Devi,sunita.devi@gmail.com,9876543210 / 8765432109,Amazon,Mumbai,Hot Lead
Amit Singh,amit.singh@company.in,9876543210,TCS,Delhi,New Lead
Pooja Bhat,pooja.bhat@gmail.com,9876S43210,Infosys,Bangalore,Contacted
Vishal Mishra,vishal.mishra@outlook.com,,Wipro,Mumbai,New Lead
Rekha Patil,rekha.patil@yahoo.com,+91-98765-43210,HCL Technologies,Pune,Hot Lead
Ganesh Kulkarni,ganesh.kulkarni@gmail.com,022-23456789,Reliance,Mumbai,Contacted
Lata Bhonsle,lata.bhonsle@company.in,+918876543210,Samsung,Pune,New Lead
Ashwin Deshmukh,ashwin.deshmukh@gmail.com,91 98765 43210,Flipkart,Mumbai,Hot Lead
Kiran Jadhav,kiran.jadhav@yahoo.com,(020) 23456789,Ola,Pune,Contacted
Nitin Phadke,nitin.phadke@gmail.com,987654321000000,TCS,Delhi,New Lead`,

"09-date-format-variations.csv": `Name,Email,Created_Date,Follow_Up_Date,Last_Contact,Company,City,Status
Aarav Patel,aarav.patel@gmail.com,2024-01-15,2024-02-20,2024-01-10,Infosys,Bangalore,Hot Lead
Vikram Singh,vikram.singh@outlook.com,01/15/2024,02/20/2024,01/10/2024,TCS,Delhi,New Lead
Priya Sharma,priya.sharma@yahoo.com,15/01/2024,20/02/2024,10/01/2024,Wipro,Mumbai,Contacted
Anjali Desai,anjali.desai@gmail.com,15.01.2024,20.02.2024,10.01.2024,HCL Technologies,Chennai,Hot Lead
Rohit Verma,rohit.verma@company.in,2024-01-15 14:30:00,2024-02-20 10:00:00,2024-01-10 16:45:00,Reliance,Mumbai,Contacted
Sneha Reddy,sneha.reddy@gmail.com,"Jan 15, 2024","Feb 20, 2024","Jan 10, 2024",Infosys,Bangalore,New Lead
Manoj Kumar,manoj.kumar@gmail.com,15th Jan 2024,20th Feb 2024,10th Jan 2024,Google,Hyderabad,Hot Lead
Kavita Joshi,kavita.joshi@outlook.com,15/01/24,20/02/24,10/01/24,Amazon,London,Contacted
Suresh Nair,suresh.nair@gmail.com,2024/01/15,2024/02/20,2024/01/10,TCS,Delhi,New Lead
Deepak Mehta,deepak.mehta@yahoo.com,45307,45343,45302,Samsung,Mumbai,Hot Lead
Rajesh Iyer,rajesh.iyer@company.in,2024-01-15T14:30:00+05:30,2024-02-20T10:00:00+05:30,2024-01-10T16:45:00+05:30,Wipro,Bangalore,Contacted
Meena Kumari,meena.kumari@gmail.com,15-01-2024 14:30:00,20-02-2024 10:00:00,10-01-2024 16:45:00,Flipkart,Hyderabad,New Lead
Sanjay Gupta,sanjay.gupta@outlook.com,January 15, 2024,February 20, 2024,January 10, 2024,Ola,Mumbai,Hot Lead
Neha Agarwal,neha.agarwal@gmail.com,20240115,20240220,20240110,Amazon,Delhi,Contacted
Prakash Rao,prakash.rao@yahoo.com,2024-01,2024-02,2024-01,Zomato,Chennai,New Lead
Sunita Devi,sunita.devi@gmail.com,2026-12-31,2027-01-15,2026-12-20,Amazon,Mumbai,Hot Lead
Amit Singh,amit.singh@company.in,01/01/2000,01/02/2000,12/01/1999,TCS,Delhi,New Lead
Pooja Bhat,pooja.bhat@gmail.com,,,Infosys,Bangalore,Contacted
Vishal Mishra,vishal.mishra@outlook.com,32/01/2024,45/02/2024,30/01/2024,Wipro,Mumbai,New Lead
Rekha Patil,rekha.patil@yahoo.com,2024-01-15T14:30:00Z,2024-02-20T10:00:00Z,2024-01-10T16:45:00Z,HCL Technologies,Pune,Hot Lead`,

"10-missing-columns.csv": `Email,Phone,Status
aarav.patel@gmail.com,9876543210,Hot Lead
vikram.singh@outlook.com,+919876543210,New Lead
priya.sharma@yahoo.com,98765-43210,Contacted
anjali.desai@gmail.com,98765 43210,Hot Lead
rohit.verma@company.in,(98765) 43210,New Lead
sneha.reddy@gmail.com,+91 98765 43210,Contacted
manoj.kumar@gmail.com,7000012345,Hot Lead
kavita.joshi@outlook.com,8000012345,New Lead
suresh.nair@gmail.com,9000012345,Contacted
deepak.mehta@yahoo.com,6000012345,Hot Lead
rajesh.iyer@company.in,080-23456789,New Lead
meena.kumari@gmail.com,+1 555 123 4567,Contacted
sanjay.gupta@outlook.com,+44 7911 123456,Hot Lead
neha.agarwal@gmail.com,9876543210 ext 123,New Lead
prakash.rao@yahoo.com,,Contacted`,

"11-extra-columns.csv": `Name,Email,Phone,Company,City,Status,Website_URL,LinkedIn_Profile,Instagram_Handle,Aadhaar_Number,PAN_Number,Annual_Income,Property_Budget,Current_EMIs,Family_Size,Number_of_Children,preferred_language,best_time_to_call,referral_code,lead_score,priority_level
Aarav Patel,aarav.patel@gmail.com,9876543210,Infosys,Bangalore,Hot Lead,https://www.infosys.com,linkedin.com/in/aarav-patel,@aarav_patel,1234-5678-9012,ABCDE1234F,1500000,8000000,25000,4,2,English,10:00-18:00,REF001,85,high
Vikram Singh,vikram.singh@outlook.com,+919876543210,TCS,Delhi,New Lead,https://www.tcs.com,linkedin.com/in/vikram-singh,@vikram_singh,2345-6789-0123,BCDEF2345G,2000000,12000000,35000,5,3,Hindi,09:00-17:00,REF002,92,high
Priya Sharma,priya.sharma@yahoo.com,98765-43210,Wipro,Mumbai,Contacted,https://www.wipro.com,linkedin.com/in/priya-sharma,@priya_sharma,3456-7890-1234,CDEFG3456H,1200000,6000000,18000,3,1,English,11:00-19:00,REF003,67,medium
Anjali Desai,anjali.desai@gmail.com,98765 43210,HCL Technologies,Chennai,Hot Lead,https://www.hcltech.com,linkedin.com/in/anjali-desai,@anjali_desai,4567-8901-2345,DEFGH4567I,1800000,10000000,28000,4,2,Hindi,08:00-16:00,REF004,78,high
Rohit Verma,rohit.verma@company.in,(98765) 43210,Reliance,Mumbai,Contacted,https://www.ril.com,linkedin.com/in/rohit-verma,@rohit_verma,5678-9012-3456,EFGHI5678J,2500000,15000000,42000,6,3,English,10:00-18:00,REF005,88,high
Sneha Reddy,sneha.reddy@gmail.com,+91 98765 43210,Infosys,Bangalore,New Lead,https://www.infosys.com,linkedin.com/in/sneha-reddy,@sneha_reddy,6789-0123-4567,FGHIJ6789K,1600000,7000000,22000,3,1,Telugu,09:00-17:00,REF006,55,medium
Manoj Kumar,manoj.kumar@gmail.com,+1 555 123 4567,Google,Hyderabad,Hot Lead,https://www.google.com,linkedin.com/in/manoj-kumar,@manoj_kumar,7890-1234-5678,GHIJK7890L,3000000,20000000,55000,5,2,English,08:00-16:00,REF007,95,high
Kavita Joshi,kavita.joshi@outlook.com,+44 7911 123456,Amazon,London,Contacted,https://www.amazon.co.uk,linkedin.com/in/kavita-joshi,@kavita_joshi,8901-2345-6789,HIJKL8901M,1400000,5000000,15000,3,1,English,11:00-19:00,REF008,45,low
Suresh Nair,suresh.nair@gmail.com,98765,TCS,Delhi,New Lead,https://www.tcs.com,linkedin.com/in/suresh-nair,@suresh_nair,9012-3456-7890,IJKLM9012N,1700000,8000000,25000,4,2,Hindi,10:00-18:00,REF009,62,medium
Deepak Mehta,deepak.mehta@yahoo.com,9876543210 ext 123,Samsung,Mumbai,Hot Lead,https://www.samsung.com,linkedin.com/in/deepak-mehta,@deepak_mehta,0123-4567-8901,JKLMN0123P,2200000,12000000,38000,5,3,English,09:00-17:00,REF010,81,high
Rajesh Iyer,rajesh.iyer@company.in,080-23456789,Wipro,Bangalore,Contacted,https://www.wipro.com,linkedin.com/in/rajesh-iyer,@rajesh_iyer,1234-5678-9012,KLMNO1234Q,1900000,9000000,30000,4,2,Tamil,08:00-16:00,REF011,70,medium
Meena Kumari,meena.kumari@gmail.com,6000012345,Flipkart,Hyderabad,New Lead,https://www.flipkart.com,linkedin.com/in/meena-kumari,@meena_kumari,2345-6789-0123,LMNOP2345R,1100000,4000000,12000,3,1,Hindi,10:00-18:00,REF012,48,low
Sanjay Gupta,sanjay.gupta@outlook.com,7000012345,Ola,Mumbai,Hot Lead,https://www.olacabs.com,linkedin.com/in/sanjay-gupta,@sanjay_gupta,3456-7890-1234,MNOPQ3456S,2800000,18000000,50000,6,4,English,09:00-17:00,REF013,90,high
Neha Agarwal,neha.agarwal@gmail.com,8000012345,Amazon,Delhi,Contacted,https://www.amazon.in,linkedin.com/in/neha-agarwal,@neha_agarwal,4567-8901-2345,NOPQR4567T,1500000,7000000,20000,4,2,Hindi,11:00-19:00,REF014,60,medium
Prakash Rao,prakash.rao@yahoo.com,9000012345,Zomato,Chennai,New Lead,https://www.zomato.com,linkedin.com/in/prakash-rao,@prakash_rao,5678-9012-3456,OPQRS5678U,1300000,5000000,16000,3,1,Tamil,08:00-16:00,REF015,42,low
Sunita Devi,sunita.devi@gmail.com,9876543210 / 8765432109,Amazon,Mumbai,Hot Lead,https://www.amazon.in,linkedin.com/in/sunita-devi,@sunita_devi,6789-0123-4567,PQRST6789V,2100000,11000000,32000,5,3,English,10:00-18:00,REF016,75,high
Amit Singh,amit.singh@company.in,9876543210,TCS,Delhi,New Lead,https://www.tcs.com,linkedin.com/in/amit-singh,@amit_singh,7890-1234-5678,QRSTU7890W,1600000,6000000,19000,3,1,Hindi,09:00-17:00,REF017,52,medium
Pooja Bhat,pooja.bhat@gmail.com,9876S43210,Infosys,Bangalore,Contacted,https://www.infosys.com,linkedin.com/in/pooja-bhat,@pooja_bhat,8901-2345-6789,RSTUV8901X,1400000,5000000,14000,3,1,English,11:00-19:00,REF018,58,medium
Vishal Mishra,vishal.mishra@outlook.com,,Wipro,Mumbai,New Lead,https://www.wipro.com,linkedin.com/in/vishal-mishra,@vishal_mishra,9012-3456-7890,STUVW9012Y,1800000,8000000,26000,4,2,Hindi,10:00-18:00,REF019,65,medium
Rekha Patil,rekha.patil@yahoo.com,+91-98765-43210,HCL Technologies,Pune,Hot Lead,https://www.hcltech.com,linkedin.com/in/rekha-patil,@rekha_patil,0123-4567-8901,TUVWX0123Z,2000000,10000000,35000,5,3,Marathi,09:00-17:00,REF020,82,high
Ganesh Kulkarni,ganesh.kulkarni@gmail.com,022-23456789,Reliance,Mumbai,Contacted,https://www.ril.com,linkedin.com/in/ganesh-kulkarni,@ganesh_kulkarni,1234-5678-9012,UVWXY1234A,1700000,7000000,23000,4,2,Marathi,08:00-16:00,REF021,56,medium
Lata Bhonsle,lata.bhonsle@company.in,+918876543210,Samsung,Pune,New Lead,https://www.samsung.com,linkedin.com/in/lata-bhonsle,@lata_bhonsle,2345-6789-0123,VWXYZ2345B,1200000,4000000,11000,3,1,Marathi,10:00-18:00,REF022,40,low
Ashwin Deshmukh,ashwin.deshmukh@gmail.com,91 98765 43210,Flipkart,Mumbai,Hot Lead,https://www.flipkart.com,linkedin.com/in/ashwin-deshmukh,@ashwin_deshmukh,3456-7890-1234,WXYZA3456C,2400000,14000000,45000,5,3,English,09:00-17:00,REF023,87,high
Kiran Jadhav,kiran.jadhav@yahoo.com,(020) 23456789,Ola,Pune,Contacted,https://www.olacabs.com,linkedin.com/in/kiran-jadhav,@kiran_jadhav,4567-8901-2345,XYZAB4567D,1500000,6000000,18000,3,1,Marathi,11:00-19:00,REF024,63,medium
Nitin Phadke,nitin.phadke@gmail.com,987654321000000,TCS,Delhi,New Lead,https://www.tcs.com,linkedin.com/in/nitin-phadke,@nitin_phadke,5678-9012-3456,YZABC5678E,1900000,9000000,29000,4,2,Hindi,10:00-18:00,REF025,71,medium`,

"12-duplicate-headers.csv": `Name,Name,Email,Email,Phone,Phone,Status
Aarav Patel,Infosys Bangalore,aarav.patel@gmail.com,aarav.patel@infosys.com,9876543210,+919876543210,Hot Lead
Vikram Singh,TCS Delhi,vikram.singh@outlook.com,vikram.singh@tcs.com,+919876543210,98765-43210,New Lead
Priya Sharma,Wipro Mumbai,priya.sharma@yahoo.com,priya.sharma@wipro.com,98765-43210,98765 43210,Contacted
Anjali Desai,HCL Chennai,anjali.desai@gmail.com,anjali.desai@hcl.com,98765 43210,(98765) 43210,Hot Lead
Rohit Verma,Reliance Mumbai,rohit.verma@company.in,rohit.verma@ril.com,(98765) 43210,+91 98765 43210,Contacted
Sneha Reddy,Infosys Bangalore,sneha.reddy@gmail.com,sneha.reddy@infosys.com,+91 98765 43210,7000012345,New Lead
Manoj Kumar,Google Hyderabad,manoj.kumar@gmail.com,manoj.kumar@google.com,+1 555 123 4567,8000012345,Hot Lead
Kavita Joshi,Amazon London,kavita.joshi@outlook.com,kavita.joshi@amazon.co.uk,+44 7911 123456,9000012345,Contacted
Suresh Nair,TCS Delhi,suresh.nair@gmail.com,suresh.nair@tcs.com,98765,6000012345,New Lead
Deepak Mehta,Samsung Mumbai,deepak.mehta@yahoo.com,deepak.mehta@samsung.com,9876543210 ext 123,080-23456789,Hot Lead
Rajesh Iyer,Wipro Bangalore,rajesh.iyer@company.in,rajesh.iyer@wipro.com,080-23456789,+1 555 123 4567,Contacted
Meena Kumari,Flipkart Hyderabad,meena.kumari@gmail.com,meena.kumari@flipkart.com,6000012345,+44 7911 123456,New Lead
Sanjay Gupta,Ola Mumbai,sanjay.gupta@outlook.com,sanjay.gupta@olacabs.com,7000012345,9876543210 ext 123,Hot Lead
Neha Agarwal,Amazon Delhi,neha.agarwal@gmail.com,neha.agarwal@amazon.in,8000012345,080-23456789,Contacted
Prakash Rao,Zomato Chennai,prakash.rao@yahoo.com,prakash.rao@zomato.com,9000012345,6000012345,New Lead`,

"13-messy-chaotic.csv": `col1,blah,data,???,notes
Rajesh Kumar (राजेश),rajesh@gmail.com,9876543210,Hot Lead,Interested 🏠 Call back 📞
PRIYA SHARMA,priya@yahoo.com,8765432109,New Lead,Very long text about property requirements
rAjEsH kUmAr,rakesh@company.in,(98765) 43210,Contacted,Important lead - call immediately
O'Brien,sean@obrien.ie,+353 87 123 4567,New Lead,'; DROP TABLE contacts;--
D'Souza,derrick.dsouza@gmail.com,9876543210 ext 123,Hot Lead,Please call
van der Berg,pieter@vanderberg.nl,+31 6 12345678,Contacted,HTML script injection test
Ñoño García,nono@espana.es,+34 612 345 678,New Lead,Unicode test: àáâãäåæçèéêë
123,,,,
a,x,1,,
,RASHMI,,Hot Lead,Empty name field
KUMAR SAHIB,KUMAR@YAHOO.COM,+919876543210,ALL CAPS,
mixed CASE mIxEd,mixed@case.com,8765432109,mixed case,
"Quoted ""Name""",quoted@gmail.com,7654321098,New Lead,Has quotes inside
Raj & Sons (Pvt) Ltd,rajsons@company.in,022-23456789,Contacted,Special chars: @#$%^&*()
Anand,anand.k@outlook.com,,New Lead,
,,Hot Lead,Row with no identifiers
   whitespace   ,ws@test.com,9876543210,,`,

"14-no-email-no-phone.csv": `Name,Company,City,Status
Aarav Patel,Infosys,Bangalore,Hot Lead
Vikram Singh,TCS,Delhi,New Lead
Priya Sharma,Wipro,Mumbai,Contacted
Anjali Desai,HCL Technologies,Chennai,Hot Lead
Rohit Verma,Reliance,Mumbai,New Lead
Sneha Reddy,Infosys,Bangalore,Contacted
Manoj Kumar,Google,Hyderabad,Hot Lead
Kavita Joshi,Amazon,London,New Lead
Suresh Nair,TCS,Delhi,Contacted
Deepak Mehta,Samsung,Mumbai,Hot Lead`,

"15-multi-value-fields.csv": `Name,Email,Phone,Company,Notes,Status
Aarav Patel,aarav.patel@gmail.com; aarav.work@infosys.com,9876543210,Infosys,Primary email is personal,Hot Lead
Vikram Singh,vikram.singh@outlook.com; vikram.s@tcs.com; hr@vikram.com,+919876543210; 8765432109; 022-23456789,TCS,Has 3 emails and 3 phones,New Lead
Priya Sharma,priya.sharma@yahoo.com,98765-43210; 8765432109,Wipro,Two phone numbers on file,Contacted
Anjali Desai,anjali.desai@gmail.com; info@anjalidesigns.com,98765 43210,HCL Technologies,Personal and business email,Hot Lead
Rohit Verma,rohit.verma@company.in,(98765) 43210,Reliance,Single phone format,Contacted
Sneha Reddy,sneha.reddy@gmail.com,+91 98765 43210,Infosys,Standard format,New Lead
Manoj Kumar,manoj.kumar@gmail.com,+1 555 123 4567,Google,International number,Hot Lead
Kavita Joshi,kavita.joshi@outlook.com; kjoshi@amazon.co.uk,+44 7911 123456; +91 9876543210,Amazon,UK and India contacts,Contacted
Suresh Nair,suresh.nair@gmail.com,98765; 8765432109,TCS,Short code and full number,New Lead
Deepak Mehta,deepak.mehta@yahoo.com,9876543210 ext 123; 8765432109,Samsung,With extension and backup,Hot Lead
Rajesh Iyer,rajesh.iyer@company.in,080-23456789,Wipro,Landline number,Contacted
Meena Kumari,meena.kumari@gmail.com; meena.k@flipkart.com,6000012345,Flipkart,Mobile starting with 6,New Lead
Sanjay Gupta,sanjay.gupta@outlook.com,7000012345,Ola,Mobile starting with 7,Hot Lead
Neha Agarwal,neha.agarwal@gmail.com,8000012345,Amazon,Mobile starting with 8,Contacted
Prakash Rao,prakash.rao@yahoo.com,9000012345,Zomato,Mobile starting with 9,New Lead
Sunita Devi,sunita.devi@gmail.com,9876543210 / 8765432109,Amazon,Slash separated phones,Hot Lead
Amit Singh,amit.singh@company.in,9876543210,TCS,Standard single phone,New Lead
Pooja Bhat,pooja.bhat@gmail.com,9876S43210,Infosys,Typo in phone number,Contacted
Vishal Mishra,vishal.mishra@outlook.com,,Wipro,Missing phone,New Lead
Rekha Patil,rekha.patil@yahoo.com,+91-98765-43210,HCL Technologies,Dash with country code,Hot Lead`,

"16-large-dataset-5000.csv": `prospect_name,contact_email,phone,org,city,state,country,assigned_agent,lead_status,source_campaign,submission_date,remarks
Nisha Shah,nisha.shah@hotmail.com,82406 64580,Startup India,Jaipur,Rajasthan,India,Anita Gupta,Not Interested,Housing.com,2024-12-08,
Geeta Verma,geeta.verma@email.com,+918853757429,Real Estate Co,Ahmedabad,Gujarat,India,Rahul Mehta,Bad Lead,Referral,2024-11-16,
Harish Patel,harish.patel@outlook.com,9876543210,Infosys,Bangalore,Karnataka,India,Anita Gupta,Follow Up,Facebook Ads,2024-10-05,
Deepa Nair,deepa.nair@gmail.com,8765432109,TCS,Mumbai,Maharashtra,India,Rahul Mehta,New Lead,Google Ads,2024-09-22,
Rajesh Kumar,rajesh.k@company.in,+917654321098,Wipro,Delhi,Delhi,India,Anita Gupta,Contacted,Website,2024-08-14,
Meera Iyer,meera.iyer@yahoo.com,6543210987,HCL Technologies,Chennai,Tamil Nadu,India,Rahul Mehta,Follow Up,IndiaMART,2024-07-30,
Vikram Singh,vikram.s@outlook.com,9876123456,Samsung,Hyderabad,Telangana,India,Anita Gupta,New Lead,JustDial,2024-06-18,
Pooja Gupta,pooja.g@gmail.com,+91 8765432109,Reliance,Pune,Maharashtra,India,Rahul Mehta,Not Interested,MagicBricks,2024-05-09,
Amit Desai,amit.desai@company.in,7654321098,Tata Steel,Kolkata,West Bengal,India,Anita Gupta,Follow Up,99acres,2024-04-27,
Kavita Reddy,kavita.r@hotmail.com,6543123456,Godrej Properties,Bangalore,Karnataka,India,Rahul Mehta,Contacted,leads_on_demand,2024-03-15,
Suresh Menon,suresh.m@gmail.com,+919876543210,Adani Group,Ahmedabad,Gujarat,India,Anita Gupta,New Lead,meridian_tower,2024-02-08,
Anjali Kulkarni,anjali.k@outlook.com,8765123456,Larsen & Toubro,Mumbai,Maharashtra,India,Rahul Mehta,Follow Up,eden_park,2024-01-20,
Ravi Shankar,ravi.s@yahoo.com,7654123456,Cognizant,Chennai,Tamil Nadu,India,Anita Gupta,Not Interested,varah_swamy,2024-12-01,
Neha Agarwal,neha.a@gmail.com,+91 6543210987,Tech Mahindra,Delhi,Delhi,India,Rahul Mehta,Contacted,sarjapur_plots,2024-11-14,
Sanjay Patil,sanjay.p@company.in,9870123456,Infosys,Pune,Maharashtra,India,Anita Gupta,New Lead,leads_on_demand,2024-10-03,
Shalini Das,shalini.d@hotmail.com,8760123456,Wipro,Kolkata,West Bengal,India,Rahul Mehta,Follow Up,meridian_tower,2024-09-19,
Mohan Rao,mohan.r@gmail.com,+91 7650123456,HCL Technologies,Hyderabad,Telangana,India,Anita Gupta,Bad Lead,eden_park,2024-08-07,
Divya Sharma,divya.s@outlook.com,6540123456,Samsung,Bangalore,Karnataka,India,Rahul Mehta,Contacted,varah_swamy,2024-07-25,
Karthik Iyer,karthik.i@yahoo.com,9869012345,Reliance,Chennai,Tamil Nadu,India,Anita Gupta,New Lead,sarjapur_plots,2024-06-12,
Pooja Nair,pooja.n@company.in,+91 8759012345,TCS,Mumbai,Maharashtra,India,Rahul Mehta,Follow Up,leads_on_demand,2024-05-01,`,
};
