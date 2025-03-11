import { chunkNavadminContent, preprocessNavadminContent, extractNavadminContext } from './content-chunker';

/**
 * Test the NAVADMIN chunking system with a sample NAVADMIN
 */
export function testNavadminChunking() {
  // Sample NAVADMIN content (abbreviated for testing)
  const sampleNavadmin = `RTTUZYUW RUEWMCS0000 3641921-UUUU--RUEWMCS.
ZNR UUUUU
R 301921Z DEC 22 MID200080142300U
FM CNO WASHINGTON DC
TO NAVADMIN
INFO CNO WASHINGTON DC
BT
UNCLAS

NAVADMIN 264/22

MSGID/GENADMIN/CNO WASHINGTON DC/CNP/DEC//

SUBJ/CALENDAR YEAR 2023 NAVY RESERVE E7 THROUGH E9 SELECTION BOARD 
SCHEDULE//

REF/A/DOC/SECNAV/14DEC18//
REF/B/DOC/CHNAVPERS/01JAN03//
REF/C/DOC/CHNAVPERS/01JAN03//
NARR/REF A IS SECNAV INSTRUCTION 1420.3 DELAYED ENTRY PROGRAM.  
REF B IS BUPERSINST 1430.16G, ADVANCEMENT MANUAL FOR ENLISTED PERSONNEL 
OF THE U.S. NAVY AND U.S. NAVY RESERVE.  
REF C IS BUPERSINST 1001.39F, ADMINISTRATIVE PROCEDURES FOR NAVY 
RESERVISTS.//

RMKS/1.  This NAVADMIN announces the Calendar Year (CY) 2023 Navy Reserve 
E7 through E9 selection board schedule.  The schedule is:
    a.  Full Time Support (FTS) E9 Selection Board:  17-28 April 2023
    b.  FTS E8 Selection Board:  17-28 April 2023
    c.  FTS E7 Selection Board:  17-28 April 2023
    d.  Selected Reserve (SELRES) E9 Selection Board:  12-23 June 2023
    e.  SELRES E8 Selection Board:  12-23 June 2023
    f.  SELRES E7 Selection Board:  12-23 June 2023

2.  Eligibility requirements for these boards are contained in references 
(a) through (c).  Eligibility requirements for the FTS and SELRES boards 
will be announced via separate NAVADMINs.

3.  The selection boards will be conducted at Navy Personnel Command in 
Millington, TN.  The selection board president will be a Navy Reserve flag 
officer.  The selection board membership will be composed of Navy Reserve 
officers and senior enlisted personnel on active duty.

4.  Correspondence to the president of the selection board must be in 
writing and must arrive no later than the day before the convening date of 
the board.  Correspondence must be signed by the eligible candidate and 
shall not include documentation already contained in the candidates 
official military personnel file.  Correspondence shall be mailed to:  
President, FY-24 Navy Reserve (FTS or SELRES) (E7, E8, or E9) Selection 
Board, Board #xxx, Customer Service Center, Navy Personnel Command (NPC), 
5720 Integrity Drive, Millington, TN 38055.  Correspondence may also be 
emailed to cscselboard(at)navy.mil.  Emails must be sent from a .mil, 
.gov, or .edu email address.  Correspondence may also be faxed to (901) 
874-2664 DSN 882.  Correspondence must be received by the Customer Service 
Center no later than 2359 central standard time the day prior to the board 
convening date.  Correspondence received after that time may not be 
presented to the board.  Candidates are encouraged to submit 
correspondence as early as possible.  Do not send correspondence via 
multiple submission methods as this may cause confusion and unnecessary 
processing.  Correspondence sent to any other address may not be presented 
to the board.  Correspondence shall not include documentation already 
contained in the candidates official military personnel file.  
Correspondence may include missing or erroneous information, but shall not 
include information that should be documented in the candidates official 
military personnel file.  Correspondence may not include third party 
correspondence or endorsements.  Correspondence that contains classified 
information will not be accepted.

5.  Individual selection board eligibility status can be viewed in the 
Career Waypoints (C-WAY) Self Service module in Navy Standard Integrated 
Personnel System (NSIPS).  Candidates can also verify their eligibility 
status by contacting the MyNavy Career Center (MNCC) at (833) 330-MNCC or 
via email at askmncc(at)navy.mil.

6.  Points of contact:
    a.  For FTS selection board matters:  Mr. Daryl Harris, BUPERS-35, at 
(901) 874-3215/DSN 882 or via email at daryl.harris1(at)navy.mil.
    b.  For SELRES selection board matters:  Mr. Daryl Harris, BUPERS-35, 
at (901) 874-3215/DSN 882 or via email at daryl.harris1(at)navy.mil.

7.  This NAVADMIN will remain in effect until superseded or canceled, 
whichever occurs first.

8.  Released by Vice Admiral Richard J. Cheeseman, Jr., N1.//

BT
#0001
NNNN
UNCLASSIFIED//`;

  // Preprocess the content
  const processedContent = preprocessNavadminContent(sampleNavadmin);
  console.log(`Preprocessed content length: ${processedContent.length} characters`);

  // Test with different chunk sizes
  const chunkSizes = [500, 1000, 2000];
  
  chunkSizes.forEach(chunkSize => {
    console.log(`\nTesting with chunk size: ${chunkSize}`);
    
    // Chunk the content
    const chunks = chunkNavadminContent(processedContent, chunkSize);
    console.log(`Created ${chunks.length} chunks`);
    
    // Log chunk details
    chunks.forEach((chunk, index) => {
      console.log(`\nChunk ${index + 1}: ${chunk.length} characters`);
      console.log(`First 100 characters: ${chunk.substring(0, 100)}...`);
      
      // Extract context from this chunk
      const context = extractNavadminContext(chunk);
      console.log(`Context extracted (${context.length} characters): ${context.substring(0, 100)}...`);
    });
  });
  
  return {
    originalLength: sampleNavadmin.length,
    processedLength: processedContent.length,
    chunkResults: chunkSizes.map(size => ({
      chunkSize: size,
      chunks: chunkNavadminContent(processedContent, size).length
    }))
  };
}

// Run the test if this file is executed directly
if (require.main === module) {
  console.log('Testing NAVADMIN chunking system...');
  const results = testNavadminChunking();
  console.log('\nSummary:');
  console.log(JSON.stringify(results, null, 2));
}