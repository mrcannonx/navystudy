export const PAYGRADE_OPTIONS = ["E5", "E6", "E7"]

// Separate cycle options by paygrade
export const E5_E6_CYCLE_OPTIONS = [
  "102 - Feb 2018",
  "239 - Mar 2018",
  "103 - Aug 2018",
  "240 - Sep 2018",
  "104 - Feb 2019",
  "243 - Mar 2019",
  "105 - Aug 2019",
  "244 - Sep 2019",
  "106 - Feb 2020",
  "247 - Mar 2020",
  "107 - Aug 2020",
  "248 - Sep 2020",
  "108 - Feb 2021",
  "251 - Mar 2021",
  "109 - Aug 2021",
  "252 - Sep 2021",
  "110 - Feb 2022",
  "255 - Mar 2022",
  "111 - Aug 2022",
  "256 - Sep 2022",
  "112 - Feb 2023",
  "259 - Mar 2023",
  "113 - Aug 2023",
  "260 - Sep 2023",
  "114 - Feb 2024",
  "263 - Mar 2024",
  "115 - Aug 2024",
  "264 - Sep 2024",
  "116 - Feb 2025",
  "267 - Mar 2025",
  "117 - Aug 2025",
  "268 - Sep 2025",
  "118 - Feb 2026",
  "271 - Mar 2026",
  "119 - Aug 2026",
  "272 - Sep 2026",
  "120 - Feb 2027",
  "275 - Mar 2027",
  "121 - Aug 2027",
  "276 - Sep 2027",
  "122 - Feb 2028",
  "279 - Mar 2028",
  "123 - Aug 2028",
  "280 - Sep 2028",
  "124 - Feb 2029",
  "283 - Mar 2029",
  "125 - Aug 2029",
  "284 - Sep 2029",
  "126 - Feb 2030",
  "287 - Mar 2030",
  "127 - Aug 2030",
  "288 - Sep 2030",
  "128 - Feb 2031",
  "291 - Mar 2031",
  "129 - Aug 2031",
  "292 - Sep 2031"
]

export const E7_CYCLE_OPTIONS = [
  "238 - Jan 2018",
  "102 - Feb 2018",
  "242 - Jan 2019",
  "104 - Feb 2019",
  "246 - Jan 2020",
  "106 - Feb 2020",
  "250 - Jan 2021",
  "108 - Feb 2021",
  "254 - Jan 2022",
  "110 - Feb 2022",
  "258 - Jan 2023",
  "112 - Feb 2023",
  "262 - Jan 2024",
  "114 - Feb 2024",
  "266 - Jan 2025",
  "116 - Feb 2025",
  "270 - Jan 2026",
  "118 - Feb 2026",
  "274 - Jan 2027",
  "120 - Feb 2027",
  "278 - Jan 2028",
  "122 - Feb 2028",
  "282 - Jan 2029",
  "124 - Feb 2029",
  "286 - Jan 2030",
  "126 - Feb 2030",
  "290 - Jan 2031",
  "128 - Feb 2031"
]

// Function to get cycle options based on paygrade
export const getCycleOptions = (paygrade: string) => {
  return paygrade === "E7" ? E7_CYCLE_OPTIONS : E5_E6_CYCLE_OPTIONS
}

/**
 * Tooltip content for FMS calculator
 * Updated to reflect NAVADMIN 312/18 guidelines
 */
export const TOOLTIP_CONTENT = {
  pma: {
    title: "Performance Mark Average",
    content: "PMA is calculated by adding together all Promotion Recommendation blocks (Block 45) from evaluations in the current paygrade and dividing by the number of evaluation used in the computation."
  },
  rscaPma: {
    title: "RSCA Performance Mark Average",
    content: "RSCA PMA is calculated using Individual Trait Average (ITA) and Reporting Senior Cumulative Average (RSCA) to determine a more accurate performance measure. This is used for E6 and E7 advancement candidates as directed by NAVADMIN 312/18."
  },
  exam: {
    title: "Exam Standard Score",
    content: "A numeric representation of how well candidates do compared to candidate peers taking the same exam. Standard Score changes each exam since the average computations are based on the peer group at the time the particular exam is given."
  },
  awards: {
    title: "Award Points",
    content: "For E5: Max 10 points. For E6: Max 12 points. Range of points given for outstanding service as specified in NAVADMIN 312/18."
  },
  pna: {
    title: "Pass Not Advanced Points",
    content: "Points given from past Standard Scores and PMA with demonstration of superior performance and/or superior rating knowledge, but are not advanced to the next-higher paygrade. Per NAVADMIN 312/18, PNA points only accumulate for the 3 previous advancement cycles."
  },
  service: {
    title: "Service in Paygrade",
    content: "Service in Paygrade (SIPG) points are awarded to Sailors (competing for E5/6 only) to account for experience serving in the same rating and paygrade. SIPG is calculated using years and months. Your Terminal Eligibility Date (TED) is a date to which your SIPG is computed for advancement purposes. For Inactive Reserves, SIPG is Drill Service in Paygrade (DSPG). Maximum E5 SIPG points is 2. Maximum E6 SIPG points is 3.\n\nTED for each exam Cycle are:\nE5-E6 FEB/MAR Exams - 1 July of same year\nE5-E6 AUG/SEP Exams - 1 January of the next year"
  },
  education: {
    title: "Education Points",
    content: "Points for an accredited associate's degree, accredited baccalaureate degree, or above reflected in the Joint Services Transcript (JST)."
  },
  ita: {
    title: "Individual Trait Average (ITA)",
    content: "The Individual Trait Average (ITA) is the average of all trait scores on your evaluation (Block 43). This is found on your evaluation in the Performance Traits section. The ITA is used in calculating your RSCA PMA."
  },
  rsca: {
    title: "Reporting Senior Cumulative Average (RSCA)",
    content: "The Reporting Senior Cumulative Average (RSCA) is the average of all evaluations your reporting senior has given to personnel in your paygrade. This value can be found on your evaluation in Block 43 (as a required admin comment) or in NSIPS under the Performance section. The RSCA is used to normalize evaluation scores across different reporting seniors."
  }
}
