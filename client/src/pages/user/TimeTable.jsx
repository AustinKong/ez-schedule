import { Grid, Box, Button, Text, Flex, IconButton, Select, Portal, createListCollection, Pagination, ButtonGroup } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { MdArrowBack, MdArrowForward, MdZoomInMap } from 'react-icons/md';
import React, { useState, useEffect, useMemo } from 'react';
import { fetchGroups, fetchTimeslotsByGroup } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { set } from 'date-fns';

// Sample course data (replace with your actual data)
const timeslots = [
{ id: 'CS2040-FRI-0900', day: 'WED', start: 8, end: 10, name: 'CS2040', type: 'LAB [24]', details: 'COM3-01-12', weeks: 'Weeks 3-13'},
{ id: 'IS3106-WED-930', day: 'WED', start: 9, end: 11, name: 'IS3106', type: 'LEC [1]', details: 'LT18'}, // Colliding course
{ id: 'CS2040-WED-1300', day: 'FRI', start: 8, end: 11, name: 'CS2040', type: 'LEC [1]', details: 'E-Learning'},
{ id: 'BT3017-THU-1600', day: 'MON', start: 8, end: 10, name: 'BT3017', type: 'TUT [1]', details: 'COM3-01-22', weeks: 'Weeks 3-13'},
{ id: 'CS2238-FRI-1600', day: 'TUE', start: 8, end: 17, name: 'CS2238', type: 'LEC [1]', details: 'LT19'},
{ id: 'CS2040-WED-800', day: 'THU', start: 8, end: 9, name: 'CS2040-2', type: 'LEC', details: 'E-Learning'}, // Another collision on WED
];

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const hourHeight = 100; // px per hour
const gapAlign = 0;
const shrinkFactor = 1;

const Timetable = () => {
  // for data
  const [groups, setGroups] = useState([]);
  const [updatedTimeslots, setUpdatedTimeslots] = useState([]);

  // for layout
  const [dayLayouts, setDayLayouts] = useState({});
  const [firstTime, setFirstTime] = useState(1);
  const [lastTime, setlastTime] = useState(24);

  // for pagination
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [slotWeekNumbers, setSlotWeekNumbers] = useState([]);

  // for week display
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const navigate = useNavigate();

  const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const timeDifference = date - startOfYear;
    const dayOfYear = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
    return Math.ceil(dayOfYear / 7);
  };

  const getMaxWeeksInYear = (year) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const daysInYear = Math.ceil((lastDayOfYear - firstDayOfYear) / millisecondsInDay) + 1;
    return Math.floor(daysInYear / 7);
  };

  const getWeekRange = (weekNumber, year) => {
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

  const [displayedWeek, setDisplayedWeek] = useState(getWeekNumber(new Date()));
  const [displayedYear, setDisplayedYear] = useState(currentYear);
  const [weekRange, setWeekRange] = useState(getWeekRange(displayedWeek, displayedYear));

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

  // fetch timeslots for each group, and save the timeslots in each course
  // updates timeslots with more readable details for timetable processing later
  // assigns random colours
  useEffect(() => {
    const fetchTimeslots = async () => {
      if (groups.length > 0) {
        const allTimeslotsWithDetails = await Promise.all(
          groups.map(async (group) => {
            try {
              const response = await fetchTimeslotsByGroup(group._id);
              return response.map(timeslot => ({
                ...timeslot,
                groupName: group.name,
                day: daysOfWeek[new Date(timeslot.start).getDay() - 1],
                startHours: new Date(timeslot.start).getHours() + (new Date(timeslot.start).getMinutes() / 60),
                endHours: new Date(timeslot.end).getHours() + (new Date(timeslot.end).getMinutes() / 60),
                week: getWeekNumber(timeslot.start),
                colour: timeslot.colour || colourPalette[Math.floor(Math.random() * colourPalette.length)],
              }));
            } catch (innerError) {
              console.error(`Error fetching timeslots for group ${group._id}:`, innerError);
              return []; // Return an empty array for failed group fetches
            }
          })
        ).then(results => results.flat()); // Flatten the array of arrays into a single array of timeslots
  
        setUpdatedTimeslots(allTimeslotsWithDetails);
      }
    };
  
    fetchTimeslots();
  }, [groups, colourPalette]);


  // useEffect(() => {
  //   console.log("Updated Timeslots updated:", updatedTimeslots);
  // }, [updatedTimeslots]);

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

  const getTopPosition = (start) => {
    const startIndex = timeSlots.indexOf(Math.floor(start));
    const minuteOffset = (start % 1) * 60;
    const baseTop = startIndex !== -1 ? startIndex * (hourHeight + gapAlign) + 2 * shrinkFactor : 0;
    return `${baseTop + (minuteOffset * (hourHeight / 60))}px`;
  };

  const getHeight = (start, end) => {
    const hourDifference = end - start;
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
      console.log("Minus 1 week");
      setDisplayedWeek(currWeek => currWeek - 1);
    } else {
      setDisplayedYear(currYear => {
        const previousYear = currYear - 1;
        setDisplayedWeek(getMaxWeeksInYear(previousYear));
        return previousYear;
      });
    }
  };

  const handleNextWeek = () => {
    console.log("pressed next week");
    if (displayedWeek < 52) {
      setDisplayedWeek(currWeek => currWeek + 1);
    } else {
      setDisplayedYear(currYear => currYear + 1);
      setDisplayedWeek(1);
    }
  };

  const handlePreviousTimeslot = () => {
    setSlotIndex(slotIndex - 1);
  }

  const handleNextTimeslot = () => {
    setSlotIndex(slotIndex + 1);
  }

  useEffect(() => {
    if (slotWeekNumbers.length > 0) {
      setDisplayedWeek(slotWeekNumbers[slotIndex]);
    }
  }, [slotIndex, slotWeekNumbers]);

  const handleDropdownChange = (e) => {
    setSelectedGroup(e.value);
    setSlotIndex(0);
  }

  // extract all the week numbers from timeslots based on selectedgroup
  useEffect(() => {
    const weeks = [];
    if (selectedGroup) {
      updatedTimeslots.forEach(timeslot => {
        if (timeslot.groupId === selectedGroup[0]) {
          weeks.push(timeslot.week);
        }
      })
    }
    setSlotWeekNumbers(weeks);
  }, [selectedGroup])

  const collections = createListCollection({
    items: groups.map((group) => ({
      label: group.name,
      value: group._id,
    })),
  })

  useEffect(() => {
    setWeekRange(getWeekRange(displayedWeek, displayedYear));
  }, [displayedWeek, displayedYear])

  useEffect(() => {
    console.log("displayedWeek(UseEffect)", displayedWeek);
  }, [displayedWeek]);

  useEffect(() => {
    console.log("displayedYear(UseEffect)", displayedYear);
  }, [displayedYear]);

  useEffect(() => {
    console.log("timeslots", updatedTimeslots);
  }, [updatedTimeslots]);

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" mb={4} display="flex" flexDirection="row">
        <Select.Root 
          collection={collections}
          value={selectedGroup || undefined}
          onValueChange={handleDropdownChange}
          alignItems="center"
          gap={2}
          width="40%"
          paddingBottom={5}
        >
        <Select.HiddenSelect />
          <Select.Label required>Groups</Select.Label>
          <Select.Control style={{ width: `80%` }}> 
            <Select.Trigger>
              <Select.ValueText placeholder="Select group" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {collections.items.map((collection) => (
                  <Select.Item item={collection} key={collection.value}>
                    {collection.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        
        {slotWeekNumbers.length > 0 ? (
          <Pagination.Root count={slotWeekNumbers.length} pageSize={1} defaultPage={1} page={slotIndex + 1}>
          <ButtonGroup gap="4" size="sm" variant="ghost">
            <Pagination.PrevTrigger asChild onClick={handlePreviousTimeslot}>
              <IconButton>
                <HiChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.PageText />
            <Pagination.NextTrigger asChild onClick={handleNextTimeslot}>
              <IconButton>
                <HiChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
        ) : (
          <p>No timeslots found</p>
        )}
      </Flex>
        

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
            {/* LEFT TIME LABEL */}
            <Box
              minH={`${hourHeight}px`}
              height={`${hourHeight}px`}
              borderRight="1px solid black"
              display="flex"
              alignItems="start"
              justifyContent="flex-end"
              pr={2}
              pt="-1px"
            >
              <Text fontSize="sm" lineHeight="1">
                {`${hour.toString().padStart(2, '0')}00`}
              </Text>
            </Box>

            {/* MAIN GRID ROW */}
            {daysOfWeek.map((day) => (
              <Box
                key={`${day}-${hour}`}
                border="1px solid #e0e0e0"
                minH={`${hourHeight}px`}
                height={`${hourHeight}px`}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Render timeslot Blocks */}
        {Object.keys(dayLayouts).length > 0 && updatedTimeslots
        .filter(timeslot => {
          const date = new Date(timeslot.start).getFullYear();
          return date === displayedYear
        })
        .filter(timeslot => timeslot.week === displayedWeek)
        .map((timeslot) => {
          const dayIndex = daysOfWeek.indexOf(timeslot.day);
          const layoutForDay = dayLayouts[timeslot.day]?.slots.find(slot => slot.timeslot._id === timeslot._id);

          if (layoutForDay) {
            const gridColumnStart = dayIndex + 2;
            const topPosition = getTopPosition(timeslot.startHours);
            const blockHeight = getHeight(timeslot.startHours, timeslot.endHours);
            const leftOffsetPercentage = 100 * layoutForDay.leftOffset;
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
                  overflowWrap:'break-word', // Allows text to wrap onto the next line
                  whiteSpace: 'normal',      // Allows line breaks within the text
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
              >
                <Flex
                  display="flex"
                  flexDirection="column"
                  left={0}
                  width={`200%`}
                  height="100%" // Make the container take full height of the button
                  paddingTop={`10px`}
                  textAlign="left"
                  lineHeight={1}
                >
                  <Text fontSize="100%" paddingBottom={'5%'}>{timeslot.name}</Text>
                  <Text fontSize="75%" fontStyle="italic">{timeslot.groupName}</Text>

                </Flex>
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