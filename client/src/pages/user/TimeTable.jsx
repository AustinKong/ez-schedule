import { Grid, Box, Button, Text, Flex, IconButton, Select, Portal, createListCollection} from '@chakra-ui/react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import React, { useState, useEffect, useMemo } from 'react';
import { fetchGroups, fetchTimeslotsByGroup } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Sample course data (replace with your actual data)
const timeslots = [
{ id: 'CS2040-FRI-0900', day: 'WED', start: 8, end: 10, name: 'CS2040', type: 'LAB [24]', details: 'COM3-01-12', weeks: 'Weeks 3-13'},
{ id: 'IS3106-WED-930', day: 'WED', start: 9, end: 11, name: 'IS3106', type: 'LEC [1]', details: 'LT18'}, // Colliding course
{ id: 'CS2040-WED-1300', day: 'FRI', start: 8, end: 11, name: 'CS2040', type: 'LEC [1]', details: 'E-Learning'},
{ id: 'BT3017-THU-1600', day: 'MON', start: 8, end: 10, name: 'BT3017', type: 'TUT [1]', details: 'COM3-01-22', weeks: 'Weeks 3-13'},
{ id: 'CS2238-FRI-1600', day: 'TUE', start: 8, end: 17, name: 'CS2238', type: 'LEC [1]', details: 'LT19'},
{ id: 'CS2040-WED-800', day: 'THU', start: 8, end: 9, name: 'CS2040-2', type: 'LEC', details: 'E-Learning'}, // Another collision on WED
];

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const hourHeight = 100; // px per hour
const gapAlign = 0;
const shrinkFactor = 1;

const Timetable = () => {
  const [groups, setGroups] = useState([]);
  const [groupsWT, setGroupsWT] = useState([]);
  const [updatedTimeslots, setUpdatedTimeslots] = useState([]);
  const [dayLayouts, setDayLayouts] = useState({});
  const [firstTime, setFirstTime] = useState(1);
  const [lastTime, setlastTime] = useState(24);
  const [currSlotIndex, setCurrSlotIndex] = useState(0); // To track the current timeslot within the selected group for the current week
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupOptions, setGroupOptions] = useState([]); // For the dropdown options

  const [weekRange, setWeekRange] = useState('');
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((date - yearStart) / 86400000) / 7);
    return weekNumber;
  };

  const getMaxWeeksInYear = (year) => {
    const date = new Date(year, 11, 31);
    return getWeekNumber(date.toISOString());
  };

  const getWeekRange = (weekNumber, year = new Date().getFullYear()) => {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    const ISOweekEnd = new Date(ISOweekStart);
    ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
  
    const formatDate = (date) => {
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-SG', options); // Adjust locale if needed
    };
  
    return `${formatDate(ISOweekStart)} - ${formatDate(ISOweekEnd)}`;
  };

  const currentWeek = getWeekNumber(currentDate.toISOString());

  const [displayedWeek, setDisplayedWeek] = useState(currentWeek);
  const [displayedYear, setDisplayedYear] = useState(currentYear);

  const colourPalette = useMemo(() => [
    '#FC8181',
    '#F6AD55',
    '#ECC94B',
    '#68D391',
    '#4FD1C5',
    '#63B3ED',
    '#76E4F7',
    '#B794F4'
  ], []);

  // extract course data from API 
  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await fetchGroups();
        setGroups(response);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
  
    getGroups();
  }, [])

  useEffect(() => {
    console.log("Group updated:", groups);
  }, [groups]);

  // fetch timeslots for each group, and save the timeslots in each course
  useEffect(() => {
    const fetchTimeslots = async () => {
      try {
        if (groups.length > 0) { // Check if groups has data
          let groupsWithSlots = [];
          for (const group of groups) {
            console.log("groupid", group._id);
            const response = await fetchTimeslotsByGroup(group._id);
            groupsWithSlots.push({ ...group, timeslots: response });
          }
          setGroupsWT(groupsWithSlots); // Update groups with timeslots
        }
      } catch (error) {
        console.error('Error fetching timeslots:', error);
      }
    };
  
    fetchTimeslots();
  }, [groups])

  // updates timeslots with more readable details for timetable processing later
  // assigns random colours
  useEffect(() => {
    const assignExtraDetails = () => {
      const updatedTimeslots = groupsWT.flatMap(group =>
        group.timeslots ? group.timeslots.map(timeslot => ({
          ...timeslot,
          day: daysOfWeek[new Date(timeslot.start).getDay()],
          startHours: new Date(timeslot.start).getHours() + (new Date(timeslot.start).getMinutes() / 60),
          endHours: new Date(timeslot.end).getHours() + (new Date(timeslot.end).getMinutes() / 60),
          week: getWeekNumber(timeslot.start),
          colour: timeslot.colour || colourPalette[Math.floor(Math.random() * colourPalette.length)],
        })) : []
      );
      setUpdatedTimeslots(updatedTimeslots);
    };
  
    assignExtraDetails();
  }, [groupsWT, colourPalette]);

  // find the earliestTime and latestTime from the list of timeslots
  useEffect(() => {
    if (updatedTimeslots.length > 0) {
      const findEarliestTime = () => {
        const earliestTime = Math.min(...updatedTimeslots
          .filter(timeslot => timeslot.week === displayedWeek)
          .map(timeslot2 => timeslot2.startHours));
        setFirstTime(earliestTime);
      };
    
      const findLatestTime = () => {
        const latestTime = Math.max(...updatedTimeslots
          .filter(timeslot => timeslot.week === displayedWeek)
          .map(timeslot2 => timeslot2.endHours));
        setlastTime(latestTime);
      };
      
      console.log("Times", firstTime, lastTime);
      findEarliestTime();
      findLatestTime();
    }
    
  }, [updatedTimeslots, displayedWeek]);
  
  // designs layout for each column (each day)
  useEffect(() => {
    const calculateDayLayouts = () => {
      const layouts = {};
      if (updatedTimeslots.length > 0) {
        daysOfWeek.forEach((day) => {
          const coursesOnDay = updatedTimeslots.filter(timeslot => timeslot.day === day).sort((a, b) => a.startHours - b.startHours);
          const slots = [];
          let maxConcurrentCollisions = 0;

          coursesOnDay.forEach(timeslot => {
            slots.push({ timeslot, start: timeslot.startHours, end: timeslot.endHours, collisions: 1, leftOffset: 0 });
          });
          console.log("slots", slots);

          for (let i = 0; i < slots.length; i++) {
            let currentCollisions = 1;
            
            for (let j = 0; j < i; j++) {
              if (slots[i].start < slots[j].end && slots[i].end > slots[j].start) {
                currentCollisions++;
              }
            }
            slots[i].collisions = currentCollisions;
            maxConcurrentCollisions = Math.max(maxConcurrentCollisions, currentCollisions);
          }
          
          const numConcurrent = maxConcurrentCollisions > 0 ? maxConcurrentCollisions : 1;
          slots.forEach((slot, index) => {
            let offsetFactor = 0;
            for (let i = 0; i < index; i++) {
              if (slot.start < slots[i].end && slot.end > slots[i].start) {
                offsetFactor++;
              }
            }
            slot.leftOffset = offsetFactor / numConcurrent + 0.01 * shrinkFactor;
            slot.width = 1 / numConcurrent - 0.02 * shrinkFactor;
          });

          layouts[day] = { slots, columnUnits: numConcurrent };
        });
        setDayLayouts(layouts);
      }
    };

    calculateDayLayouts();
  }, [updatedTimeslots]);

  // adjusts the start and end hours of the timetable
  const timeSlots = Array.from({ length: lastTime - firstTime + 2 }, (_, i) => firstTime - 1 + i); // [8, 9, ..., 18]

  const gridColumns = useMemo(() => {
    return ['1fr', ...daysOfWeek.map(day => `${dayLayouts[day]?.columnUnits || 1}fr`)].join(' ');
  }, [dayLayouts, daysOfWeek]);

  // sets the week to current week
  useEffect(() => {
    setWeekRange(getWeekRange(displayedWeek));
  }, [displayedWeek]);

  // dropdown options for groups
  useEffect(() => {
    if (groups && groups.length > 0) {
      setGroupOptions(groups.map(group => ({ value: group._id, label: group.name })));
    } else {
      setGroupOptions([]);
      setSelectedGroup(null);
      setCurrSlotIndex(0);
    }
  }, [groups]);

  // handle group changes
  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId === 'all' ? null : groupId);
    setCurrSlotIndex(0);
  };

  const getTopPosition = (start) => {
    const startIndex = timeSlots.indexOf(Math.floor(start));
    const minuteOffset = (start % 1) * 60;
    const baseTop = startIndex !== -1 ? startIndex * (hourHeight + gapAlign) + 2 * shrinkFactor : 0;
    return `${baseTop + (minuteOffset * (hourHeight / 60))}px`;
  };

  const getHeight = (start, end) => {
    const hourDifference = end - start;
    console.log("hourDifference", hourDifference);
    return `${hourDifference * hourHeight + (hourDifference - 1) * gapAlign - 4 * shrinkFactor}px`;
  };

  // direct to specific timeslot page
  const handleOnClick = (id) => {
    if (id) {
      navigate(`/user/timeslots/${id}`);
    }
  }

  const handlePrevWeek = () => {
    if (displayedWeek > 1) {
      setDisplayedWeek(prevWeek => prevWeek - 1);
    } else {
      setDisplayedYear(prevYear => prevYear - 1);
      setDisplayedWeek(getMaxWeeksInYear(displayedYear - 1));
    }
  };

  const handleNextWeek = () => {
    console.log("displayedWeek", getMaxWeeksInYear(displayedYear));
    if (displayedWeek < 52) {
      setDisplayedWeek(prevWeek => prevWeek + 1);
    } else {
      setDisplayedYear(prevYear => prevYear + 1);
      setDisplayedWeek(1);
    }
  };

  const collection = useMemo(() => ({
    getKey: (group) => group._id,
    items: groups,
  }), [groups]);

  const frameworks = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  })

  useEffect(() => {
    console.log("Collections:", collection);
    console.log("frameworks:", frameworks);
  }, [groups]);

  return (
    <Box>
      <Select.Root collection={frameworks}>
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <IconButton aria-label="Previous Week" onClick={handlePrevWeek}>
          <MdArrowBack/>
        </IconButton>
        
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          >
          <Text fontWeight="bold" fontSize="lg">Week {displayedWeek}, {displayedYear}</Text>
          <Text fontSize="xs">{weekRange}</Text>
        </Box>
        
        <IconButton aria-label="Next Week" onClick={handleNextWeek}>
          <MdArrowForward/>
        </IconButton>
      </Flex>

      <Grid
        templateColumns={gridColumns}
        gap={`${gapAlign}px`}
        border="1px solid black"
        position="relative"
      >
        {/* Time Slot Labels */}
        <Box></Box>
        {daysOfWeek.map((day) => (
          <Box key={day} p={2} textAlign="center" borderBottom="1px solid black">
            <Text fontWeight="bold">{day}</Text>
          </Box>
        ))}

        {/* Time Slot Rows */}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            <Box p={2} textAlign="right" borderRight="1px solid black">
              <Text>{`${hour}00`}</Text>
            </Box>
            {daysOfWeek.map((day) => (
              <Box
                key={`${day}-${hour}`}
                border="1px solid #e0e0e0"
                minH={`${hourHeight}px`}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Render timeslot Blocks */}
        {Object.keys(dayLayouts).length > 0 && updatedTimeslots
        .filter(timeslot => timeslot.week === displayedWeek)
        .map((timeslot) => {
          const dayIndex = daysOfWeek.indexOf(timeslot.day);
          console.log("slotsInWeekInGrid", updatedTimeslots);
          const layoutForDay = dayLayouts[timeslot.day]?.slots.find(slot => slot.timeslot._id === timeslot._id);

          if (layoutForDay) {
            const gridColumnStart = dayIndex + 2;
            const topPosition = getTopPosition(timeslot.startHours);
            const blockHeight = getHeight(timeslot.startHours, timeslot.endHours);
            const leftOffsetPercentage = 100* layoutForDay.leftOffset;
            const widthPercentage = 100 * layoutForDay.width;
            return (
              <Button
                key={timeslot._id}
                style={{
                  backgroundColor: timeslot.colour,
                  position: 'absolute',
                  top: topPosition,
                  left: `${leftOffsetPercentage}%`,
                  width: `calc(${widthPercentage}%)`,
                  height: blockHeight,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(0.9)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                gridRowStart = "2"
                gridColumnStart={gridColumnStart}
                gridColumnEnd={gridColumnStart + 1}
                onClick={() => handleOnClick(timeslot._id)}
                justifyContent={"flex-start"}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start" // Align text to the left within the vertical stack
                  justifyContent="flex-start"
                  height="100%" // Make the container take full height of the button
                  padding="10px"
                >
                  <Text fontWeight="bold" fontSize="s">{timeslot.name}</Text>
                  <Text fontSize="xs">{timeslot.type}</Text>
                  <Text fontSize="xs">{timeslot.details}</Text>
                  <Text fontSize="xs">{timeslot.weeks}</Text>
                </Box>
              </Button>
            );
          }
          return null;
        })}
      </Grid>
    </Box>
  );
};

export default Timetable;