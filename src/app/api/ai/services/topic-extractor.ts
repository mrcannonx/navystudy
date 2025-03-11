/**
 * Topic extraction service for content processing
 * Extracts relevant Navy-specific topics from text content
 */

/**
 * Navy-specific keyword sets for topic extraction
 */
const topicKeywords: Record<string, RegExp> = {
  // Naval Warfare Areas
  "Engineering": /engineer|technical|mechanical|electrical|hydraulic|pneumatic|propulsion|turbine|generator|motor|machinery|auxiliary|power|plant|mm|em|gs|en/i,
  "Navigation": /navigation|chart|course|bearing|positioning|gps|radar|compass|heading|route|piloting|quartermaster|qm|bridge/i,
  "Communications": /communication|radio|signal|transmission|frequency|antenna|message|broadcast|receiver|cryptologic|it|is|ct|crypto/i,
  "Weapons": /weapon|armament|ordnance|missile|gun|torpedo|ammunition|explosive|projectile|firing|gunnery|fc|ft|gm|mine|mt/i,
  "Medical": /medical|health|treatment|patient|diagnosis|injury|symptom|medication|disease|first aid|corpsman|hm/i,
  "Maintenance": /maintenance|repair|service|fix|inspect|upkeep|preventive|corrective|scheduled|tech|troubleshoot/i,
  "Supply": /supply|inventory|requisition|part|stock|order|procurement|material|logistics|ls|storekeeper|sk|sh/i,
  "Personnel": /personnel|sailor|officer|crew|staff|manning|rating|rank|qualification|assignment|ps|yn|nc/i,
  "Safety": /safety|hazard|risk|caution|warning|danger|protection|precaution|emergency|dc|damage control/i,
  "Administration": /admin|paperwork|document|record|report|form|procedure|instruction|directive|yeoman|legalman|ln/i,
  "Training": /training|education|instruction|learning|qualification|certification|course|study|school/i,
  
  // Aviation Specialties
  "Aviation Operations": /aviation|flight|aircraft|pilot|aircrew|flight deck|aw|squadron|plane|jet|helicopter|ab|ac/i,
  "Aviation Maintenance": /aviation maintenance|ad|ae|am|as|at|airframe|avionics|powerplant|aircraft engine|pr/i,
  "Air Traffic Control": /air traffic|ac|tower|flight control|departure|approach|clearance/i,
  
  // Deck and Hull
  "Seamanship": /seamanship|boatswain|bm|deck|line|mooring|anchor|boat|helm|ship handling/i,
  "Hull Maintenance": /hull|welding|plumbing|metal|pipefitting|ht|sheet metal|fitting|valve/i,
  
  // Special Operations
  "Special Warfare": /seal|special warfare|so|sb|special operations|combat craft|swcc|diving|nd/i,
  
  // Technical Specialties
  "Electronics": /electronics|circuit|component|board|troubleshoot|repair|et|fc|at|ic|diagnostic/i,
  "Information Technology": /information technology|computer|network|server|database|software|hardware|it|cybersecurity/i,
  "Sonar": /sonar|underwater|acoustic|sound|submarine|detection|tracking|st|stg|sts/i,
  
  // Nuclear Operations
  "Nuclear": /nuclear|reactor|radiation|coolant|primary|shielding|etn|mmn|elt|power plant/i,
  
  // Construction
  "Construction": /construction|seabee|bu|ce|cm|ea|eo|sw|ut|build|earthmoving|facility/i,
  
  // Support Services
  "Culinary": /culinary|food|cooking|galley|mess|cs|nutrition|meal|kitchen/i,
  "Religious": /religious|chaplain|rp|faith|worship|spiritual|devotional/i,
  "Intelligence": /intelligence|intel|is|security|classified|surveillance|reconnaissance/i,
  "Music": /music|band|instrument|mu|concert|performance|ceremonial/i
};

/**
 * Navy rating to specialty mapping
 */
const rateMap: Record<string, string> = {
  // Aviation Ratings
  "AB": "Aviation Boatswain's Mate",
  "ABE": "Aviation Boatswain's Mate (Launching & Recovery)",
  "ABF": "Aviation Boatswain's Mate (Fuels)",
  "ABH": "Aviation Boatswain's Mate (Aircraft Handling)",
  "AC": "Air-Traffic Controller",
  "AD": "Aviation Machinist's Mate",
  "AE": "Aviation Electrician's Mate",
  "AG": "Aerographer's Mate",
  "AM": "Aviation Structural Mechanic",
  "AME": "Aviation Structural Mechanic (Safety Equipment)",
  "AO": "Aviation Ordnanceman",
  "AS": "Aviation Support Equipment Technician",
  "AT": "Aviation Electronics Technician",
  "AW": "Naval Aircrewman",
  "AWO": "Naval Aircrewman (Operational Level)",
  "AWF": "Naval Aircrewman (Mechanical)",
  "AWV": "Naval Aircrewman (Avionics)",
  "AWS": "Naval Aircrewman (Sierra)",
  "AWR": "Naval Aircrewman (Romeo)",
  "AZ": "Aviation Maintenance Administrationman",
  "PR": "Aircrew Survival Equipmentman",
  
  // Construction Ratings
  "BU": "Builder",
  "CE": "Construction Electrician",
  "CM": "Construction Mechanic",
  "EA": "Engineering Aide",
  "EO": "Equipment Operator",
  "SW": "Steelworker",
  "UT": "Utilitiesman",
  
  // Medical Rating
  "HM": "Hospital Corpsman",
  
  // Administration, Deck, Technical, and Weapons Ratings
  "BM": "Boatswain's Mate",
  "CS": "Culinary Specialist",
  "CT": "Cryptologic Technician",
  "CTI": "Cryptologic Technician (Interpretive)",
  "CTM": "Cryptologic Technician (Maintenance)",
  "CTN": "Cryptologic Technician (Networks)",
  "CTR": "Cryptologic Technician (Collection)",
  "CTT": "Cryptologic Technician (Technical)",
  "EOD": "Explosive Ordnance Disposal",
  "ET": "Electronics Technician",
  "ETN": "Electronics Technician (Nuclear)",
  "ETR": "Electronics Technician (Communications)",
  "ETV": "Electronics Technician (Navigation)",
  "FC": "Fire Controlman",
  "FT": "Fire Control Technician",
  "GM": "Gunner's Mate",
  "IS": "Intelligence Specialist",
  "IT": "Information Systems Technician",
  "ITS": "Information Systems Technician Submarines",
  "LN": "Legalman",
  "LS": "Logistics Specialist",
  "MA": "Master-at-Arms",
  "MC": "Mass Communication Specialist",
  "MN": "Mineman",
  "MT": "Missile Technician",
  "MU": "Musician",
  "NC": "Navy Counselor",
  "OS": "Operations Specialist",
  "PS": "Personnel Specialist",
  "QM": "Quartermaster",
  "RP": "Religious Programs Specialist",
  "SB": "Special Warfare Boat Operator",
  "SH": "Ship's Serviceman",
  "SO": "Special Warfare Operator",
  "ST": "Sonar Technician",
  "STG": "Sonar Technician (Surface)",
  "STS": "Sonar Technician (Subsurface)",
  "YN": "Yeoman",
  
  // Engineering and Hull Ratings
  "DC": "Damage Controlman",
  "EM": "Electrician's Mate",
  "EMN": "Electrician's Mate (Nuclear)",
  "EN": "Engineman",
  "GS": "Gas Turbine System Technician",
  "GSE": "Gas Turbine System Technician (Electrical)",
  "GSM": "Gas Turbine System Technician (Mechanical)",
  "HT": "Hull Maintenance Technician",
  "IC": "Interior Communications Electrician",
  "MM": "Machinist's Mate",
  "MMN": "Machinist's Mate (Nuclear)",
  "MMW": "Machinist's Mate (Weapons)",
  "MMA": "Machinist's Mate (Auxiliary)",
  "MR": "Machinery Repairman",
  "ND": "Navy Diver"
};

/**
 * TopicExtractor class for extracting relevant topics from content
 */
export class TopicExtractor {
  /**
   * Extract the most relevant topic from text content based on keyword frequency
   * @param content The text content to analyze
   * @returns The most relevant topic extracted from the content
   */
  public extractTopic(content: string): string {
    // Check for keywords and count matches
    const topicScores: Record<string, number> = {};
    
    for (const [topic, regex] of Object.entries(topicKeywords)) {
      // Count matches instead of just checking presence
      const matches = (content.match(regex) || []).length;
      if (matches > 0) {
        topicScores[topic] = matches;
      }
    }
    
    // Return topic with most keyword matches or default
    if (Object.keys(topicScores).length === 0) return "General";
    
    return Object.entries(topicScores)
      .sort((a, b) => b[1] - a[1])[0][0]; // Sort by count and take highest
  }
  
  /**
   * Extract context-based topic from title and first paragraph
   * @param title The title of the content
   * @param firstParagraph The first paragraph of the content
   * @returns Extracted topic based on context
   */
  public extractTopicFromContext(title: string, firstParagraph: string): string {
    // Combine title and first paragraph for better context
    const contextText = `${title} ${firstParagraph}`;
    
    // Try to extract rate/specialty from context
    const rateMatch = contextText.match(/\b(AB|ABE|ABF|ABH|AC|AD|AE|AG|AM|AME|AO|AS|AT|AW|AWO|AWF|AWV|AWS|AWR|AZ|PR|BU|CE|CM|EA|EO|SW|UT|HM|BM|CS|CT|CTI|CTM|CTN|CTR|CTT|EOD|ET|ETN|ETR|ETV|FC|FT|GM|IS|IT|ITS|LN|LS|MA|MC|MN|MT|MU|NC|OS|PS|QM|RP|SB|SH|SO|ST|STG|STS|YN|DC|EM|EMN|EN|GS|GSE|GSM|HT|IC|MM|MMN|MMW|MMA|MR|ND)\b/i);
    
    if (rateMatch) {
      return rateMap[rateMatch[0].toUpperCase()] || "Navy Specialty";
    }
    
    // Fall back to keyword matching
    return this.extractTopic(contextText);
  }
  
  /**
   * Extract topic from an item (quiz question or flashcard)
   * @param item The quiz question or flashcard object
   * @returns The extracted topic
   */
  public extractItemTopic(item: any): string {
    // Check for explicit topic field
    if (item.topic) return item.topic;
    if (item.tags && item.tags.length > 0) return item.tags[0];
    
    // Extract from content
    const content = item.question || item.front || "";
    
    // For longer content, try context-based extraction
    if (content.length > 50) {
      // Split into lines to potentially extract title/first paragraph
      const lines = content.split('\n').filter((line: string) => line.trim().length > 0);
      if (lines.length >= 2) {
        return this.extractTopicFromContext(lines[0], lines[1]);
      }
    }
    
    // Fall back to improved keyword matching
    return this.extractTopic(content);
  }
}

// Create and export default instance
export const topicExtractor = new TopicExtractor();