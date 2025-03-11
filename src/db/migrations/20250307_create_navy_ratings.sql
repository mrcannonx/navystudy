-- Create navy_ratings table for storing rating-specific information
CREATE TABLE IF NOT EXISTS navy_ratings (
  id SERIAL PRIMARY KEY,
  abbreviation VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  common_achievements TEXT[] DEFAULT '{}',
  parent_rating VARCHAR(10),
  service_rating VARCHAR(50),
  is_variation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on abbreviation for faster lookups
CREATE INDEX IF NOT EXISTS idx_navy_ratings_abbreviation ON navy_ratings(abbreviation);

-- Insert data for Aviation Boatswain's Mate (AB)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  service_rating, 
  is_variation
) VALUES (
  'AB',
  'Aviation Boatswain''s Mate',
  'Aviation boatswain''s mates operate, maintain, and perform organizational maintenance on catapults, arresting gear, barricades, and associated flightdeck launching and recovery equipment; operate and service aircraft ground-handling equipment and machinery; operate and service aircraft crash, firefighting, and rescue equipment; handle aircraft afloat and ashore; operate, maintain, and repair aviation fueling, defueling, lubricating oil, and inert gas systems; perform crash rescue, crash removal, and damage control duties.',
  ARRAY[
    'aircraft handling', 
    'flight deck operations', 
    'catapults', 
    'arresting gear', 
    'aviation fueling', 
    'crash rescue', 
    'firefighting', 
    'damage control', 
    'aircraft launch', 
    'aircraft recovery'
  ],
  ARRAY[
    'Supervised flight deck operations involving ## personnel',
    'Maintained ## pieces of aircraft handling equipment at ##% operational readiness',
    'Conducted ## aircraft launch and recovery operations',
    'Trained ## personnel in flight deck safety procedures',
    'Performed ## preventive maintenance actions on launch/recovery equipment',
    'Managed aviation fuel systems handling ## gallons of fuel',
    'Responded to ## aircraft emergency situations',
    'Coordinated ## crash rescue operations',
    'Maintained ## firefighting equipment pieces at operational readiness',
    'Achieved ## qualifications in aircraft handling operations'
  ],
  'Aviation',
  FALSE
);

-- Insert data for Aviation Boatswain's Mate - Equipment (ABE)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  parent_rating,
  service_rating, 
  is_variation
) VALUES (
  'ABE',
  'Aviation Boatswain''s Mate - Equipment',
  'Aviation boatswain''s mates, equipment (ABEs) operate and perform maintenance on steam catapults, barricades, arresting gear, and associated equipment ashore and afloat; operate catapult hydraulic systems, retraction engines, water brakes, jet blast deflectors, deckedge and integrated catapult control stations (ICCS), and jet blast deflector control panels; arresting gear engines, sheave dampers, deckedge control station, and associated equipment; perform aircraft handling duties related to the operation of aircraft launching and recovery equipment.',
  ARRAY[
    'catapults', 
    'arresting gear', 
    'barricades', 
    'hydraulic systems', 
    'retraction engines', 
    'water brakes', 
    'jet blast deflectors', 
    'ICCS', 
    'sheave dampers', 
    'launch equipment'
  ],
  ARRAY[
    'Operated catapult systems for ## aircraft launches',
    'Maintained arresting gear systems for ## aircraft recoveries',
    'Performed ## preventive maintenance actions on launch/recovery equipment',
    'Operated jet blast deflector systems for ## flight operations',
    'Conducted ## equipment operational tests and calibrations',
    'Trained ## personnel on catapult and arresting gear operations',
    'Achieved ##% operational availability of flight deck equipment',
    'Repaired ## critical equipment casualties',
    'Qualified on ## different launch and recovery systems',
    'Supervised ## personnel during flight deck operations'
  ],
  'AB',
  'Aviation',
  TRUE
);

-- Insert data for Aviation Boatswain's Mate - Fuels (ABF)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  parent_rating,
  service_rating, 
  is_variation
) VALUES (
  'ABF',
  'Aviation Boatswain''s Mate - Fuels',
  'Aviation boatswain''s mates, fuels (ABFs) operate, maintain and perform organizational maintenance on aviation fueling and lubricating oil systems on carriers and amphibious ships; observe and enforce handling safety precautions and maintain fuel quality surveillance and control in aviation fuel systems; supervise the operation and servicing of fuel farms and equipment associated with the fueling and de-fueling of aircraft ashore and afloat; train, direct and supervise fire fighting crews, fire rescue teams, and damage control parties in assigned fuel and lubricating oil spaces.',
  ARRAY[
    'aviation fueling', 
    'defueling', 
    'lubricating oil systems', 
    'fuel quality control', 
    'fuel farms', 
    'safety precautions', 
    'firefighting', 
    'damage control', 
    'fuel purification', 
    'inert gas systems'
  ],
  ARRAY[
    'Managed aviation fuel systems handling ## gallons of fuel',
    'Conducted ## aircraft fueling/defueling operations',
    'Maintained fuel quality standards with ##% compliance rate',
    'Supervised ## personnel in fuel handling operations',
    'Performed ## preventive maintenance actions on fueling systems',
    'Trained ## personnel in fuel safety procedures',
    'Responded to ## fuel-related emergency situations',
    'Managed inventory of ## fuel products valued at $##',
    'Achieved ##% operational availability of fueling equipment',
    'Implemented ## safety improvements in fuel handling procedures'
  ],
  'AB',
  'Aviation',
  TRUE
);

-- Insert data for Aviation Boatswain's Mate - Handling (ABH)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  parent_rating,
  service_rating, 
  is_variation
) VALUES (
  'ABH',
  'Aviation Boatswain''s Mate - Handling',
  'Aviation boatswain''s mates, handling (ABHs) supervise the movement, spotting and securing of aircraft and equipment ashore and afloat; perform crash rescue, fire fighting, crash removal and damage control duties in connection with launching and recovery of aircraft. ABHs also operate mobile crash cranes and firefighting vehicles, work in flight deck control, operate elevators, and dispatch/operate aircraft tractors.',
  ARRAY[
    'aircraft handling', 
    'flight deck operations', 
    'aircraft movement', 
    'crash rescue', 
    'firefighting', 
    'crash removal', 
    'damage control', 
    'elevator operations', 
    'tractor operations', 
    'flight deck control'
  ],
  ARRAY[
    'Directed movement of ## aircraft on flight/hangar deck',
    'Supervised ## aircraft spotting and securing operations',
    'Conducted ## crash rescue and firefighting drills',
    'Operated mobile crash cranes for ## aircraft movements',
    'Trained ## personnel in aircraft handling procedures',
    'Achieved ##% safety compliance in aircraft handling operations',
    'Operated flight deck elevators for ## aircraft transfers',
    'Coordinated ## flight deck evolutions as part of flight deck control',
    'Supervised ## personnel during aircraft handling operations',
    'Responded to ## aircraft emergency situations'
  ],
  'AB',
  'Aviation',
  TRUE
);

-- Insert sample data for Construction Mechanic (CM)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  service_rating, 
  is_variation
) VALUES (
  'CM',
  'Construction Mechanic',
  'Construction Mechanics (CMs) are responsible for the maintenance, repair, and operation of automotive and construction equipment. They work on a variety of vehicles and heavy equipment including trucks, bulldozers, power shovels, rollers, cranes, and other construction equipment.',
  ARRAY[
    'diesel engines', 
    'hydraulic systems', 
    'heavy equipment', 
    'preventive maintenance', 
    'troubleshooting', 
    'repair', 
    'construction equipment', 
    'automotive', 
    'mechanical systems', 
    'technical manuals'
  ],
  ARRAY[
    'Maintained and repaired diesel engines and power generation equipment',
    'Performed preventive maintenance on construction and automotive equipment',
    'Diagnosed and repaired hydraulic systems on heavy equipment',
    'Maintained technical documentation and service records',
    'Operated heavy construction equipment in support of projects',
    'Conducted equipment inspections and quality assurance checks',
    'Trained junior personnel on equipment maintenance procedures',
    'Managed parts inventory and supply requisitions',
    'Implemented safety protocols for equipment operation and maintenance',
    'Achieved ASE certifications in relevant specialties'
  ],
  'Seabee',
  FALSE
);

-- Insert sample data for Information Systems Technician (IT)
INSERT INTO navy_ratings (
  abbreviation, 
  name, 
  description, 
  keywords, 
  common_achievements, 
  service_rating, 
  is_variation
) VALUES (
  'IT',
  'Information Systems Technician',
  'Information Systems Technicians (ITs) are responsible for the Navy''s computer and network systems. They maintain, repair, and operate telecommunications systems, local and wide area networks, and associated peripheral equipment.',
  ARRAY[
    'network administration', 
    'cybersecurity', 
    'information assurance', 
    'computer systems', 
    'telecommunications', 
    'troubleshooting', 
    'system administration', 
    'information security', 
    'software', 
    'hardware'
  ],
  ARRAY[
    'Administered network systems serving hundreds of users',
    'Implemented cybersecurity measures to protect classified information',
    'Maintained telecommunications systems with high uptime percentage',
    'Troubleshot and resolved complex technical issues',
    'Managed user accounts and access controls',
    'Conducted information assurance training for command personnel',
    'Deployed and configured new hardware and software systems',
    'Performed system backups and disaster recovery operations',
    'Monitored network traffic for security threats',
    'Achieved relevant IT certifications (Security+, Network+, etc.)'
  ],
  'Information Warfare',
  FALSE
);

-- Insert sample data for Boatswain's Mate (BM)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'BM',
  'Boatswain''s Mate',
  'Boatswain''s Mates (BMs) are the Navy''s seamanship specialists. They serve as the subject matter experts for all deck evolutions and maintain the exterior surfaces of ships. BMs operate small boats, serve as helmsman and lookout, handle cargo, operate and maintain rigging and deck equipment.',
  ARRAY[
    'seamanship',
    'deck operations',
    'small boat handling',
    'line handling',
    'anchoring',
    'mooring',
    'replenishment at sea',
    'search and rescue',
    'deck maintenance',
    'damage control'
  ],
  ARRAY[
    'Supervised deck operations involving ## personnel',
    'Conducted ## small boat operations in various sea states',
    'Trained ## personnel in seamanship and deck operations',
    'Maintained ## pieces of deck equipment at ##% operational readiness',
    'Conducted ## underway replenishment evolutions',
    'Served as safety observer for ## high-risk evolutions',
    'Qualified as ## watch stations on small boats',
    'Coordinated ## anchoring and mooring evolutions',
    'Managed ## damage control training sessions',
    'Maintained ## square feet of deck and superstructure'
  ],
  'Surface',
  FALSE
);

-- Insert sample data for Hospital Corpsman (HM)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'HM',
  'Hospital Corpsman',
  'Hospital Corpsmen (HMs) serve as medical professionals on submarines, aircraft carriers, amphibious assault ships, and with Marine Corps units. They help maintain the health of sailors and their families by providing emergency medical treatment, limited dental care, and preventive medicine.',
  ARRAY[
    'medical care',
    'first aid',
    'patient care',
    'preventive medicine',
    'medical records',
    'pharmacy',
    'laboratory procedures',
    'field medicine',
    'triage',
    'combat casualty care'
  ],
  ARRAY[
    'Provided medical care to ## patients',
    'Maintained medical readiness for ## personnel',
    'Conducted ## immunizations with zero adverse reactions',
    'Managed inventory of ## medical supplies worth $##',
    'Performed ## medical procedures with ##% success rate',
    'Trained ## personnel in first aid and CPR',
    'Processed ## medical records with ##% accuracy',
    'Responded to ## medical emergencies',
    'Conducted ## preventive medicine inspections',
    'Maintained ## medical qualifications and certifications'
  ],
  'Medical',
  FALSE
);

-- Insert sample data for Electronics Technician (ET)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'ET',
  'Electronics Technician',
  'Electronics Technicians (ETs) are responsible for electronic equipment used to send and receive messages, detect enemy planes and ships, and determine target distances. They maintain, repair, calibrate, tune, and adjust electronic equipment used for communications, detection and tracking, recognition and identification, navigation, and electronic countermeasures.',
  ARRAY[
    'electronic systems',
    'communications equipment',
    'radar',
    'navigation systems',
    'troubleshooting',
    'calibration',
    'maintenance',
    'repair',
    'technical documentation',
    'electronic warfare'
  ],
  ARRAY[
    'Maintained ## electronic systems with ##% operational availability',
    'Repaired ## critical equipment casualties',
    'Conducted ## preventive maintenance checks',
    'Calibrated ## electronic systems to within ##% of specifications',
    'Trained ## personnel on electronic systems operation',
    'Managed technical library for ## equipment types',
    'Troubleshot and resolved ## complex electronic failures',
    'Performed ## system upgrades and modifications',
    'Maintained ## communication circuits during critical operations',
    'Achieved ## technical qualifications ahead of schedule'
  ],
  'Combat Systems',
  FALSE
);

-- Insert sample data for Machinist's Mate (MM)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'MM',
  'Machinist''s Mate',
  'Machinist''s Mates (MMs) operate and maintain steam turbines and reduction gears used for ship propulsion and auxiliary machinery such as turbo-generators, pumps, and oil purifiers. They maintain auxiliary machinery outside of main machinery spaces, refrigeration, and air conditioning equipment.',
  ARRAY[
    'propulsion systems',
    'steam turbines',
    'diesel engines',
    'pumps',
    'valves',
    'heat exchangers',
    'refrigeration',
    'air conditioning',
    'mechanical systems',
    'preventive maintenance'
  ],
  ARRAY[
    'Operated main propulsion plant for ## steaming hours',
    'Conducted ## preventive maintenance actions on engineering equipment',
    'Repaired ## critical engineering casualties',
    'Maintained ## auxiliary systems at ##% operational readiness',
    'Qualified on ## engineering watch stations',
    'Performed ## equipment alignments within ##% of specifications',
    'Managed ## maintenance procedures for engineering department',
    'Conducted ## operational tests on repaired equipment',
    'Trained ## personnel on engineering systems',
    'Achieved ##% reduction in equipment downtime'
  ],
  'Engineering',
  FALSE
);

-- Insert sample data for Yeoman (YN)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'YN',
  'Yeoman',
  'Yeomen (YNs) perform administrative and clerical work. They deal with visitors, telephone calls and incoming mail. They organize files and operate office equipment, write and type business and social letters, notices, directives, forms and reports.',
  ARRAY[
    'administration',
    'correspondence',
    'records management',
    'office procedures',
    'personnel management',
    'reports',
    'directives',
    'instructions',
    'customer service',
    'documentation'
  ],
  ARRAY[
    'Processed ## personnel actions with ##% accuracy',
    'Managed correspondence for ## command personnel',
    'Maintained ## personnel records in compliance with regulations',
    'Prepared ## official documents and reports',
    'Coordinated ## command functions and ceremonies',
    'Processed ## evaluation reports ahead of deadline',
    'Managed ## award recommendations with ##% approval rate',
    'Trained ## personnel on administrative procedures',
    'Maintained ## instruction and directive libraries',
    'Achieved ##% reduction in processing time for administrative actions'
  ],
  'Administration',
  FALSE
);

-- Insert sample data for Gunner's Mate (GM)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'GM',
  'Gunner''s Mate',
  'Gunner''s Mates (GMs) operate, maintain and repair all gunnery equipment, guided missile launching systems, underwater explosive weapons, and small arms. They are responsible for the stowage and issue of ammunition, and the maintenance of magazines and ammunition handling rooms.',
  ARRAY[
    'weapons systems',
    'small arms',
    'ammunition',
    'ordnance',
    'guided missiles',
    'gun mounts',
    'weapons maintenance',
    'weapons qualification',
    'explosives handling',
    'range operations'
  ],
  ARRAY[
    'Maintained ## weapons systems at ##% operational readiness',
    'Conducted ## small arms qualifications for ## personnel',
    'Managed inventory of ## ordnance items valued at $##',
    'Performed ## weapons system alignments and calibrations',
    'Conducted ## ammunition handling evolutions with zero safety incidents',
    'Trained ## personnel on weapons handling and safety',
    'Performed ## preventive maintenance actions on weapons systems',
    'Qualified ## personnel on small arms',
    'Conducted ## live fire exercises',
    'Achieved ## weapons certifications and qualifications'
  ],
  'Ordnance',
  FALSE
);

-- Insert sample data for Culinary Specialist (CS)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'CS',
  'Culinary Specialist',
  'Culinary Specialists (CSs) prepare menus and order food items. They operate and manage dining facilities and living quarters established to subsist and accommodate Navy personnel. They prepare all types of food items and operate and maintain food service equipment.',
  ARRAY[
    'food preparation',
    'menu planning',
    'nutrition',
    'inventory management',
    'sanitation',
    'food service',
    'budgeting',
    'galley operations',
    'baking',
    'special events'
  ],
  ARRAY[
    'Prepared ## meals daily for ## personnel',
    'Managed food inventory valued at $##',
    'Achieved ##% satisfaction rating on food service surveys',
    'Maintained ##% sanitation rating during health inspections',
    'Trained ## personnel in food preparation and safety',
    'Reduced food waste by ##%',
    'Planned and executed ## special events and ceremonies',
    'Managed ## food service operations within budget',
    'Implemented ## new menu items increasing variety',
    'Maintained ## pieces of galley equipment at operational readiness'
  ],
  'Supply',
  FALSE
);

-- Insert data for Aviation Structural Mechanic (AM)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'AM',
  'Aviation Structural Mechanic',
  'Aviation Structural Mechanics (AMs) maintain aircraft airframe and structural components including flight surfaces and controls, hydraulic and pneumatic control and actuating systems and mechanisms, landing gear systems, air conditioning, pressurization, and other utility systems. They fabricate and repair metallic and nonmetallic materials; perform aircraft inspections; maintain aircraft structures including fuselages, fixed and moveable flight surfaces, doors, panels, and seats; flight controls and related mechanisms; hydraulic power storage and distribution systems; landing gear systems including wheels and tires, brakes, and emergency systems; pneumatic power, storage and distribution systems; hoists and winches, wing and tail fold systems.',
  ARRAY[
    'aircraft structures',
    'hydraulic systems',
    'landing gear',
    'flight controls',
    'structural repair',
    'sheet metal work',
    'pneumatic systems',
    'tire and wheel',
    'airframe maintenance',
    'corrosion control'
  ],
  ARRAY[
    'Led ## personnel in completing ## maintenance actions and ## phase inspections',
    'Performed ## aircraft inspections with ##% discrepancy identification rate',
    'Repaired ## hydraulic system components and conducted ## operational checks',
    'Maintained ## aircraft at ##% mission capable rate',
    'Performed ## sheet metal repairs on aircraft structures',
    'Qualified ## personnel as Collateral Duty Inspectors and Quality Assurance Representatives',
    'Completed ## technical directive compliance actions',
    'Managed tire and wheel program with ##% ready-for-issue rate',
    'Conducted ## corrosion prevention and treatment actions',
    'Achieved ##% reduction in maintenance turnaround time'
  ],
  'Aviation',
  FALSE
);

-- Insert data for Aviation Structural Mechanic - Safety Equipment (AME)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  parent_rating,
  service_rating,
  is_variation
) VALUES (
  'AME',
  'Aviation Structural Mechanic - Safety Equipment',
  'Aviation Structural Mechanics, Safety Equipment (AMEs) maintain safety belts, shoulder harnesses and integrated flight harnesses in aircraft, inertia reels, seat and canopy ejection systems, gaseous and liquid oxygen systems, life raft ejection systems, fire extinguishing systems, air-conditioning, heating cabin and cockpit pressurization, ventilating and anti-G-systems, visual improvement systems, and other utility systems. They replenish liquid and gaseous oxygen systems; inspect, remove, install and rig ejection seats; operate and maintain liquid nitrogen and liquid and gaseous oxygen shop transfer and recharge equipment; and perform aircraft inspections.',
  ARRAY[
    'ejection seats',
    'oxygen systems',
    'safety equipment',
    'fire extinguishing systems',
    'pressurization systems',
    'air conditioning',
    'life support equipment',
    'anti-G systems',
    'visual improvement systems',
    'emergency egress'
  ],
  ARRAY[
    'Completed ## maintenance actions on egress and environmental systems totaling ## man-hours',
    'Performed ## oxygen system replenishments and inspections',
    'Conducted ## special inspections on ejection seats and safety equipment',
    'Qualified ## personnel on egress system checkout procedures',
    'Supervised ## phase inspections and ## unscheduled maintenance actions',
    'Managed egress explosive checkout program for ## personnel',
    'Performed ## aircraft environmental control system repairs',
    'Maintained ## ejection seat systems at ##% operational readiness',
    'Trained ## personnel on safety equipment maintenance procedures',
    'Achieved ##% compliance with safety equipment technical directives'
  ],
  'AM',
  'Aviation',
  TRUE
);

-- Insert data for Air Traffic Controller (AC)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'AC',
  'Air Traffic Controller',
  'Navy Air Traffic Controllers (ACs) perform duties similar to civilian air traffic controllers and play a key role in the effective use of naval airpower throughout the world in operational and training environments. They are responsible for safely and effectively directing aircraft operating from airfields or the decks of aircraft carriers. They control the movement of aircraft and vehicles on airfield taxiways, issue flight instructions to pilots by radio, provide air traffic control services in control towers, radar facilities, and fleet area control facilities. They operate radio communication systems, surveillance radar, precision radar, and data link approach systems.',
  ARRAY[
    'air traffic control',
    'radar operations',
    'flight control',
    'aircraft direction',
    'tower operations',
    'approach control',
    'departure control',
    'ground control',
    'flight planning',
    'emergency procedures'
  ],
  ARRAY[
    'Controlled ## aircraft movements with zero safety incidents',
    'Directed ## aircraft during high-tempo flight operations',
    'Managed ## simultaneous aircraft in controlled airspace',
    'Operated radar approach control for ## aircraft recoveries',
    'Trained ## personnel in air traffic control procedures',
    'Maintained ##% compliance with FAA and Navy regulations',
    'Coordinated ## emergency aircraft situations to safe resolution',
    'Processed ## flight plans and clearances',
    'Achieved ## air traffic control qualifications and certifications',
    'Supervised ## personnel in air traffic control operations'
  ],
  'Aviation',
  FALSE
);

-- Insert data for Aviation Machinist's Mate (AD)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'AD',
  'Aviation Machinist''s Mate',
  'Aviation Machinist''s Mates (ADs) are aircraft engine mechanics that inspect, adjust, test, repair, and overhaul aircraft engines and propellers. They install, maintain, and service various aircraft engine types as well as accessories, gear boxes, related fuel systems, and lubrication systems. ADs determine reasons for engine degradation using various test equipment, perform propeller repairs, handle and service aircraft ashore or aboard ship, and can also serve as aircrewman in various types of aircraft.',
  ARRAY[
    'aircraft engines',
    'propellers',
    'power plant maintenance',
    'engine components',
    'auxiliary power',
    'fuel systems',
    'lubrication systems',
    'helicopter maintenance',
    'corrosion control',
    'troubleshooting'
  ],
  ARRAY[
    'Performed ## aircraft engine inspections with ##% discrepancy identification rate',
    'Conducted ## engine component repairs and replacements',
    'Maintained ## aircraft at ##% mission capable rate',
    'Troubleshot and resolved ## complex engine malfunctions',
    'Performed ## auxiliary power unit maintenance actions',
    'Trained ## personnel on engine maintenance procedures',
    'Completed ## technical directive compliance actions',
    'Achieved ##% reduction in maintenance turnaround time',
    'Conducted ## engine test cell operations',
    'Implemented ## safety improvements in maintenance procedures'
  ],
  'Aviation',
  FALSE
);

-- Insert data for Aviation Electrician's Mate (AE)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'AE',
  'Aviation Electrician''s Mate',
  'Aviation Electrician''s Mates (AEs) maintain electrical and instrument systems, including power generation, conversion, and distribution systems; aircraft batteries; interior and exterior lighting; electrical control of aircraft systems, including hydraulic, landing gear, flight control, utility, and power plant engine, flight and non-instrument-type indicating and warning systems; automatic flight control and stabilization systems; aircraft compass systems; attitude reference systems; and inertial navigation systems.',
  ARRAY[
    'electrical systems',
    'power generation',
    'aircraft batteries',
    'lighting systems',
    'flight control systems',
    'navigation systems',
    'instrument systems',
    'compass calibration',
    'avionics',
    'troubleshooting'
  ],
  ARRAY[
    'Completed ## maintenance actions on aircraft electrical systems',
    'Repaired ## mission-critical navigation/communication discrepancies',
    'Performed ## compass calibrations ensuring navigational accuracy',
    'Maintained ## aircraft at ##% mission capable rate',
    'Trained ## personnel on electrical system maintenance procedures',
    'Qualified ## personnel as Collateral Duty Quality Assurance Representatives',
    'Supervised ## personnel in completing ## flight hours with zero electrical malfunctions',
    'Troubleshot and resolved ## complex electrical system failures',
    'Managed $## worth of electrical components and test equipment',
    'Achieved ##% reduction in electrical system-related downing discrepancies'
  ],
  'Aviation',
  FALSE
);

-- Insert data for Aerographer's Mate (AG)
INSERT INTO navy_ratings (
  abbreviation,
  name,
  description,
  keywords,
  common_achievements,
  service_rating,
  is_variation
) VALUES (
  'AG',
  'Aerographer''s Mate',
  'Aerographer''s Mates (AGs) observe, collect, record and analyze meteorological and oceanographic data; make visual and instrument observations of weather and sea conditions; operate meteorological satellite receivers and interpret satellite data; interpret and brief radar imagery; prepare warnings of severe and hazardous weather and sea conditions; forecast meteorological and oceanographic conditions; and prepare briefings concerning current and predicted environmental conditions and their effect on operations.',
  ARRAY[
    'meteorology',
    'oceanography',
    'weather forecasting',
    'environmental analysis',
    'satellite imagery',
    'radar interpretation',
    'sea conditions',
    'severe weather warnings',
    'data collection',
    'atmospheric science'
  ],
  ARRAY[
    'Produced ## meteorological and oceanographic analyses and forecasts',
    'Provided ## weather briefings to operational commanders',
    'Issued ## severe weather warnings protecting $## in assets',
    'Collected and analyzed ## environmental observations',
    'Created ## electromagnetic maneuver warfare support products',
    'Supported ## flight operations with accurate weather forecasts',
    'Maintained ##% accuracy in terminal aerodrome forecasts',
    'Trained ## personnel in meteorological and oceanographic procedures',
    'Supervised ## personnel in weather operations center',
    'Achieved ## qualifications in specialized forecasting areas'
  ],
  'Aviation',
  FALSE
);

-- Add more ratings as needed for comprehensive coverage