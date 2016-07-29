export default class GroupSearchResultsController {
  /*@ngInject*/
  constructor() {
    this.search = null;
    this.processing = false;

    this.results = MOCK_DATA;
  }

  submit() {
  }
}

// Mock Data
let MOCK_DATA = [
  { groupName: '(t) Chris Tallent\'s Small Test Group with a super long name maxed out #####', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '17:30:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Dave\'s Group Tool Test', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '22:00:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Dave\'s Group Tool Test 2', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '7:00:00', day: 'Friday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) David McCoy\'s Small Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '17:30:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Dustin Test Group 2', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '10:00:00', day: 'Saturday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Dustin\'s Test Bible Study', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '10:30:00', day: 'Tuesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Group there it is', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Group there it is', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Joe\'s Group Name', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Joe\'s Test Small Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '19:30:00', day: 'Monday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) John Small Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '0:00:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Kims Volunteers Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '0:00:00', day: 'Monday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Learning the flute', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '11:00:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa9\'s Test Group 1', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa9\'s Test Group 2', congregationName: 'Anywhere', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa9\'s Test Group 3', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa9\'s Test Group 4', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa\'s First Group 1', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '19:00:00', day: 'Friday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Lisa\'s Test Group 1', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '23:00:00', day: 'Friday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Liz Small Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '16:00:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Liz Small Group 2', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '17:00:00', day: 'Tuesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t) Sara\'s Test Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '8:00:00', day: 'Sunday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t)Coed Pet Walking Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '0:00:00', day: 'Sunday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t)Morning Bible Class KF', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '9:30:00', day: 'Saturday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t)Richard Test Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '0:00:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t)Sopranos Singing Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '16:00:00', day: 'Saturday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '(t)Women of Zumba', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '1:30:00', day: 'Saturday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: '2 (t) Joe\'s Test Small Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '19:30:00', day: 'Monday', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: 'age ranges', congregationName: 'Anywhere', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  { groupName: 'Andrew', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Anotehr 12 gorup', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Anotehr Joe Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Another group for joe', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Another group for joe agian', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Another group for ken', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Another joe group again', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Another men only group', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'asdf', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'asdf', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'asdfdsf dfsda', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Atticus Puck', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Attribute test group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Category group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Cheryl\'s Rockers', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Cheryl\'s Rockers', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Couples group attributes test', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Couples group attributes test', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Couples group attributes test', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Create Group test', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'df', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Different way to not save time', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Every group is awesome', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '21:00:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'fg bdf', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'fg fg sdg', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '45:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ga gdf gfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Get categories yo', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Group #41', congregationName: 'I do not attend Crossroads', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'group 12', congregationName: 'Anywhere', groupType: 'Anyone Welcome', time: '21:00:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'group group', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Group McGroupFace', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'group nizzame', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Group no default time', congregationName: 'West Side', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'group test for 4th time', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'groupy group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '13:43.8', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'how save age rnages', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'jf jkl fklj', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Joe Group that saves kid friendly', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '21:00:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Joe test group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Joe\'s group that saves the day', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '21:00:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Joe\'s Group to save everything except categories i think', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '21:00:00', day: 'Saturday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 7:51pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:02pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:30pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:32pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:36pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:36pm 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken 8:44pm 7/28', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken group save this time you fool', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken Group Stupid', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Couples Group - 40s', congregationName: 'West Side', groupType: 'Anyone Welcome', time: '45:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Couples Group - 60s', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s foot golf group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group 7:14pm on 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group 7:16 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group 7:16 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group another men group all age ranges', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group at 6:23pm on 7/28', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group for time again', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '3:45:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group for time again and again', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '23:15:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group stuff is broken', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group what meets sometimes', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group where Joe hosed him', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s group where Joe hosed him', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s lumpy gravy group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '23:15:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s many age group group', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '15:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Married Couples - MSU', congregationName: 'West Side', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s meeting day it\'s going to work this time no kidding group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '15:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s meeting day test again and again and again', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s meeting day test group', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '15:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s men group all age ranges', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '45:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Men Only Group - 50s', congregationName: 'West Side', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Men Only Group - 50s, 60s', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Mensa group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '23:45:00', day: 'Friday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s real test group for time what format\'s incorrectly', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '3:00:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s test group to see what the time format is', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Ken\'s Women Only Group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '15:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'LW Church', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '0:00:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Martin', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Men Only group attribute test', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Men Only group attribute test', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Michael Jordan\'s Group One time childcare 8/1/2016 9.45a-6.00p', congregationName: 'West Side', groupType: 'Anyone Welcome', time: '9:45:00', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'My eclectic group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'My latest group - flexible meeting time', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'My new eclectic group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'My new new eclectic group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'My Test Bible Study Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '10:30:00', day: 'Thursday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'No Treble', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ok keep my data', congregationName: 'I do not attend Crossroads', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Penguin group', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Double Please', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Friday 11', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Friday 22', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Group Friday', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Help at Night', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Help At Night', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '45:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Help Friday 5', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Help Hey!', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Please Night Time', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Please Please Help Me', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Sara', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please Work ParticiPANTS', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Please...Help!', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Robert Milton', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '15:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Save a group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '21:00:00', day: 'Wednesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'save a group', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Save Category please', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Save Category?', congregationName: 'I do not attend Crossroads', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Save Category?', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Save Frequency', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Second Attribute Test Group', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'sgsfdg dfgdf g', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'skdjf djflk', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ss sdfg fgsd fg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'ssdfasdf sdfasdf', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Test', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Test Group Name - Please', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Test Please Again', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Test save frequency group II', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Test Thursday Save', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '2:15:00', day: 'Tuesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'THIS IS AWESOME', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'This is for the win!', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'THIS IS IT!', congregationName: 'Oxford', groupType: 'Anyone Welcome', time: '30:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Triple Threat', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '19:00:00', day: 'Tuesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Triple Threat', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '19:00:00', day: 'Tuesday', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Triple Triple Triple Please', congregationName: 'I do not attend Crossroads', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Update profile group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'updates to profile', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'William', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '29:44.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Women only attribute test', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Work you #&$*#(&$@&$', congregationName: 'Oakley', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'xgdsfg', congregationName: 'Florence', groupType: 'Anyone Welcome', time: '00:00.0', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'yet another 12 group', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'yet another 12 grup', congregationName: 'Uptown', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
  // { groupName: 'Yet another group with out a time this time', congregationName: 'Mason', groupType: 'Anyone Welcome', time: '', day: '', category: 'Spiritual Growth', detail: 'Life Changes' },
];
