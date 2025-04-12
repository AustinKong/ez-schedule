import {
  Box,
  Heading,
  Input,
  Textarea,
  VStack,
  Button,
  HStack,
  CloseButton,
  Text,
  Field,
  Select,
  Alert,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { format } from "date-fns";
import { useTimeslots } from "@/hooks/useTimeslots";
import { useGroups } from "@/hooks/useGroups";
import { createListCollection } from "@chakra-ui/react";

const TimeSlotForm = ({ isEdit }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [groupId, setGroupId] = useState("");
  const [alertIsOpen, setAlertIsOpen] = useState(true);
  const [timeslot, setTimeslot] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getTimeslot, addTimeslot, editTimeslot } = useTimeslots();
  const { groups, loadGroups } = useGroups();

  const groupCollection = createListCollection({
    items: groups.map((group) => ({
      label: group.name,
      value: group._id,
    })),
  });

  useEffect(() => {
    if (!isEdit) loadGroups();

    if (isEdit) {
      const load = async () => {
        const data = await getTimeslot(id);
        if (data) {
          setTimeslot(data);
          setName(data.name || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setStartTime(format(new Date(data.start), "yyyy-MM-dd'T'HH:mm"));
          setEndTime(format(new Date(data.end), "yyyy-MM-dd'T'HH:mm"));
        }
      };
      load();
    }
  }, [isEdit, id]);

  const handleSubmit = async () => {
    if (!name || !location || !startTime || !endTime || (!isEdit && !groupId))
      return;

    try {
      const payload = {
        name,
        location,
        description,
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString(),
        ...(isEdit ? {} : { groupId: groupId[0] }),
      };

      const result = isEdit
        ? await editTimeslot(id, payload)
        : await addTimeslot(payload);

      if (result) navigate("/manager/timeslots");
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <Box>
      <Heading size="3xl">
        {isEdit ? "Edit Consultation Timeslot" : "Create Consultation Timeslot"}
      </Heading>

      <VStack spacing={4} mt={4}>
        {!isEdit && (
          <Field.Root required>
            <Select.Root
              collection={groupCollection}
              value={groupId}
              onValueChange={(e) => setGroupId(e.value)}
            >
              <Select.HiddenSelect />
              <Select.Label required>Choose group</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select a group" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {groupCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>
        )}

        <Field.Root required>
          <Field.Label>
            Consultation Name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Week 7 Review"
            autoFocus
          />
        </Field.Root>

        <HStack spacing={4} align="start" w="full">
          <Field.Root required w="100%">
            <Field.Label>
              Start Time (SGT) <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={now}
              w="100%"
            />
          </Field.Root>

          <Field.Root required w="100%">
            <Field.Label>
              End Time (SGT) <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime || now}
              w="100%"
            />
          </Field.Root>
        </HStack>

        <Field.Root required>
          <Field.Label>
            Location <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. COM1-0210, Zoom"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Additional Notes (optional)</Field.Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </Field.Root>
      </VStack>

      {alertIsOpen && (
        <Alert.Root mt={4}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Reminder</Alert.Title>
            <Alert.Description>
              Keep the slot name and location clear for students. Use Zoom links
              or room numbers with details when needed.
            </Alert.Description>
          </Alert.Content>
          <CloseButton
            pos="relative"
            top="-2"
            insetEnd="-2"
            onClick={() => setAlertIsOpen(false)}
          />
        </Alert.Root>
      )}

      <HStack mt={6} justifyContent="space-between">
        <Button as={Link} to="/manager/timeslots" variant="ghost">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isDisabled={
            !name ||
            !location ||
            !startTime ||
            !endTime ||
            (!isEdit && !groupId)
          }
          colorScheme="blue"
        >
          {isEdit ? "Save Changes" : "Create Timeslot"}{" "}
          <FiEdit style={{ marginLeft: 6 }} />
        </Button>
      </HStack>
    </Box>
  );
};

export default TimeSlotForm;
