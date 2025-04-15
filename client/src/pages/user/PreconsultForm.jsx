import {
  Box,
  Heading,
  Textarea,
  Input,
  VStack,
  Button,
  HStack,
  Field,
  Text,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPreconsultForm, fetchTimeslotsByGroup, fetchGroups } from "@/services/api";
import { createListCollection } from "@chakra-ui/react";

const PreconsultFormPage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [slotId, setSlotId] = useState("");
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    const loadAllTimeslots = async () => {
      try {
        const groups = await fetchGroups();
        const allSlots = [];
        for (const group of groups) {
          const slots = await fetchTimeslotsByGroup(group._id);
          console.log(slots)
          allSlots.push(...slots);
        }
        setTimeslots(allSlots);
      } catch (err) {
        console.error("Failed to load timeslots", err);
      }
    };
    loadAllTimeslots();
  }, []);

  const timeslotCollection = createListCollection({
    items: timeslots.map((slot) => ({
      label: `${slot.name} (${new Date(slot.start).toLocaleString()})`,
      value: slot._id,
    })),
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((base64s) => setAttachments(base64s));
  };

  const handleSubmit = async () => {
    try {
      await createPreconsultForm({
        slotId: slotId[0],
        text,
        attachments,
      });
      navigate(`/user/slots/${slotId}`);
    } catch (err) {
      console.error("Error submitting preconsult form", err);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>Pre-consultation Form</Heading>
      <VStack spacing={4} align="stretch">
        <Field.Root required>
          <Select.Root
            collection={timeslotCollection}
            value={slotId}
            onValueChange={(e) => setSlotId(e.value)}
          >
            <Select.HiddenSelect />
            <Select.Label required>Select consultation slot</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Choose a consultation" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {timeslotCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Description <Field.RequiredIndicator />
          </Field.Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Briefly describe your consultation request"
            rows={6}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Attachments (optional)</Field.Label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileChange}
          />
          {attachments.length > 0 && (
            <Text fontSize="sm" color="gray.600">
              {attachments.length} file(s) attached
            </Text>
          )}
        </Field.Root>

        <HStack justify="flex-end" pt={2}>
          <Button
            onClick={handleSubmit}
            isDisabled={!text.trim() || !slotId}
            colorScheme="blue"
          >
            Submit
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PreconsultFormPage;
