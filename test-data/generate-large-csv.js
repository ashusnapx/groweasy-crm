const fs = require('fs');
const path = require('path');

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anita', 'Suresh', 'Deepa',
  'Ravi', 'Pooja', 'Arjun', 'Kavita', 'Sanjay', 'Meena', 'Anil', 'Sunita',
  'Manoj', 'Rekha', 'Vijay', 'Geeta', 'Rahul', 'Aisha', 'Kiran', 'Lata',
  'Mohan', 'Nisha', 'Pradeep', 'Seema', 'Tarun', 'Usha', 'Vinod', 'Wendy',
  'Yogesh', 'Zara', 'Aarav', 'Diya', 'Ishaan', 'Jaya', 'Karan', 'Leela',
  'Nikhil', 'Om', 'Pranav', 'Riya', 'Sachin', 'Tanvi', 'Uday', 'Varun',
  'Yash', 'Aditi'
];

const lastNames = [
  'Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Gupta',
  'Verma', 'Rao', 'Das', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Bose',
  'Joshi', 'Mishra', 'Tiwari', 'Pandey', 'Sinha', 'Chauhan', 'Yadav',
  'Mehta', 'Shah', 'Desai', 'Kulkarni', 'Deshmukh', 'Pillai', 'Menon',
  'Nambiar', 'Bhat', 'Pai', 'Hegde', 'Kamath', 'Saldanha', 'Fernandes'
];

const emails = [
  '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@rediffmail.com',
  '@email.com', '@mail.com', '@protonmail.com'
];

const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

const statesMap = {
  'Bangalore': 'Karnataka',
  'Mumbai': 'Maharashtra',
  'Delhi': 'Delhi',
  'Chennai': 'Tamil Nadu',
  'Hyderabad': 'Telangana',
  'Pune': 'Maharashtra',
  'Kolkata': 'West Bengal',
  'Ahmedabad': 'Gujarat',
  'Jaipur': 'Rajasthan',
  'Lucknow': 'Uttar Pradesh'
};

const states = Object.values(statesMap);

const sources = ['Facebook Ads', 'Google Ads', 'Website', 'Referral', 'LinkedIn', 'IndiaMART', 'JustDial', 'MagicBricks', '99acres', 'Housing.com'];

const statuses = ['New', 'Follow Up', 'Contacted', 'Not Interested', 'Converted', 'Bad Lead'];

const agents = ['Rahul Mehta', 'Priya Sharma', 'Amit Patel', 'Neha Reddy', 'Vikram Singh', 'Anita Gupta'];

const remarksPool = [
  'Interested in premium package',
  'Budget: 50-75 lakhs',
  'Looking for 2BHK in Sarjapur',
  'Wants to visit property this weekend',
  'Already purchased from competitor',
  'Needs EMI options',
  'NRI client - call after 6 PM IST',
  'Requires Vastu compliant flat',
  'Preferred floor: 8th or above',
  'Has pets - needs ground floor',
  '',
  '',
  '',
  '',
  ''
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
  const formats = ['plain', 'plus91', 'dashed', 'spaced', 'parens'];
  const fmt = pick(formats);
  const num = randomInt(7000000000, 9999999999).toString();

  switch (fmt) {
    case 'plus91':
      return '+91' + num;
    case 'dashed':
      return num.slice(0, 5) + '-' + num.slice(5);
    case 'spaced':
      return num.slice(0, 5) + ' ' + num.slice(5);
    case 'parens':
      return '(' + num.slice(0, 5) + ') ' + num.slice(5);
    default:
      return num;
  }
}

function generateDate() {
  const year = 2024;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function escapeCSV(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function generateRow(rowNum) {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const fullName = firstName + ' ' + lastName;

  // 2% no email and phone → skip
  const skipBoth = Math.random() < 0.02;
  // 5% no email
  const noEmail = Math.random() < 0.05 || skipBoth;
  // 3% no phone
  const noPhone = Math.random() < 0.03 || skipBoth;

  const email = noEmail ? '' : (firstName.toLowerCase() + '.' + lastName.toLowerCase() + pick(emails));
  const phone = noPhone ? '' : generatePhone();

  const city = pick(cities);
  const state = statesMap[city];
  const agent = pick(agents);
  const status = pick(statuses);
  const source = pick(sources);
  const date = generateDate();
  const remarks = Math.random() < 0.10 ? pick(remarksPool.filter(r => r !== '')) : '';

  return [
    fullName,
    email,
    phone,
    pick(['Acme Corp', 'Tech Solutions', 'Property Investors', 'Individual', 'Startup India', 'Real Estate Co', 'HomeBuyers Pvt Ltd']),
    city,
    state,
    'India',
    agent,
    status,
    source,
    date,
    remarks
  ].map(escapeCSV).join(',');
}

function main() {
  const header = 'prospect_name,contact_email,phone,org,city,state,country,assigned_agent,lead_status,source_campaign,submission_date,remarks';
  const rows = [header];

  for (let i = 0; i < 5000; i++) {
    rows.push(generateRow(i + 1));
  }

  const outputPath = path.join(__dirname, '16-large-dataset-5000.csv');
  fs.writeFileSync(outputPath, rows.join('\n'), 'utf8');
  console.log(`Generated ${rows.length - 1} rows → ${outputPath}`);
}

main();