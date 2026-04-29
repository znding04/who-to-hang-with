// English seed data — same persona archetypes as the zh seed so the scoring
// patterns (high-freq-low-quality, low-freq-high-quality, etc.) feel familiar.
export function seedEn({ addFriend, addHangout, d }) {
  const f1 = addFriend({ name: 'Marcus Chen', tags: ['college', 'basketball'], phone: '555-0101', birthday: '1995-03-15', location: 'Brooklyn, NY', howWeMet: 'College roommates', values: ['basketball partner', 'reliable'], importantEvents: ['Played in the campus league together', 'Senior year road trip'] })
  const f2 = addFriend({ name: 'Emma Park', tags: ['coworker'], phone: '555-0102', birthday: '1993-07-22', location: 'Manhattan, NY', howWeMet: 'New-hire orientation', values: ['work partner', 'coffee enthusiast'], importantEvents: ['Shipped Q3 project together', 'Birthday dinner'] })
  const f3 = addFriend({ name: 'Sam Davis', tags: ['childhood friend', 'neighbor'], phone: '555-0103', birthday: '1992-01-10', location: 'Brooklyn, NY', howWeMet: 'Grew up on the same block', values: ['lifelong friend', 'late-night talks'], importantEvents: ['Childhood adventures', 'Senior year of high school'] })
  const f4 = addFriend({ name: 'Alex Kim', tags: ['coworker', 'lunch buddy'], phone: '555-0104', birthday: '1996-11-05', location: 'Manhattan, NY', howWeMet: 'Company offsite', values: ['food explorer', 'venting partner'], importantEvents: ['Found a hidden gem restaurant', 'Late-night work delivery'] })
  const f5 = addFriend({ name: 'Maya Patel', tags: ['photography', 'travel'], phone: '555-0105', birthday: '1994-06-18', location: 'San Francisco, CA', howWeMet: 'Photo walk meetup', values: ['photo coach', 'trip planner'], importantEvents: ['Iceland photo trip', 'Gallery show'] })
  const f6 = addFriend({ name: 'Jordan Reyes', tags: ['gym', 'college'], phone: '555-0106', birthday: '1991-09-30', location: 'Brooklyn, NY', howWeMet: 'College intramurals', values: ['workout partner', 'accountability'], importantEvents: ['Ran a marathon together', 'Built consistent habits'] })
  const f7 = addFriend({ name: 'Sophie Tran', tags: ['language exchange', 'friend'], phone: '555-0107', birthday: '1997-04-12', location: 'Manhattan, NY', howWeMet: 'Language exchange meetup', values: ['practice partner', 'great conversation'], importantEvents: ['Toastmasters speech contest', 'Book club'] })
  const f8 = addFriend({ name: 'Tyler Brooks', tags: ['gaming', 'online friend'], phone: '555-0108', birthday: '1998-12-01', location: 'Austin, TX', howWeMet: 'Met in a discord raid group', values: ['raid partner', 'late-night gaming'], importantEvents: ['First guild boss kill', 'Game anniversary stream'] })
  const f9 = addFriend({ name: 'Hannah Wright', tags: ['neighbor', 'baking'], phone: '555-0109', birthday: '1990-02-28', location: 'Brooklyn, NY', howWeMet: 'Knocked on my door for a cup of sugar', values: ['food sharing', 'baker'], importantEvents: ['Made a cake together', 'Neighborhood block party'] })
  const f10 = addFriend({ name: 'Raj Patel', tags: ['tech', 'college'], phone: '555-0110', birthday: '1993-08-14', location: 'Seattle, WA', howWeMet: 'CS class lab partner', values: ['tech advisor', 'code review'], importantEvents: ['Open-source project together', 'Tech conference talk'] })
  const f11 = addFriend({ name: 'Olivia Bennett', tags: ['book club', 'coworker'], phone: '555-0111', birthday: '1995-10-20', location: 'Manhattan, NY', howWeMet: 'Workplace book club', values: ['book friend', 'deep conversation'], importantEvents: ['Hosted a book club discussion', 'Finished a novel together'] })
  const f12 = addFriend({ name: 'Mike Sullivan', tags: ['hiking', 'outdoors'], phone: '555-0112', birthday: '1989-05-25', location: 'Denver, CO', howWeMet: 'Local hiking group', values: ['hiking partner', 'trail safety'], importantEvents: ['Summited Mt. Rainier', 'Backcountry camping'] })
  const f13 = addFriend({ name: 'Lily Wong', tags: ['music', 'college'], phone: '555-0113', birthday: '1996-03-08', location: 'Los Angeles, CA', howWeMet: 'College a cappella group', values: ['music kindred spirit', 'concert buddy'], importantEvents: ['Campus singer competition', 'Coachella together'] })
  const f14 = addFriend({ name: 'David Park', tags: ['startup', 'friend'], phone: '555-0114', birthday: '1988-11-30', location: 'San Francisco, CA', howWeMet: 'Startup founders mixer', values: ['startup mentor', 'business insight'], importantEvents: ['Product launch', 'Series A close'] })
  const f15 = addFriend({ name: 'Zoe Martinez', tags: ['yoga', 'neighbor'], phone: '555-0115', birthday: '1994-07-16', location: 'Brooklyn, NY', howWeMet: 'Local yoga studio', values: ['yoga buddy', 'wellness'], importantEvents: ['Yoga teacher training', 'Wellness streak'] })
  const f16 = addFriend({ name: 'Ben Carter', tags: ['college', 'soccer'], phone: '555-0116', birthday: '1992-09-03', location: 'Chicago, IL', howWeMet: 'College intramural soccer', values: ['soccer partner', 'sports commentator'], importantEvents: ['Intramural championship', 'World Cup all-nighter'] })
  const f17 = addFriend({ name: 'Rachel Thompson', tags: ['ex-coworker', 'best friend'], phone: '555-0117', birthday: '1991-12-22', location: 'Manhattan, NY', howWeMet: 'My first job out of college', values: ['listener', 'emotional support'], importantEvents: ['Job-hopped together', 'Got me through a breakup'] })
  const f18 = addFriend({ name: 'Aaron Lewis', tags: ['cycling', 'outdoors'], phone: '555-0118', birthday: '1997-06-11', location: 'Portland, OR', howWeMet: 'Cycling club', values: ['cycling partner', 'route scout'], importantEvents: ['Pacific coast bike tour', 'Century ride PR'] })
  const f19 = addFriend({ name: 'Isabella Rivera', tags: ['dance', 'hobby'], phone: '555-0119', birthday: '1998-08-07', location: 'Manhattan, NY', howWeMet: 'Dance studio', values: ['dance partner', 'stage performer'], importantEvents: ['Year-end recital', 'Dance competition'] })
  const f20 = addFriend({ name: 'Uncle Steve', tags: ['family'], phone: '555-0120', birthday: '1965-04-30', location: 'New Jersey', howWeMet: 'Family', values: ['family support', 'holiday traditions'], importantEvents: ['Thanksgiving dinners', 'Family vacation to Maine'] })

  // Three "draining" friends — high frequency, low quality (truly negative gap)
  const f21 = addFriend({ name: 'Mr. Henderson', tags: ['boss', 'work events'], phone: '555-0121', birthday: '1972-02-14', location: 'Manhattan, NY', howWeMet: 'My current manager', values: ['professional relationship'], importantEvents: ['Year-end review', 'Department dinner'] })
  const f22 = addFriend({ name: 'Uncle Frank', tags: ['relative', 'distant'], phone: '555-0122', birthday: '1958-09-09', location: 'Long Island, NY', howWeMet: 'Family gatherings', values: ['family obligation'], importantEvents: ['Family reunions'] })
  const f23 = addFriend({ name: 'Chris Walsh', tags: ['old classmate', 'high school'], phone: '555-0123', birthday: '1992-05-20', location: 'Brooklyn, NY', howWeMet: 'High school homeroom', values: ['old classmate'], importantEvents: ['High school graduation'] })

  // Marcus Chen — high frequency, high quality, basketball
  addHangout({ friendIds: [f1.id], type: 'activity', duration: '2hr', quality: 10, note: 'Pickup basketball', date: d(2) })
  addHangout({ friendIds: [f1.id], type: 'activity', duration: '2hr', quality: 9, note: 'Court practice', date: d(9) })
  addHangout({ friendIds: [f1.id], type: 'meal', duration: '1hr', quality: 8, note: 'Dinner after the game', date: d(16) })
  addHangout({ friendIds: [f1.id], type: 'call', duration: '30min', quality: 8, note: 'Catch-up call', date: d(25) })
  addHangout({ friendIds: [f1.id], type: 'activity', duration: 'fullday', quality: 10, note: 'Weekend tournament', date: d(40) })

  // Emma Park — coworker, medium frequency / quality
  addHangout({ friendIds: [f2.id], type: 'meal', duration: '1hr', quality: 7, note: 'Work lunch', date: d(3) })
  addHangout({ friendIds: [f2.id], type: 'call', duration: '30min', quality: 6, note: 'Project sync', date: d(14) })
  addHangout({ friendIds: [f2.id], type: 'meal', duration: '1hr', quality: 7, note: 'Coffee run', date: d(30) })
  addHangout({ friendIds: [f2.id], type: 'activity', duration: '2hr', quality: 6, note: 'Team offsite', date: d(45) })

  // Sam Davis — childhood friend, low frequency but deep
  addHangout({ friendIds: [f3.id], type: 'hangout', duration: '2hr', quality: 10, note: 'Caught up at length', date: d(15) })
  addHangout({ friendIds: [f3.id], type: 'meal', duration: '2hr', quality: 10, note: 'Old neighborhood diner', date: d(60) })
  addHangout({ friendIds: [f3.id], type: 'call', duration: '1hr', quality: 9, note: 'Late-night phone call', date: d(90) })

  // Alex Kim — high frequency but mid quality, lunch buddy
  addHangout({ friendIds: [f4.id], type: 'meal', duration: '1hr', quality: 5, note: 'Quick work lunch', date: d(1) })
  addHangout({ friendIds: [f4.id], type: 'meal', duration: '1hr', quality: 6, note: 'Takeout in office', date: d(4) })
  addHangout({ friendIds: [f4.id], type: 'meal', duration: '1hr', quality: 7, note: 'Tried a new spot', date: d(8) })
  addHangout({ friendIds: [f4.id], type: 'online', duration: '30min', quality: 4, note: 'Quick game session', date: d(12) })
  addHangout({ friendIds: [f4.id], type: 'meal', duration: '1hr', quality: 5, note: 'Lunch again', date: d(20) })
  addHangout({ friendIds: [f4.id], type: 'meal', duration: '1hr', quality: 6, note: 'Usual lunch routine', date: d(35) })
  addHangout({ friendIds: [f4.id], type: 'call', duration: '30min', quality: 5, note: 'Casual chat', date: d(50) })

  // Maya Patel — travel high quality but rare
  addHangout({ friendIds: [f5.id], type: 'trip', duration: 'trip', quality: 10, note: 'Iceland photo trip — a week', date: d(120) })
  addHangout({ friendIds: [f5.id], type: 'activity', duration: '2hr', quality: 9, note: 'City photo walk', date: d(200) })

  // Jordan Reyes — gym partner, mutual accountability
  addHangout({ friendIds: [f6.id], type: 'activity', duration: '2hr', quality: 8, note: 'Gym session', date: d(5) })
  addHangout({ friendIds: [f6.id], type: 'activity', duration: '2hr', quality: 8, note: 'Park run', date: d(12) })
  addHangout({ friendIds: [f6.id], type: 'meal', duration: '1hr', quality: 7, note: 'Post-workout meal', date: d(18) })
  addHangout({ friendIds: [f6.id], type: 'call', duration: '30min', quality: 6, note: 'Training plan check-in', date: d(30) })
  addHangout({ friendIds: [f6.id], type: 'activity', duration: 'fullday', quality: 10, note: 'Marathon race day', date: d(60) })

  // Sophie Tran — language exchange friend, high quality but low frequency
  addHangout({ friendIds: [f7.id], type: 'hangout', duration: '2hr', quality: 8, note: 'Language exchange evening', date: d(7) })
  addHangout({ friendIds: [f7.id], type: 'call', duration: '30min', quality: 7, note: 'Speaking practice', date: d(45) })
  addHangout({ friendIds: [f7.id], type: 'meal', duration: '1hr', quality: 8, note: 'Dinner after book club', date: d(80) })

  // Tyler Brooks — online gaming friend
  addHangout({ friendIds: [f8.id], type: 'online', duration: '2hr', quality: 8, note: 'Late-night raid', date: d(2) })
  addHangout({ friendIds: [f8.id], type: 'online', duration: '2hr', quality: 7, note: 'Daily grind', date: d(8) })
  addHangout({ friendIds: [f8.id], type: 'online', duration: '2hr', quality: 8, note: 'Guild war', date: d(15) })
  addHangout({ friendIds: [f8.id], type: 'online', duration: '2hr', quality: 8, note: 'Weekend session', date: d(25) })

  // Hannah Wright — neighbor, baking
  addHangout({ friendIds: [f9.id], type: 'hangout', duration: '1hr', quality: 9, note: 'Brought over a homemade cake', date: d(10) })
  addHangout({ friendIds: [f9.id], type: 'meal', duration: '1hr', quality: 8, note: 'Block-party potluck', date: d(50) })
  addHangout({ friendIds: [f9.id], type: 'call', duration: '30min', quality: 8, note: 'Recipe exchange', date: d(90) })

  // Raj Patel — tech advisor
  addHangout({ friendIds: [f10.id], type: 'call', duration: '1hr', quality: 7, note: 'Code review call', date: d(6) })
  addHangout({ friendIds: [f10.id], type: 'call', duration: '1hr', quality: 8, note: 'Architecture discussion', date: d(20) })
  addHangout({ friendIds: [f10.id], type: 'online', duration: '2hr', quality: 6, note: 'Pair programming', date: d(45) })
  addHangout({ friendIds: [f10.id], type: 'call', duration: '30min', quality: 7, note: 'Career advice', date: d(70) })

  // Olivia Bennett — book club, deep conversation
  addHangout({ friendIds: [f11.id], type: 'hangout', duration: '2hr', quality: 10, note: 'Book club discussion', date: d(14) })
  addHangout({ friendIds: [f11.id], type: 'meal', duration: '1hr', quality: 8, note: 'Dinner after club', date: d(15) })
  addHangout({ friendIds: [f11.id], type: 'call', duration: '1hr', quality: 9, note: 'Deep dive on a novel', date: d(60) })
  addHangout({ friendIds: [f11.id], type: 'hangout', duration: '2hr', quality: 9, note: 'Book club night', date: d(75) })

  // Mike Sullivan — hiking partner
  addHangout({ friendIds: [f12.id], type: 'activity', duration: 'fullday', quality: 10, note: 'Day hike', date: d(30) })
  addHangout({ friendIds: [f12.id], type: 'trip', duration: 'trip', quality: 10, note: 'Mt. Rainier summit', date: d(180) })
  addHangout({ friendIds: [f12.id], type: 'call', duration: '30min', quality: 7, note: 'Trail planning', date: d(200) })

  // Lily Wong — music kindred spirit
  addHangout({ friendIds: [f13.id], type: 'hangout', duration: '2hr', quality: 9, note: 'Concert', date: d(40) })
  addHangout({ friendIds: [f13.id], type: 'call', duration: '1hr', quality: 9, note: 'Music swap', date: d(100) })
  addHangout({ friendIds: [f13.id], type: 'activity', duration: '2hr', quality: 8, note: 'Karaoke night', date: d(150) })

  // David Park — startup mentor
  addHangout({ friendIds: [f14.id], type: 'call', duration: '1hr', quality: 7, note: 'Business model chat', date: d(20) })
  addHangout({ friendIds: [f14.id], type: 'call', duration: '1hr', quality: 8, note: 'Project retro', date: d(50) })
  addHangout({ friendIds: [f14.id], type: 'meal', duration: '2hr', quality: 9, note: 'Series A celebration', date: d(90) })
  addHangout({ friendIds: [f14.id], type: 'call', duration: '30min', quality: 5, note: 'Quick advice call', date: d(120) })

  // Zoe Martinez — yoga buddy
  addHangout({ friendIds: [f15.id], type: 'activity', duration: '1hr', quality: 7, note: 'Yoga class', date: d(7) })
  addHangout({ friendIds: [f15.id], type: 'activity', duration: '1hr', quality: 7, note: 'Yoga class', date: d(21) })
  addHangout({ friendIds: [f15.id], type: 'meal', duration: '1hr', quality: 8, note: 'Coffee after class', date: d(22) })
  addHangout({ friendIds: [f15.id], type: 'call', duration: '30min', quality: 6, note: 'Wellness chat', date: d(60) })

  // Ben Carter — soccer partner
  addHangout({ friendIds: [f16.id], type: 'activity', duration: '2hr', quality: 8, note: 'Soccer pickup', date: d(10) })
  addHangout({ friendIds: [f16.id], type: 'call', duration: '30min', quality: 7, note: 'Talked over the match', date: d(30) })
  addHangout({ friendIds: [f16.id], type: 'activity', duration: '2hr', quality: 7, note: 'Soccer pickup', date: d(55) })
  addHangout({ friendIds: [f16.id], type: 'meal', duration: '1hr', quality: 6, note: 'Watch party + dinner', date: d(90) })

  // Rachel Thompson — best friend
  addHangout({ friendIds: [f17.id], type: 'meal', duration: '2hr', quality: 10, note: 'Long brunch catch-up', date: d(12) })
  addHangout({ friendIds: [f17.id], type: 'call', duration: '1hr', quality: 9, note: 'Deep talk', date: d(25) })
  addHangout({ friendIds: [f17.id], type: 'hangout', duration: '2hr', quality: 9, note: 'Shopping day', date: d(55) })
  addHangout({ friendIds: [f17.id], type: 'call', duration: '30min', quality: 8, note: 'Vent session', date: d(80) })

  // Aaron Lewis — cycling partner
  addHangout({ friendIds: [f18.id], type: 'activity', duration: 'fullday', quality: 10, note: 'Lake-loop ride', date: d(45) })
  addHangout({ friendIds: [f18.id], type: 'trip', duration: 'trip', quality: 10, note: 'Pacific coast tour', date: d(200) })
  addHangout({ friendIds: [f18.id], type: 'call', duration: '30min', quality: 7, note: 'Route planning', date: d(250) })

  // Isabella Rivera — dance partner
  addHangout({ friendIds: [f19.id], type: 'activity', duration: '2hr', quality: 7, note: 'Dance rehearsal', date: d(18) })
  addHangout({ friendIds: [f19.id], type: 'hangout', duration: '2hr', quality: 9, note: 'Year-end performance', date: d(70) })
  addHangout({ friendIds: [f19.id], type: 'meal', duration: '1hr', quality: 7, note: 'Post-rehearsal dinner', date: d(71) })

  // Uncle Steve — family
  addHangout({ friendIds: [f20.id], type: 'hangout', duration: 'fullday', quality: 10, note: 'Thanksgiving', date: d(60) })
  addHangout({ friendIds: [f20.id], type: 'meal', duration: '2hr', quality: 9, note: 'Family dinner', date: d(200) })
  addHangout({ friendIds: [f20.id], type: 'trip', duration: 'fullday', quality: 10, note: 'Family trip to Maine', date: d(300) })

  // Mr. Henderson — boss, frequent obligatory dinners, low quality
  addHangout({ friendIds: [f21.id], type: 'meal', duration: '2hr', quality: 2, note: 'Department dinner', date: d(2) })
  addHangout({ friendIds: [f21.id], type: 'meal', duration: '2hr', quality: 3, note: 'Client dinner', date: d(7) })
  addHangout({ friendIds: [f21.id], type: 'hangout', duration: '2hr', quality: 1, note: 'Roped into late drinks', date: d(11) })
  addHangout({ friendIds: [f21.id], type: 'meal', duration: '2hr', quality: 2, note: 'Business dinner', date: d(18) })
  addHangout({ friendIds: [f21.id], type: 'call', duration: '30min', quality: 3, note: 'Status update', date: d(22) })
  addHangout({ friendIds: [f21.id], type: 'meal', duration: '2hr', quality: 2, note: 'Team dinner', date: d(28) })
  addHangout({ friendIds: [f21.id], type: 'meal', duration: '1hr', quality: 4, note: 'Working lunch', date: d(40) })
  addHangout({ friendIds: [f21.id], type: 'hangout', duration: '2hr', quality: 2, note: 'Holiday party', date: d(55) })

  // Uncle Frank — distant relative, frequent visits, hard to talk to
  addHangout({ friendIds: [f22.id], type: 'meal', duration: '2hr', quality: 3, note: 'Dinner at his place', date: d(10) })
  addHangout({ friendIds: [f22.id], type: 'hangout', duration: '2hr', quality: 2, note: 'Drop-by visit', date: d(25) })
  addHangout({ friendIds: [f22.id], type: 'meal', duration: '2hr', quality: 3, note: "Couldn't say no to dinner", date: d(50) })
  addHangout({ friendIds: [f22.id], type: 'call', duration: '30min', quality: 2, note: 'Asked when I was getting married', date: d(70) })
  addHangout({ friendIds: [f22.id], type: 'meal', duration: '2hr', quality: 3, note: 'Family dinner', date: d(95) })

  // Chris Walsh — old classmate, always venting
  addHangout({ friendIds: [f23.id], type: 'call', duration: '1hr', quality: 3, note: 'Another vent call', date: d(5) })
  addHangout({ friendIds: [f23.id], type: 'meal', duration: '2hr', quality: 4, note: 'Old hangout spot', date: d(20) })
  addHangout({ friendIds: [f23.id], type: 'call', duration: '1hr', quality: 2, note: 'Late-night money request', date: d(35) })
  addHangout({ friendIds: [f23.id], type: 'hangout', duration: '2hr', quality: 3, note: 'High school reunion drinks', date: d(60) })
}
